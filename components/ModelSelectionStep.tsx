
import React from 'react';
import { MLModel } from '../types';
import { MODELS } from '../constants';
import Card from './Card';
import ModelIcon from './icons/ModelIcon';

interface ModelSelectionStepProps {
  onNext: () => void;
  onBack: () => void;
  onSelectModel: (model: MLModel) => void;
  selectedModel: MLModel | null;
}

const ModelSelectionStep: React.FC<ModelSelectionStepProps> = ({ onNext, onBack, onSelectModel, selectedModel }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-2">Select a Model</h2>
        <p className="text-lg sm:text-xl text-slate-400 mb-6 sm:mb-8">Choose a base model to apply compression techniques to.</p>
      </div>
      <div className="flex-grow min-h-0 overflow-y-auto pr-2 -mr-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {MODELS.map((model) => (
            <Card
              key={model.id}
              title={model.name}
              description={model.description}
              isSelected={selectedModel?.id === model.id}
              onClick={() => onSelectModel(model)}
              icon={<ModelIcon />}
            >
              <div className="text-base sm:text-lg font-semibold text-slate-300 space-y-2 mt-4">
                <p><strong>Size:</strong> {model.sizeMB} MB</p>
                <p><strong>Params:</strong> {model.parametersMillion}M</p>
                <p><strong>Accuracy:</strong> {model.accuracy}%</p>
              </div>
            </Card>
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
          disabled={!selectedModel}
          className="px-6 py-2 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75 disabled:bg-slate-500 disabled:cursor-not-allowed disabled:hover:bg-slate-500 disabled:opacity-70"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ModelSelectionStep;
