import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';

const LogoutButton = () => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <Button
      onClick={handleLogout}
      variant="default"
      leftSection={<IconLogout size={16} />}
    >
      Log Out
    </Button>
  );
};

export default LogoutButton;
