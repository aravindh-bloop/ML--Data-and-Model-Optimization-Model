
import React, { useMemo, useState } from 'react';
import { MLDataset } from '../types';

interface CorrelationHeatmapProps {
  dataset: MLDataset;
}

// Simple seeded random number generator for deterministic "randomness"
const seededRandom = (seed: number) => {
    let s = seed;
    return () => {
        s = Math.sin(s) * 10000;
        return s - Math.floor(s);
    };
};

const generateCorrelationMatrix = (size: number, datasetId: string, rand: () => number): number[][] => {
    const matrix = Array.from({ length: size }, () => Array(size).fill(0));
    // Base correlation strength varies by dataset
    const baseCorrelation = datasetId === 'wine_quality' ? 0.6 : (datasetId === 'iris_dataset' ? 0.3 : 0.1);

    for (let i = 0; i < size; i++) {
        for (let j = i; j < size; j++) {
            if (i === j) {
                matrix[i][j] = 1.0;
            } else {
                // Create some random strong correlations and some weak ones
                const isStronglyCorrelated = rand() < 0.2;
                const correlation = isStronglyCorrelated 
                    ? (baseCorrelation + rand() * (1 - baseCorrelation)) * (rand() > 0.5 ? 1 : -1)
                    : (rand() - 0.5) * baseCorrelation;
                matrix[i][j] = correlation;
                matrix[j][i] = correlation;
            }
        }
    }
    return matrix;
};

const getColorForValue = (value: number): string => {
    // Using HSL for better color control.
    // Negative is blue, positive is red. Closer to 0 is darker/less saturated.
    const saturation = 70;
    const lightness = 45;
    const alpha = Math.abs(value) * 0.8 + 0.2; // Ensure even small values are visible

    if (value > 0.05) { // Positive
        return `hsla(0, ${saturation}%, ${lightness}%, ${alpha})`;
    } else if (value < -0.05) { // Negative
        return `hsla(220, ${saturation}%, ${lightness}%, ${alpha})`;
    }
    return `hsla(220, 10%, 25%, 1)`; // Dark slate for near-zero
};

const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({ dataset }) => {
    const [tooltip, setTooltip] = useState<{ x: number, y: number, value: number, i: number, j: number } | null>(null);

    const matrix = useMemo(() => {
        const seed = dataset.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const rand = seededRandom(seed);
        const featureCount = Math.min(dataset.features, 20); // Cap at 20 for readability
        return generateCorrelationMatrix(featureCount, dataset.id, rand);
    }, [dataset]);

    const handleMouseMove = (e: React.MouseEvent, value: number, i: number, j: number) => {
        setTooltip({ x: e.clientX, y: e.clientY, value, i, j });
    };

    const handleMouseLeave = () => {
        setTooltip(null);
    };

    const featureLabels = useMemo(() => Array.from({ length: matrix.length }, (_, i) => `F${i + 1}`), [matrix.length]);

    return (
        <div className="p-4 bg-slate-900/80 rounded-lg flex flex-col">
            <h3 className="font-bold text-center text-lg text-slate-100">Simulated Feature Correlation Heatmap</h3>
            <p className="text-sm text-slate-100 text-center mb-4">
                Represents relationships between original features. Red is positive, blue is negative.
                {dataset.features > 20 && ` (Showing first 20 of ${dataset.features} features)`}
            </p>
            <div className="w-full flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md aspect-square relative max-h-full">
                    <div 
                        className="grid gap-px bg-slate-800 border border-slate-700 h-full" 
                        style={{ gridTemplateColumns: `repeat(${matrix.length}, 1fr)` }}
                        onMouseLeave={handleMouseLeave}
                    >
                        {matrix.flat().map((value, index) => {
                            const i = Math.floor(index / matrix.length);
                            const j = index % matrix.length;
                            const isHighlighted = tooltip && (tooltip.i === i || tooltip.j === j);
                            return (
                                <div
                                    key={index}
                                    className="w-full aspect-square transition-transform duration-100"
                                    style={{ 
                                        backgroundColor: getColorForValue(value),
                                        transform: isHighlighted ? 'scale(1.05)' : 'scale(1)',
                                        zIndex: isHighlighted ? 10 : 1,
                                        position: 'relative',
                                        opacity: (tooltip && !isHighlighted) ? 0.5 : 1,
                                    }}
                                    onMouseMove={(e) => handleMouseMove(e, value, i, j)}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-6 flex items-center justify-center gap-3 text-sm text-slate-300 w-full max-w-md">
                    <span className="font-semibold text-blue-400">-1.0</span>
                    <div className="h-4 flex-grow rounded" style={{
                        background: 'linear-gradient(to right, hsla(220, 70%, 45%, 1), hsla(220, 10%, 25%, 1), hsla(0, 70%, 45%, 1))'
                    }}/>
                    <span className="font-semibold text-red-400">+1.0</span>
                </div>
            </div>

            {tooltip && (
                <div
                    className="fixed p-2 bg-slate-800 text-slate-100 rounded-md text-sm pointer-events-none shadow-lg border border-slate-700 z-50"
                    style={{
                        top: tooltip.y,
                        left: tooltip.x,
                        transform: 'translate(15px, -100%)',
                    }}
                >
                    <p>Corr ({featureLabels[tooltip.i]} & {featureLabels[tooltip.j]}):</p>
                    <p className="font-bold text-center text-lg">{tooltip.value.toFixed(3)}</p>
                </div>
            )}
        </div>
    );
};

export default CorrelationHeatmap;
