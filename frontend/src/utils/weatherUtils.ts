import type { WeatherCondition } from '../types';

/**
 * Get color for weather condition
 */
export const getConditionColor = (condition: WeatherCondition): string => {
  const colors: Record<WeatherCondition, string> = {
    hot: '#fb923c',
    cold: '#38bdf8',
    windy: '#14b8a6',
    wet: '#6366f1',
    uncomfortable: '#fbbf24'
  };
  return colors[condition];
};

/**
 * Get description for weather condition
 */
export const getConditionDescription = (condition: WeatherCondition): string => {
  const descriptions: Record<WeatherCondition, string> = {
    hot: 'Dangerously high temperatures',
    cold: 'Extremely low temperatures',
    windy: 'Strong wind conditions',
    wet: 'Heavy precipitation',
    uncomfortable: 'Poor comfort index (heat/humidity)'
  };
  return descriptions[condition];
};

/**
 * Format probability percentage
 */
export const formatProbability = (probability: number): string => {
  if (probability >= 75) return 'Very High';
  if (probability >= 50) return 'High';
  if (probability >= 25) return 'Moderate';
  return 'Low';
};

/**
 * Get risk level from probabilities
 */
export const calculateRiskLevel = (probabilities: number[]): 'low' | 'medium' | 'high' => {
  const avgProbability = probabilities.reduce((a, b) => a + b, 0) / probabilities.length;
  if (avgProbability >= 60) return 'high';
  if (avgProbability >= 30) return 'medium';
  return 'low';
};
