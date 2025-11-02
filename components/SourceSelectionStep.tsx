
import React from 'react';
import Card from './Card';
import ListIcon from './icons/ListIcon';
import UploadIcon from './icons/UploadIcon';

interface SourceSelectionStepProps {
  onSelectSource: (source: 'predefined' | 'upload') => void;
  onBack: () => void;
}

const SourceSelectionStep: React.FC<SourceSelectionStepProps> = ({ onSelectSource, onBack }) => {
  return (
    <div className="flex flex-col h-full relative">
      <div className="pt-24">
        <h2 className="text-4xl font-bold mb-2 text-center">Choose Your Source</h2>
        <p className="text-xl text-center text-slate-400 mb-8">Start with one of our examples or upload your own asset.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <Card
            title="Predefined Examples"
            description="Select from a curated list of popular models and datasets to get started quickly."
            isSelected={false}
            onClick={() => onSelectSource('predefined')}
            icon={<ListIcon />}
          />
          <Card
            title="Upload Your Own"
            description="Bring your own model or dataset to analyze its compression potential."
            isSelected={false}
            onClick={() => onSelectSource('upload')}
            icon={<UploadIcon />}
          />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex justify-start">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-slate-600 text-slate-100 font-semibold rounded-lg hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          Back to Mode
        </button>
      </div>
    </div>
  );
};

export default SourceSelectionStep;
