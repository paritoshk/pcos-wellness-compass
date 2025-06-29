import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Card, Stack, Text, Title, Box, Group, Checkbox, Radio, NumberInput, Progress } from "@mantine/core";
import { useUser, PCOSProfile } from '@/contexts/UserContext';

const symptomOptions = [
  'Acne',
  'Unwanted hair growth (hirsutism)',
  'Hair loss (on your head)',
  'Skin darkening (acanthosis nigricans)',
  'Weight gain or difficulty losing weight',
];

const dietaryOptions = [
  "Vegan",
  "Vegetarian",
  "Gluten-Free",
  "Dairy-Free",
];

const goalOptions = [
  "Regulate my cycle",
  "Improve my diet",
  "Lose weight",
  "Understand my symptoms",
];

const calculatePcosProbability = (data: Partial<PCOSProfile>): 'low' | 'medium' | 'high' => {
  let score = 0;
  if (data.periodRegularity === 'irregular' || data.periodRegularity === 'absent') {
    score += 2;
  }
  score += data.symptoms?.length || 0;
  if (data.insulinResistant === true) {
    score += 1;
  }
  
  if (score >= 4) return 'high';
  if (score >= 2) return 'medium';
  return 'low';
};

const PCOSQuiz: React.FC = () => {
  const { profile, updateProfile } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect if the user has already completed the quiz when they first land on the page.
    if (profile.completedQuiz) {
      navigate('/chat', { replace: true });
    }
  }, []); // Run only once on mount

  const [active, setActive] = useState(0);
  const [formData, setFormData] = useState<Partial<PCOSProfile>>({
    name: profile.name || '',
    age: profile.age || null,
    periodRegularity: profile.periodRegularity || null,
    primaryGoal: profile.primaryGoal || null,
    weightManagementGoal: profile.weightManagementGoal || null,
    symptoms: profile.symptoms || [],
    insulinResistant: profile.insulinResistant || null,
    dietaryPreferences: profile.dietaryPreferences || [],
    hasBeenDiagnosed: profile.hasBeenDiagnosed || null,
    height: profile.height || { feet: null, inches: null },
    weight: profile.weight || null,
  });

  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  const nextStep = () => setActive((current) => (current < 5 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));
  
  const isStepValid = () => {
    switch (active) {
      case 0:
        return disclaimerAccepted;
      case 1:
        return !!formData.periodRegularity;
      case 2:
        return formData.age !== null && formData.insulinResistant !== null;
      case 3:
        return formData.hasBeenDiagnosed !== null && formData.height?.feet !== null && formData.weight !== null;
      case 4:
        return formData.primaryGoal !== null && formData.weightManagementGoal !== null;
      default:
        // All other steps or completed state are considered valid
        return true;
    }
  };
  
  const handleValueChange = (field: keyof PCOSProfile, value: unknown) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };
  
  const handleNumericValueChange = (field: 'age' | 'weight', value: number | string) => {
    const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
    setFormData(current => ({...current, [field]: isNaN(numValue) ? null : numValue}));
  };
  
  const handleHeightChange = (part: 'feet' | 'inches', value: number | string) => {
    const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
    setFormData(current => ({ ...current, height: { ...(current.height || {feet: null, inches: null}), [part]: isNaN(numValue) ? null : numValue } }));
  };

  const handleComplete = () => {
    const result = calculatePcosProbability(formData);
    const finalProfile = { ...formData, pcosProbability: result, completedQuiz: true };
    updateProfile(finalProfile);
    setActive(5);
  };

  // Do not render the quiz if the profile is already complete (avoids flicker before redirect)
  if (profile.completedQuiz && active !== 5) {
    return null;
  }

  // Handle the completion screen separately
  if (active === 5) {
    return (
      <Container 
        style={{ 
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(255, 255, 255, 1))'
        }} 
        p="md"
      >
        <Card style={{ width: '100%', maxWidth: 700 }} shadow="xl" padding="xl" radius="md">
          <Stack align="center" p="xl" gap="lg">
            <Title order={3}>Thank You!</Title>
            <Text>Your PCOS probability assessment is complete.</Text>
            <Card withBorder radius="md" p="xl" style={{ textTransform: 'capitalize' }}>
              <Text size="lg" fw={700} c={profile.pcosProbability === 'high' ? 'red' : profile.pcosProbability === 'medium' ? 'orange' : 'green'}>
                {profile.pcosProbability} Probability
              </Text>
            </Card>
            <Text size="sm" c="dimmed" ta="center">Remember, this is not a medical diagnosis. <br/> Please consult with a healthcare professional.</Text>
            <Button color="pink" size="md" onClick={() => navigate('/chat', { replace: true })}>Start Your Journey</Button>
          </Stack>
        </Card>
      </Container>
    );
  }

  return (
    <Container 
      style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(255, 255, 255, 1))'
      }} 
      p="md"
    >
      <Card 
        style={{ width: '100%', maxWidth: 700 }} 
        shadow="xl" 
        padding="xl" 
        radius="md"
      >
        <Stack mb="xl">
          <Progress value={((active + 1) / 5) * 100} color="pink" radius="sm" size="lg" striped animated />
          <Title order={4} ta="center" mt="sm">
            {active === 0 && "Welcome & Disclaimer"}
            {active === 1 && "Your Cycle & Symptoms"}
            {active === 2 && "Your Medical History"}
            {active === 3 && "Physical Health"}
            {active === 4 && "Lifestyle & Goals"}
          </Title>
        </Stack>

        {active === 0 && (
          <Stack p="xl">
            <Box bg="gray.0" p="md">
              <Text fw={500} mb="sm">For Informational Purposes Only</Text>
              <Text size="sm" c="dimmed">This assessment is not a medical diagnosis. Please consult with a healthcare professional for an accurate diagnosis.</Text>
            </Box>
            <Checkbox
              checked={disclaimerAccepted}
              onChange={(event) => setDisclaimerAccepted(event.currentTarget.checked)}
              label="I have read and agree to the terms above."
              mt="xl" color="pink"
            />
          </Stack>
        )}

        {active === 1 && (
          <Stack p="xl" gap="xl">
            <Title order={4}>Your Cycle & Symptoms</Title>
            <Radio.Group label="How would you describe your periods?" value={formData.periodRegularity || ''} onChange={(v) => handleValueChange('periodRegularity', v)}>
              <Group mt="xs"><Radio value="regular" label="Regular" color="pink" /><Radio value="irregular" label="Irregular" color="pink" /><Radio value="absent" label="Absent or Infrequent" color="pink" /></Group>
            </Radio.Group>
            <Checkbox.Group label="Do you experience any of the following?" value={formData.symptoms || []} onChange={(v) => handleValueChange('symptoms', v)}>
              <Stack mt="xs" gap="sm">{symptomOptions.map(s => <Checkbox key={s} value={s} label={s} color="pink" />)}</Stack>
            </Checkbox.Group>
          </Stack>
        )}
        
        {active === 2 && (
           <Stack p="xl" gap="xl">
            <Title order={4}>Your Medical History</Title>
            <NumberInput label="What's your age?" placeholder="Your age" value={formData.age || ''} onChange={(v) => handleNumericValueChange('age', v)} min={12} max={99} />
            <Radio.Group label="Have you been diagnosed with insulin resistance or type 2 diabetes?" value={String(formData.insulinResistant)} onChange={(v) => handleValueChange('insulinResistant', v === 'true')}>
              <Group mt="xs"><Radio value="true" label="Yes" color="pink" /><Radio value="false" label="No" color="pink" /></Group>
            </Radio.Group>
          </Stack>
        )}
        
        {active === 3 && (
          <Stack p="xl" gap="xl">
            <Title order={4}>Physical Health</Title>
            <Radio.Group label="Have you ever been officially diagnosed with PCOS by a doctor?" value={formData.hasBeenDiagnosed || ''} onChange={(v) => handleValueChange('hasBeenDiagnosed', v)}>
               <Group mt="xs"><Radio value="yes" label="Yes" color="pink" /><Radio value="no" label="No" color="pink" /></Group>
            </Radio.Group>
            <Group grow>
              <NumberInput label="Height (feet)" value={formData.height?.feet || ''} onChange={(v) => handleHeightChange('feet', v)} min={3} max={7} />
              <NumberInput label="Height (inches)" value={formData.height?.inches || ''} onChange={(v) => handleHeightChange('inches', v)} min={0} max={11} />
            </Group>
            <NumberInput label="What is your current weight (in lbs)?" placeholder="Enter your weight" value={formData.weight || ''} onChange={(v) => handleNumericValueChange('weight', v)} min={50} max={700} />
          </Stack>
        )}

        {active === 4 && (
          <Stack p="xl" gap="xl">
            <Title order={4}>Lifestyle & Goals</Title>
             <Radio.Group label="Are you currently trying to manage your weight?" value={formData.weightManagementGoal || ''} onChange={(v) => handleValueChange('weightManagementGoal', v)}>
              <Stack mt="xs"><Radio value="lose" label="Yes, trying to lose weight" color="pink" /><Radio value="gain" label="Yes, trying to gain weight" color="pink" /><Radio value="maintain" label="No, maintaining my current weight" color="pink" /><Radio value="not_focused" label="I'm not focused on weight right now" color="pink" /></Stack>
            </Radio.Group>
            <Radio.Group label="What's your primary goal right now?" value={formData.primaryGoal || ''} onChange={(v) => handleValueChange('primaryGoal', v)}>
              <Stack mt="xs">{goalOptions.map(g => <Radio key={g} value={g} label={g} color="pink" />)}</Stack>
            </Radio.Group>
            <Checkbox.Group label="Do you have any dietary preferences?" value={formData.dietaryPreferences || []} onChange={(v) => handleValueChange('dietaryPreferences', v)}>
              <Group mt="xs">{dietaryOptions.map(o => <Checkbox key={o} value={o} label={o} color="pink" />)}</Group>
            </Checkbox.Group>
          </Stack>
        )}

        <Group justify="flex-end" mt="xl">
          {active > 0 && active < 5 && <Button variant="default" onClick={prevStep}>Back</Button>}
          {active < 4 && <Button onClick={nextStep} color="pink" disabled={!isStepValid()}>Next</Button>}
          {active === 4 && <Button onClick={handleComplete} color="pink" disabled={!isStepValid()}>See My Results</Button>}
        </Group>
      </Card>
    </Container>
  );
};

export default PCOSQuiz;
