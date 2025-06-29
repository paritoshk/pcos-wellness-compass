import React from "react";
import { Button } from "@mantine/core";
import { IconLogin } from "@tabler/icons-react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  const handleGetStarted = () => {
    // This will redirect the user to the Auth0 login page.
    // After a successful login, Auth0 will redirect them back to the `/quiz` route.
    loginWithRedirect({
      appState: {
        returnTo: '/quiz',
      },
    });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Button 
        onClick={handleGetStarted}
        size="lg"
        leftSection={<IconLogin size={20} />}
        variant="filled"
        color="pink"
      >
        Log In & Take Assessment
      </Button>
    </div>
  );
};

export default LoginButton;
