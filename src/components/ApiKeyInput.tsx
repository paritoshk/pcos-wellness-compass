
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Check } from "lucide-react";
import { useUser } from '@/contexts/UserContext';
import { toast } from "sonner";

const ApiKeyInput: React.FC = () => {
  const { apiKey, setApiKey } = useUser();
  const [inputValue, setInputValue] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    if (!inputValue || inputValue.trim() === '') {
      toast.error("Please enter a valid API key");
      return;
    }

    setIsSaving(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setApiKey(inputValue.trim());
      toast.success("API key saved successfully");
      setIsSaving(false);
    }, 500);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="api-key">Fireworks AI API Key</Label>
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <Input
            id="api-key"
            type={showKey ? "text" : "password"}
            placeholder="Enter your Fireworks AI API key"
            value={inputValue || ''}
            onChange={(e) => setInputValue(e.target.value)}
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={() => setShowKey(!showKey)}
          >
            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving || inputValue === apiKey}
          className="bg-pcos hover:bg-pcos-dark"
        >
          {isSaving ? (
            <span className="flex items-center gap-1">Saving...</span>
          ) : (
            <span className="flex items-center gap-1">
              <Check className="h-4 w-4" />
              Save
            </span>
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        You need a Fireworks AI API key to use the food analysis feature. 
        <a 
          href="https://app.fireworks.ai/users?tab=apiKeys" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-pcos ml-1 hover:underline"
        >
          Get your API key here
        </a>.
      </p>
    </div>
  );
};

export default ApiKeyInput;
