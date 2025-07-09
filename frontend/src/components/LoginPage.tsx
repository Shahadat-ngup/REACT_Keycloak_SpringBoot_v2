import React from 'react';
import { useAuthViewModel } from '../viewmodels/authViewModel';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const { isLoading, error, login, clearError } = useAuthViewModel();

  const handleLogin = async () => {
    clearError();
    await login();
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome</h1>
          <p>Please sign in to access the application</p>
        </div>
        
        {error && (
          <div className="error-message">
            <span>{error}</span>
            <button onClick={clearError} className="error-close">×</button>
          </div>
        )}
        
        <div className="login-content">
          <div className="app-info">
            <h2>Keycloak Demo Application</h2>
            <p>
              This application demonstrates secure authentication using Keycloak with PKCE flow.
              Click the button below to authenticate via Keycloak.
            </p>
          </div>
          
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className={`login-button ${isLoading ? 'loading' : ''}`}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Redirecting...
              </>
            ) : (
              'Login via Keycloak'
            )}
          </button>
        </div>
        
        <div className="login-footer">
          <p>Secure authentication powered by Keycloak</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
