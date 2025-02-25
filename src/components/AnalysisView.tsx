import React, { useState } from 'react';
import { RentalIncomeData } from '../lib/api';
import { DashboardTab } from './DashboardTab';

interface AnalysisViewProps {
  rentalIncomeData?: RentalIncomeData;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ rentalIncomeData }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="mt-8 w-full">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-2 px-4 text-center border-b-2 ${
              activeTab === 'dashboard'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Dashboard
          </button>
          {/* Add more tabs as needed */}
        </nav>
      </div>
      
      <div className="py-4">
        {activeTab === 'dashboard' && <DashboardTab rentalIncome={rentalIncomeData} />}
        {/* Add more tab content as needed */}
      </div>
    </div>
  );
}; 