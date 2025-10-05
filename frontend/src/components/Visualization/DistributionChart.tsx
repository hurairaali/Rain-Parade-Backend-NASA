import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import type { ProbabilityData } from '../../types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface DistributionChartProps {
  data: ProbabilityData;
  title?: string;
}

const DistributionChart: React.FC<DistributionChartProps> = ({ data, title }) => {
  // Generate bell curve data points
  const generateBellCurve = (mean: number, stdDev: number, points: number = 50) => {
    const values: number[] = [];
    const labels: number[] = [];
    const min = mean - 3 * stdDev;
    const max = mean + 3 * stdDev;
    const step = (max - min) / points;

    for (let x = min; x <= max; x += step) {
      labels.push(parseFloat(x.toFixed(2)));
      const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
      const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
      values.push(y);
    }

    return { labels, values };
  };

  const { labels, values } = generateBellCurve(data.mean, data.stdDev);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Probability Distribution',
        data: values,
        borderColor: 'rgb(147, 197, 253)',
        backgroundColor: 'rgba(147, 197, 253, 0.2)',
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 5
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: title || `Distribution for ${data.condition}`,
        color: '#fff',
        font: {
          size: 16,
          weight: 'bold'
        }
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
          color: '#9ca3af',
          display: false
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#9ca3af',
          maxTicksLimit: 8
        }
      }
    }
  };

  return (
    <div className="glass-card p-6 h-64">
      <Line data={chartData} options={options} />
      <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
        <div>
          <p className="text-gray-400">Mean</p>
          <p className="text-white font-semibold">{data.mean.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-400">Median</p>
          <p className="text-white font-semibold">{data.median.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-400">Std Dev</p>
          <p className="text-white font-semibold">{data.stdDev.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default DistributionChart;
