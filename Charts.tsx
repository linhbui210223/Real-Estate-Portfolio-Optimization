import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { CalculatedProject, OptimizationResult } from '../types';

interface Props {
  projects: CalculatedProject[];
  allocations: OptimizationResult[];
}

export const AllocationPieChart: React.FC<Props> = ({ projects, allocations }) => {
  const data = allocations
    .filter(a => a.units > 0)
    .map(a => {
      const proj = projects.find(p => p.id === a.projectId);
      return {
        name: proj?.name || 'Unknown',
        value: (proj?.cost || 0) * a.units,
        color: proj?.color || '#ccc'
      };
    });

  if (data.length === 0) return <div className="h-full flex items-center justify-center text-slate-400">No investment allocated</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}B`} />
        <Legend verticalAlign="bottom" height={36}/>
      </PieChart>
    </ResponsiveContainer>
  );
};

export const NPVComparisonChart: React.FC<Props> = ({ projects }) => {
  const data = projects.map(p => ({
    name: p.name,
    NPV: p.totalNPV,
    Cost: p.cost,
    color: p.color
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} />
        <Tooltip 
          cursor={{fill: 'transparent'}}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const d = payload[0].payload;
              return (
                <div className="bg-white p-2 border border-slate-200 shadow-lg rounded text-sm">
                  <p className="font-bold">{d.name}</p>
                  <p className="text-green-600">NPV: {d.NPV.toFixed(3)}</p>
                  <p className="text-slate-500">Cost: {d.Cost.toFixed(3)}</p>
                  <p className="text-indigo-500 font-mono mt-1">Ratio: {(d.NPV/d.Cost).toFixed(2)}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="NPV" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
};