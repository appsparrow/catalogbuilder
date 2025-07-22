
import { useState } from "react";
import { AdminDashboard } from "@/components/AdminDashboard";
import { CustomerCatalog } from "@/components/CustomerCatalog";
import { Button } from "@/components/ui/button";
import { Palette, Settings } from "lucide-react";

const Index = () => {
  const [view, setView] = useState<'admin' | 'customer'>('admin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="min-h-screen bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm">
        <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">CatalogPro</h1>
            <div className="flex gap-2">
              <Button
                variant={view === 'admin' ? 'default' : 'outline'}
                onClick={() => setView('admin')}
                className={view === 'admin' ? 'bg-white text-purple-600' : 'text-white border-white/30'}
              >
                <Settings className="mr-2 h-4 w-4" />
                Admin
              </Button>
              <Button
                variant={view === 'customer' ? 'default' : 'outline'}
                onClick={() => setView('customer')}
                className={view === 'customer' ? 'bg-white text-purple-600' : 'text-white border-white/30'}
              >
                <Palette className="mr-2 h-4 w-4" />
                Catalog
              </Button>
            </div>
          </div>
        </nav>

        <main className="p-6">
          {view === 'admin' ? <AdminDashboard /> : <CustomerCatalog />}
        </main>
      </div>
    </div>
  );
};

export default Index;
