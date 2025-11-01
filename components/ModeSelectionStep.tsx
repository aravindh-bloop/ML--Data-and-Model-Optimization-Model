
import React from 'react';
import Card from './Card';
import ModelIcon from './icons/ModelIcon';
import DataIcon from './icons/DataIcon';

interface ModeSelectionStepProps {
  onSelectMode: (mode: 'model' | 'data') => void;
}

const ModeSelectionStep: React.FC<ModeSelectionStepProps> = ({ onSelectMode }) => {
  return (
    <div className="flex flex-col h-full relative">
      <div className="pt-24">
        <h2 className="text-4xl font-bold mb-2 text-center">Choose a Workflow</h2>
        <p className="text-xl text-center text-slate-400 mb-8">What would you like to visualize and analyze today?</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <Card
            title="Model Visualization"
            description="Analyze the impact of compression techniques like pruning and quantization on ML models."
            isSelected={false}
            onClick={() => onSelectMode('model')}
            icon={<ModelIcon />}
          />
          <Card
            title="Data Visualization"
            description="Explore how data compression techniques like PCA and sampling affect datasets."
            isSelected={false}
            onClick={() => onSelectMode('data')}
            icon={<DataIcon />}
          />
        </div>
      </div>
    </div>
  );
};

export default ModeSelectionStep;
