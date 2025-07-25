import { useState } from "react";
import { MainDashboard } from "@/components/MainDashboard";

export default function Index() {
  const [activeView, setActiveView] = useState<'main' | 'products' | 'catalogs'>('main');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold">Catalog Builder</h1>
              <nav className="flex items-center gap-6">
                <button
                  onClick={() => setActiveView('main')}
                  className={`text-sm font-medium transition-colors ${
                    activeView === 'main' 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Upload Images
                </button>
                <button
                  onClick={() => setActiveView('products')}
                  className={`text-sm font-medium transition-colors ${
                    activeView === 'products' 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Products
                </button>
                <button
                  onClick={() => setActiveView('catalogs')}
                  className={`text-sm font-medium transition-colors ${
                    activeView === 'catalogs' 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Catalogs
                </button>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <MainDashboard activeView={activeView} onViewChange={setActiveView} />
    </div>
  );
}
