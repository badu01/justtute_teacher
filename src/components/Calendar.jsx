// components/Calendar.jsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar = ({ selectedDate, onDateSelect, events }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const getDayName = (date) => {
    return date.toLocaleString('default', { weekday: 'short' });
  };

  const hasEvents = (date) => {
    const dateKey = date.toISOString().split('T')[0];
    return events[dateKey] && events[dateKey].length > 0;
  };

  const generateCalendarDays = () => {
    const totalDays = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);
    const days = [];

    // Previous month days
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const prevMonthDays = daysInMonth(prevMonth);
    for (let i = firstDay - 1; i >= 0; i--) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, prevMonthDays - i);
      days.push({
        date,
        currentMonth: false,
        isToday: false,
        hasEvents: hasEvents(date)
      });
    }

    // Current month days
    const today = new Date();
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      days.push({
        date,
        currentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        isSelected: date.toDateString() === selectedDate.toDateString(),
        hasEvents: hasEvents(date)
      });
    }

    // Next month days
    const nextMonthDays = 42 - days.length; // 6 rows × 7 days
    for (let i = 1; i <= nextMonthDays; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i);
      days.push({
        date,
        currentMonth: false,
        isToday: false,
        hasEvents: hasEvents(date)
      });
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const calendarDays = generateCalendarDays();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white p-4 h-full w-full flex flex-col">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <h2 className="text-xl font-semibold text-gray-800">
          {getMonthName(currentMonth)}
        </h2>
        
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 gap-1 grow">
        {calendarDays.map((day, index) => (
          <button
            key={index}
            onClick={() => day.currentMonth && onDateSelect(day.date)}
            disabled={!day.currentMonth}
            className={`
              relative rounded-lg flex flex-col items-center justify-center
              transition-all duration-200
              ${!day.currentMonth ? 'text-gray-300' : ''}
              ${day.isSelected ? 'bg-amber-300' : 'hover:bg-gray-50'}
              ${day.isToday && !day.isSelected ? 'bg-blue-50 text-blue-600' : ''}
              min-h-12
            `}
          >
            <span className={`text-sm font-medium ${day.isSelected ? 'text-black' : ''}`}>
              {day.date.getDate()}
            </span>
            
            {/* Event indicator */}
            {day.hasEvents && (
              <div className="absolute bottom-1 flex space-x-1">
                <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                {events[day.date.toISOString().split('T')[0]]?.length > 1 && (
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                )}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calendar;