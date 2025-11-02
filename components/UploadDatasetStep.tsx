
import React, { useState, useMemo } from 'react';
import { MLDataset } from '../types';
import UploadIcon from './icons/UploadIcon';

interface UploadDatasetStepProps {
  onNext: () => void;
  onBack: () => void;
  onUploadDataset: (dataset: MLDataset) => void;
}

const UploadDatasetStep: React.FC<UploadDatasetStepProps> = ({ onNext, onBack, onUploadDataset }) => {
  const [datasetDetails, setDatasetDetails] = useState({
    name: '',
    description: '',
    sizeMB: '',
    features: '',
    samples: '',
  });
  const [fileName, setFileName] = useState('');

  const isFormValid = useMemo(() => {
    return (
      datasetDetails.name.trim() !== '' &&
      datasetDetails.description.trim() !== '' &&
      !isNaN(parseFloat(datasetDetails.sizeMB)) && parseFloat(datasetDetails.sizeMB) > 0 &&
      !isNaN(parseInt(datasetDetails.features)) && parseInt(datasetDetails.features) > 0 &&
      !isNaN(parseInt(datasetDetails.samples)) && parseInt(datasetDetails.samples) > 0
    );
  }, [datasetDetails]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDatasetDetails(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  }

  const handleSubmit = () => {
    if (!isFormValid) return;
    const newDataset: MLDataset = {
      id: `custom-${Date.now()}`,
      name: datasetDetails.name,
      description: datasetDetails.description,
      sizeMB: parseFloat(datasetDetails.sizeMB),
      features: parseInt(datasetDetails.features),
      samples: parseInt(datasetDetails.samples),
      intrinsicDimensionality: 0.6, // Assign a default average complexity
    };
    onUploadDataset(newDataset);
    onNext();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-2">Upload Dataset Details</h2>
        <p className="text-lg sm:text-xl text-slate-400 mb-6 sm:mb-8">Enter the specifications for your custom dataset.</p>
      </div>
      
      <div className="flex-grow min-h-0 overflow-y-auto pr-2 -mr-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-900/50 p-4 sm:p-6 rounded-lg">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-600 rounded-lg p-6 text-center h-full">
            <UploadIcon className="h-12 w-12 sm:h-16 sm:w-16 text-slate-500 mb-4"/>
            <p className="text-slate-400 mb-2">Drag & drop your file here or</p>
            <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} />
            <label htmlFor="file-upload" className="cursor-pointer px-4 py-2 bg-slate-700 text-slate-100 font-semibold rounded-lg hover:bg-slate-600">
              Select File
            </label>
            {fileName && <p className="text-xs text-slate-400 mt-4 break-all px-2">Selected: {fileName}</p>}
            <p className="text-xs text-slate-500 mt-4">(File upload is for demonstration purposes only)</p>
          </div>
          <div className="space-y-4">
            <input type="text" name="name" placeholder="Dataset Name" value={datasetDetails.name} onChange={handleInputChange} className="w-full bg-slate-800 border border-slate-700 rounded-md p-3 focus:ring-2 focus:ring-sky-500 focus:outline-none"/>
            <textarea name="description" placeholder="Description" value={datasetDetails.description} onChange={handleInputChange} className="w-full bg-slate-800 border border-slate-700 rounded-md p-3 h-24 resize-none focus:ring-2 focus:ring-sky-500 focus:outline-none"></textarea>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input type="number" name="sizeMB" placeholder="Size (MB)" value={datasetDetails.sizeMB} onChange={handleInputChange} className="w-full bg-slate-800 border border-slate-700 rounded-md p-3 focus:ring-2 focus:ring-sky-500 focus:outline-none"/>
                <input type="number" name="features" placeholder="Features" value={datasetDetails.features} onChange={handleInputChange} className="w-full bg-slate-800 border border-slate-700 rounded-md p-3 focus:ring-2 focus:ring-sky-500 focus:outline-none"/>
                <input type="number" name="samples" placeholder="Samples" value={datasetDetails.samples} onChange={handleInputChange} className="w-full bg-slate-800 border border-slate-700 rounded-md p-3 focus:ring-2 focus:ring-sky-500 focus:outline-none"/>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 pt-6 flex justify-between">
        <button onClick={onBack} className="px-6 py-2 bg-slate-600 text-slate-100 font-semibold rounded-lg hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400">Back</button>
        <button onClick={handleSubmit} disabled={!isFormValid} className="px-6 py-2 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 disabled:bg-slate-500 disabled:cursor-not-allowed">Next</button>
      </div>
    </div>
  );
};

export default UploadDatasetStep;
