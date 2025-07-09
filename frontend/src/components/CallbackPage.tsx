import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthViewModel } from '../viewmodels/authViewModel';
import './CallbackPage.css';

const CallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isLoading, error, handleCallback } = useAuthViewModel();

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        console.error('OAuth error:', errorParam);
        navigate('/?error=' + encodeURIComponent(errorParam));
        return;
      }

      if (code && state) {
        try {
          await handleCallback(code, state);
          navigate('/dashboard');
        } catch (error) {
          console.error('Callback processing failed:', error);
          navigate('/?error=' + encodeURIComponent('Authentication failed'));
        }
      } else {
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
