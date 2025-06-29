import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Radio, TextInput, Progress, Container, Stack, Text, Title, Card, Group, Checkbox } from '@mantine/core';
import { useUser } from '@/contexts/UserContext';

// Define the structure for your quiz questions
const quizQuestions = [
  {
    step: 1,
    title: 'Your Cycle Story',
    question: 'How would you describe your periods?',
    type: 'radio',
    key: 'periodCycle',
    options: [
      'Regular as a clock',
      'A bit unpredictable',
      'Totally MIA sometimes',
      'Heavy and painful',
    ],
  },
  {
    step: 2,
    title: 'Physical Clues',
    question: 'Have you noticed any of these uninvited guests?',
    type: 'toggle',
    key: 'physicalSymptoms',
    options: [
      'Acne (especially jawline)',
      'Extra hair growth (face/body)',
      'Hair thinning (on your head)',
      'Dark skin patches (neck/underarms)',
    ],
  },
  {
    step: 3,
    title: 'Lifestyle & Habits',
    question: 'How often do you get moving?',
    type: 'radio',
    key: 'activityLevel',
    options: [
      'Daily sweat session',
      'A few times a week',
      'Weekend warrior',
      'What\'s a workout?',
    ],
  },
  {
    step: 4,
    title: 'The Mental Game',
    question: 'How\'s your mood been lately?',
    type: 'radio',
    key: 'mood',
    options: ['Feeling great! 😊', 'Up and down 🎢', 'A bit blue 😟', 'Stressed out 🤯'],
  },
];

const PcosQuiz: React.FC = () => {
  const navigate = useNavigate();
  const { updateProfile } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [errors, setErrors] = useState<{[key: string]: string}>({});

    const handleAnswerChange = (key: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggleChange = (key: string, option: string, pressed: boolean) => {
    const currentAnswers = (answers[key] as string[]) || [];
    const newAnswers = pressed
      ? [...currentAnswers, option]
      : currentAnswers.filter((item: string) => item !== option);
    handleAnswerChange(key, newAnswers);
  };

  const validateStep = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    const currentQuestion = quizQuestions[currentStep];
    
    if (!answers[currentQuestion.key] || 
        (Array.isArray(answers[currentQuestion.key]) && answers[currentQuestion.key].length === 0)) {
      newErrors[currentQuestion.key] = 'Please select an option';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep() && currentStep < quizQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (validateStep()) {
      // Save quiz results to user profile
      updateProfile({
        quizResults: answers,
        completedQuiz: true
      });
      
      // Navigate to results or dashboard
      navigate('/chat');
    }
  };

  const currentQuestion = quizQuestions[currentStep];
  const progress = ((currentStep + 1) / quizQuestions.length) * 100;

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
        <Stack gap="xl">
          <Group justify="space-between" align="center">
            <Title order={2} size="xl">
              Step {currentQuestion.step}: {currentQuestion.title}
            </Title>
            <Text size="sm" c="dimmed">
              {currentStep + 1} of {quizQuestions.length}
            </Text>
          </Group>
          
          <Progress value={progress} color="pink" size="sm" />
          
          <Stack gap="md">
            <Text size="lg" fw={500}>{currentQuestion.question}</Text>
            
            {currentQuestion.type === 'number' && (
              <TextInput
                type="number"
                value={answers[currentQuestion.key] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.key, e.currentTarget.value)}
                style={{ maxWidth: 300 }}
              />
            )}
            
            {currentQuestion.type === 'radio' && (
              <Radio.Group 
                value={answers[currentQuestion.key]} 
                onChange={(value) => handleAnswerChange(currentQuestion.key, value)}
              >
                <Stack gap="xs">
                  {currentQuestion.options?.map((option) => (
                    <Radio key={option} value={option} label={option} color="pink" />
                  ))}
                </Stack>
              </Radio.Group>
            )}
            
            {currentQuestion.type === 'toggle' && (
              <Stack gap="xs">
                {currentQuestion.options?.map((option) => (
                  <Checkbox
                    key={option}
                    label={option}
                    checked={((answers[currentQuestion.key] as string[]) || []).includes(option)}
                    onChange={(event) => handleToggleChange(currentQuestion.key, option, event.currentTarget.checked)}
                    color="pink"
                  />
                ))}
              </Stack>
            )}
            
            {errors[currentQuestion.key] && (
              <Text size="sm" c="red">{errors[currentQuestion.key]}</Text>
            )}
          </Stack>

          <Group justify="space-between">
            <Button 
              onClick={prevStep} 
              disabled={currentStep === 0} 
              variant="outline"
              color="pink"
            >
              Previous
            </Button>
            {currentStep < quizQuestions.length - 1 ? (
              <Button onClick={nextStep} color="pink">Next</Button>
            ) : (
              <Button onClick={handleSubmit} color="pink">Finish & See Results</Button>
            )}
          </Group>
        </Stack>
      </Card>
    </Container>
  );
};

export default PcosQuiz;
