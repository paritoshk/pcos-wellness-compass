
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";
import { useUser } from '@/contexts/UserContext';

interface FireworksAPIKeyInputProps {
  onApiKeySubmit: (apiKey: string) => void;
}

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-muted/50 rounded-md">
      <h3 className="font-medium">Fireworks AI API Key</h3>
      <p className="text-sm text-muted-foreground">
        Enter your Fireworks AI API key to enable food image analysis
      </p>
      <div className="flex gap-2">
        <Input
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your API key..."
          type="password"
          className="flex-1"
        />
        <Button type="submit" size="sm">
          <Key className="h-4 w-4 mr-2" />
          Save Key
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Your API key is stored locally and is only sent to Fireworks AI for image analysis.
      </p>
    </form>
  );
};

export default FireworksAPIKeyInput;
