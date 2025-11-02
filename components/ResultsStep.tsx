
import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { MLModel, CompressionTechnique, CompressionConfig, CompressionResult } from '../types';
import { generateCompressionAnalysis } from '../services/geminiService';
import Loader from './Loader';

interface ResultsStepProps {
  model: MLModel;
  technique: CompressionTechnique;
  config: CompressionConfig;
  onStartOver: () => void;
  onResultsReady: () => void;
  isTransitioning: boolean;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ model, technique, config, onStartOver, onResultsReady, isTransitioning }) => {
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { compressedSize, compressedParams } = useMemo(() => {
    let newSize = model.sizeMB;
    let newParams = model.parametersMillion;

    if (technique.id === 'pruning') {
      const sparsity = (config.sparsity as number) / 100;
      newSize *= (1 - sparsity * 0.9); // Pruning doesn't reduce size linearly
      newParams *= (1 - sparsity);
    } else if (technique.id === 'quantization') {
      const bits = config.bits as number;
      if (bits === 16) newSize /= 2;
      else if (bits === 8) newSize /= 4;
      else if (bits === 4) newSize /= 8;
    }

    return { compressedSize: newSize, compressedParams: newParams };
  }, [model, technique, config]);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { newAccuracy, summary } = await generateCompressionAnalysis(model, technique, config, compressedSize, compressedParams);
        setResult({
          originalSize: model.sizeMB,
          compressedSize: compressedSize,
          originalParams: model.parametersMillion,
          compressedParams: compressedParams,
          originalAccuracy: model.accuracy,
          compressedAccuracy: newAccuracy,
          summary: summary,
        });
      } catch (e) {
        setError("Failed to generate analysis. Please try again.");
        console.error(e);
      } finally {
        setIsLoading(false);
        onResultsReady();
      }
    };

    fetchAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, technique, config, compressedSize, compressedParams, onResultsReady]);

  if (isLoading || isTransitioning) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <Loader />
            <p className="text-lg mt-4 text-slate-400">
              {isLoading 
                ? "Running compression simulation & generating AI analysis..."
                : "Finalizing..."
              }
            </p>
        </div>
    );
  }

  if (error || !result) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-lg text-red-500">{error || "Could not load results."}</p>
            <button onClick={onStartOver} className="mt-4 px-6 py-2 bg-sky-600 text-white rounded-lg">Start Over</button>
        </div>
    );
  }
  
  const chartData = [
    { name: 'Size (MB)', Original: result.originalSize, Compressed: result.compressedSize },
    { name: 'Parameters (M)', Original: result.originalParams, Compressed: result.compressedParams },
    { name: 'Accuracy (%)', Original: result.originalAccuracy, Compressed: result.compressedAccuracy },
  ];
  
  const sizeReduction = ((result.originalSize - result.compressedSize) / result.originalSize) * 100;
  const paramsReduction = ((result.originalParams - result.compressedParams) / result.originalParams) * 100;
  const accuracyChange = result.compressedAccuracy - result.originalAccuracy;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-slate-100">Compression Analysis</h2>
      </div>
      
      <div className="flex-grow min-h-0 overflow-y-auto pr-2 -mr-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="p-4 bg-slate-900/80 rounded-lg">
            <h3 className="font-bold text-center mb-2">Comparison Metrics</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <XAxis dataKey="name" stroke="#cbd5e1" fontSize={12} />
                      <YAxis stroke="#cbd5e1" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '0.5rem' }} />
                      <Legend wrapperStyle={{fontSize: "14px"}} />
                      <Bar dataKey="Original" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Compressed" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-4">
              <div className="p-4 bg-slate-900/80 rounded-lg text-center">
                  <p className="text-sm font-semibold text-slate-400">Size Reduction</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-500">{sizeReduction.toFixed(1)}%</p>
              </div>
              <div className="p-4 bg-slate-900/80 rounded-lg text-center">
                  <p className="text-sm font-semibold text-slate-400">Parameters Reduction</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-500">{paramsReduction.toFixed(1)}%</p>
              </div>
              <div className="p-4 bg-slate-900/80 rounded-lg text-center">
                  <p className="text-sm font-semibold text-slate-400">Accuracy Change</p>
                  <p className={`text-xl sm:text-2xl font-bold ${accuracyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {accuracyChange.toFixed(2)}%
                  </p>
              </div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-slate-900/80 rounded-lg border border-slate-700">
          <h3 className="text-lg font-bold mb-2 text-sky-300">Model Analysis</h3>
          <p className="text-slate-300 whitespace-pre-wrap font-medium text-sm sm:text-base">{result.summary}</p>
        </div>
      </div>

      <div className="flex-shrink-0 flex justify-center pt-6 pb-2">
        <button
          onClick={onStartOver}
          className="px-8 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75 transition-transform transform hover:scale-105"
        >
          Run Another Simulation
        </button>
      </div>
    </div>
  );
};

export default ResultsStep;
