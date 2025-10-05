import { useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import type { ProbabilityData } from '../../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler);

interface ProbabilityChartProps {
  data: ProbabilityData[];
  type?: 'bar' | 'line';
}

const ProbabilityChart: React.FC<ProbabilityChartProps> = ({ data, type = 'bar' }) => {
  const chartRef = useRef(null);

  const conditionColors: Record<string, { bg: string; border: string }> = {
    hot: { bg: 'rgba(251, 146, 60, 0.6)', border: 'rgb(251, 146, 60)' },
    cold: { bg: 'rgba(56, 189, 248, 0.6)', border: 'rgb(56, 189, 248)' },
    windy: { bg: 'rgba(20, 184, 166, 0.6)', border: 'rgb(20, 184, 166)' },
    wet: { bg: 'rgba(99, 102, 241, 0.6)', border: 'rgb(99, 102, 241)' },
    uncomfortable: { bg: 'rgba(251, 191, 36, 0.6)', border: 'rgb(251, 191, 36)' }
  };

  const chartData = {
    labels: data.map(d => d.condition.charAt(0).toUpperCase() + d.condition.slice(1)),
    datasets: [
      {
        label: 'Probability (%)',
        data: data.map(d => d.probability),
        backgroundColor: data.map(d => conditionColors[d.condition]?.bg || 'rgba(147, 197, 253, 0.6)'),
        borderColor: data.map(d => conditionColors[d.condition]?.border || 'rgb(147, 197, 253)'),
        borderWidth: 2,
        borderRadius: 8,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Weather Condition Probabilities',
        color: '#fff',
        font: {
          size: 18,
          weight: 'bold'
        },
        padding: 20
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            return [
              `Probability: ${context.parsed.y.toFixed(1)}%`,
              `Mean: ${data[context.dataIndex].mean.toFixed(1)}`,
              `Std Dev: ${data[context.dataIndex].stdDev.toFixed(1)}`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#9ca3af',
          callback: function(value: any) {
            return value + '%';
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#9ca3af'
        }
      }
    }
  };

  return (
    <div className="glass-card p-6 h-96">
      {type === 'bar' ? (
        <Bar ref={chartRef} data={chartData} options={options} />
      ) : (
        <Line ref={chartRef} data={chartData} options={options} />
      )}
    </div>
  );
};

export default ProbabilityChart;
