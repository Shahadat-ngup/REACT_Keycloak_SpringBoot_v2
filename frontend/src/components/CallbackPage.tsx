import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './CallbackPage.css';

const CallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isLoading, error, handleCallback } = useAuth();

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const errorParam = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      console.log('Callback received:', { code: !!code, state: !!state, error: errorParam, errorDescription });

      if (errorParam) {
        console.error('OAuth error:', errorParam, errorDescription);
        navigate('/?error=' + encodeURIComponent(`${errorParam}: ${errorDescription || 'Authentication failed'}`));
        return;
      }

      if (code && state) {
        try {
          console.log('Processing callback with code and state...');
          await handleCallback(code, state);
          console.log('Callback processed successfully, redirecting to dashboard...');
          navigate('/dashboard');
        } catch (error) {
          console.error('Callback processing failed:', error);
          const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
          navigate('/?error=' + encodeURIComponent(errorMessage));
        }
      } else {
        console.error('Missing callback parameters:', { code: !!code, state: !!state });
        navigate('/?error=' + encodeURIComponent('Invalid callback parameters'));
      }
    };

    processCallback();
  }, [searchParams, navigate, handleCallback]);

  return (
    <div className="callback-container">
      <div className="callback-card">
        {isLoading ? (
          <div className="callback-loading">
            <div className="large-spinner"></div>
            <h2>Authenticating...</h2>
            <p>Please wait while we complete your authentication.</p>
          </div>
        ) : error ? (
          <div className="callback-error">
            <div className="error-icon">⚠️</div>
            <h2>Authentication Failed</h2>
            <p>{error}</p>
            <button onClick={() => navigate('/')} className="return-button">
              Return to Login
            </button>
          </div>
        ) : (
          <div className="callback-success">
            <div className="success-icon">✅</div>
            <h2>Authentication Successful</h2>
            <p>Redirecting to dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallbackPage;
