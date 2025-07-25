
import { useState } from "react";
import { MainDashboard } from "@/components/MainDashboard";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Index() {
  const [activeView, setActiveView] = useState<'main' | 'products' | 'catalogs'>('main');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleViewChange = (view: 'main' | 'products' | 'catalogs') => {
    setActiveView(view);
    setIsMobileMenuOpen(false); // Close mobile menu when item is selected
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-mixed rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-mixed bg-clip-text text-transparent">
                Cuzata
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              <Button
                onClick={() => handleViewChange('main')}
                variant={activeView === 'main' ? 'default' : 'ghost'}
                className={`transition-all duration-200 ${
                  activeView === 'main' 
                    ? 'bg-gradient-mixed hover:bg-gradient-mixed text-white shadow-lg' 
                    : 'hover:bg-accent'
                }`}
              >
                Upload Images
              </Button>
              <Button
                onClick={() => handleViewChange('products')}
                variant={activeView === 'products' ? 'default' : 'ghost'}
                className={`transition-all duration-200 ${
                  activeView === 'products' 
                    ? 'bg-gradient-mixed hover:bg-gradient-mixed text-white shadow-lg' 
                    : 'hover:bg-accent'
                }`}
              >
                Products
              </Button>
              <Button
                onClick={() => handleViewChange('catalogs')}
                variant={activeView === 'catalogs' ? 'default' : 'ghost'}
                className={`transition-all duration-200 ${
                  activeView === 'catalogs' 
                    ? 'bg-gradient-mixed hover:bg-gradient-mixed text-white shadow-lg' 
                    : 'hover:bg-accent'
                }`}
              >
                Catalogs
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t bg-white/95 backdrop-blur-sm">
              <nav className="flex flex-col gap-2 p-4">
                <Button
                  onClick={() => handleViewChange('main')}
                  variant={activeView === 'main' ? 'default' : 'ghost'}
                  className={`w-full justify-start transition-all duration-200 ${
                    activeView === 'main' 
                      ? 'bg-gradient-mixed hover:bg-gradient-mixed text-white shadow-lg' 
                      : 'hover:bg-accent'
                  }`}
                >
                  Upload Images
                </Button>
                <Button
                  onClick={() => handleViewChange('products')}
                  variant={activeView === 'products' ? 'default' : 'ghost'}
                  className={`w-full justify-start transition-all duration-200 ${
                    activeView === 'products' 
                      ? 'bg-gradient-mixed hover:bg-gradient-mixed text-white shadow-lg' 
                      : 'hover:bg-accent'
                  }`}
                >
                  Products
                </Button>
                <Button
                  onClick={() => handleViewChange('catalogs')}
                  variant={activeView === 'catalogs' ? 'default' : 'ghost'}
                  className={`w-full justify-start transition-all duration-200 ${
                    activeView === 'catalogs' 
                      ? 'bg-gradient-mixed hover:bg-gradient-mixed text-white shadow-lg' 
                      : 'hover:bg-accent'
                  }`}
                >
                  Catalogs
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <MainDashboard activeView={activeView} onViewChange={setActiveView} />
    </div>
  );
}
