import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Eye, EyeOff } from "lucide-react";

interface AuthPopupProps {
  isOpen: boolean;
  onSuccess: () => void;
}

export const AuthPopup = ({ isOpen, onSuccess }: AuthPopupProps) => {
  const [code, setCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Hard-coded 4-digit code for demo purposes
  const DEMO_CODE = "2031";

  useEffect(() => {
    if (isOpen) {
      setCode("");
      setError("");
      setShowCode(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    if (code === DEMO_CODE) {
      onSuccess();
    } else {
      setError("Invalid code. Please try again.");
      setCode("");
    }
    
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Only allow numbers
    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
      e.preventDefault();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-sm mx-4">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl font-semibold">Access Required</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter the 4-digit code to access the application
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type={showCode ? "text" : "password"}
                  value={code}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setCode(value);
                    setError("");
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter 4-digit code"
                  className="text-center text-lg font-mono tracking-widest"
                  maxLength={4}
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowCode(!showCode)}
                >
                  {showCode ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={code.length !== 4 || isLoading}
            >
              {isLoading ? "Verifying..." : "Access Application"}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
            {/* Demo Code: <span className="font-mono font-semibold">{DEMO_CODE}</span> */}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 