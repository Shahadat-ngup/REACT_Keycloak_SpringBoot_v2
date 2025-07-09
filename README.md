# Keycloak OAuth2 PKCE Demo Application

This project demonstrates a secure login mechanism using Keycloak with PKCE (Proof Key for Code Exchange) flow. The a3. Access via `http://oauth2-demo.local:4006`plication consists of a React frontend and a Spring Boot backend, following MVVM architecture principles and best practices.

## 🏗️ Architecture

- **Frontend**: React with TypeScript (MVVM Architecture)
- **Backend**: Spring Boot with OAuth2 Resource Server
- **Authentication**: Keycloak with PKCE flow
- **Security**: JWT token validation, CORS configuration

## 🚀 Features

- ✅ Custom login page with Keycloak OAuth2 PKCE flow
- ✅ Secure JWT token handling
- ✅ Protected routes and API endpoints
- ✅ User profile management
- ✅ Responsive design for mobile and desktop
- ✅ CORS configuration for cross-origin requests
- ✅ Network-accessible for remote devices
- ✅ Health monitoring and error handling

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **Java** (v17 or higher)
- **Maven** (v3.6 or higher)
- **Keycloak** server running with configured realm

## 🔧 Configuration

### Keycloak Setup

The application is configured to work with the following Keycloak settings:

- **Keycloak URL**: `https://keycloak.ccom.ipb.pt:8443`
- **Realm**: `ipbStudents`
- **Client ID**: `springKeycloakOauth2APP`
- **Valid Redirect URLs**: `http://oauth2-demo.local:4006/*`
- **Post Logout Redirect URLs**: `http://oauth2-demo.local:4006/*`
- **Web Origins**: `http://oauth2-demo.local:4006`

### Host Configuration

For network accessibility, add the following to your `/etc/hosts` file:

```bash
# Add your machine's IP address
192.168.1.100 oauth2-demo.local  # Replace with your actual IP
```

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd React_Springboot_Keycloak
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies and run
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://oauth2-demo.local:8080`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will start on `http://oauth2-demo.local:4006`

## 📁 Project Structure

```
React_Springboot_Keycloak/
├── frontend/                    # React TypeScript frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── LoginPage.tsx   # Custom login page
│   │   │   ├── CallbackPage.tsx # OAuth callback handler
│   │   │   ├── Dashboard.tsx    # Main dashboard
│   │   │   └── ProtectedRoute.tsx # Route protection
│   │   ├── services/           # Business logic services
│   │   │   ├── authService.ts  # PKCE authentication
│   │   │   └── apiService.ts   # API communication
│   │   ├── viewmodels/         # MVVM view models
│   │   │   ├── authViewModel.ts     # Authentication state
│   │   │   └── dashboardViewModel.ts # Dashboard logic
│   │   └── config.ts           # Application configuration
│   ├── public/
│   └── package.json
├── backend/                     # Spring Boot backend
│   ├── src/main/java/com/example/keycloak/
│   │   ├── config/             # Security configuration
│   │   ├── controller/         # REST controllers
│   │   ├── dto/                # Data transfer objects
│   │   ├── service/            # Business services
│   │   └── KeycloakDemoApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
└── README.md
```

## 🔐 Security Features

### PKCE Flow Implementation

The application implements OAuth2 PKCE flow for enhanced security:

1. **Code Verifier Generation**: Cryptographically random string
2. **Code Challenge**: SHA256 hash of the code verifier
3. **State Parameter**: CSRF protection
4. **Token Exchange**: Secure token retrieval using code verifier

### JWT Token Handling

- Automatic token refresh
- Secure token storage
- Token validation on backend
- Role-based access control

## 🌐 API Endpoints

### Public Endpoints
- `GET /api/health` - Health check

### Protected Endpoints (Requires Authentication)
- `GET /api/user/profile` - Get user profile
- `GET /api/protected/data` - Get protected data
- `GET /api/protected/time` - Get server time

## 📱 Network Access

The application is configured to be accessible from other devices on the same network:

1. **Frontend**: Runs on `0.0.0.0:4006` (all interfaces)
2. **Backend**: Runs on `0.0.0.0:8080` (all interfaces)
3. **CORS**: Configured for cross-origin requests

To access from other devices:
1. Find your machine's IP address: `ip addr show` (Linux) or `ipconfig` (Windows)
2. Update `/etc/hosts` on other devices with your IP
3. Access via `http://oauth2-demo.local:4000`

## 🛠️ Development

### Frontend Development

```bash
cd frontend

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Backend Development

```bash
cd backend

# Run in development mode
mvn spring-boot:run

# Build for production
mvn clean package

# Run tests
mvn test
```

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Verify backend CORS configuration
   - Check if frontend URL is in allowed origins

2. **Authentication Failures**
   - Verify Keycloak configuration
   - Check redirect URLs in Keycloak client settings
   - Ensure HTTPS is properly configured for Keycloak

3. **Network Access Issues**
   - Verify `/etc/hosts` configuration
   - Check firewall settings
   - Ensure applications are bound to `0.0.0.0`

4. **Token Validation Errors**
   - Verify JWT issuer URI
   - Check Keycloak realm settings
   - Ensure client ID matches

### Debug Mode

Enable debug logging by setting in backend `application.properties`:

```properties
logging.level.org.springframework.security=DEBUG
logging.level.com.example.keycloak=DEBUG
```

## 🚀 Deployment

### Production Considerations

1. **HTTPS**: Configure SSL/TLS for production
2. **Environment Variables**: Use environment-specific configurations
3. **Security Headers**: Add security headers for production
4. **Monitoring**: Set up application monitoring and logging

### Docker Deployment (Optional)

Create Docker containers for both frontend and backend for easier deployment across environments.

## 📚 Additional Resources

- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [OAuth2 PKCE RFC](https://tools.ietf.org/html/rfc7636)
- [Spring Security OAuth2](https://spring.io/projects/spring-security-oauth)
- [React Router Documentation](https://reactrouter.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Keycloak Demo Team** - Initial work

## 🙏 Acknowledgments

- Keycloak community for excellent documentation
- Spring Boot team for OAuth2 integration
- React community for frontend frameworks
