import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stepper, Container, Card, Stack, Text, Title, Box, Group, Checkbox, Radio, NumberInput } from "@mantine/core";
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
  const [active, setActive] = useState(0);
  const [formData, setFormData] = useState<Partial<PCOSProfile>>({
    name: profile.name || '',
    age: profile.age || null,
    periodRegularity: profile.periodRegularity || null,
    primaryGoal: profile.primaryGoal || null,
    weightManagementGoal: profile.weightManagementGoal || null,
    pcosProbability: profile.pcosProbability || null,
    symptoms: profile.symptoms || [],
    insulinResistant: profile.insulinResistant || null,
    dietaryPreferences: profile.dietaryPreferences || [],
    hasBeenDiagnosed: profile.hasBeenDiagnosed || null,
    height: profile.height || null,
    weight: profile.weight || null,
  });
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  const nextStep = () => setActive((current) => (current < 6 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleValueChange = (field: keyof PCOSProfile, value: any) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleHeightChange = (type: 'feet' | 'inches', value: string | number) => {
    const numValue = typeof value === 'string' ? parseInt(value) || 0 : value;
    setFormData((current) => ({ 
      ...current, 
      height: { 
        feet: type === 'feet' ? numValue : current.height?.feet || 0,
        inches: type === 'inches' ? numValue : current.height?.inches || 0
      }
    }));
  };

  const handleComplete = () => {
    const result = calculatePcosProbability(formData);
    setFormData((current) => ({ ...current, pcosProbability: result }));
    updateProfile({
      ...formData,
      pcosProbability: result,
      completedQuiz: true
    });
    nextStep();
  };

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
        style={{ width: '100%', maxWidth: 600 }} 
        shadow="xl" 
        padding="xl" 
        radius="md"
      >
        <Stack gap="xl">
          <Stepper active={active} onStepClick={setActive} color="pink">
            <Stepper.Step label="Welcome" description="Disclaimer">
              {/* Step 1 Content */}
              <Title order={3} mb="md">PCOS Probability Assessment</Title>
              <Box bg="gray.0" p="md">
                <Text fw={500} mb="sm">For Informational Purposes Only</Text>
                <Text size="sm" c="dimmed">
                  This assessment is not a medical diagnosis. The results are based on common PCOS symptoms and risk factors and are intended for educational purposes. Please consult with a qualified healthcare professional for an accurate diagnosis and personalized medical advice.
                </Text>
                <Text size="sm" c="dimmed" mt="xs">
                  Your individual responses are used solely to generate your assessment result and will not be used for medical research or AI model training unless you provide explicit consent in the future.
                </Text>
              </Box>
              <Checkbox
                checked={disclaimerAccepted}
                onChange={(event) => setDisclaimerAccepted(event.currentTarget.checked)}
                label="I have read and agree to the terms above."
                mt="xl"
                color="pink"
              />
            </Stepper.Step>
            <Stepper.Step label="Symptoms" description="Your experiences">
              <Stack gap="xl" p="md">
                <Title order={4}>Your Cycle & Symptoms</Title>
                <Radio.Group
                  name="periodRegularity"
                  label="How would you describe your periods?"
                  value={formData.periodRegularity || ''}
                  onChange={(value) => handleValueChange('periodRegularity', value)}
                >
                  <Group mt="xs">
                    <Radio value="regular" label="Regular" color="pink" />
                    <Radio value="irregular" label="Irregular" color="pink" />
                    <Radio value="absent" label="Absent or Infrequent" color="pink" />
                  </Group>
                </Radio.Group>
                <Checkbox.Group
                  label="Do you experience any of the following?"
                  value={formData.symptoms || []}
                  onChange={(values) => handleValueChange('symptoms', values)}
                >
                  <Stack mt="xs" gap="sm">
                    {symptomOptions.map((symptom) => (
                      <Checkbox key={symptom} value={symptom} label={symptom} color="pink" />
                    ))}
                  </Stack>
                </Checkbox.Group>
              </Stack>
            </Stepper.Step>
            <Stepper.Step label="Medical History" description="Related conditions">
              <Stack gap="xl" p="md">
                <Title order={4}>Your Medical History</Title>
                <NumberInput
                  label="What's your age?"
                  placeholder="Your age"
                  value={formData.age || ''}
                  onChange={(value) => handleValueChange('age', value)}
                  min={12}
                  max={99}
                />
                <Radio.Group
                  name="insulinResistant"
                  label="Have you been diagnosed with insulin resistance or type 2 diabetes?"
                  value={formData.insulinResistant === null ? '' : String(formData.insulinResistant)}
                  onChange={(value) => handleValueChange('insulinResistant', value === 'true')}
                >
                  <Group mt="xs">
                    <Radio value="true" label="Yes" color="pink" />
                    <Radio value="false" label="No" color="pink" />
                  </Group>
                </Radio.Group>
              </Stack>
            </Stepper.Step>
            <Stepper.Step label="Physical Health" description="Measurements">
              <Stack gap="xl" p="md">
                <Title order={4}>Physical Health</Title>
                <Radio.Group
                  name="hasBeenDiagnosed"
                  label="Have you ever been officially diagnosed with PCOS by a doctor?"
                  value={formData.hasBeenDiagnosed || ''}
                  onChange={(value) => handleValueChange('hasBeenDiagnosed', value as 'yes' | 'no')}
                >
                  <Group mt="xs">
                    <Radio value="yes" label="Yes" color="pink" />
                    <Radio value="no" label="No" color="pink" />
                  </Group>
                </Radio.Group>
                <Group grow>
                  <NumberInput
                    label="Height (feet)"
                    value={formData.height?.feet || ''}
                    onChange={(value) => handleHeightChange('feet', value)}
                    min={3}
                    max={7}
                  />
                  <NumberInput
                    label="Height (inches)"
                    value={formData.height?.inches || ''}
                    onChange={(value) => handleHeightChange('inches', value)}
                    min={0}
                    max={11}
                  />
                </Group>
                <NumberInput
                  label="What is your current weight (in lbs)?"
                  placeholder="Enter your weight"
                  value={formData.weight || ''}
                  onChange={(value) => handleValueChange('weight', value)}
                  min={50}
                  max={700}
                />
              </Stack>
            </Stepper.Step>
            <Stepper.Step label="Lifestyle" description="Diet & Goals">
              <Stack gap="xl" p="md">
                <Title order={4}>Lifestyle & Diet</Title>
                <Radio.Group
                  name="weightManagementGoal"
                  label="Are you currently trying to manage your weight?"
                  value={formData.weightManagementGoal || ''}
                  onChange={(value) => handleValueChange('weightManagementGoal', value)}
                >
                  <Stack mt="xs">
                    <Radio value="lose" label="Yes, trying to lose weight" color="pink" />
                    <Radio value="gain" label="Yes, trying to gain weight" color="pink" />
                    <Radio value="maintain" label="No, maintaining my current weight" color="pink" />
                    <Radio value="not_focused" label="I'm not focused on weight right now" color="pink" />
                  </Stack>
                </Radio.Group>

                <Checkbox.Group
                    label="Do you have any specific dietary preferences?"
                    description="Select all that apply."
                    value={formData.dietaryPreferences || []}
                    onChange={(values) => handleValueChange('dietaryPreferences', values)}
                  >
                  <Stack mt="xs">
                    {dietaryOptions.map((diet) => (
                      <Checkbox key={diet} value={diet} label={diet} color="pink" />
                    ))}
                  </Stack>
                </Checkbox.Group>
              </Stack>
            </Stepper.Step>
            <Stepper.Step label="Goals" description="What matters most">
              <Stack gap="xl" p="md">
                <Title order={4}>What's Your Primary Goal?</Title>
                <Text c="dimmed" size="sm">
                  Thinking about your health journey, which one of these is most important to you right now?
                </Text>
                <Radio.Group
                  name="primaryGoal"
                  value={formData.primaryGoal || ''}
                  onChange={(value) => handleValueChange('primaryGoal', value)}
                >
                  <Stack mt="xs">
                    {goalOptions.map((goal) => (
                      <Radio key={goal} value={goal} label={goal} color="pink" />
                    ))}
                  </Stack>
                </Radio.Group>
              </Stack>
            </Stepper.Step>
            <Stepper.Completed>
              <Stack align="center" p="md" gap="lg">
                <Title order={3}>Thank You!</Title>
                <Text>Your PCOS probability assessment is complete.</Text>
                <Card withBorder radius="md" p="xl" style={{ textTransform: 'capitalize' }}>
                  <Text size="lg" fw={700} c={
                    formData.pcosProbability === 'high' ? 'red' :
                    formData.pcosProbability === 'medium' ? 'orange' : 'green'
                  }>
                    {formData.pcosProbability} Probability
                  </Text>
                </Card>
                <Text size="sm" c="dimmed" ta="center">
                  Remember, this is not a medical diagnosis. <br/> Please consult with a healthcare professional.
                </Text>
                <Button color="pink" size="md" onClick={() => navigate('/chat')}>
                  Start Your Journey
                </Button>
              </Stack>
            </Stepper.Completed>
          </Stepper>

          <Group justify="flex-end" mt="xl">
            {active > 0 && active < 6 && (
              <Button variant="default" onClick={prevStep}>
                Back
              </Button>
            )}
            {active < 5 && (
              <Button onClick={nextStep} color="pink" disabled={active === 0 && !disclaimerAccepted}>
                Next
              </Button>
            )}
            {active === 5 && (
              <Button onClick={handleComplete} color="pink">
                See My Results
              </Button>
            )}
          </Group>
        </Stack>
      </Card>
    </Container>
  );
};

export default PCOSQuiz;
