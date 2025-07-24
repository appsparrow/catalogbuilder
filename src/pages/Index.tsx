
import { MainDashboard } from "@/components/MainDashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/ad9485b6-d796-4b14-a5b2-0701ba070683.png" 
              alt="CUZATA Logo" 
              className="h-8 w-8"
            />
            <h1 className="text-2xl font-bold text-foreground">CUZATA</h1>
          </div>
        </div>
      </nav>

      <main>
        <MainDashboard />
      </main>
    </div>
  );
};

export default Index;
