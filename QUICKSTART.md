# Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16+)
- **Java** 17+
- **Maven** 3.6+
- Access to **Keycloak server** at `https://keycloak.ccom.ipb.pt:8443`

### Important: Keycloak Client Configuration
Before starting, ensure your Keycloak client is configured with:
- **Valid Redirect URIs**: `http://localhost:4006/*`
- **Web Origins**: `http://localhost:4006`
- **PKCE Code Challenge Method**: `S256`

## 🏃‍♂️ Quick Setup

### 1. Start the Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

✅ Backend will be available at: `http://localhost:8080`

### 2. Start the Frontend

```bash
cd frontend
npm install
npm start
```

✅ Frontend will be available at: `http://localhost:4006`

### 3. Access the Application

1. Open `http://localhost:4006` in your browser
2. Click **"Login via Keycloak"**
3. You'll be redirected to Keycloak login page
4. Enter your credentials
5. After successful authentication, you'll be redirected back to the dashboard

## 🔧 Configuration

### Backend Configuration
Key file: `backend/src/main/resources/application.properties`
```properties
# Server Configuration
server.port=8080

# CORS Configuration
app.cors.allowed-origins=http://localhost:4006

# Keycloak OAuth2 Configuration
spring.security.oauth2.resourceserver.jwt.issuer-uri=https://keycloak.ccom.ipb.pt:8443/realms/ipbStudents
keycloak.realm=ipbStudents
keycloak.client-id=springKeycloakOauth2APP
```

### Frontend Configuration
Key file: `frontend/src/config.ts`
```typescript
export const keycloakConfig: KeycloakConfig = {
  baseUrl: 'https://keycloak.ccom.ipb.pt:8443',
  realm: 'ipbStudents',
  clientId: 'springKeycloakOauth2APP',
  redirectUri: 'http://localhost:4006/callback',
  postLogoutRedirectUri: 'http://localhost:4006/',
};
```

## 🧪 Testing & Debug

### Debug Page
Access `http://localhost:4006/debug` to:
- Test Keycloak connectivity
- Validate configuration
- Debug authentication issues

### API Health Check
```bash
curl http://localhost:8080/api/health
```

## 🐛 Troubleshooting

### Common Issues

1. **"Authentication failed" Error**
   - Check Keycloak client redirect URIs include `http://localhost:4006/*`
   - Verify PKCE is enabled in Keycloak client settings
   - Ensure client ID matches in both frontend and backend config

2. **CORS Errors**
   - Verify `app.cors.allowed-origins=http://localhost:4006` in backend config
   - Check that frontend is running on port 4006

3. **Port Conflicts**
   - If port 4006 is busy, update both:
     - Frontend: `PORT=XXXX` in `package.json` start script
     - Keycloak client: Add new port to redirect URIs

4. **JWT Validation Errors**
   - Check `issuer-uri` and `jwk-set-uri` in `application.properties`
   - Verify Keycloak realm is accessible

### Debug Steps
1. Check browser console for errors
2. Use the debug page at `/debug`
3. Review backend logs for authentication issues
4. Verify Keycloak client configuration

## 📚 API Endpoints

### Public
- `GET /api/health` - Health check

### Protected (Requires Authentication)
- `GET /api/user/profile` - User profile
- `GET /api/protected/data` - Protected data
- `GET /api/protected/time` - Server time

## 🎯 Features Included

✅ Keycloak PKCE authentication flow  
✅ JWT token validation  
✅ Protected routes and API endpoints  
✅ User profile management  
✅ Responsive design  
✅ Network accessibility  
✅ Error handling  
✅ Health monitoring  

## 🔐 Security Features

- PKCE flow for enhanced security
- JWT token validation
- Automatic token refresh
- CORS protection
- Role-based access control

Happy coding! 🚀
