
import React from 'react';
import { DataCompressionTechnique } from '../types';
import { DATA_TECHNIQUES } from '../constants';
import Card from './Card';
import CompressIcon from './icons/CompressIcon';

interface DataTechniqueStepProps {
  onNext: () => void;
  onBack: () => void;
  onSelectTechnique: (technique: DataCompressionTechnique) => void;
  selectedTechnique: DataCompressionTechnique | null;
}

const DataTechniqueStep: React.FC<DataTechniqueStepProps> = ({ onNext, onBack, onSelectTechnique, selectedTechnique }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-2">Select a Compression Technique</h2>
        <p className="text-lg sm:text-xl text-slate-400 mb-6 sm:mb-8">Choose a method to reduce your dataset's complexity.</p>
      </div>
      <div className="flex-grow min-h-0 overflow-y-auto pr-2 -mr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {DATA_TECHNIQUES.map((technique) => (
            <Card
              key={technique.id}
              title={technique.name}
              description={technique.description}
              isSelected={selectedTechnique?.id === technique.id}
              onClick={() => onSelectTechnique(technique)}
              icon={<CompressIcon />}
            />
          ))}
        </div>
      </div>
      <div className="flex-shrink-0 pt-6 flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-slate-600 text-slate-100 font-semibold rounded-lg hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!selectedTechnique}
          className="px-6 py-2 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-slate-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataTechniqueStep;
