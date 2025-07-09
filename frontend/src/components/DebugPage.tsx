import React, { useState } from 'react';
import { keycloakConfig } from '../config';

const DebugPage: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');

  const testKeycloakEndpoint = async () => {
    setTestResult('Testing...');
    
    const authUrl = `${keycloakConfig.baseUrl}/realms/${keycloakConfig.realm}/protocol/openid-connect/auth`;
    const wellKnownUrl = `${keycloakConfig.baseUrl}/realms/${keycloakConfig.realm}/.well-known/openid_configuration`;
    
    try {
      // Test 1: Try to access the auth endpoint (should return 400 with missing parameters)
      const authResponse = await fetch(authUrl);
      console.log('Auth endpoint status:', authResponse.status);
      
      // Test 2: Try to access well-known configuration
      const wellKnownResponse = await fetch(wellKnownUrl);
      console.log('Well-known endpoint status:', wellKnownResponse.status);
      
      if (wellKnownResponse.ok) {
        const config = await wellKnownResponse.json();
        setTestResult(`✅ Keycloak realm is accessible!\n\nEndpoints:\n- Authorization: ${config.authorization_endpoint}\n- Token: ${config.token_endpoint}\n- Issuer: ${config.issuer}`);
      } else {
        setTestResult(`❌ Keycloak realm test failed.\n\nAuth endpoint: ${authResponse.status}\nWell-known endpoint: ${wellKnownResponse.status}\n\nPlease check:\n1. Realm name '${keycloakConfig.realm}' exists\n2. Keycloak server is accessible`);
      }
    } catch (error) {
      setTestResult(`❌ Network error: ${error}\n\nPlease check your internet connection and Keycloak server URL.`);
    }
  };

  const buildTestAuthUrl = () => {
    const authUrl = new URL(`${keycloakConfig.baseUrl}/realms/${keycloakConfig.realm}/protocol/openid-connect/auth`);
    authUrl.searchParams.set('client_id', keycloakConfig.clientId);
    authUrl.searchParams.set('redirect_uri', keycloakConfig.redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'openid');
    authUrl.searchParams.set('state', 'test-state');
    
    return authUrl.toString();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Keycloak Configuration Debug</h1>
      
      <div style={{ background: '#f5f5f5', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
        <h3>Current Configuration:</h3>
        <pre style={{ background: 'white', padding: '10px', borderRadius: '3px' }}>
{JSON.stringify(keycloakConfig, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={testKeycloakEndpoint} style={{ 
          padding: '10px 20px', 
          background: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Test Keycloak Connection
        </button>
      </div>

      {testResult && (
        <div style={{ 
          background: testResult.includes('✅') ? '#d4edda' : '#f8d7da', 
          padding: '15px', 
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{testResult}</pre>
        </div>
      )}

      <div style={{ background: '#e9ecef', padding: '15px', borderRadius: '5px' }}>
        <h3>Test Auth URL:</h3>
        <p>Click this link to test if Keycloak accepts your client configuration:</p>
        <a 
          href={buildTestAuthUrl()} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ wordBreak: 'break-all', color: '#007bff' }}
        >
          {buildTestAuthUrl()}
        </a>
        <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          If this works, you should see a Keycloak login page. If you get an error about invalid client or redirect URI, 
          then the client configuration in Keycloak needs to be updated.
        </p>
      </div>
    </div>
  );
};

export default DebugPage;
