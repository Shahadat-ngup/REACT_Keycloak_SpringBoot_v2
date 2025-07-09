// Utility functions for PKCE implementation
export class PKCEUtils {
  static generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return this.base64URLEncode(array);
  }

  static async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return this.base64URLEncode(new Uint8Array(digest));
  }

  private static base64URLEncode(array: Uint8Array): string {
    return btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  static generateState(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return this.base64URLEncode(array);
  }
}

export interface KeycloakConfig {
  baseUrl: string;
  realm: string;
  clientId: string;
  redirectUri: string;
  postLogoutRedirectUri: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  idToken?: string;
  tokenType: string;
  expiresIn: number;
}

export class KeycloakAuthService {
  private config: KeycloakConfig;
  private codeVerifier: string | null = null;

  constructor(config: KeycloakConfig) {
    this.config = config;
  }

  async initiateLogin(): Promise<void> {
    try {
      console.log('Initiating login with config:', {
        baseUrl: this.config.baseUrl,
        realm: this.config.realm,
        clientId: this.config.clientId,
        redirectUri: this.config.redirectUri
      });

      // Generate PKCE parameters
      this.codeVerifier = PKCEUtils.generateCodeVerifier();
      const codeChallenge = await PKCEUtils.generateCodeChallenge(this.codeVerifier);
      const state = PKCEUtils.generateState();

      // Store code verifier and state in session storage
      sessionStorage.setItem('code_verifier', this.codeVerifier);
      sessionStorage.setItem('auth_state', state);

      // Build authorization URL
      const authUrl = new URL(`${this.config.baseUrl}/realms/${this.config.realm}/protocol/openid-connect/auth`);
      authUrl.searchParams.set('client_id', this.config.clientId);
      authUrl.searchParams.set('redirect_uri', this.config.redirectUri);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', 'openid profile email');
      authUrl.searchParams.set('state', state);
      authUrl.searchParams.set('code_challenge', codeChallenge);
      authUrl.searchParams.set('code_challenge_method', 'S256');

      console.log('Redirecting to:', authUrl.toString());

      // Redirect to Keycloak
      window.location.href = authUrl.toString();
    } catch (error) {
      console.error('Error initiating login:', error);
      throw error; // Re-throw the specific error message
    }
  }

  async handleCallback(code: string, state: string): Promise<AuthTokens> {
    try {
      // Verify state
      const storedState = sessionStorage.getItem('auth_state');
      if (state !== storedState) {
        throw new Error('Invalid state parameter');
      }

      // Get code verifier
      const codeVerifier = sessionStorage.getItem('code_verifier');
      if (!codeVerifier) {
        throw new Error('Code verifier not found');
      }

      // Exchange code for tokens
      const tokenUrl = `${this.config.baseUrl}/realms/${this.config.realm}/protocol/openid-connect/token`;
      
      const tokenData = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: this.config.clientId,
        code: code,
        redirect_uri: this.config.redirectUri,
        code_verifier: codeVerifier,
      });

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: tokenData,
      });

      if (!response.ok) {
        throw new Error(`Token exchange failed: ${response.statusText}`);
      }

      const tokens = await response.json();
      
      // Store tokens
      const authTokens: AuthTokens = {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        idToken: tokens.id_token,
        tokenType: tokens.token_type || 'Bearer',
        expiresIn: tokens.expires_in,
      };

      this.storeTokens(authTokens);
      
      // Clean up session storage
      sessionStorage.removeItem('code_verifier');
      sessionStorage.removeItem('auth_state');

      return authTokens;
    } catch (error) {
      console.error('Error handling callback:', error);
      throw error;
    }
  }

  private storeTokens(tokens: AuthTokens): void {
    localStorage.setItem('access_token', tokens.accessToken);
    localStorage.setItem('refresh_token', tokens.refreshToken);
    if (tokens.idToken) {
      localStorage.setItem('id_token', tokens.idToken);
    }
    localStorage.setItem('token_type', tokens.tokenType);
    localStorage.setItem('expires_at', (Date.now() + tokens.expiresIn * 1000).toString());
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    const expiresAt = localStorage.getItem('expires_at');
    
    if (!token || !expiresAt) {
      return false;
    }

    return Date.now() < parseInt(expiresAt);
  }

  async refreshTokens(): Promise<AuthTokens | null> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        return null;
      }

      const tokenUrl = `${this.config.baseUrl}/realms/${this.config.realm}/protocol/openid-connect/token`;
      
      const tokenData = new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: this.config.clientId,
        refresh_token: refreshToken,
      });

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: tokenData,
      });

      if (!response.ok) {
        this.logout();
        return null;
      }

      const tokens = await response.json();
      
      const authTokens: AuthTokens = {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        idToken: tokens.id_token,
        tokenType: tokens.token_type || 'Bearer',
        expiresIn: tokens.expires_in,
      };

      this.storeTokens(authTokens);
      return authTokens;
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      this.logout();
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      const idToken = localStorage.getItem('id_token');
      
      // Clear local storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('id_token');
      localStorage.removeItem('token_type');
      localStorage.removeItem('expires_at');

      // Redirect to Keycloak logout
      if (idToken) {
        const logoutUrl = new URL(`${this.config.baseUrl}/realms/${this.config.realm}/protocol/openid-connect/logout`);
        logoutUrl.searchParams.set('client_id', this.config.clientId);
        logoutUrl.searchParams.set('post_logout_redirect_uri', this.config.postLogoutRedirectUri);
        logoutUrl.searchParams.set('id_token_hint', idToken);

        window.location.href = logoutUrl.toString();
      } else {
        window.location.href = this.config.postLogoutRedirectUri;
      }
    } catch (error) {
      console.error('Error during logout:', error);
      window.location.href = this.config.postLogoutRedirectUri;
    }
  }

  getUserInfo(): any {
    const idToken = localStorage.getItem('id_token');
    if (!idToken) return null;

    try {
      const payload = idToken.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decoding ID token:', error);
      return null;
    }
  }
}
