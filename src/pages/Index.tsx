
import { MainDashboard } from "@/components/MainDashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-foreground">CatalogPro</h1>
        </div>
      </nav>

      <main>
        <MainDashboard />
      </main>
    </div>
  );
};

export default Index;
