import React, { useEffect } from 'react';
import { CompressionTechnique, CompressionConfig } from '../types';
import BitPrecisionSelector from './BitPrecisionSelector';

interface ConfigurationStepProps {
  onVisualize: () => void;
  onBack: () => void;
  selectedTechnique: CompressionTechnique;
  config: CompressionConfig;
  setConfig: (config: CompressionConfig) => void;
}

const ConfigurationStep: React.FC<ConfigurationStepProps> = ({ onVisualize, onBack, selectedTechnique, config, setConfig }) => {
  
  useEffect(() => {
    // Initialize config with default values if not already set
    const initialConfig: CompressionConfig = {};
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
        <p className="text-xl text-center text-slate-400 mb-8">Adjust the parameters for the compression algorithm.</p>
        
        <div className="space-y-8">
          {selectedTechnique.parameters.map((param) => {
            const currentValue = config[param.id] ?? param.defaultValue;
            let inputControl;

            if (param.type === 'select' && param.id === 'bits') {
              inputControl = (
                <BitPrecisionSelector
                  options={param.options ?? []}
                  value={currentValue}
                  onChange={(value) => handleConfigChange(param.id, value)}
                />
              );
            } else if (param.type === 'slider') {
              inputControl = (
                <div className="flex items-center space-x-4 mt-2">
                  <input
                    type="range"
                    id={param.id}
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    value={currentValue}
                    onChange={(e) => handleConfigChange(param.id, Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="font-semibold text-sky-400 w-16 text-center">
                    {currentValue}{param.unit}
                  </span>
                </div>
              );
            } else if (param.type === 'select') {
              inputControl = (
                <select
                  id={param.id}
                  value={currentValue}
                  onChange={(e) => handleConfigChange(param.id, e.target.value)}
                  className="mt-2 block w-full pl-3 pr-10 py-2 text-base border-slate-600 bg-slate-700 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md"
                >
                  {param.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              );
            }

            return (
              <div key={param.id}>
                <label htmlFor={param.id} className="block text-md font-medium text-slate-300 mb-3">
                  {param.name}
                </label>
                {inputControl}
              </div>
            );
          })}
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

export default ConfigurationStep;