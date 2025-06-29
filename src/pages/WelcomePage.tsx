import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import LoginButton from '@/components/LoginButton';
import { IconToolsKitchen2, IconActivity, IconFileText, IconHeartHandshake, IconShield, IconChartBar, IconDroplet, IconClipboardText, IconSparkles } from '@tabler/icons-react';
import { Container, Text, Grid, Card, Group, Box, Stack, Title, Modal, List, ThemeIcon } from '@mantine/core';

const features = [
  {
    icon: IconToolsKitchen2,
    title: 'Food Analysis',
    description: 'Instantly analyze meals for PCOS compatibility by taking a photo. Our AI provides a detailed breakdown of macronutrients, glycemic load, and inflammatory score.',
    benefits: [
      'Get immediate feedback on your food choices.',
      'Understand how different foods impact your body.',
      'Receive suggestions for healthier alternatives.',
    ]
  },
  {
    icon: IconActivity,
    title: 'Personalized Advice',
    description: 'Receive recommendations tailored to your unique PCOS profile, symptoms, and goals. Nari learns and adapts to your health journey.',
     benefits: [
      'Guidance that goes beyond generic advice.',
      'Focus on areas most important for your well-being.',
      'Adjust your plan as your symptoms and goals change.',
    ]
  },
    {
    icon: IconFileText,
    title: 'Food & Symptom Tracking',
    description: 'Log your meals, symptoms, and cycle to uncover patterns and track your progress over time. See what works best for you.',
     benefits: [
      'Identify triggers and correlations.',
      'Visualize your progress with clear charts.',
      'Share a detailed history with your healthcare provider.',
    ]
  },
  {
    icon: IconHeartHandshake,
    title: 'Expert Connect',
    description: 'Connect with certified nutritionists and health coaches specializing in PCOS for one-on-one consultations and support.',
     benefits: [
      'Get professional, evidence-based guidance.',
      'Build a support system you can trust.',
      'Ask questions and get expert answers.',
    ]
  }
];

type Feature = typeof features[0];

const WelcomePage = () => {
  const navigate = useNavigate();
  const { isProfileComplete } = useUser();
  const [openedModal, setOpenedModal] = useState<Feature | null>(null);

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
            {features.map((feature) => (
              <Grid.Col key={feature.title} span={{ base: 12, sm: 6, lg: 3 }}>
                <Card 
                  p="xl" 
                  radius="xl" 
                  shadow="md"
                  onClick={() => setOpenedModal(feature)}
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
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
                      <feature.icon size={32} color="var(--mantine-color-pink-6)" />
                    </Box>
                    <Title order={3} size="xl" ta="center">{feature.title}</Title>
                    <Text size="sm" c="dimmed" ta="center">{feature.description.split('.')[0]}.</Text>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
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
      
      <Modal opened={openedModal !== null} onClose={() => setOpenedModal(null)} title={openedModal?.title} centered size="lg">
        {openedModal && (
          <Stack p="md">
            <Text c="dimmed">{openedModal.description}</Text>
            <Title order={4} mt="md">Key Benefits</Title>
            <List
              spacing="sm"
              size="sm"
              center
              icon={
                <ThemeIcon color="pink" size={24} radius="xl">
                  <IconSparkles size={16} />
                </ThemeIcon>
              }
            >
              {openedModal.benefits.map((benefit, index) => (
                <List.Item key={index}>{benefit}</List.Item>
              ))}
            </List>
          </Stack>
        )}
      </Modal>

    </Box>
  );
};

export default WelcomePage;
