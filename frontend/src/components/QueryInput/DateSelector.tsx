import { Calendar } from 'lucide-react';

interface DateSelectorProps {
  value: Date;
  onChange: (date: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ value, onChange }) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(new Date(e.target.value));
  };

  const handleMonthDayChange = (month: number, day: number) => {
    const year = new Date().getFullYear();
    onChange(new Date(year, month, day));
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (month: number) => {
    return new Date(2024, month + 1, 0).getDate();
  };

  const currentMonth = value.getMonth();
  const currentDay = value.getDate();

  return (
    <div className="space-y-4">
      {/* Quick Date Input */}
      <div className="relative">
        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="date"
          value={value.toISOString().split('T')[0]}
          onChange={handleDateChange}
          className="input-field w-full pl-12"
        />
      </div>

      {/* Month/Day Selector */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Month</label>
          <select
            value={currentMonth}
            onChange={(e) => handleMonthDayChange(parseInt(e.target.value), currentDay)}
            className="input-field w-full"
          >
            {months.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-2">Day</label>
          <select
            value={currentDay}
            onChange={(e) => handleMonthDayChange(currentMonth, parseInt(e.target.value))}
            className="input-field w-full"
          >
            {Array.from({ length: getDaysInMonth(currentMonth) }, (_, i) => i + 1).map(day => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="text-sm text-gray-400 text-center">
        Day of year: <span className="text-white font-semibold">{getDayOfYear(value)}</span>
      </div>
    </div>
  );
};

const getDayOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

export default DateSelector;

