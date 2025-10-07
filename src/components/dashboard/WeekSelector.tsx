import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { eachDayOfInterval, format } from 'date-fns';
import { formatWeekInterval } from '../../utils/dateHelpers';

interface Week {
  start: Date;
  end: Date;
}

interface WeekSelectorProps {
  weeks: Week[];
  selectedWeek: Week;
  onSelectWeek: (week: Week) => void;
}

const weekDayInitials = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

const WeekSelector = ({ weeks, selectedWeek, onSelectWeek }: WeekSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (week: Week) => {
    onSelectWeek(week);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white rounded-lg shadow-sm p-4 flex justify-between items-center text-left"
      >
        <div>
            <p className="text-sm text-gray-500">Exibindo semana</p>
            <p className="text-lg font-semibold text-gray-800">{formatWeekInterval(selectedWeek.start, selectedWeek.end)}</p>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg z-10 overflow-hidden"
          >
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                <h2 className="text-md font-semibold text-gray-800">Semanas</h2>
                <div className="flex space-x-2 text-xs text-gray-500 font-semibold">
                    {weekDayInitials.map((day, i) => <span key={i} className="w-6 text-center">{day}</span>)}
                </div>
            </div>
            <div className="divide-y max-h-60 overflow-y-auto">
              {weeks.map((week) => {
                const days = eachDayOfInterval({ start: week.start, end: week.end });
                const isSelected = selectedWeek.start.toISOString() === week.start.toISOString();
                return (
                  <button
                    key={week.start.toISOString()}
                    onClick={() => handleSelect(week)}
                    className={`w-full text-left p-4 hover:bg-gray-50 ${isSelected ? 'bg-primary-50' : ''}`}
                  >
                    <div className="flex justify-between items-center">
                        <p className={`text-sm font-medium ${isSelected ? 'text-primary-700' : 'text-gray-700'}`}>{formatWeekInterval(week.start, week.end)}</p>
                        <div className="flex space-x-2 text-xs text-gray-700">
                            {days.map(day => <span key={day.toISOString()} className="w-6 text-center">{format(day, 'd')}</span>)}
                        </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeekSelector;
