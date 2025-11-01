import React from 'react';
import { CompressionTechnique } from '../types';
import { TECHNIQUES } from '../constants';
import Card from './Card';
import CompressIcon from './icons/CompressIcon';

interface TechniqueStepProps {
  onNext: () => void;
  onBack: () => void;
  onSelectTechnique: (technique: CompressionTechnique) => void;
  selectedTechnique: CompressionTechnique | null;
}

const TechniqueStep: React.FC<TechniqueStepProps> = ({ onNext, onBack, onSelectTechnique, selectedTechnique }) => {
  return (
    <div className="flex flex-col h-full relative">
      <div className="pt-24">
        <h2 className="text-4xl font-bold mb-2 text-center">Select a Compression Technique</h2>
        <p className="text-xl text-center text-slate-400 mb-8">Choose an optimization method to apply to your selected model.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {TECHNIQUES.map((technique) => (
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
      <div className="absolute bottom-0 left-0 right-0 flex justify-between">
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

export default TechniqueStep;