import React from 'react';
import { RentalIncomeData } from '../lib/api';

interface DashboardTabProps {
  rentalIncome?: RentalIncomeData;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ rentalIncome }) => {
  if (!rentalIncome) {
    return <div>No rental income data available</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Rental Income Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-500 p-4 rounded shadoww">
          <div className="text-gray-100 mb-1">Monthly Rent</div>
          <div className="text-xl font-semibold">
            ${rentalIncome.monthly_rent.toLocaleString()}
          </div>
        </div>
        <div className="bg-blue-500 p-4 rounded shadow">
          <div className="text-gray-100 mb-1">Annual Rent</div>
          <div className="text-xl font-semibold">
            ${rentalIncome.annual_rent.toLocaleString()}
          </div>
        </div>
        </div>
      </div>
  );
}; 