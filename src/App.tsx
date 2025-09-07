import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import Landing from './pages/Landing';
import Research from './pages/Research';
import MVPFeatures from './pages/MVPFeatures';
import NotFound from './pages/NotFound';
import CatalogPage from './pages/CatalogPage';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

function App() {
  return (
    <Router>
      <TooltipProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/research" element={<Research />} />
          <Route path="/app" element={<Index />} />
          <Route path="/features" element={<MVPFeatures />} />
          <Route path="/catalog/:shareableLink" element={<CatalogPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </TooltipProvider>
    </Router>
  );
}

export default App;