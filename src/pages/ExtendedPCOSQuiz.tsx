import React, { useState } from 'react';
import { Button, Stepper, Container, Stack, Text, Title, Group, Checkbox, Radio, Textarea, MultiSelect } from "@mantine/core";
import { useUser, PCOSProfile } from '@/contexts/UserContext';

// More detailed questions and options
const diagnosedConditionsOptions = [
  { value: 'hypothyroidism', label: 'Hypothyroidism' },
  { value: 'hyperprolactinemia', label: 'Hyperprolactinemia' },
  { value: 'diabetes', label: 'Prediabetes or Type 2 Diabetes' },
  { value: 'none', label: 'None of the above' },
];

const familyHistoryOptions = [
  { value: 'pcos', label: 'PCOS' },
  { value: 'diabetes', label: 'Diabetes' },
  { value: 'irregular_cycles', label: 'Irregular Cycles' },
  { value: 'none', label: 'None of the above' },
];

const medicationOptions = [
  { value: 'hormonal_birth_control', label: 'Hormonal Birth Control' },
  { value: 'metformin', label: 'Metformin' },
  { value: 'spironolactone', label: 'Spironolactone' },
  { value: 'other', label: 'Other Hormone-Affecting Medication' },
  { value: 'none', label: 'None of the above' },
];

interface ExtendedPCOSQuizProps {
  onComplete: () => void;
}

const ExtendedPCOSQuiz: React.FC<ExtendedPCOSQuizProps> = ({ onComplete }) => {
  const { profile, updateProfile } = useUser();
  const [active, setActive] = useState(0);
  const [formData, setFormData] = useState<Partial<PCOSProfile>>({
    ...profile,
    // Initialize new fields to avoid uncontrolled component warnings
    diagnosedConditions: profile.diagnosedConditions || [],
    familyHistory: profile.familyHistory || [],
    medications: profile.medications || [],
    isTryingToConceive: profile.isTryingToConceive || null,
    stressLevel: profile.stressLevel || null,
  });

  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const handleMultiSelectChange = (field: keyof PCOSProfile, values: string[]) => {
    // If a real option is selected, filter out 'none'. If 'none' is selected, clear other options.
    if (values.includes('none')) {
      setFormData((current) => ({ ...current, [field]: ['none'] }));
    } else {
      setFormData((current) => ({ ...current, [field]: values.filter(v => v !== 'none') }));
    }
  };
  
  const handleValueChange = (field: keyof PCOSProfile, value: PCOSProfile[keyof PCOSProfile]) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleComplete = () => {
    console.log("Submitting extended quiz data:", formData);
    // TODO: Send `formData` to the new AI agent function for feature engineering
    updateProfile({ ...formData, completedExtendedQuiz: true });
    onComplete();
  };

  return (
    <Container p="md">
      <Stepper active={active} onStepClick={setActive} color="pink" allowNextStepsSelect={false}>
        <Stepper.Step label="Medical History" description="Diagnoses & Family">
          <Stack p="md" gap="lg">
             <Title order={4}>Medical Background</Title>
             <Text size="sm" c="dimmed">This helps us understand your full health picture.</Text>
             <MultiSelect
                label="Have you ever been diagnosed with any of the following?"
                placeholder="Select all that apply"
                data={diagnosedConditionsOptions}
                value={formData.diagnosedConditions}
                onChange={(values) => handleMultiSelectChange('diagnosedConditions', values)}
                clearable
              />
              <MultiSelect
                label="Has a close female family member been diagnosed with any of the following?"
                placeholder="Select all that apply"
                data={familyHistoryOptions}
                value={formData.familyHistory}
                onChange={(values) => handleMultiSelectChange('familyHistory', values)}
                clearable
              />
          </Stack>
        </Stepper.Step>
        
        <Stepper.Step label="Lifestyle" description="Stress & Medications">
           <Stack p="md" gap="lg">
             <Title order={4}>Your Lifestyle</Title>
              <MultiSelect
                label="Are you taking any medications that could affect your menstrual cycle?"
                placeholder="Select all that apply"
                data={medicationOptions}
                value={formData.medications}
                onChange={(values) => handleMultiSelectChange('medications', values)}
                clearable
              />
             <Radio.Group
                  name="stressLevel"
                  label="How would you rate your typical stress level?"
                  value={formData.stressLevel}
                  onChange={(value) => handleValueChange('stressLevel', value)}
                >
                  <Group mt="xs">
                    <Radio value="low" label="Low" color="pink" />
                    <Radio value="moderate" label="Moderate" color="pink" />
                    <Radio value="high" label="High" color="pink" />
                  </Group>
                </Radio.Group>
          </Stack>
        </Stepper.Step>
        
        <Stepper.Step label="Goals" description="Conception">
           <Stack p="md" gap="lg">
             <Title order={4}>Family Goals</Title>
              <Radio.Group
                  name="isTryingToConceive"
                  label="Are you currently trying to conceive?"
                  value={formData.isTryingToConceive}
                  onChange={(value) => handleValueChange('isTryingToConceive', value)}
                >
                  <Group mt="xs">
                    <Radio value="yes" label="Yes" color="pink" />
                    <Radio value="no" label="No" color="pink" />
                    <Radio value="not_sure" label="Not sure / Thinking about it" color="pink" />
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
        {active > 0 && active < 3 && (
          <Button variant="default" onClick={prevStep}>Back</Button>
        )}
        {active < 2 ? (
          <Button onClick={nextStep} color="pink">Next</Button>
        ) : (
           active === 2 && (
            <Button onClick={handleComplete} color="pink">Save & Get Insights</Button>
           )
        )}
      </Group>
    </Container>
  );
};

export default ExtendedPCOSQuiz; 