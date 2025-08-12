import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { useToast } from "@/hooks/use-toast";

export const Header = () => {
  const { profile } = useCompanyProfile();
  const { toast } = useToast();

  const cleanupAuthState = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
  };

  const handleSignOut = async () => {
    try {
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }

      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      
      window.location.href = '/auth';
    } catch (error) {
      toast({
        title: "Sign out error",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-3">
          {profile?.logo_url ? (
            <img
              src={profile.logo_url}
              alt={profile.company_name}
              className="h-8 w-8 object-contain"
            />
          ) : (
            <img
              src="/lovable-uploads/6487a356-5d35-4050-a2ff-c0bb013f6c1c.png"
              alt="Cuzata"
              className="h-8 w-16 object-contain"
            />
          )}
          <div>
            <h1 className="text-lg font-semibold">
              {profile?.company_name || "Cuzata"}
            </h1>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                {profile?.logo_url && (
                  <AvatarImage src={profile.logo_url} alt={profile.contact_person} />
                )}
                <AvatarFallback>
                  {profile?.contact_person ? getInitials(profile.contact_person) : <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {profile && (
              <>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{profile.contact_person}</p>
                    <p className="text-xs text-muted-foreground">{profile.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem disabled>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};