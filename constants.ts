
import { MLModel, CompressionTechnique, MLDataset, DataCompressionTechnique } from './types';

export const MODELS: MLModel[] = [
  {
    id: 'mobilenet_v2',
    name: 'MobileNetV2',
    description: 'A lightweight, mobile-first computer vision model designed for efficient on-device processing.',
    sizeMB: 14,
    parametersMillion: 3.5,
    accuracy: 94.2,
  },
  {
    id: 'resnet50',
    name: 'ResNet-50',
    description: 'A classic 50-layer deep convolutional neural network known for its powerful feature extraction.',
    sizeMB: 102,
    parametersMillion: 25.6,
    accuracy: 96.5,
  },
  {
    id: 'bert_base',
    name: 'BERT-Base',
    description: 'A transformer-based model for natural language processing tasks like text classification and Q&A.',
    sizeMB: 440,
    parametersMillion: 110,
    accuracy: 97.8,
  },
];

export const TECHNIQUES: CompressionTechnique[] = [
  {
    id: 'pruning',
    name: 'Weight Pruning',
    description: 'Removes individual weights from the network that are close to zero, creating a sparse model.',
    parameters: [
      {
        id: 'sparsity',
        name: 'Sparsity Target',
        type: 'slider',
        min: 10,
        max: 95,
        step: 5,
        defaultValue: 50,
        unit: '%',
      },
    ],
  },
  {
    id: 'quantization',
    name: 'Quantization',
    description: 'Reduces the precision of model weights from 32-bit floating point to lower-bit representations.',
    parameters: [
      {
        id: 'bits',
        name: 'Bit Precision',
        type: 'select',
        defaultValue: 8,
        options: [
          { value: 16, label: '16-bit Float' },
          { value: 8, label: '8-bit Integer' },
          { value: 4, label: '4-bit Integer' },
        ],
      },
    ],
  },
];

export const DATASETS: MLDataset[] = [
  {
    id: 'iris_dataset',
    name: 'Iris Flower Dataset',
    description: 'A classic dataset in pattern recognition, containing 3 classes of 50 instances each.',
    sizeMB: 0.1,
    features: 4,
    samples: 150,
  },
  {
    id: 'wine_quality',
    name: 'Wine Quality Dataset',
    description: 'Contains chemical analysis of wines to predict their quality, with many correlated features.',
    sizeMB: 0.5,
    features: 11,
    samples: 4898,
  },
  {
    id: 'mnist_digits',
    name: 'MNIST Digits',
    description: 'A large database of handwritten digits, commonly used for training image processing systems.',
    sizeMB: 50,
    features: 784, // 28x28 pixels
    samples: 60000,
  },
];

export const DATA_TECHNIQUES: DataCompressionTechnique[] = [
  {
    id: 'pca',
    name: 'PCA (Principal Component Analysis)',
    description: 'A dimensionality-reduction method that transforms a large set of variables into a smaller one that still contains most of the information.',
    parameters: [
      {
        id: 'variance_to_keep',
        name: 'Explained Variance Target',
        type: 'slider',
        min: 80,
        max: 99,
        step: 1,
        defaultValue: 95,
        unit: '%',
      },
    ],
  },
  {
    id: 'sampling',
    name: 'Random Sampling',
    description: 'Reduces the dataset size by selecting a random subset of the data samples.',
    parameters: [
      {
        id: 'sampling_ratio',
        name: 'Sampling Ratio',
        type: 'slider',
        min: 10,
        max: 90,
        step: 5,
        defaultValue: 50,
        unit: '%',
      },
    ],
  },
];
