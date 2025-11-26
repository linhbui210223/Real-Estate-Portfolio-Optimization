import { ProjectInput, CalculatedProject, GlobalParams } from '../types';

/**
 * Calculates the Net Present Value (NPV) components based on the methodology image.
 * 
 * Formula:
 * NPV = -I_i + R_i + S_i
 * 
 * R_i (Rental PV) = Sum( Rent / (1+r)^k ) for k=1 to years
 * S_i (Sale PV)   = ( I_i * (1+g)^years ) / (1+r)^years
 */
export const calculateProjectMetrics = (
  project: ProjectInput, 
  params: GlobalParams
): CalculatedProject => {
  const { cost, rent, growthRate } = project;
  const { discountRate, years } = params;

  // 1. Present Value of Rental Income (R_i)
  let rentalPV = 0;
  for (let k = 1; k <= years; k++) {
    rentalPV += rent / Math.pow(1 + discountRate, k);
  }

  // 2. Present Value of Sale Price after N years (S_i)
  // Future Value = Cost * (1 + g)^n
  const futureValue = cost * Math.pow(1 + growthRate, years);
  // Discounted back to present
  const salePV = futureValue / Math.pow(1 + discountRate, years);

  // 3. Net Present Value
  // NPV = -Cost + Rental_PV + Sale_PV
  const totalNPV = -cost + rentalPV + salePV;

  return {
    ...project,
    salePrice: futureValue, // Storing FV for display
    rentalNPV: rentalPV,
    totalNPV: totalNPV
  };
};

export const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
    notation: "compact",
    compactDisplay: "short"
  }).format(val);
};

export const formatPercent = (val: number) => {
  return `${(val * 100).toFixed(1)}%`;
};