import { Link } from 'react-router-dom';

export const LandingFooter = () => {
  return (
    <footer className="bg-white text-gray-600 py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/logo-cuzata.png" 
                alt="Cuzata" 
                className="h-8 w-auto"
              />
            </div>
            <p className="text-gray-500 text-sm">
              Create beautiful product catalogs
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/privacy" 
                  className="hover:text-gray-900 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="hover:text-gray-900 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="mailto:support@cuzata.com" 
                  className="hover:text-gray-900 transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <span className="text-gray-500">support@cuzata.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Cuzata. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
