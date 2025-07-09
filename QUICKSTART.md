# Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- Java 17+
- Maven 3.6+
- Access to Keycloak server at `https://keycloak.ccom.ipb.pt:8443`

### Setup `/etc/hosts` (Important for Network Access)
Add this line to your `/etc/hosts` file (replace with your actual IP):
```bash
# Replace 192.168.1.100 with your machine's IP address
192.168.1.100 oauth2-demo.local
```

To find your IP address:
```bash
# On Linux
ip addr show | grep 'inet ' | grep -v 127.0.0.1

# On Windows
ipconfig | findstr "IPv4"
```

### 1. Start the Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend will be available at: `http://oauth2-demo.local:8080`

### 2. Start the Frontend

```bash
cd frontend
npm install
npm start
```

Frontend will be available at: `http://oauth2-demo.local:4000`

### 3. Access the Application

1. Open `http://oauth2-demo.local:4000` in your browser
2. Click "Login via Keycloak"
3. You'll be redirected to Keycloak login page
4. After successful authentication, you'll be redirected back to the dashboard

### 4. Access from Other Devices

To access from other devices on the same network:
1. Add the host entry to the other device's hosts file:
   ```
   192.168.1.100 oauth2-demo.local  # Your machine's IP
   ```
2. Access via `http://oauth2-demo.local:4000`

## 🔧 Configuration

### Backend Configuration
Edit `backend/src/main/resources/application.properties`:
- Server port: `server.port=8080`
- Keycloak URL: Update if different
- CORS origins: Add additional origins if needed

### Frontend Configuration
Edit `frontend/src/config.ts`:
- Keycloak URLs
- Client ID
- Redirect URIs

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Check backend CORS configuration
2. **Network Access**: Verify `/etc/hosts` configuration
3. **Keycloak Connection**: Ensure Keycloak server is accessible
4. **Authentication Errors**: Check Keycloak client configuration

### Debug Mode
Enable debug logging in backend:
```properties
logging.level.org.springframework.security=DEBUG
logging.level.com.example.keycloak=DEBUG
```

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
