import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './utils/console' // Import console utilities early

createRoot(document.getElementById("root")!).render(<App />);
