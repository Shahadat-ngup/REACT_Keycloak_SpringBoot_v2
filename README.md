# React + Spring Boot + Keycloak OAuth2 Demo Application

A full-stack demonstration of secure authentication using **React** frontend with **Spring Boot** backend, integrated with **Keycloak** using **PKCE (Proof Key for Code Exchange)** OAuth2 flow.

## 🏗️ Architecture Overview

```
┌─────────────────┐    OAuth2/PKCE    ┌─────────────────┐    JWT Validation    ┌─────────────────┐
│   React SPA     │ ◄─────────────── │    Keycloak     │ ◄─────────────────► │   Spring Boot   │
│  (Frontend)     │                   │   Auth Server   │                     │   (Backend)     │
│                 │ ◄─────────────────────────────────── │                     │                 │
│ Port: 4006      │           Protected API Calls        │                     │ Port: 8080      │
└─────────────────┘                                      └─────────────────────┘                 └─────────────────┘
```

## 🚀 Technologies Used

### Frontend (React)
- **React 19.1** with TypeScript
- **React Router 6.30** for client-side routing
- **Axios 1.10** for HTTP requests
- **Custom PKCE Implementation** for OAuth2 security
- **MVVM Architecture** with React Context for state management
- **CSS3** with responsive design

### Backend (Spring Boot)
- **Spring Boot 3.2.0** with Java 17
- **Spring Security 6.x** with OAuth2 Resource Server
- **Spring Web** for REST API
- **Spring Boot Actuator** for health monitoring
- **Jackson** for JSON processing
- **Maven** for dependency management

### Authentication & Security
- **Keycloak** as OAuth2/OpenID Connect provider
- **PKCE (Proof Key for Code Exchange)** flow for enhanced security
- **JWT tokens** for stateless authentication
- **CORS** configuration for cross-origin requests

## 📁 Project Structure

```
React_Springboot_Keycloak/
├── README.md                 # This comprehensive guide
├── QUICKSTART.md            # Quick setup instructions
├── .gitignore               # Git ignore rules
│
├── frontend/                # React TypeScript SPA
│   ├── package.json         # Frontend dependencies
│   ├── tsconfig.json        # TypeScript configuration
│   ├── public/              # Static assets
│   └── src/
│       ├── config.ts        # 🔧 Keycloak & API configuration
│       ├── App.tsx          # Main application component
│       ├── contexts/
│       │   └── AuthContext.tsx     # 🔧 Authentication state management
│       ├── services/
│       │   ├── authService.ts      # 🔧 PKCE OAuth2 implementation
│       │   └── apiService.ts       # API communication service
│       ├── components/
│       │   ├── LoginPage.tsx       # Login interface
│       │   ├── CallbackPage.tsx    # OAuth2 callback handler
│       │   ├── Dashboard.tsx       # Protected dashboard
│       │   ├── ProtectedRoute.tsx  # Route protection
│       │   └── DebugPage.tsx       # Keycloak debug tools
│       └── viewmodels/             # MVVM pattern implementation
│           ├── authViewModel.ts
│           └── dashboardViewModel.ts
│
└── backend/                 # Spring Boot REST API
    ├── pom.xml              # Maven dependencies
    └── src/main/
        ├── resources/
        │   └── application.properties  # 🔧 Backend configuration
        └── java/com/example/keycloak/
            ├── KeycloakDemoApplication.java  # Main application
            ├── config/
            │   └── SecurityConfig.java      # 🔧 OAuth2 & CORS config
            ├── controller/
            │   ├── HealthController.java    # Health check endpoint
            │   ├── UserController.java      # User profile API
            │   ├── ProtectedController.java # Protected endpoints
            │   └── GlobalExceptionHandler.java
            ├── service/
            │   └── UserService.java         # Business logic
            └── dto/
                ├── ApiResponse.java         # Response wrapper
                └── UserProfileDto.java      # User data transfer
```

## 🔧 Configuration Files

### 🎯 Key Configuration Files to Modify

#### 1. Frontend Configuration: `frontend/src/config.ts`
```typescript
export const keycloakConfig: KeycloakConfig = {
  baseUrl: 'https://your-keycloak-server:port',    // Keycloak server URL
  realm: 'your-realm-name',                        // Your Keycloak realm
  clientId: 'your-client-id',                      // Your Keycloak client ID
  redirectUri: 'http://localhost:4006/callback',   // Callback URL
  postLogoutRedirectUri: 'http://localhost:4006/', // Post-logout URL
};

export const apiConfig = {
  baseURL: 'http://localhost:8080',                // Backend API URL
};
```

#### 2. Backend Configuration: `backend/src/main/resources/application.properties`
```properties
# Server Configuration
server.port=8080
server.address=0.0.0.0

# CORS Configuration (allow frontend access)
app.cors.allowed-origins=http://localhost:4006
app.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
app.cors.allowed-headers=*
app.cors.allow-credentials=true

# OAuth2 Resource Server (JWT validation)
spring.security.oauth2.resourceserver.jwt.issuer-uri=https://your-keycloak-server:port/realms/your-realm
spring.security.oauth2.resourceserver.jwt.jwk-set-uri=https://your-keycloak-server:port/realms/your-realm/protocol/openid-connect/certs

# Keycloak Configuration
keycloak.realm=your-realm-name
keycloak.auth-server-url=https://your-keycloak-server:port
keycloak.client-id=your-client-id
```

