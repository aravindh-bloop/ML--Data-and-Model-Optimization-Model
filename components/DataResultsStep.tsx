
import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MLDataset, DataCompressionTechnique, DataCompressionConfig, DataCompressionResult } from '../types';
import { generateDataCompressionAnalysis } from '../services/geminiService';
import Loader from './Loader';

interface DataResultsStepProps {
  dataset: MLDataset;
  technique: DataCompressionTechnique;
  config: DataCompressionConfig;
  onStartOver: () => void;
  onResultsReady: () => void;
  isTransitioning: boolean;
}

const DataResultsStep: React.FC<DataResultsStepProps> = ({ dataset, technique, config, onStartOver, onResultsReady, isTransitioning }) => {
  const [result, setResult] = useState<DataCompressionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { compressedSize, compressedFeatures } = useMemo(() => {
    let newSize = dataset.sizeMB;
    let newFeatures = dataset.features;

    if (technique.id === 'pca') {
      const varianceToKeep = (config.variance_to_keep as number) / 100;
      // Simulate feature reduction. Not linear, but let's assume a strong correlation.
      newFeatures = Math.ceil(dataset.features * (varianceToKeep * 0.8 + 0.15)); // Heuristic
      newSize *= (newFeatures / dataset.features);
    } else if (technique.id === 'sampling') {
      const samplingRatio = (config.sampling_ratio as number) / 100;
      newSize *= samplingRatio;
      // Sampling doesn't reduce features
    }

    return { compressedSize: Math.max(0.01, newSize), compressedFeatures: Math.max(1, newFeatures) };
  }, [dataset, technique, config]);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { informationLoss, summary } = await generateDataCompressionAnalysis(dataset, technique, config, compressedSize, compressedFeatures);
        setResult({
          originalSize: dataset.sizeMB,
          compressedSize: compressedSize,
          originalFeatures: dataset.features,
          compressedFeatures: compressedFeatures,
          informationLoss: informationLoss,
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
  }, [dataset, technique, config, compressedSize, compressedFeatures, onResultsReady]);

  if (isLoading || isTransitioning) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <Loader />
            <p className="text-lg mt-4 text-slate-400">
              {isLoading 
                ? "Running data compression simulation & generating AI analysis..."
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
    { name: 'Features', Original: result.originalFeatures, Compressed: result.compressedFeatures },
  ];
  
  const sizeReduction = result.originalSize > 0 ? ((result.originalSize - result.compressedSize) / result.originalSize) * 100 : 0;
  const featuresReduction = result.originalFeatures > 0 ? ((result.originalFeatures - result.compressedFeatures) / result.originalFeatures) * 100 : 0;

  return (
    <div className="flex flex-col h-full pt-16">
      <h2 className="text-4xl font-bold mb-6 text-center text-slate-100">Dataset Compression Analysis</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
        <div className="p-4 bg-slate-900/80 rounded-lg">
          <h3 className="font-bold text-center mb-2">Comparison Metrics</h3>
          <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <XAxis dataKey="name" stroke="#cbd5e1" fontSize={14} />
                    <YAxis stroke="#cbd5e1" fontSize={14} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '0.5rem' }} />
                    <Legend />
                    <Bar dataKey="Original" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Compressed" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
            <div className="p-4 bg-slate-900/80 rounded-lg text-center">
                <p className="text-sm font-semibold text-slate-400">Size Reduction</p>
                <p className="text-2xl font-bold text-green-500">{sizeReduction.toFixed(1)}%</p>
            </div>
            <div className="p-4 bg-slate-900/80 rounded-lg text-center">
                <p className="text-sm font-semibold text-slate-400">Features Reduction</p>
                <p className="text-2xl font-bold text-green-500">{featuresReduction.toFixed(1)}%</p>
            </div>
            <div className="p-4 bg-slate-900/80 rounded-lg text-center">
                <p className="text-sm font-semibold text-slate-400">Information Loss</p>
                <p className='text-2xl font-bold text-red-500'>
                    ~{result.informationLoss.toFixed(1)}%
                </p>
            </div>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-slate-900/80 rounded-lg border border-slate-700">
        <h3 className="text-lg font-bold mb-2 text-sky-300">Dataset Analysis</h3>
        <p className="text-slate-300 whitespace-pre-wrap font-medium">{result.summary}</p>
      </div>

      <div className="mt-auto flex justify-center pt-8">
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

export default DataResultsStep;
