import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const { isAuthenticated, isLoading, error, login, clearError } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check for error from URL params (from failed callback)
  const urlError = searchParams.get('error');

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleLogin = async () => {
    clearError();
    await login();
  };

  // Display either the context error or URL error
  const displayError = error || urlError;

  // Don't render login form if already authenticated
  if (!isLoading && isAuthenticated) {
    return null; // Let the useEffect handle the redirect
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome</h1>
          <p>Please sign in to access the application</p>
        </div>
        
        {displayError && (
          <div className="error-message">
            <span>{displayError}</span>
            <button onClick={() => {
              clearError();
              navigate('/', { replace: true });
            }} className="error-close">×</button>
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
