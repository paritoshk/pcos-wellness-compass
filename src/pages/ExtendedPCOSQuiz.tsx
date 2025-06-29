import React, { useState } from 'react';
import { Button, Stepper, Container, Card, Stack, Text, Title, Group, Checkbox, Radio, NumberInput, Textarea } from "@mantine/core";
import { useUser, PCOSProfile } from '@/contexts/UserContext';

// This would be a more comprehensive list based on the new questions
const detailedSymptomOptions = [
  'Acne', 'Unwanted hair growth (hirsutism)', 'Hair loss (on head)', 'Skin darkening', 'Weight gain',
  'Extreme stress or anxiety', 'Difficulty conceiving'
];

interface ExtendedPCOSQuizProps {
  onComplete: () => void;
}

const ExtendedPCOSQuiz: React.FC<ExtendedPCOSQuizProps> = ({ onComplete }) => {
  const { profile, updateProfile } = useUser();
  const [active, setActive] = useState(0);
  const [formData, setFormData] = useState<Partial<PCOSProfile>>({
    // Pre-fill with existing data, but allow overriding
    ...profile,
  });

  const nextStep = () => setActive((current) => (current < 4 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const handleValueChange = (field: keyof PCOSProfile, value: any) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleComplete = () => {
    // Here we would eventually call the AI agent function
    console.log("Submitting extended quiz data:", formData);
    updateProfile({
      ...formData,
      completedExtendedQuiz: true,
    });
    onComplete();
  };

  return (
    <Container p="md">
      <Stepper active={active} onStepClick={setActive} color="pink" allowNextStepsSelect={false}>
        {/* We will add all the detailed steps here */}
        <Stepper.Step label="Medical History" description="Diagnoses & Family">
          <Stack p="md" gap="lg">
             <Title order={4}>Medical Background</Title>
             <Text size="sm" c="dimmed">This helps us understand your full health picture.</Text>
            {/* Example of a new question */}
             <Checkbox.Group
                label="Have you ever been diagnosed with any of the following?"
                // value={formData.diagnosedConditions || []}
                // onChange={(values) => handleValueChange('diagnosedConditions', values)}
              >
                <Stack mt="xs" gap="sm">
                  <Checkbox value="hypothyroidism" label="Hypothyroidism" color="pink" />
                  <Checkbox value="hyperprolactinemia" label="Hyperprolactinemia" color="pink" />
                </Stack>
              </Checkbox.Group>
          </Stack>
        </Stepper.Step>
        
        <Stepper.Step label="Lifestyle" description="Stress & Medications">
           <Stack p="md" gap="lg">
             <Title order={4}>Your Lifestyle</Title>
             <Radio.Group
                  name="stressLevel"
                  label="How would you rate your typical stress level?"
                  // value={formData.stressLevel || ''}
                  // onChange={(value) => handleValueChange('stressLevel', value)}
                >
                  <Group mt="xs">
                    <Radio value="low" label="Low" color="pink" />
                    <Radio value="moderate" label="Moderate" color="pink" />
                    <Radio value="high" label="High" color="pink" />
                  </Group>
                </Radio.Group>
          </Stack>
        </Stepper.Step>

        <Stepper.Completed>
           <Stack align="center" p="xl" gap="lg">
              <Title order={3}>Thank You!</Title>
              <Text ta="center">Your detailed information has been saved.<br/>Nari will now use this to provide even more personalized insights.</Text>
              <Button color="pink" size="md" onClick={handleComplete}>
                Close & Continue Chat
              </Button>
            </Stack>
        </Stepper.Completed>
      </Stepper>

       <Group justify="flex-end" mt="xl">
        {active > 0 && active < 4 && (
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
        )}
        {active < 3 ? (
          <Button onClick={nextStep} color="pink">
            Next
          </Button>
        ) : (
           active === 3 && (
            <Button onClick={handleComplete} color="pink">
              Save & Analyze
            </Button>
           )
        )}
      </Group>
    </Container>
  );
};

export default ExtendedPCOSQuiz; 