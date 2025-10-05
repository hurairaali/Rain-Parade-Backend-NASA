// Location types
export interface Location {
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

// Weather condition types
export type WeatherCondition = 'hot' | 'cold' | 'windy' | 'wet' | 'uncomfortable';

export interface WeatherThreshold {
  condition: WeatherCondition;
  value: number;
  unit: string;
  enabled: boolean;
}

// Query parameters
export interface QueryParams {
  location: Location;
  date: Date;
  dayOfYear?: number;
  conditions: WeatherCondition[];
  thresholds: WeatherThreshold[];
  timeRange?: {
    start: number; // year
    end: number; // year
  };
}

// Weather data types
export interface WeatherVariable {
  name: string;
  value: number;
  unit: string;
  timestamp: string;
}

export interface ProbabilityData {
  condition: WeatherCondition;
  probability: number; // 0-100
  mean: number;
  median: number;
  stdDev: number;
  percentile25: number;
  percentile75: number;
  percentile90: number;
}

export interface TrendData {
  year: number;
  value: number;
  condition: WeatherCondition;
}

export interface WeatherResults {
  location: Location;
  queryDate: Date;
  probabilities: ProbabilityData[];
  trends: TrendData[];
  historicalData: {
    years: number[];
    values: number[][];
  };
  summary: string;
  riskLevel: 'low' | 'medium' | 'high';
  metadata: {
    dataSource: string;
    lastUpdated: string;
    yearsAnalyzed: number;
  };
}

// Chart types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

// Export types
export interface ExportData {
  format: 'csv' | 'json';
  data: WeatherResults;
  filename: string;
}

// API Response types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Component prop types
export interface LocationSelectionProps {
  onLocationSelect: (location: Location) => void;
  selectedLocation?: Location | null;
}

export interface QueryInputProps {
  location: Location;
  onSubmit: (params: QueryParams) => void;
}

export interface DashboardProps {
  location: Location;
  queryParams: QueryParams;
  results: WeatherResults | null;
  onNewQuery: () => void;
}

export interface VisualizationProps {
  data: ProbabilityData[] | TrendData[];
  type: 'probability' | 'trend' | 'timeseries';
  title: string;
}

export interface ExportProps {
  results: WeatherResults;
  onExport: (format: 'csv' | 'json') => void;
}

// Re-export everything as named exports
export type {
  Location as LocationType,
  WeatherCondition as WeatherConditionType,
  WeatherThreshold as WeatherThresholdType,
  QueryParams as QueryParamsType,
  WeatherResults as WeatherResultsType,
  ProbabilityData as ProbabilityDataType,
  TrendData as TrendDataType,
};