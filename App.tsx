import React, { useState, useMemo } from 'react';
import { Plus, Calculator, Settings, TrendingUp, DollarSign, PieChart as PieIcon, LayoutDashboard } from 'lucide-react';
import ProjectCard from './components/ProjectCard';
import { AllocationPieChart, NPVComparisonChart } from './components/Charts';
import { calculateProjectMetrics, formatCurrency } from './services/finance';
import { solvePortfolio } from './services/solver';
import { ProjectInput, GlobalParams, CalculatedProject } from './types';

// Default Data based on the PDF/Screenshots
const INITIAL_PROJECTS: ProjectInput[] = [
  { id: '1', name: 'Apt Type A', cost: 4.000, rent: 0.2, growthRate: 0.05, maxUnits: 3, color: '#3b82f6' },
  { id: '2', name: 'Apt Type B', cost: 4.200, rent: 0.22, growthRate: 0.06, maxUnits: 3, color: '#8b5cf6' },
  { id: '3', name: 'Apt Type C', cost: 4.300, rent: 0.21, growthRate: 0.055, maxUnits: 3, color: '#10b981' },
  { id: '4', name: 'Villa S', cost: 3.600, rent: 0.15, growthRate: 0.04, maxUnits: 3, color: '#f59e0b' },
  { id: '5', name: 'Villa M', cost: 4.500, rent: 0.23, growthRate: 0.07, maxUnits: 3, color: '#ef4444' },
  { id: '6', name: 'Villa L', cost: 3.800, rent: 0.18, growthRate: 0.06, maxUnits: 3, color: '#ec4899' },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6'];

const App: React.FC = () => {
  // --- State ---
  const [projects, setProjects] = useState<ProjectInput[]>(INITIAL_PROJECTS);
  const [globalParams, setGlobalParams] = useState<GlobalParams>({
    budget: 50,
    discountRate: 0.08, // 8% Discount rate assumption
    years: 5
  });

  // --- Actions ---
  const addProject = () => {
    const newId = (projects.length + 1).toString();
    const color = COLORS[projects.length % COLORS.length];
    setProjects([...projects, {
      id: newId,
      name: `Project ${newId}`,
      cost: 5.0,
      rent: 0.25,
      growthRate: 0.05,
      maxUnits: 2,
      color
    }]);
  };

  const updateProject = (id: string, field: keyof ProjectInput, value: number | string) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== id) return p;
      return { ...p, [field]: value };
    }));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // --- Computations ---
  
  // 1. Calculate Financial Metrics for each project (R, NPV_i)
  const calculatedProjects: CalculatedProject[] = useMemo(() => {
    return projects.map(p => calculateProjectMetrics(p, globalParams));
  }, [projects, globalParams]);

  // 2. Solve the Linear Programming Problem
  const solverResult = useMemo(() => {
    return solvePortfolio(calculatedProjects, globalParams.budget);
  }, [calculatedProjects, globalParams.budget]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-slate-800">
      
      {/* --- Sidebar / Configuration Panel --- */}
      <aside className="w-full md:w-96 bg-slate-50 border-r border-slate-200 flex-shrink-0 flex flex-col h-screen overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-white">
          <h1 className="text-xl font-bold flex items-center gap-2 text-slate-800">
            <LayoutDashboard className="text-indigo-600" />
            QuantEstate
          </h1>
          <p className="text-xs text-slate-500 mt-1">Portfolio Optimization Prototype</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
          
          {/* Global Parameters Section */}
          <section className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
              <Settings size={16} /> Global Constraints
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Total Budget (Billions)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-serif font-bold">B</span>
                  <input 
                    type="number" 
                    value={globalParams.budget}
                    onChange={(e) => setGlobalParams({...globalParams, budget: parseFloat(e.target.value)})}
                    className="pl-8 w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Discount Rate (r)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={globalParams.discountRate}
                    onChange={(e) => setGlobalParams({...globalParams, discountRate: parseFloat(e.target.value)})}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Horizon (Years)</label>
                  <input 
                    type="number" 
                    value={globalParams.years}
                    onChange={(e) => setGlobalParams({...globalParams, years: parseInt(e.target.value)})}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Projects List */}
          <section>
            <div className="flex justify-between items-center mb-4 px-1">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Real Estate Assets</h2>
              <button 
                onClick={addProject}
                className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors"
              >
                <Plus size={14} /> Add Asset
              </button>
            </div>
            
            <div className="space-y-4">
              {projects.map(p => (
                <ProjectCard 
                  key={p.id} 
                  project={p} 
                  onChange={updateProject}
                  onDelete={deleteProject}
                />
              ))}
            </div>
          </section>
        </div>
      </aside>

      {/* --- Main Dashboard --- */}
      <main className="flex-1 bg-slate-100/50 p-6 overflow-y-auto h-screen">
        
        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-500">Total Investment</h3>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <DollarSign size={20} />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {solverResult.totalCost.toFixed(2)} <span className="text-sm font-normal text-slate-400">/ {globalParams.budget}</span>
            </div>
            <div className="mt-2 w-full bg-slate-100 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min((solverResult.totalCost / globalParams.budget) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-right">
              {((solverResult.totalCost / globalParams.budget) * 100).toFixed(1)}% Budget Utilized
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-500">Maximized Profit (NPV)</h3>
              <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                <TrendingUp size={20} />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {solverResult.totalNPV.toFixed(2)}
            </div>
            <p className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
              Optimal Solution Found
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-500">Algorithm Status</h3>
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Calculator size={20} />
              </div>
            </div>
            <div className="text-lg font-semibold text-slate-900">
              Integer Programming
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Method: Greedy Heuristic (Density Descending) with Knapsack Constraints.
            </p>
          </div>
        </div>

        {/* Charts & Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Allocation Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <PieIcon size={18} className="text-slate-400" />
              Budget Allocation
            </h3>
            <div className="h-64">
              <AllocationPieChart projects={calculatedProjects} allocations={solverResult.allocations} />
            </div>
          </div>

          {/* Efficiency Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp size={18} className="text-slate-400" />
              Project NPV Potential
            </h3>
            <div className="h-64">
              <NPVComparisonChart projects={calculatedProjects} />
            </div>
          </div>
        </div>

        {/* Detailed Results Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-800">Portfolio Recommendations</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3 font-semibold">Project</th>
                  <th className="px-6 py-3 font-semibold text-right">Unit Cost (I)</th>
                  <th className="px-6 py-3 font-semibold text-right">Unit NPV</th>
                  <th className="px-6 py-3 font-semibold text-right text-indigo-600">Buy Units</th>
                  <th className="px-6 py-3 font-semibold text-right">Total Investment</th>
                  <th className="px-6 py-3 font-semibold text-right">Total Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {solverResult.allocations
                  .filter(a => a.units > 0)
                  .map(allocation => {
                    const project = calculatedProjects.find(p => p.id === allocation.projectId);
                    if (!project) return null;
                    return (
                      <tr key={allocation.projectId} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{backgroundColor: project.color}}></div>
                          {project.name}
                        </td>
                        <td className="px-6 py-4 text-right text-slate-600">{project.cost.toFixed(3)}</td>
                        <td className="px-6 py-4 text-right text-green-600 font-medium">{project.totalNPV.toFixed(3)}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-bold">
                            {allocation.units}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-slate-700">
                          {(allocation.units * project.cost).toFixed(3)}
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-green-700 font-bold">
                          {(allocation.units * project.totalNPV).toFixed(3)}
                        </td>
                      </tr>
                    );
                })}
                {solverResult.allocations.every(a => a.units === 0) && (
                   <tr>
                     <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                       No viable investments found within budget constraints.
                     </td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;