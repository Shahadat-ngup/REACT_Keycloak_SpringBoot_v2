import { KeycloakConfig } from './services/authService';

export const keycloakConfig: KeycloakConfig = {
  baseUrl: 'https://keycloak.ccom.ipb.pt:8443',
  realm: 'ipbStudents',
  clientId: 'springKeycloakOauth2APP',
  redirectUri: 'http://oauth2-demo.local:4000/callback',
  postLogoutRedirectUri: 'http://oauth2-demo.local:4000/',
};

export const apiConfig = {
  baseURL: process.env.REACT_APP_API_URL || 'http://oauth2-demo.local:8080',
};

export const appConfig = {
  appName: 'Keycloak Demo App',
  version: '1.0.0',
  env: process.env.NODE_ENV || 'development',
};
