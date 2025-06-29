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
import { Center, Stack, Title, Text } from '@mantine/core'

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
  const domain = import.meta.env.VITE_AUTH0_DOMAIN
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID

  const onRedirectCallback = (appState?: AppState) => {
    navigate(appState?.returnTo || window.location.pathname)
  }

  const appUrl = import.meta.env.VITE_VERCEL_URL
    ? `https://${import.meta.env.VITE_VERCEL_URL}`
    : 'http://localhost:8080'

  // This check is the important one for developers.
  if (!domain || !clientId) {
    return (
      <Center h="100vh">
        <Stack align="center" p="md">
          <Title order={2} c="red.7">Configuration Error</Title>
          <Text ta="center">
            The Auth0 Domain or Client ID is not configured.
          </Text>
          <Text c="dimmed" size="sm" ta="center">
            Please make sure `VITE_AUTH0_DOMAIN` and `VITE_AUTH0_CLIENT_ID` are set correctly in your `.env` file.
          </Text>
        </Stack>
      </Center>
    )
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: `${appUrl}/chat`
      }}
      onRedirectCallback={onRedirectCallback}
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
