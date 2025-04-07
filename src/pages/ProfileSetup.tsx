
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
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

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleComplete = () => {
    updateProfile({
      ...formData,
      completedSetup: true
    });
    navigate('/chat');
  };

  const updateFormData = (key: keyof PCOSProfile, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">
              {currentStep === 1 && "Personal Info"}
              {currentStep === 2 && "PCOS Symptoms"}
              {currentStep === 3 && "Insulin & Weight"}
              {currentStep === 4 && "Dietary Preferences"}
            </h2>
            <div className="text-sm text-muted-foreground">
              Step {currentStep} of 4
            </div>
          </div>

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter your name" 
                  value={formData.name} 
                  onChange={e => updateFormData('name', e.target.value)}
                  className="pcos-input-focus"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Your age</Label>
                <Input 
                  id="age" 
                  type="number" 
                  placeholder="Enter your age" 
                  value={formData.age || ''} 
                  onChange={e => updateFormData('age', parseInt(e.target.value) || null)}
                  className="pcos-input-focus"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <p className="text-muted-foreground mb-2">
                Select the symptoms that apply to you:
              </p>
              <div className="grid grid-cols-1 gap-3">
                {pcosSymptoms.map((symptom) => (
                  <div key={symptom.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={symptom.id} 
                      checked={formData.symptoms?.includes(symptom.label)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFormData('symptoms', [...(formData.symptoms || []), symptom.label]);
                        } else {
                          updateFormData('symptoms', formData.symptoms?.filter(s => s !== symptom.label) || []);
                        }
                      }}
                      className="border-pcos data-[state=checked]:bg-pcos data-[state=checked]:border-pcos"
                    />
                    <label htmlFor={symptom.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {symptom.label}
                    </label>
                  </div>
                ))}
              </div>
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
                    <RadioGroupItem value="yes" id="insulin-yes" className="border-pcos text-pcos" />
                    <Label htmlFor="insulin-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="insulin-no" className="border-pcos text-pcos" />
                    <Label htmlFor="insulin-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unknown" id="insulin-unknown" className="border-pcos text-pcos" />
                    <Label htmlFor="insulin-unknown">I don't know</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>What are your weight management goals?</Label>
                <RadioGroup 
                  value={formData.weightGoals || undefined}
                  onValueChange={(value: 'maintain' | 'lose' | 'gain') => updateFormData('weightGoals', value)}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="maintain" id="maintain" className="border-pcos text-pcos" />
                    <Label htmlFor="maintain">Maintain current weight</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lose" id="lose" className="border-pcos text-pcos" />
                    <Label htmlFor="lose">Lose weight</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gain" id="gain" className="border-pcos text-pcos" />
                    <Label htmlFor="gain">Gain weight</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <p className="text-muted-foreground mb-2">
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
                      className="border-pcos data-[state=checked]:bg-pcos data-[state=checked]:border-pcos"
                    />
                    <label htmlFor={option.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
                className="border-pcos text-pcos hover:bg-pcos/10"
              >
                Back
              </Button>
            ) : (
              <Button 
                onClick={() => navigate('/')} 
                variant="outline"
                className="border-pcos text-pcos hover:bg-pcos/10"
              >
                Cancel
              </Button>
            )}

            {currentStep < 4 ? (
              <Button 
                onClick={handleNext}
                className="bg-pcos hover:bg-pcos-dark"
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleComplete}
                className="bg-pcos hover:bg-pcos-dark"
              >
                Complete
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetup;
