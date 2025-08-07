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
      <div className="flex min-h-screen bg-gray">
        <Sidebar />

        {/* Main Content Area - centered with respect to sidebar */}
        <div className="flex-1 ml-1 flex justify-center items-center">
          <Search />
        </div>
      </div>
    </PrimeReactProvider>
  );
}

export default App;
