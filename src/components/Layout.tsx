import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useUser } from '@/contexts/UserContext';
import { Button, Menu, Avatar, Group, Text, Box } from "@mantine/core";
import { IconMenu2, IconUser, IconLogout, IconMessageCircle, IconCamera, IconFileText, IconHeartHandshake } from '@tabler/icons-react';
import LogoutButton from './LogoutButton';

const Layout = () => {
  const { profile } = useUser();
  const { user } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/chat', name: 'Chat', icon: IconMessageCircle },
    { path: '/analyze', name: 'Analyze Food', icon: IconCamera },
    { path: '/history', name: 'History', icon: IconFileText },
    { path: '/experts', name: 'Experts', icon: IconHeartHandshake },
  ];

  const displayName = profile.name || user?.name || user?.nickname || "User";
  const userImage = user?.picture || '';
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header style={{ 
        position: 'sticky', top: 0, zIndex: 50, 
        borderBottom: '1px solid var(--mantine-color-gray-2)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
      }}>
        <Group justify="space-between" h="4rem" px="md">
          <Link to="/chat" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Group>
              <img src="/logo.png" alt="Nari AI Logo" style={{ height: '2.25rem', width: 'auto' }} />
              <Text component="h1" size="xl" fw={600} visibleFrom="sm">Nari AI</Text>
            </Group>
          </Link>

          <Group gap="xs" visibleFrom="md">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant={location.pathname.startsWith(item.path) ? "light" : "subtle"}
                color="pink"
                onClick={() => navigate(item.path)}
              >
                {item.name}
              </Button>
            ))}
          </Group>

          <Group>
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Avatar src={userImage} alt={displayName} radius="xl" color="pink" style={{ cursor: 'pointer' }}>
                  {userInitial}
                </Avatar>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>
                  <Text fw={500}>{displayName}</Text>
                  <Text size="xs" c="dimmed">{user?.email}</Text>
                </Menu.Label>
                <Menu.Divider />
                <Menu.Item leftSection={<IconUser size={14} />} disabled>
                  My Profile
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item component="div" p={0}>
                   <LogoutButton />
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>

            <Box hiddenFrom="md">
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <Button variant="outline" size="sm" p={0} w={36} h={36}>
                    <IconMenu2 size={20} />
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  {navItems.map((item) => (
                    <Menu.Item key={item.name} onClick={() => navigate(item.path)} leftSection={<item.icon size={14} />}>
                      {item.name}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            </Box>
          </Group>
        </Group>
      </header>

      <main style={{ flex: 1, overflowY: 'auto', padding: 'var(--mantine-spacing-md)' }}>
          <Outlet />
      </main>
    </Box>
  );
};

export default Layout;
