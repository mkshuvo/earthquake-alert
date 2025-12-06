export const truncateMagnitude = (magnitude: number): string => {
  if (typeof magnitude !== 'number') return '0.0';
  // Use simple string truncation to avoid floating point issues
  // or use Math.floor(magnitude * 10) / 10
  // Math.floor approach:
  return (Math.floor(magnitude * 10) / 10).toFixed(1);
};
