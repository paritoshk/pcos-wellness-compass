import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Toggle } from '@/components/ui/toggle';
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
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg my-10">
      <h2 className="text-2xl font-bold text-gray-700 mb-2">Step {currentQuestion.step}: {currentQuestion.title}</h2>
      <Progress value={progress} className="mb-6" />
      
      <div className="mb-8">
        <p className="text-lg text-gray-800 mb-4">{currentQuestion.question}</p>
        {currentQuestion.type === 'number' && (
          <Input
            type="number"
            value={answers[currentQuestion.key] || ''}
            onChange={(e) => handleAnswerChange(currentQuestion.key, e.target.value)}
            className="max-w-xs"
          />
        )}
        {currentQuestion.type === 'radio' && (
          <RadioGroup onValueChange={(value) => handleAnswerChange(currentQuestion.key, value)} value={answers[currentQuestion.key]}>
            {currentQuestion.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
        {currentQuestion.type === 'toggle' && (
          <div className="space-y-2">
            {currentQuestion.options?.map((option) => (
              <Toggle
                key={option}
                pressed={((answers[currentQuestion.key] as string[]) || []).includes(option)}
                onPressedChange={(pressed) => handleToggleChange(currentQuestion.key, option, pressed)}
                className="justify-start h-auto p-3 text-left data-[state=on]:bg-blue-500 data-[state=on]:text-white hover:bg-blue-50 w-full"
              >
                {option}
              </Toggle>
            ))}
          </div>
        )}
      </div>
      {errors[currentQuestion.key] && (
        <p className="text-red-500 text-sm mt-2">{errors[currentQuestion.key]}</p>
      )}

      <div className="flex justify-between">
        <Button onClick={prevStep} disabled={currentStep === 0} variant="outline">
          Previous
        </Button>
        {currentStep < quizQuestions.length - 1 ? (
          <Button onClick={nextStep}>Next</Button>
        ) : (
          <Button onClick={handleSubmit}>Finish & See Results</Button>
        )}
      </div>
    </div>
  );
};

export default PcosQuiz;
