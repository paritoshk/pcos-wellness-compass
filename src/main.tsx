import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Auth0Provider, AppState } from '@auth0/auth0-react'
import { MantineProvider, createTheme } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/dates/styles.css'
import { BrowserRouter, useNavigate } from 'react-router-dom'

console.log('main.tsx: Script start') // Early log

// Mantine theme configuration matching PCOS wellness colors
const theme = createTheme({
  primaryColor: 'pink',
  colors: {
    pink: [
      '#fdf2f8', // pink-50
      '#fce7f3', // pink-100
      '#fbcfe8', // pink-200
      '#f9a8d4', // pink-300
      '#f472b6', // pink-400
      '#ec4899', // pink-500 - main primary
      '#db2777', // pink-600
      '#be185d', // pink-700
      '#9d174d', // pink-800
      '#831843', // pink-900
    ],
  },
  fontFamily: 'Inter, system-ui, sans-serif',
  headings: {
    fontFamily: 'Poppins, system-ui, sans-serif',
  },
  defaultRadius: 'md',
  cursorType: 'pointer',
})

const Auth0ProviderWithRedirect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate()

  const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN
  const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID
  const redirectUri = import.meta.env.VITE_APP_URL

  if (!(auth0Domain && auth0ClientId && redirectUri)) {
    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif', color: 'red' }}>
        <h1>Configuration Error</h1>
        <p>Auth0 Domain, Client ID, or App URL is missing from your .env file.</p>
        <p>Please ensure VITE_APP_URL is set (e.g., VITE_APP_URL=http://localhost:8080).</p>
      </div>
    )
  }

  const onRedirectCallback = (appState?: AppState) => {
    // Use the `returnTo` from appState or default to the root page
    navigate(appState?.returnTo || '/')
  }

  return (
    <Auth0Provider
      domain={auth0Domain}
      clientId={auth0ClientId}
      onRedirectCallback={onRedirectCallback}
      authorizationParams={{
        redirect_uri: redirectUri,
      }}
    >
      {children}
    </Auth0Provider>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <Notifications />
      <BrowserRouter>
        <Auth0ProviderWithRedirect>
          <App />
        </Auth0ProviderWithRedirect>
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
)

console.log('main.tsx: Script end')
