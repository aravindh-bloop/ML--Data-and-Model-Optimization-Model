
import React, { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ZAxis } from 'recharts';

interface PCAPlotProps {
  originalFeatures: number;
  compressedFeatures: number;
  datasetId: string;
}

// Simple seeded random number generator for deterministic "randomness"
const seededRandom = (seed: number) => {
    let s = seed;
    return () => {
        s = Math.sin(s) * 10000;
        return s - Math.floor(s);
    };
};

const generateClusterData = (
  numPoints: number, 
  cx: number, 
  cy: number, 
  spread: number, 
  rand: () => number
) => {
  const data = [];
  for (let i = 0; i < numPoints; i++) {
    const angle = rand() * 2 * Math.PI;
    const radius = rand() * spread;
    data.push({ x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius });
  }
  return data;
};

const PCAPlot: React.FC<PCAPlotProps> = ({ originalFeatures, compressedFeatures, datasetId }) => {
  const { data, domain } = useMemo(() => {
    const seed = datasetId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const rand = seededRandom(seed);
    
    // Determine number of clusters based on dataset
    const numClusters = (datasetId === 'iris_dataset') ? 3 : (datasetId === 'wine_quality' ? 2 : 4);
    const pointsPerCluster = 50;

    const featureReductionRatio = Math.max(0, 1 - (compressedFeatures / originalFeatures));
    // Information loss affects how much the clusters overlap. Higher loss = more overlap.
    const informationLossFactor = featureReductionRatio * 1.5;

    const centers = Array.from({ length: numClusters }, (_, i) => ({
      x: (rand() - 0.5) * 200,
      y: (rand() - 0.5) * 200,
    }));
    
    let allData = [];
    const baseSpread = 60;
    
    for (let i = 0; i < numClusters; i++) {
        // Move centers closer together based on information loss
        const newCx = centers[i].x * (1 - informationLossFactor * 0.5);
        const newCy = centers[i].y * (1 - informationLossFactor * 0.5);
        // Increase spread based on information loss
        const newSpread = baseSpread * (1 + informationLossFactor);

        const clusterData = generateClusterData(pointsPerCluster, newCx, newCy, newSpread, rand);
        allData.push({
            name: `Class ${i + 1}`,
            data: clusterData
        });
    }

    const allPoints = allData.flatMap(d => d.data);
    const xDomain = [Math.min(...allPoints.map(p => p.x)), Math.max(...allPoints.map(p => p.x))];
    const yDomain = [Math.min(...allPoints.map(p => p.y)), Math.max(...allPoints.map(p => p.y))];
    const buffer = 30;
    const domain = {
        x: [xDomain[0] - buffer, xDomain[1] + buffer],
        y: [yDomain[0] - buffer, yDomain[1] + buffer],
    };

    return { data: allData, domain };

  }, [originalFeatures, compressedFeatures, datasetId]);

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  return (
    <div className="p-4 bg-slate-900/80 rounded-lg flex flex-col">
      <h3 className="font-bold text-center text-lg text-slate-100">Simulated PCA Projection</h3>
      <p className="text-sm text-slate-100 text-center mb-4">
        This plot simulates how data might look when projected onto its first two principal components. 
        As features are reduced, clusters may overlap, representing information loss.
      </p>
      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <XAxis type="number" dataKey="x" name="PC 1" domain={domain.x} tick={false} axisLine={false} stroke="#cbd5e1" label={{ value: 'Principal Component 1', position: 'insideBottom', offset: -10, fill: '#e2e8f0' }} />
            <YAxis type="number" dataKey="y" name="PC 2" domain={domain.y} tick={false} axisLine={false} stroke="#cbd5e1" label={{ value: 'Principal Component 2', angle: -90, position: 'insideLeft', offset: -10, fill: '#e2e8f0' }} />
            <ZAxis type="number" range={[20, 50]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem' }} itemStyle={{ color: '#e2e8f0' }} labelStyle={{color: '#94a3b8'}} />
            <Legend wrapperStyle={{ color: '#e2e8f0', paddingTop: '10px' }}/>
            {data.map((series, index) => (
                <Scatter key={series.name} name={series.name} data={series.data} fill={colors[index % colors.length]} shape="circle" />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PCAPlot;
