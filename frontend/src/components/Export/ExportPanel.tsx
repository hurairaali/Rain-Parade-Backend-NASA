import { useState } from 'react';
import { Download, FileJson, FileText, Check } from 'lucide-react';
import type { WeatherResults } from '../../types';

interface ExportPanelProps {
  results: WeatherResults;
}

const ExportPanel: React.FC<ExportPanelProps> = ({ results }) => {
  const [exported, setExported] = useState<string | null>(null);

  const handleExport = (format: 'csv' | 'json') => {
    const filename = `weather-analysis-${new Date().toISOString().split('T')[0]}.${format}`;
    
    let content: string;
    let mimeType: string;

    if (format === 'json') {
      content = JSON.stringify(results, null, 2);
      mimeType = 'application/json';
    } else {
      content = convertToCSV(results);
      mimeType = 'text/csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExported(format);
    setTimeout(() => setExported(null), 3000);
  };

  const convertToCSV = (data: WeatherResults): string => {
    const headers = [
      'Condition',
      'Probability (%)',
      'Mean',
      'Median',
      'Std Deviation',
      '25th Percentile',
      '75th Percentile',
      '90th Percentile'
    ];

    const rows = data.probabilities.map(prob => [
      prob.condition,
      prob.probability.toFixed(2),
      prob.mean.toFixed(2),
      prob.median.toFixed(2),
      prob.stdDev.toFixed(2),
      prob.percentile25.toFixed(2),
      prob.percentile75.toFixed(2),
      prob.percentile90.toFixed(2)
    ]);

    const metadata = [
      [''],
      ['Metadata'],
      ['Location Latitude', data.location.latitude.toString()],
      ['Location Longitude', data.location.longitude.toString()],
      ['Location Name', data.location.name || 'N/A'],
      ['Query Date', data.queryDate.toISOString()],
      ['Data Source', data.metadata.dataSource],
      ['Years Analyzed', data.metadata.yearsAnalyzed.toString()],
      ['Last Updated', data.metadata.lastUpdated],
      ['Risk Level', data.riskLevel],
      [''],
      ['Summary'],
      [data.summary]
    ];

    return [
      headers.join(','),
      ...rows.map(row => row.join(',')),
      ...metadata.map(row => row.join(','))
    ].join('\n');
  };

  return (
    <div className="glass-card p-6">
      <div className="space-y-4">
        <p className="text-gray-300 mb-6">
          Download the complete analysis data including all statistics, metadata, and source information.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <button
            onClick={() => handleExport('json')}
            className="flex items-center justify-between p-6 rounded-lg border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <FileJson className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h4 className="text-lg font-semibold text-white mb-1">JSON Format</h4>
                <p className="text-sm text-gray-400">
                  Structured data for applications
                </p>
              </div>
            </div>
            {exported === 'json' ? (
              <Check className="w-6 h-6 text-green-400" />
            ) : (
              <Download className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
            )}
          </button>

          <button
            onClick={() => handleExport('csv')}
            className="flex items-center justify-between p-6 rounded-lg border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h4 className="text-lg font-semibold text-white mb-1">CSV Format</h4>
                <p className="text-sm text-gray-400">
                  Spreadsheet-compatible format
                </p>
              </div>
            </div>
            {exported === 'csv' ? (
              <Check className="w-6 h-6 text-green-400" />
            ) : (
              <Download className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
            )}
          </button>
        </div>

        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <h5 className="text-sm font-semibold text-white mb-2">Export Includes:</h5>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• Probability statistics for all selected conditions</li>
            <li>• Historical trend data</li>
            <li>• Location coordinates and metadata</li>
            <li>• Data source information and timestamps</li>
            <li>• Summary and risk assessment</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExportPanel;
