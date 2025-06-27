import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ButtonColorful } from "@/components/ui/button-colorful";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Toggle } from "@/components/ui/toggle";
import { useUser, PCOSProfile } from '@/contexts/UserContext';
import { Card, CardContent } from '@/components/ui/card';

// Common PCOS symptoms
const pcosSymptoms = [
  { id: "irregular-periods", label: "Irregular periods" },
  { id: "acne", label: "Acne" },
  { id: "excess-hair", label: "Excess hair growth" },
  { id: "hair-loss", label: "Hair loss/thinning" },
  { id: "weight-gain", label: "Weight gain" },
  { id: "fatigue", label: "Fatigue" },
  { id: "mood-changes", label: "Mood changes" },
  { id: "fertility-issues", label: "Fertility issues" }
];

// Dietary preferences
const dietaryOptions = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "gluten-free", label: "Gluten-free" },
  { id: "dairy-free", label: "Dairy-free" },
  { id: "low-carb", label: "Low-carb" },
  { id: "keto", label: "Keto" },
  { id: "mediterranean", label: "Mediterranean" },
  { id: "intermittent-fasting", label: "Intermittent fasting" }
];

const ProfileSetup: React.FC = () => {
  const { profile, updateProfile } = useUser();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<PCOSProfile>>({
    name: profile.name || '',
    age: profile.age || undefined,
    symptoms: profile.symptoms || [],
    insulinResistant: profile.insulinResistant,
    weightGoals: profile.weightGoals,
    dietaryPreferences: profile.dietaryPreferences || [],
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateStep = (step: number): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (step === 1) {
      if (!formData.name?.trim()) {
        newErrors.name = 'Name is required';
      }
      if (!formData.age || formData.age < 12 || formData.age > 100) {
        newErrors.age = 'Please enter a valid age (12-100)';
      }
    }
    
    if (step === 2) {
      if (!formData.symptoms?.length) {
        newErrors.symptoms = 'Please select at least one symptom';
      }
    }
    
    if (step === 3) {
      if (formData.insulinResistant === null || formData.insulinResistant === undefined) {
        newErrors.insulinResistant = 'Please select an option';
      }
      if (!formData.weightGoals) {
        newErrors.weightGoals = 'Please select your weight goal';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleComplete = () => {
    if (validateStep(currentStep)) {
      updateProfile({
        ...formData,
        completedSetup: true
      });
      navigate('/quiz');
    }
  };

  const updateFormData = (key: keyof PCOSProfile, value: PCOSProfile[keyof PCOSProfile]) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-nari-secondary p-4">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-nari-text-main">
              {currentStep === 1 && "Personal Info"}
              {currentStep === 2 && "PCOS Symptoms"}
              {currentStep === 3 && "Insulin & Weight"}
              {currentStep === 4 && "Dietary Preferences"}
            </h2>
            <div className="text-sm font-medium text-nari-text-main/70">
              Step {currentStep} of 4
            </div>
          </div>

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-nari-text-main/90">Your name</Label>
                <Input 
                  id="name" 
                  placeholder="E.g., Jane Doe"
                  value={formData.name} 
                  onChange={e => updateFormData('name', e.target.value)}
                  className={`pcos-input-focus bg-white text-nari-text-main placeholder:text-nari-text-muted border-nari-accent/50 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-nari-text-main/90">Your age</Label>
                <Input 
                  id="age" 
                  type="number" 
                  placeholder="E.g., 30"
                  value={formData.age || ''} 
                  onChange={e => updateFormData('age', parseInt(e.target.value) || null)}
                  className={`pcos-input-focus bg-white text-nari-text-main placeholder:text-nari-text-muted border-nari-accent/50 ${errors.age ? 'border-red-500' : ''}`}
                />
                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <p className="text-nari-text-main/80 mb-2">
                Select the symptoms that apply to you:
              </p>
              <div className="grid grid-cols-1 gap-3">
                {pcosSymptoms.map((symptom) => (
                  <Toggle
                    key={symptom.id}
                    pressed={formData.symptoms?.includes(symptom.label)}
                    onPressedChange={(pressed) => {
                      if (pressed) {
                        updateFormData('symptoms', [...(formData.symptoms || []), symptom.label]);
                      } else {
                        updateFormData('symptoms', formData.symptoms?.filter(s => s !== symptom.label) || []);
                      }
                    }}
                    className="justify-start h-auto p-3 text-left data-[state=on]:bg-nari-primary data-[state=on]:text-white hover:bg-nari-accent/10"
                  >
                    {symptom.label}
                  </Toggle>
                ))}
              </div>
              {errors.symptoms && <p className="text-red-500 text-sm mt-2">{errors.symptoms}</p>}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Do you have insulin resistance?</Label>
                <RadioGroup 
                  value={formData.insulinResistant === null ? undefined : formData.insulinResistant ? "yes" : "no"}
                  onValueChange={(value) => updateFormData('insulinResistant', value === "yes")}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="insulin-yes" className="border-nari-accent text-nari-accent data-[state=checked]:bg-nari-primary data-[state=checked]:text-white data-[state=checked]:border-nari-primary" />
                    <Label htmlFor="insulin-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="insulin-no" className="border-nari-accent text-nari-accent data-[state=checked]:bg-nari-primary data-[state=checked]:text-white data-[state=checked]:border-nari-primary" />
                    <Label htmlFor="insulin-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unknown" id="insulin-unknown" className="border-nari-accent text-nari-accent data-[state=checked]:bg-nari-primary data-[state=checked]:text-white data-[state=checked]:border-nari-primary" />
                    <Label htmlFor="insulin-unknown">I don't know</Label>
                  </div>
                </RadioGroup>
                {errors.insulinResistant && <p className="text-red-500 text-sm mt-1">{errors.insulinResistant}</p>}
              </div>

              <div className="space-y-3">
                <Label>What are your weight management goals?</Label>
                <RadioGroup 
                  value={formData.weightGoals || undefined}
                  onValueChange={(value: 'maintain' | 'lose' | 'gain') => updateFormData('weightGoals', value)}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="maintain" id="maintain" className="border-nari-accent text-nari-accent data-[state=checked]:bg-nari-primary data-[state=checked]:text-white data-[state=checked]:border-nari-primary" />
                    <Label htmlFor="maintain">Maintain current weight</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lose" id="lose" className="border-nari-accent text-nari-accent data-[state=checked]:bg-nari-primary data-[state=checked]:text-white data-[state=checked]:border-nari-primary" />
                    <Label htmlFor="lose">Lose weight</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gain" id="gain" className="border-nari-accent text-nari-accent data-[state=checked]:bg-nari-primary data-[state=checked]:text-white data-[state=checked]:border-nari-primary" />
                    <Label htmlFor="gain">Gain weight</Label>
                  </div>
                </RadioGroup>
                {errors.weightGoals && <p className="text-red-500 text-sm mt-1">{errors.weightGoals}</p>}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <p className="text-nari-text-main/80 mb-2">
                Select any dietary preferences that apply to you:
              </p>
              <div className="grid grid-cols-1 gap-3">
                {dietaryOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={option.id} 
                      checked={formData.dietaryPreferences?.includes(option.label)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFormData('dietaryPreferences', [...(formData.dietaryPreferences || []), option.label]);
                        } else {
                          updateFormData('dietaryPreferences', formData.dietaryPreferences?.filter(p => p !== option.label) || []);
                        }
                      }}
                      className="border-nari-accent data-[state=checked]:bg-nari-primary data-[state=checked]:border-nari-primary"
                    />
                    <label htmlFor={option.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-nari-text-main/90">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {currentStep > 1 ? (
              <Button 
                onClick={handlePrevious} 
                variant="outline"
                className="border-nari-accent text-nari-accent hover:bg-nari-accent/10"
              >
                Back
              </Button>
            ) : (
              <Button 
                onClick={() => navigate('/')} 
                variant="outline"
                className="border-nari-accent text-nari-accent hover:bg-nari-accent/10"
              >
                Cancel
              </Button>
            )}

            {currentStep < 4 ? (
              <Button 
                onClick={handleNext}
                className="bg-nari-primary hover:bg-nari-primary/90"
              >
                Next
              </Button>
            ) : (
              <ButtonColorful 
                onClick={handleComplete}
                label="Complete Setup"
                className="bg-nari-primary hover:bg-nari-primary/90"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetup;
