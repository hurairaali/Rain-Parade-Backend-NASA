import { Thermometer, Wind, Droplets, Snowflake, AlertTriangle, type LucideIcon } from 'lucide-react';
import type { WeatherCondition, WeatherThreshold } from '../../types';

interface WeatherConditionsProps {
  selectedConditions: WeatherCondition[];
  thresholds: WeatherThreshold[];
  onConditionToggle: (condition: WeatherCondition) => void;
  onThresholdChange: (condition: WeatherCondition, value: number) => void;
}

interface ConditionConfig {
  id: WeatherCondition;
  label: string;
  icon: LucideIcon;
  color: string;
  description: string;
}

const WeatherConditions: React.FC<WeatherConditionsProps> = ({
  selectedConditions,
  thresholds,
  onConditionToggle,
  onThresholdChange
}) => {
  const conditions: ConditionConfig[] = [
    {
      id: 'hot',
      label: 'Very Hot',
      icon: Thermometer,
      color: 'from-orange-500 to-red-500',
      description: 'High temperature extremes'
    },
    {
      id: 'cold',
      label: 'Very Cold',
      icon: Snowflake,
      color: 'from-cyan-500 to-blue-500',
      description: 'Low temperature extremes'
    },
    {
      id: 'windy',
      label: 'Very Windy',
      icon: Wind,
      color: 'from-teal-500 to-cyan-500',
      description: 'High wind speeds'
    },
    {
      id: 'wet',
      label: 'Very Wet',
      icon: Droplets,
      color: 'from-blue-500 to-indigo-500',
      description: 'Heavy precipitation'
    },
    {
      id: 'uncomfortable',
      label: 'Very Uncomfortable',
      icon: AlertTriangle,
      color: 'from-yellow-500 to-orange-500',
      description: 'Poor comfort conditions'
    }
  ];

  return (
    <div className="space-y-4">
      {conditions.map((condition) => {
        const isSelected = selectedConditions.includes(condition.id);
        const threshold = thresholds.find(t => t.condition === condition.id);
        const Icon = condition.icon;

        return (
          <div
            key={condition.id}
            className={`border rounded-lg p-4 transition-all cursor-pointer ${
              isSelected
                ? 'border-white/40 bg-white/10'
                : 'border-white/20 hover:border-white/30 hover:bg-white/5'
            }`}
            onClick={() => onConditionToggle(condition.id)}
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${condition.color} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="text-lg font-semibold text-white">{condition.label}</h5>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onConditionToggle(condition.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-5 h-5 rounded border-white/30 text-nasa-blue focus:ring-nasa-blue"
                  />
                </div>
                <p className="text-sm text-gray-400 mb-3">{condition.description}</p>
                
                {isSelected && threshold && (
                  <div className="flex items-center space-x-3">
                    <label className="text-sm text-gray-300">Threshold:</label>
                    <input
                      type="number"
                      value={threshold.value}
                      onChange={(e) => onThresholdChange(condition.id, parseFloat(e.target.value))}
                      onClick={(e) => e.stopPropagation()}
                      className="input-field w-24 py-2"
                    />
                    <span className="text-sm text-gray-400">{threshold.unit}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeatherConditions;
