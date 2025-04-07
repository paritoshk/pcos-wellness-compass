
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";
import { useUser } from '@/contexts/UserContext';

interface FireworksAPIKeyInputProps {
  onApiKeySubmit: (apiKey: string) => void;
}

// This component is now deprecated as we use a default API key
const FireworksAPIKeyInput = ({ onApiKeySubmit }: FireworksAPIKeyInputProps) => {
  const [apiKey, setApiKey] = useState("");
  const { setApiKey: setGlobalApiKey } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySubmit(apiKey.trim());
      setGlobalApiKey(apiKey.trim());
    }
  };

  // Return null as we no longer need this component
  return null;
};

export default FireworksAPIKeyInput;
