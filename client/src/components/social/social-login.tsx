import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Github, Mail, Facebook, Twitter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialLoginProps {
  onSocialLogin?: (provider: string) => void;
}

export function SocialLogin({ onSocialLogin }: SocialLoginProps) {
  const { toast } = useToast();

  const handleSocialLogin = (provider: string) => {
    toast({
      title: "Social Login",
      description: `${provider} login would be implemented here with OAuth`,
    });
    
    if (onSocialLogin) {
      onSocialLogin(provider);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Continue with Social Media</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleSocialLogin("Google")}
        >
          <Mail className="mr-2 h-4 w-4" />
          Continue with Google
        </Button>
        
        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleSocialLogin("GitHub")}
        >
          <Github className="mr-2 h-4 w-4" />
          Continue with GitHub
        </Button>
        
        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleSocialLogin("Facebook")}
        >
          <Facebook className="mr-2 h-4 w-4" />
          Continue with Facebook
        </Button>
        
        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleSocialLogin("Twitter")}
        >
          <Twitter className="mr-2 h-4 w-4" />
          Continue with Twitter
        </Button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}