#### 3. Security Configuration: `backend/src/main/java/com/example/keycloak/config/SecurityConfig.java`
- Configures JWT token validation
- Sets up CORS policies
- Defines protected vs public endpoints
- Maps Keycloak roles to Spring Security authorities

## 🔐 Keycloak Setup Guide

### 1. Create Keycloak Realm
1. Access your Keycloak admin console
2. Create a new realm (e.g., `ipbStudents`)
3. Configure realm settings as needed

### 2. Create Keycloak Client
1. Go to **Clients** → **Create Client**
2. Set **Client ID**: `springKeycloakOauth2APP` (or your preferred name)
3. **Client Type**: `OpenID Connect`
4. **Client authentication**: `Off` (public client for PKCE)

### 3. Configure Client Settings
```
Standard Flow Enabled: ON
Direct Access Grants Enabled: OFF
Implicit Flow Enabled: OFF
Service Accounts Enabled: OFF

Valid Redirect URIs: 
  - http://localhost:4006/*
  - http://localhost:4006/callback

Valid Post Logout Redirect URIs:
  - http://localhost:4006/*

Web Origins:
  - http://localhost:4006

Advanced Settings:
  - Proof Key for Code Exchange Code Challenge Method: S256
```

### 4. Create Test Users
1. Go to **Users** → **Add User**
2. Set username, email, first name, last name
3. Go to **Credentials** tab → Set password
4. Assign roles as needed

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** 16+ and npm
- **Java** 17+
- **Maven** 3.6+
- Access to a **Keycloak server**

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd React_Springboot_Keycloak
```

### 2. Configure Keycloak Settings
Edit the configuration files mentioned above with your Keycloak server details.

### 3. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 4. Install Backend Dependencies
```bash
cd ../backend
mvn clean install
```

## 🏃‍♂️ Running the Application

### 1. Start the Backend
```bash
cd backend
mvn spring-boot:run
```
Backend will be available at: `http://localhost:8080`

### 2. Start the Frontend
```bash
cd frontend
npm start
```
Frontend will be available at: `http://localhost:4006`

### 3. Access the Application
1. Open `http://localhost:4006` in your browser
2. Click **"Login via Keycloak"**
3. Enter your Keycloak credentials
4. You'll be redirected to the dashboard after successful authentication

## 🔍 API Endpoints

### Public Endpoints
- `GET /api/health` - Application health check

### Protected Endpoints (Require Authentication)
- `GET /api/user/profile` - Get user profile information
- `GET /api/protected/data` - Get protected data
- `GET /api/protected/time` - Get server time

## 🧪 Testing & Debugging

### Debug Page
Access `http://localhost:4006/debug` for Keycloak configuration testing:
- Tests Keycloak connectivity
- Validates configuration
- Provides direct authentication URL for testing

### Logging
Enable debug logging in `application.properties`:
```properties
logging.level.org.springframework.security=DEBUG
logging.level.com.example.keycloak=DEBUG
```

## 🔒 Security Features

- ✅ **PKCE Flow**: Enhanced OAuth2 security for SPAs
- ✅ **JWT Validation**: Stateless token verification
- ✅ **CORS Protection**: Configured for cross-origin requests
- ✅ **Role-based Access**: Keycloak role mapping
- ✅ **Secure Token Storage**: Browser localStorage with validation
- ✅ **Automatic Token Refresh**: Seamless token renewal
- ✅ **Protected Routes**: Client-side route protection

## 🎨 Features Implemented

### Frontend Features
- Modern React 19 with TypeScript
- MVVM architecture with React Context
- Responsive design with custom CSS
- OAuth2 PKCE implementation
- Automatic authentication state management
- Protected route handling
- Error handling and user feedback

### Backend Features
- RESTful API with Spring Boot 3.2
- OAuth2 Resource Server configuration
- JWT token validation
- CORS configuration
- Health monitoring with Actuator
- Global exception handling
- Role-based authorization

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check `app.cors.allowed-origins` in `application.properties`
   - Ensure frontend URL is properly configured

2. **Authentication Fails**
   - Verify Keycloak client configuration
   - Check redirect URIs match exactly
   - Ensure PKCE is enabled in Keycloak client

3. **JWT Validation Errors**
   - Verify `issuer-uri` and `jwk-set-uri` in backend config
   - Check Keycloak realm accessibility

4. **Port Conflicts**
   - Frontend: Change PORT in `package.json` scripts
   - Backend: Change `server.port` in `application.properties`

### Debug Steps
1. Use the debug page at `/debug`
2. Check browser console for errors
3. Review backend logs for JWT validation issues
4. Verify Keycloak client settings

## 📚 References & Documentation

- [Spring Security OAuth2 Resource Server](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/index.html)
- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [OAuth2 PKCE RFC](https://tools.ietf.org/html/rfc7636)
- [React Router Documentation](https://reactrouter.com/)
- [Spring Boot Actuator](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy Coding!** 🚀

For quick setup instructions, see [QUICKSTART.md](./QUICKSTART.md)
