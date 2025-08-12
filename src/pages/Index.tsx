
import { useState } from "react";
import { MainDashboard } from "@/components/MainDashboard";
import { Header } from "@/components/Header";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Index() {
  const [activeView, setActiveView] = useState<'main' | 'products' | 'catalogs'>('main');
  const { profile } = useCompanyProfile();

  const handleViewChange = (view: 'main' | 'products' | 'catalogs') => {
    setActiveView(view);
  };

  return (
    <div className="min-h-screen bg-app-gradient">
      <Header />

      {/* Main Content */}
      <MainDashboard activeView={activeView} onViewChange={setActiveView} />

      {/* Footer */}
      <footer className="mt-8 pt-6 pb-8 border-t border-border text-center bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Custom catalogs - built by{" "}
              <a 
                href="https://cuzata.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                {profile?.company_name || "Cuzata"}
              </a>
              {profile?.company_name && profile.company_name !== "Cuzata" && (
                <>
                  {" "}in partnership with{" "}
                  <a 
                    href="https://cuzata.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    Cuzata
                  </a>
                </>
              )}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
