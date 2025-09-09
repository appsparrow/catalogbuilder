import { useCompanyProfile } from '@/hooks/useCompanyProfile';
import { Link } from 'react-router-dom';

export const DynamicFooter = () => {
  const { profile } = useCompanyProfile();

  const companyName = profile?.company_name || 'Cuzata';
  const websiteUrl = profile?.website_url || 'https://cuzata.com';
  const contactEmail = profile?.email || 'support@cuzata.com';
  const logoUrl = profile?.logo_url || '/logo-cuzata.png';
  const theme = profile?.theme || { primary_color: '#4F46E5', secondary_color: '#10B981' };

  return (
    <footer 
      className="bg-gray-900 text-white py-16"
      style={{
        backgroundColor: theme.primary_color,
        color: '#ffffff'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src={logoUrl}
                alt={companyName} 
                className="h-8 w-auto"
                onError={(e) => {
                  // Fallback to default logo if custom logo fails to load
                  (e.target as HTMLImageElement).src = '/logo-cuzata.png';
                }}
              />
            </div>
            <p className="text-gray-100 text-sm">
              {profile ? `Custom catalogs - built by Cuzata for ${companyName}` : 'Custom catalogs - built by Cuzata'}
            </p>
            {websiteUrl && (
              <p className="text-gray-100 text-sm mt-2">
                <a 
                  href={websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                  style={{ color: theme.secondary_color }}
                >
                  {websiteUrl}
                </a>
              </p>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/privacy" 
                  className="hover:text-white transition-colors"
                  style={{ color: theme.secondary_color }}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="hover:text-white transition-colors"
                  style={{ color: theme.secondary_color }}
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href={`mailto:${contactEmail}`} 
                  className="hover:text-white transition-colors"
                  style={{ color: theme.secondary_color }}
                >
                  Contact Us
                </a>
              </li>
              <li>
                <span className="text-gray-100">{contactEmail}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-opacity-20 mt-12 pt-8 text-center text-sm text-gray-100">
          <p>Custom catalogs - built by Cuzata for {companyName}</p>
        </div>
      </div>
    </footer>
  );
};
