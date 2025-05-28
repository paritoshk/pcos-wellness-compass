import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Auth0Provider } from '@auth0/auth0-react'

console.log('main.tsx: Script start') // Early log

// These should ideally come from environment variables
const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID

console.log('main.tsx: Auth0 Domain from env:', auth0Domain)
console.log('main.tsx: Auth0 ClientID from env:', auth0ClientId)

let hasAuth0Config = false
if (!auth0Domain || !auth0ClientId) {
  console.error(
    'CRITICAL ERROR: Auth0 domain or client ID is not set in .env. App will not load correctly.'
  )
} else {
  console.log('main.tsx: Auth0 config found in .env. Attempting to render Auth0Provider.')
  hasAuth0Config = true
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {hasAuth0Config ? (
      <Auth0Provider
        domain={auth0Domain!}
        clientId={auth0ClientId!}
        authorizationParams={{
          redirect_uri: window.location.origin,
          // audience: `https://YOUR_AUTH0_DOMAIN/api/v2/`, // If you need an audience for API access
          // scope: "openid profile email" // Adjust scopes as needed
        }}
      >
        <App />
      </Auth0Provider>
    ) : (
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h1>Auth0 Configuration Missing</h1>
        <p>VITE_AUTH0_DOMAIN or VITE_AUTH0_CLIENT_ID is not set in your .env file.</p>
        <p>Please check your browser console for more details. The app cannot load without these settings.</p>
        <p>Ensure your .env file in the project root contains these lines with your actual Auth0 credentials:</p>
        <pre>
          VITE_AUTH0_DOMAIN=your_auth0_domain
          VITE_AUTH0_CLIENT_ID=your_auth0_client_id
        </pre>
      </div>
    )}
  </React.StrictMode>
)

console.log('main.tsx: Script end')
