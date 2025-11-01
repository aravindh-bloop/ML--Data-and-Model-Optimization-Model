
import React, { useEffect } from 'react';
import { DataCompressionTechnique, DataCompressionConfig } from '../types';

interface DataConfigurationStepProps {
  onVisualize: () => void;
  onBack: () => void;
  selectedTechnique: DataCompressionTechnique;
  config: DataCompressionConfig;
  setConfig: (config: DataCompressionConfig) => void;
}

const DataConfigurationStep: React.FC<DataConfigurationStepProps> = ({ onVisualize, onBack, selectedTechnique, config, setConfig }) => {
  
  useEffect(() => {
    const initialConfig: DataCompressionConfig = {};
    let needsUpdate = false;
    selectedTechnique.parameters.forEach(param => {
      if (config[param.id] === undefined) {
        initialConfig[param.id] = param.defaultValue;
        needsUpdate = true;
      }
    });
    if (needsUpdate) {
      setConfig({ ...config, ...initialConfig });
    }
  }, [selectedTechnique, config, setConfig]);

  const handleConfigChange = (id: string, value: string | number) => {
    setConfig({ ...config, [id]: value });
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="pt-24">
        <h2 className="text-4xl font-bold mb-2 text-center">Configure <span className="text-sky-400">{selectedTechnique.name}</span></h2>
        <p className="text-xl text-center text-slate-400 mb-8">Adjust the parameters for the data compression algorithm.</p>
        
        <div className="space-y-8">
          {selectedTechnique.parameters.map((param) => (
            <div key={param.id}>
              <label htmlFor={param.id} className="block text-md font-medium text-slate-300 mb-3">
                {param.name}
              </label>
              <div className="flex items-center space-x-4 mt-2">
                <input
                  type="range"
                  id={param.id}
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  value={config[param.id] ?? param.defaultValue}
                  onChange={(e) => handleConfigChange(param.id, Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="font-semibold text-sky-400 w-16 text-center">
                  {config[param.id] ?? param.defaultValue}{param.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto flex flex-col items-center gap-4 pt-8">
        <button
          onClick={onVisualize}
          className="w-full max-w-xs px-8 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75 transition-transform transform hover:scale-105"
        >
          Visualize Results
        </button>
        <button
          onClick={onBack}
          className="px-6 py-2 text-slate-400 font-semibold rounded-lg hover:text-slate-200"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default DataConfigurationStep;
