
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
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-2">Choose Your Source</h2>
        <p className="text-lg sm:text-xl text-slate-400 mb-6 sm:mb-8">Start with one of our examples or upload your own asset.</p>
      </div>
      <div className="flex-grow min-h-0 overflow-y-auto pr-2 -mr-2 flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full">
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
      <div className="flex-shrink-0 pt-6 flex justify-start">
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
