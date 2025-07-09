import { KeycloakConfig } from './services/authService';

export const keycloakConfig: KeycloakConfig = {
  baseUrl: 'https://keycloak.ccom.ipb.pt:8443',
  realm: 'ipbStudents',
  clientId: 'springKeycloakOauth2APP',
  redirectUri: 'http://localhost:4006/callback',
  postLogoutRedirectUri: 'http://localhost:4006/',
};

export const apiConfig = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
};

export const appConfig = {
  appName: 'Keycloak Demo App',
  version: '1.0.0',
  env: process.env.NODE_ENV || 'development',
};
