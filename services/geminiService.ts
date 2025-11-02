
import { GoogleGenAI } from "@google/genai";
import { MLModel, CompressionTechnique, CompressionConfig, MLDataset, DataCompressionTechnique, DataCompressionConfig } from '../types';

// Fix: Per coding guidelines, initialize GoogleGenAI client directly with process.env.API_KEY and assume it is always available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCompressionAnalysis = async (
  model: MLModel,
  technique: CompressionTechnique,
  config: CompressionConfig,
  compressedSize: number,
  compressedParams: number,
): Promise<{ newAccuracy: number; summary: string }> => {
  const configString = technique.parameters
    .map(p => `- ${p.name}: ${config[p.id]}${p.unit || ''}`)
    .join('\n');

  const prompt = `
    Act as a world-class Machine Learning engineer specializing in model optimization and compression.

    You are analyzing the compression of an ML model.

    **Original Model Details:**
    - Name: ${model.name} (${model.description})
    - Original Size: ${model.sizeMB.toFixed(1)} MB
    - Original Parameters: ${model.parametersMillion.toFixed(1)} Million
    - Original Accuracy: ${model.accuracy}%

    **Compressed Model Details:**
    - Compressed Size: ${compressedSize.toFixed(1)} MB
    - Compressed Parameters: ${compressedParams.toFixed(1)} Million

    **Compression Technique Applied:**
    - Name: ${technique.name}
    - Description: ${technique.description}
    - Configuration:
    ${configString}

    **Your Task:**
    Based on the provided information, generate a concise analysis for a technical audience. The output must be in two parts, separated by a newline.
    1.  **Simulated New Accuracy:** On the first line, provide a single, realistic number for the new accuracy after compression. For example: "90.5". Do not add any other text or symbols on this line. The accuracy drop should be plausible. For example, aggressive pruning on a complex model like BERT might cause a larger drop than 8-bit quantization on a robust model like ResNet-50. Consider the technique's harshness and the model's architecture.
    2.  **Analysis Summary:** On the following lines, provide a summary (2-4 sentences) explaining the trade-offs of this specific compression configuration on this model type. Explain why the accuracy might have changed and what the benefits are (e.g., reduced latency, smaller footprint). Mention potential risks or drawbacks.

    **Example Output:**
    94.5
    Applying ${technique.name} to a ${model.name} model with these settings effectively reduces its size and parameter count, which can lead to significantly faster inference times and lower memory usage on edge devices. However, this level of compression may cause a slight degradation in model performance, as some crucial information stored in the weights might be lost. The model might now be slightly less robust to out-of-distribution data.
  `;
  
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    const text = response.text.trim();
    const lines = text.split('\n');
    
    if (lines.length < 2) {
      throw new Error("Invalid response format from Gemini API");
    }
    
    const newAccuracy = parseFloat(lines[0]);
    const summary = lines.slice(1).join('\n').trim();

    if (isNaN(newAccuracy)) {
      throw new Error("Could not parse accuracy from Gemini response");
    }

    return { newAccuracy, summary };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Provide a fallback response on error
    return {
      newAccuracy: model.accuracy * 0.95, // Fallback to 95% of original
      summary: "An error occurred while generating the AI analysis. This is a placeholder summary. Compression generally involves a trade-off between model size and performance. Please try again later.",
    };
  }
};

export const generateDataCompressionAnalysis = async (
  dataset: MLDataset,
  technique: DataCompressionTechnique,
  config: DataCompressionConfig,
  compressedSize: number,
  compressedFeatures: number,
): Promise<{ informationLoss: number; summary: string }> => {
  const configString = technique.parameters
    .map(p => `- ${p.name}: ${config[p.id]}${p.unit || ''}`)
    .join('\n');

  const prompt = `
    Act as a world-class Data Scientist specializing in feature engineering and data preprocessing.

    You are analyzing the compression of a dataset.

    **Original Dataset Details:**
    - Name: ${dataset.name} (${dataset.description})
    - Original Size: ${dataset.sizeMB.toFixed(2)} MB
    - Original Features: ${dataset.features}
    - Samples: ${dataset.samples}

    **Compressed Dataset Details:**
    - Compressed Size: ${compressedSize.toFixed(2)} MB
    - Compressed Features: ${compressedFeatures}

    **Compression Technique Applied:**
    - Name: ${technique.name}
    - Description: ${technique.description}
    - Configuration:
    ${configString}

    **Your Task:**
    Based on the provided information, generate a concise analysis for a technical audience. The output must be in two parts, separated by a newline.
    1.  **Simulated Information Loss:** On the first line, provide a single, realistic number for the percentage of information loss. For example: "5.0". Do not add any other text or symbols on this line. For PCA, information loss is 100 - explained_variance. For sampling, estimate a plausible value representing potential loss of minority class representation or outliers.
    2.  **Analysis Summary:** On the following lines, provide a summary (2-4 sentences) explaining the trade-offs of this specific data compression. Explain what the reduction means for potential model training (e.g., faster training, reduced overfitting) and what the drawbacks are (e.g., loss of nuance, potential bias). The impact of losing features in a dataset like 'Wine Quality' with many correlated features might be less severe than in a dataset with orthogonal features.

    **Example Output:**
    5.0
    Applying ${technique.name} to the ${dataset.name} dataset drastically reduces its feature count, which will significantly speed up model training and may even improve generalization by removing noise. However, this comes at the cost of losing some information, which could slightly reduce the maximum achievable accuracy for a highly complex model. The principal components retained should still capture the most significant patterns in the data.
  `;
  
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    const text = response.text.trim();
    const lines = text.split('\n');
    
    if (lines.length < 2) {
      throw new Error("Invalid response format from Gemini API");
    }
    
    const informationLoss = parseFloat(lines[0]);
    const summary = lines.slice(1).join('\n').trim();

    if (isNaN(informationLoss)) {
      throw new Error("Could not parse information loss from Gemini response");
    }

    return { informationLoss, summary };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Provide a fallback response on error
    return {
      informationLoss: 5.0,
      summary: "An error occurred while generating the AI analysis. This is a placeholder summary. Data compression typically trades off data fidelity for reduced storage and faster processing. The impact on model performance varies depending on the technique and dataset.",
    };
  }
};
