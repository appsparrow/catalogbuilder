import { useCompanyProfile } from '@/hooks/useCompanyProfile';
import { Link } from 'react-router-dom';

export const DynamicFooter = () => {
  const { profile } = useCompanyProfile();

  const companyName = profile?.company_name || 'Cuzata';
  const websiteUrl = profile?.website_url || 'https://cuzata.com';
  const contactEmail = profile?.email || 'support@cuzata.com';

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/logo-cuzata.png" 
                alt={companyName} 
                className="h-8 w-auto"
              />
            </div>
            <p className="text-gray-400 text-sm">
              Custom catalogs - built by Cuzata for {companyName}
            </p>
            {profile?.website_url && (
              <p className="text-gray-400 text-sm mt-2">
                <a 
                  href={websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {websiteUrl}
                </a>
              </p>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a 
                  href={`mailto:${contactEmail}`} 
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li><span className="text-gray-500">{contactEmail}</span></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 Cuzata. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
