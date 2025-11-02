
export interface MLModel {
  id: string;
  name: string;
  description: string;
  sizeMB: number;
  parametersMillion: number;
  accuracy: number;
}

export interface CompressionParameter {
  id:string;
  name: string;
  type: 'slider' | 'select';
  min?: number;
  max?: number;
  step?: number;
  defaultValue: number | string;
  options?: { value: string | number; label: string }[];
  unit?: string;
}

export interface CompressionTechnique {
  id:string;
  name: string;
  description: string;
  parameters: CompressionParameter[];
}

export interface CompressionConfig {
  [key: string]: number | string;
}

export interface CompressionResult {
  originalSize: number;
  compressedSize: number;
  originalParams: number;
  compressedParams: number;
  originalAccuracy: number;
  compressedAccuracy: number;
  summary: string;
}

export interface MLDataset {
  id: string;
  name: string;
  description: string;
  sizeMB: number;
  features: number;
  samples: number;
  intrinsicDimensionality: number; // Represents data complexity for better simulation
}

export interface DataCompressionTechnique {
  id: string;
  name: string;
  description: string;
  parameters: CompressionParameter[];
}

export type DataCompressionConfig = CompressionConfig;

export interface DataCompressionResult {
  originalSize: number;
  compressedSize: number;
  originalFeatures: number;
  compressedFeatures: number;
  informationLoss: number; // A percentage
  summary: string;
}
