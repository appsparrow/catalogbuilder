
import { MainDashboard } from "@/components/MainDashboard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Package, Settings } from "lucide-react";

const Index = () => {
  const [activeView, setActiveView] = useState<'main' | 'products' | 'catalogs'>('main');

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <img 
                src="/lovable-uploads/ad9485b6-d796-4b14-a5b2-0701ba070683.png" 
                alt="CUZATA Logo" 
                className="h-6 w-6 sm:h-8 sm:w-8"
              />
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-mixed bg-clip-text text-transparent">
                CUZATA
              </h1>
            </div>
            
            {/* Header Menu */}
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant={activeView === 'main' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('main')}
                className="hidden sm:flex items-center gap-2"
              >
                <span>Dashboard</span>
              </Button>
              <Button
                variant={activeView === 'products' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('products')}
                className="flex items-center gap-1 sm:gap-2"
              >
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Products</span>
                <span className="sm:hidden">Products</span>
              </Button>
              <Button
                variant={activeView === 'catalogs' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('catalogs')}
                className="flex items-center gap-1 sm:gap-2"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Catalogs (Manage)</span>
                <span className="sm:hidden">Manage</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <MainDashboard activeView={activeView} onViewChange={setActiveView} />
      </main>
    </div>
  );
};

export default Index;
