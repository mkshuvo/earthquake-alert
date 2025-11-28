import React, { useState } from 'react';
import { useFilters, useEarthquakeStore } from '../../store/earthquakeStore';

const FilterPanel: React.FC = () => {
  const filters = useFilters();
  const { setFilters } = useEarthquakeStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleFilterChange = (key: string, value: any) => {
    setFilters({ [key]: value });
  };

  const resetFilters = () => {
    setFilters({
      minMagnitude: 0,
      maxMagnitude: 10,
      location: '',
      startDate: '',
      endDate: '',
      limit: 100,
    });
  };

  const InputField = ({ 
    label, 
    type, 
    value, 
    onChange, 
    placeholder,
    min,
    max,
    step 
  }: {
    label: string;
    type: string;
    value: any;
    onChange: (value: any) => void;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
  }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="text-lg font-semibold text-white">🔍 Filters</h3>
        <span className="text-gray-400">
          {isCollapsed ? '▼' : '▲'}
        </span>
      </div>
      
      {!isCollapsed && (
        <div className="p-4 pt-0 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Min Magnitude"
              type="number"
              value={filters.minMagnitude}
              onChange={(value) => handleFilterChange('minMagnitude', value)}
              min={0}
              max={10}
              step={0.1}
            />
            
            <InputField
              label="Max Magnitude"
              type="number"
              value={filters.maxMagnitude}
              onChange={(value) => handleFilterChange('maxMagnitude', value)}
              min={0}
              max={10}
              step={0.1}
            />
          </div>

          <InputField
            label="Location"
            type="text"
            value={filters.location}
            onChange={(value) => handleFilterChange('location', value)}
            placeholder="Search by location..."
          />

          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Start Date"
              type="datetime-local"
              value={filters.startDate}
              onChange={(value) => handleFilterChange('startDate', value)}
            />
            
            <InputField
              label="End Date"
              type="datetime-local"
              value={filters.endDate}
              onChange={(value) => handleFilterChange('endDate', value)}
            />
          </div>

          <InputField
            label="Limit"
            type="number"
            value={filters.limit}
            onChange={(value) => handleFilterChange('limit', value)}
            min={10}
            max={1000}
            step={10}
          />

          <div className="flex space-x-2">
            <button
              onClick={resetFilters}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors"
            >
              Reset Filters
            </button>
          </div>

          {/* Quick Filter Buttons */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-300">Quick Filters:</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleFilterChange('minMagnitude', 5.0)}
                className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 text-white text-sm rounded transition-colors"
              >
                Significant (5.0+)
              </button>
              
              <button
                onClick={() => handleFilterChange('minMagnitude', 7.0)}
                className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-sm rounded transition-colors"
              >
                Major (7.0+)
              </button>
              
              <button
                onClick={() => {
                  const yesterday = new Date();
                  yesterday.setDate(yesterday.getDate() - 1);
                  handleFilterChange('startDate', yesterday.toISOString().slice(0, 16));
                }}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded transition-colors"
              >
                Last 24h
              </button>
            </div>
          </div>

          {/* Active Filters Summary */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="text-xs text-gray-400">
              <div>Showing earthquakes:</div>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Magnitude: {filters.minMagnitude} - {filters.maxMagnitude}</li>
                {filters.location && <li>Location: "{filters.location}"</li>}
                {filters.startDate && <li>After: {new Date(filters.startDate).toLocaleDateString()}</li>}
                {filters.endDate && <li>Before: {new Date(filters.endDate).toLocaleDateString()}</li>}
                <li>Limit: {filters.limit} results</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
