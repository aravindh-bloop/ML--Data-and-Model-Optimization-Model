
import React from 'react';
import { MLDataset } from '../types';
import { DATASETS } from '../constants';
import Card from './Card';
import DataIcon from './icons/DataIcon';

interface DatasetSelectionStepProps {
  onNext: () => void;
  onBack: () => void;
  onSelectDataset: (dataset: MLDataset) => void;
  selectedDataset: MLDataset | null;
}

const DatasetSelectionStep: React.FC<DatasetSelectionStepProps> = ({ onNext, onBack, onSelectDataset, selectedDataset }) => {
  return (
    <div className="flex flex-col h-full relative">
      <div className="pt-24">
        <h2 className="text-4xl font-bold mb-2 text-center">Select a Dataset</h2>
        <p className="text-xl text-center text-slate-400 mb-8">Choose a base dataset to apply compression techniques to.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {DATASETS.map((dataset) => (
            <Card
              key={dataset.id}
              title={dataset.name}
              description={dataset.description}
              isSelected={selectedDataset?.id === dataset.id}
              onClick={() => onSelectDataset(dataset)}
              icon={<DataIcon />}
            >
              <div className="text-lg font-semibold text-slate-300 space-y-2 mt-4">
                <p><strong>Size:</strong> {dataset.sizeMB} MB</p>
                <p><strong>Features:</strong> {dataset.features}</p>
                <p><strong>Samples:</strong> {dataset.samples}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-slate-600 text-slate-100 font-semibold rounded-lg hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          Back to Mode
        </button>
        <button
          onClick={onNext}
          disabled={!selectedDataset}
          className="px-6 py-2 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75 disabled:bg-slate-500 disabled:cursor-not-allowed disabled:hover:bg-slate-500 disabled:opacity-70"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DatasetSelectionStep;
