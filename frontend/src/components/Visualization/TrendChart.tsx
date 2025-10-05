import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import type { TrendData } from '../../types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface TrendChartProps {
  data: TrendData[];
  title?: string;
}

const TrendChart: React.FC<TrendChartProps> = ({ data, title = 'Historical Trend Analysis' }) => {
  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.condition]) {
      acc[item.condition] = [];
    }
    acc[item.condition].push(item);
    return {};
  }, {} as Record<string, TrendData[]>);

  const conditionColors: Record<string, string> = {
    hot: 'rgb(251, 146, 60)',
    cold: 'rgb(56, 189, 248)',
    windy: 'rgb(20, 184, 166)',
    wet: 'rgb(99, 102, 241)',
    uncomfortable: 'rgb(251, 191, 36)'
  };

  const years = Array.from(new Set(data.map(d => d.year))).sort();
  
  const datasets = Object.keys(groupedData).map(condition => {
    const conditionData = years.map(year => {
      const item = groupedData[condition].find(d => d.year === year);
      return item ? item.value : null;
    });

    return {
      label: condition.charAt(0).toUpperCase() + condition.slice(1),
      data: conditionData,
      borderColor: conditionColors[condition] || 'rgb(147, 197, 253)',
      backgroundColor: (conditionColors[condition] || 'rgb(147, 197, 253)') + '33',
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      pointHoverRadius: 6
    };
  });

  const chartData = {
    labels: years,
    datasets
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#fff',
          padding: 15,
          usePointStyle: true,
        }
      },
      title: {
        display: true,
        text: title,
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
        padding: 12
      }
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#9ca3af'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#9ca3af'
        }
      }
    }
  };

  return (
    <div className="glass-card p-6 h-96">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default TrendChart;
