import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthViewModel } from '../viewmodels/authViewModel';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthViewModel();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '20px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(102, 126, 234, 0.3)',
            borderRadius: '50%',
            borderTopColor: '#667eea',
            animation: 'spin 1s ease-in-out infinite',
            margin: '0 auto 20px'
          }}></div>
          <h2 style={{ color: '#333', margin: 0 }}>Loading...</h2>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
