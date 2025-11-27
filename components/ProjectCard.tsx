import React from 'react';
import { ProjectInput } from '../types';
import { Trash2, TrendingUp, DollarSign, Home } from 'lucide-react';

interface Props {
  project: ProjectInput;
  onChange: (id: string, field: keyof ProjectInput, value: number | string) => void;
  onDelete: (id: string) => void;
}

const ProjectCard: React.FC<Props> = ({ project, onChange, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 transition-all hover:shadow-md relative group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }}></div>
            <input 
              type="text" 
              value={project.name}
              onChange={(e) => onChange(project.id, 'name', e.target.value)}
              className="font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none transition-colors w-32"
            />
        </div>
        <button 
            onClick={() => onDelete(project.id)}
            className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
            <Trash2 size={16} />
        </button>
      </div>

      <div className="space-y-3">
        {/* Cost Input */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <DollarSign size={12} /> Purchase Cost (I)
          </label>
          <div className="relative mt-1">
            <input
              type="number"
              value={project.cost}
              onChange={(e) => onChange(project.id, 'cost', parseFloat(e.target.value))}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Rent Input */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Home size={12} /> Yearly Rent
            </label>
            <input
              type="number"
              value={project.rent}
              onChange={(e) => onChange(project.id, 'rent', parseFloat(e.target.value))}
              className="mt-1 w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* Growth Input */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <TrendingUp size={12} /> Growth (g)
            </label>
            <div className="relative mt-1">
              <input
                type="number"
                step="0.01"
                value={project.growthRate}
                onChange={(e) => onChange(project.id, 'growthRate', parseFloat(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none pr-6"
              />
              <span className="absolute right-2 top-2 text-slate-400 text-xs">%</span>
            </div>
          </div>
        </div>

        {/* Constraints */}
        <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Constraint: Max Units
            </label>
            <input
              type="number"
              min="1"
              value={project.maxUnits}
              onChange={(e) => onChange(project.id, 'maxUnits', parseInt(e.target.value))}
              className="mt-1 w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
