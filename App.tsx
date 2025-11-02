
import React, { useState, useCallback, useEffect } from 'react';
import { MLModel, CompressionTechnique, CompressionConfig, CompressionResult, MLDataset, DataCompressionTechnique, DataCompressionConfig, DataCompressionResult } from './types';
import WelcomeStep from './components/WelcomeStep';
import ModeSelectionStep from './components/ModeSelectionStep';
import SourceSelectionStep from './components/SourceSelectionStep';
import ModelSelectionStep from './components/ModelSelectionStep';
import DatasetSelectionStep from './components/DatasetSelectionStep';
import UploadModelStep from './components/UploadModelStep';
import UploadDatasetStep from './components/UploadDatasetStep';
import TechniqueStep from './components/TechniqueStep';
import DataTechniqueStep from './components/DataTechniqueStep';
import ConfigurationStep from './components/ConfigurationStep';
import DataConfigurationStep from './components/DataConfigurationStep';
import ResultsStep from './components/ResultsStep';
import DataResultsStep from './components/DataResultsStep';
import Starfield from './components/Starfield';

const App: React.FC = () => {
  const [step, setStep] = useState(0);
  const [animationState, setAnimationState] = useState<'none' | 'diving' | 'exploding' | 'compressing' | 'imploding'>('none');
  const [visualizationMode, setVisualizationMode] = useState<'model' | 'data' | null>(null);
  const [dataSource, setDataSource] = useState<'predefined' | 'upload' | null>(null);
  
  // Model workflow state
  const [selectedModel, setSelectedModel] = useState<MLModel | null>(null);
  const [selectedTechnique, setSelectedTechnique] = useState<CompressionTechnique | null>(null);
  const [modelConfig, setModelConfig] = useState<CompressionConfig>({});
  
  // Data workflow state
  const [selectedDataset, setSelectedDataset] = useState<MLDataset | null>(null);
  const [selectedDataTechnique, setSelectedDataTechnique] = useState<DataCompressionTechnique | null>(null);
  const [dataConfig, setDataConfig] = useState<DataCompressionConfig>({});

  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalSteps = 6; // Welcome, Mode, Source, Select/Upload, Technique, Configure, Results

  const handleNext = useCallback(() => {
    setStep((prevStep) => Math.min(prevStep + 1, totalSteps));
  }, []);

  const handleBack = useCallback(() => {
    setStep((prevStep) => Math.max(prevStep - 1, 0));
  }, []);
  
  const handleStartOver = useCallback(() => {
    setStep(1); // Go back to mode selection
    setVisualizationMode(null);
    setDataSource(null);
    setSelectedModel(null);
    setSelectedTechnique(null);
    setModelConfig({});
    setSelectedDataset(null);
    setSelectedDataTechnique(null);
    setDataConfig({});
    setIsTransitioning(false);
  }, []);

  const handleSelectMode = useCallback((mode: 'model' | 'data') => {
    setVisualizationMode(mode);
    setStep(2); // Go to Source Selection
  }, []);

  const handleSelectSource = useCallback((source: 'predefined' | 'upload') => {
    setDataSource(source);
    handleNext();
  }, [handleNext]);

  const handleDive = useCallback(() => {
    setAnimationState('diving');
    
    setTimeout(() => {
      setAnimationState('exploding');
    }, 2500);

    setTimeout(() => {
      setStep(1);
      setAnimationState('none');
    }, 3000);
  }, []);
  
  const handleVisualize = useCallback(() => {
    setAnimationState('compressing');
    setStep(6); // Go to results
  }, []);
  
  const handleResultsReady = useCallback(() => {
    setIsTransitioning(true);
    setAnimationState('imploding');
    
    setTimeout(() => {
      setAnimationState('none');
      setIsTransitioning(false);
    }, 2000); 
  }, []);

  useEffect(() => {
    if (animationState === 'compressing' || animationState === 'imploding') {
      document.body.style.backgroundImage = 'none';
      document.body.style.backgroundColor = 'black';
    } else {
      document.body.style.backgroundImage = ''; 
      document.body.style.backgroundColor = '';
    }
  }, [animationState]);


  const renderStep = () => {
    switch (step) {
      case 0:
        return <WelcomeStep onDive={handleDive} animationState={animationState} />;
      case 1:
        return <ModeSelectionStep onSelectMode={handleSelectMode} />;
      case 2:
        return <SourceSelectionStep onSelectSource={handleSelectSource} onBack={() => setStep(1)} />;
      case 3:
        if (dataSource === 'predefined') {
          if (visualizationMode === 'model') {
            return <ModelSelectionStep onNext={handleNext} onSelectModel={setSelectedModel} selectedModel={selectedModel} onBack={() => setStep(2)} />;
          }
          if (visualizationMode === 'data') {
            return <DatasetSelectionStep onNext={handleNext} onSelectDataset={setSelectedDataset} selectedDataset={selectedDataset} onBack={() => setStep(2)} />;
          }
        }
        if (dataSource === 'upload') {
          if (visualizationMode === 'model') {
            return <UploadModelStep onNext={handleNext} onUploadModel={setSelectedModel} onBack={() => setStep(2)} />;
          }
          if (visualizationMode === 'data') {
            return <UploadDatasetStep onNext={handleNext} onUploadDataset={setSelectedDataset} onBack={() => setStep(2)} />;
          }
        }
        return null;
      case 4:
        if (visualizationMode === 'model') {
          return <TechniqueStep onNext={handleNext} onBack={handleBack} onSelectTechnique={setSelectedTechnique} selectedTechnique={selectedTechnique} />;
        }
        if (visualizationMode === 'data') {
          return <DataTechniqueStep onNext={handleNext} onBack={handleBack} onSelectTechnique={setSelectedDataTechnique} selectedTechnique={selectedDataTechnique} />;
        }
        return null;
      case 5:
        if (visualizationMode === 'model' && selectedTechnique) {
          return <ConfigurationStep onVisualize={handleVisualize} onBack={handleBack} selectedTechnique={selectedTechnique} config={modelConfig} setConfig={setModelConfig} />;
        }
        if (visualizationMode === 'data' && selectedDataTechnique) {
          return <DataConfigurationStep onVisualize={handleVisualize} onBack={handleBack} selectedTechnique={selectedDataTechnique} config={dataConfig} setConfig={setDataConfig} />;
        }
        return null;
      case 6:
        if (visualizationMode === 'model' && selectedModel && selectedTechnique) {
          return <ResultsStep model={selectedModel} technique={selectedTechnique} config={modelConfig} onStartOver={handleStartOver} onResultsReady={handleResultsReady} isTransitioning={isTransitioning} />;
        }
        if (visualizationMode === 'data' && selectedDataset && selectedDataTechnique) {
          return <DataResultsStep dataset={selectedDataset} technique={selectedDataTechnique} config={dataConfig} onStartOver={handleStartOver} onResultsReady={handleResultsReady} isTransitioning={isTransitioning} />;
        }
        return null;
      default:
        return null;
    }
  };
  
  const mainContainerClasses = "flex flex-col transition-all duration-300";
  const isPanelHiddenForAnimation = animationState === 'diving' || animationState === 'exploding' || animationState === 'compressing' || animationState === 'imploding';


  return (
    <div 
      className="h-full w-full flex items-center justify-center font-gruppo text-slate-200 overflow-hidden p-2 sm:p-4"
    >
      <div className={`fixed inset-0 bg-black z-50 transition-opacity duration-500 ${animationState === 'exploding' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />
      <Starfield animationState={animationState} />
      <div className={`flex flex-col relative z-10 transition-all duration-500 ${
        step === 0
          ? 'w-full h-full justify-between items-center py-12 sm:py-20'
          : 'w-full max-w-5xl h-full sm:h-[95vh] sm:max-h-[900px] p-4 sm:p-6 lg:p-8'
      } ${
        isPanelHiddenForAnimation ? 'opacity-0' : 'opacity-100'
      }`}>
        {step === 0 && (
          <header className="text-center flex-shrink-0 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl font-bold text-cyan-200 tracking-widest uppercase">ML Compression Visualizer</h1>
            <p className="text-slate-400 mt-2 text-lg">Interactively explore the impact of model and data optimization.</p>
          </header>
        )}
        
        <main key={`${step}-${visualizationMode}`} className={`${mainContainerClasses} ${step > 0 ? 'flex-grow min-h-0 animate-fade-in' : 'flex items-center justify-center'}`}>
          {renderStep()}
        </main>
      </div>
    </div>
  );
};

export default App;
