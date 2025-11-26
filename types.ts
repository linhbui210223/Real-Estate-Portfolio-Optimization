export interface ProjectInput {
  id: string;
  name: string;
  cost: number; // I_i: Purchase Cost
  rent: number; // Annual rental income
  growthRate: number; // g: Growth rate (decimal, e.g., 0.05 for 5%)
  maxUnits: number; // Constraint: Max units to buy
  color: string;
}

export interface CalculatedProject extends ProjectInput {
  salePrice: number; // S_i
  rentalNPV: number; // R_i
  totalNPV: number; // The final coefficient for the objective function
}

export interface OptimizationResult {
  projectId: string;
  units: number; // X_i
}

export interface GlobalParams {
  budget: number; // B
  discountRate: number; // r
  years: number; // Time horizon
}

export interface SolverResult {
  allocations: OptimizationResult[];
  totalCost: number;
  totalNPV: number;
  isOptimal: boolean;
  status: string;
}