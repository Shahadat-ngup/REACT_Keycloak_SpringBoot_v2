import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDashboardViewModel } from '../viewmodels/dashboardViewModel';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { isLoading, data, error, healthStatus, fetchData, checkHealth, clearError } = 
    useDashboardViewModel();

  const handleLogout = async () => {
    await logout();
  };

  const handleRefreshData = async () => {
    clearError();
    await fetchData();
  };

  const handleHealthCheck = async () => {
    await checkHealth();
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-info">
            <h1>Dashboard</h1>
            <p>Welcome back, {user?.firstName || user?.username || 'User'}!</p>
          </div>
          <div className="header-actions">
            <div className={`health-indicator ${healthStatus}`}>
              <span className="health-dot"></span>
              <span className="health-text">
                {healthStatus === 'healthy' ? 'API Healthy' : 
                 healthStatus === 'unhealthy' ? 'API Unhealthy' : 'Checking...'}
              </span>
            </div>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button onClick={clearError} className="error-close">×</button>
          </div>
        )}

        <div className="dashboard-grid">
          <div className="card user-info-card">
            <h2>User Information</h2>
            <div className="user-details">
              <div className="user-detail">
                <label>Username:</label>
                <span>{user?.username || 'N/A'}</span>
              </div>
              <div className="user-detail">
                <label>Email:</label>
                <span>{user?.email || 'N/A'}</span>
              </div>
              <div className="user-detail">
                <label>First Name:</label>
                <span>{user?.firstName || 'N/A'}</span>
              </div>
              <div className="user-detail">
                <label>Last Name:</label>
                <span>{user?.lastName || 'N/A'}</span>
              </div>
              <div className="user-detail">
                <label>User ID:</label>
                <span className="user-id">{user?.id || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="card api-data-card">
            <div className="card-header">
              <h2>Protected Data</h2>
              <div className="card-actions">
                <button 
                  onClick={handleRefreshData} 
                  disabled={isLoading}
                  className="refresh-button"
                >
                  {isLoading ? '🔄' : '↻'} Refresh
                </button>
                <button 
                  onClick={handleHealthCheck}
                  className="health-button"
                >
                  🏥 Health Check
                </button>
              </div>
            </div>
            <div className="api-data-content">
              {isLoading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Loading data...</p>
                </div>
              ) : data ? (
                <div className="data-display">
                  <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
              ) : (
                <div className="no-data">
                  <p>No data available. Click refresh to load data from the backend.</p>
                </div>
              )}
            </div>
          </div>

          <div className="card stats-card">
            <h2>Application Stats</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">✅</div>
                <div className="stat-label">Authenticated</div>
              </div>
              <div className="stat-item">
                <div className={`stat-value ${healthStatus === 'healthy' ? 'healthy' : 'unhealthy'}`}>
                  {healthStatus === 'healthy' ? '🟢' : '🔴'}
                </div>
                <div className="stat-label">API Status</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">🔒</div>
                <div className="stat-label">PKCE Secured</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">🎯</div>
                <div className="stat-label">Keycloak SSO</div>
              </div>
            </div>
          </div>

          <div className="card actions-card">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <button onClick={handleRefreshData} className="action-button">
                <span className="action-icon">🔄</span>
                <span>Refresh Data</span>
              </button>
              <button onClick={handleHealthCheck} className="action-button">
                <span className="action-icon">🏥</span>
                <span>Health Check</span>
              </button>
              <button onClick={handleLogout} className="action-button logout-action">
                <span className="action-icon">🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
