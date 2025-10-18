
import React from 'react';

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ title, children }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-full flex flex-col">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="flex-grow">
        {children}
      </div>
    </div>
  );
};

export default ChartContainer;
