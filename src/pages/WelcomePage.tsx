import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import LoginButton from '@/components/LoginButton';
import { IconToolsKitchen2, IconActivity, IconFileText, IconHeartHandshake, IconShield } from '@tabler/icons-react';
import { Container, Text, Grid, Card, Group, Box, Stack, Title } from '@mantine/core';

const WelcomePage = () => {
  const navigate = useNavigate();
  const { isProfileComplete } = useUser();

  useEffect(() => {
    // If user has ALREADY completed profile setup (e.g., returning user), redirect to chat
    if (isProfileComplete) {
      navigate('/chat');
    }
    // No other automatic navigation. User must click LoginButton to proceed to /profile if new.
  }, [isProfileComplete, navigate]);

  return (
    <Box 
      style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(255, 255, 255, 1), rgba(219, 39, 119, 0.1))'
      }}
    >
      <Container size="xl" p="xl">
        <Group mb="xl">
          <img src="/logo.png" alt="Nari AI" style={{ height: 40, width: 'auto' }} />
          <Title 
            order={1} 
            size="2rem" 
            fw={700}
            style={{
              background: 'linear-gradient(45deg, var(--mantine-color-pink-6), var(--mantine-color-grape-6))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Nari AI
          </Title>
        </Group>
        
        <Stack align="center" justify="center" style={{ minHeight: '70vh' }} gap="xl">
          <Box ta="center" maw={1000}>
            <Title order={2} size="3rem" mb="md" c="dark">
              Your Personal PCOS Health Assistant
            </Title>
            <Text size="xl" c="dimmed" maw={800} mx="auto">
              Get personalized guidance for PCOS-friendly food choices and lifestyle recommendations
            </Text>
          </Box>
          
          <Grid gutter="xl" justify="center">
            <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
              <Card 
                p="xl" 
                radius="xl" 
                shadow="md"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  transition: 'box-shadow 0.2s',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Stack align="center" gap="md">
                  <Box 
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(236, 72, 153, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <IconToolsKitchen2 size={32} color="var(--mantine-color-pink-6)" />
                  </Box>
                  <Title order={3} size="xl" ta="center">Food Analysis</Title>
                  <Text size="sm" c="dimmed" ta="center">Instantly analyze meals for PCOS compatibility</Text>
                </Stack>
              </Card>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
              <Card 
                p="xl" 
                radius="xl" 
                shadow="md"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  transition: 'box-shadow 0.2s',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Stack align="center" gap="md">
                  <Box 
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(236, 72, 153, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <IconActivity size={32} color="var(--mantine-color-pink-6)" />
                  </Box>
                  <Title order={3} size="xl" ta="center">Personalized Advice</Title>
                  <Text size="sm" c="dimmed" ta="center">Get recommendations tailored to your PCOS profile</Text>
                </Stack>
              </Card>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
              <Card 
                p="xl" 
                radius="xl" 
                shadow="md"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  transition: 'box-shadow 0.2s',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Stack align="center" gap="md">
                  <Box 
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(236, 72, 153, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <IconFileText size={32} color="var(--mantine-color-pink-6)" />
                  </Box>
                  <Title order={3} size="xl" ta="center">Food Tracking</Title>
                  <Text size="sm" c="dimmed" ta="center">Log meals and monitor your progress</Text>
                </Stack>
              </Card>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
              <Card 
                p="xl" 
                radius="xl" 
                shadow="md"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  transition: 'box-shadow 0.2s',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Stack align="center" gap="md">
                  <Box 
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(236, 72, 153, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <IconHeartHandshake size={32} color="var(--mantine-color-pink-6)" />
                  </Box>
                  <Title order={3} size="xl" ta="center">Expert Connect</Title>
                  <Text size="sm" c="dimmed" ta="center">Connect with PCOS nutritionists</Text>
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
          
          <Stack align="center" gap="md" pt="xl">
            <LoginButton />
            <Group gap="xs">
              <IconShield size={16} color="var(--mantine-color-dimmed)" />
              <Text size="xs" c="dimmed">Your data is secured and private</Text>
            </Group>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default WelcomePage;
