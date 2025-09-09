import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Billing from './pages/Billing';
import Research from './pages/Research';
import MVPFeatures from './pages/MVPFeatures';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
import CatalogPage from './pages/CatalogPage';
import PromoPage from './pages/PromoPage';
import FAQ from './pages/FAQ';
import Info from './pages/Info';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import { StripeTest } from './pages/StripeTest';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/useAuth';

function App() {
  const { user, loading } = useAuth();
  return (
    <Router>
      <TooltipProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/research" element={<Research />} />
          <Route path="/app" element={loading ? null : (user ? <Index /> : <Navigate to="/login" replace />)} />
          <Route path="/settings" element={loading ? null : (user ? <Settings /> : <Navigate to="/login" replace />)} />
          <Route path="/billing" element={loading ? null : (user ? <Billing /> : <Navigate to="/login" replace />)} />
          <Route path="/admin" element={loading ? null : (user ? <Admin /> : <Navigate to="/login" replace />)} />
          <Route path="/stripe-test" element={loading ? null : (user ? <StripeTest /> : <Navigate to="/login" replace />)} />
          <Route path="/features" element={<MVPFeatures />} />
          <Route path="/promo" element={<PromoPage />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/info" element={<Info />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/catalog/:shareableLink" element={<CatalogPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </TooltipProvider>
    </Router>
  );
}

export default App;