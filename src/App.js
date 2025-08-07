import React from 'react';
import { PrimeReactProvider } from 'primereact/api';
import Sidebar from './components/sidebar';
import Search from './components/search';
import "primereact/resources/themes/lara-dark-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import './index.css';

function App() {
  return (
    <PrimeReactProvider>
      <div className="flex min-h-screen bg-gray-900">
        <Sidebar />
        
        {/* Main Content Area - aligned with sidebar */}
        <div className="flex-1 ml-14"> {/* ml-14 = 56px sidebar width */}
          <Search />
        </div>
      </div>
    </PrimeReactProvider>
  );
}

export default App;