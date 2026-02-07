// components/Calendar.jsx
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

const Calendar = ({ selectedDate, onDateSelect, events }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  // Generate years range (10 years back, 10 years forward from current year)
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearsArray = [];
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      yearsArray.push(i);
    }
    return yearsArray;
  }, []);

  // Months list
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
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

  const handleYearChange = (year) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setShowYearPicker(false);
  };

  const handleMonthChange = (monthIndex) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    onDateSelect(today);
  };

  const calendarDays = generateCalendarDays();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white p-4 h-full w-full flex flex-col">
      {/* Calendar Header with Year/Month Selectors */}
      {/* <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-800">Calendar</h2>
        </div>
        <button
          onClick={goToToday}
          className="px-3 py-1.5 text-sm bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg transition-colors"
        >
          Today
        </button>
      </div> */}

      {/* Month/Year Selector */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex items-center space-x-4">
          {/* Month Selector */}
          <div className="relative">
            <button
              onClick={() => setShowMonthPicker(!showMonthPicker)}
              className="appearance-none bg-transparent border-0 text-lg font-semibold text-gray-800 focus:outline-none focus:ring-0 cursor-pointer pr-6 hover:text-gray-900"
            >
              {months[currentMonth.getMonth()]}
              <ChevronRight className="w-4 h-4 text-gray-500 rotate-90 inline-block ml-1" />
            </button>

            {showMonthPicker && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 w-32 max-h-60 overflow-y-auto">
                <div className="py-2">
                  {months.map((month, index) => (
                    <button
                      key={month}
                      onClick={() => {
                        handleMonthChange(index);
                        setShowMonthPicker(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${index === currentMonth.getMonth()
                          ? 'bg-amber-50 text-amber-700 font-medium'
                          : 'text-gray-700'
                        }`}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Year Selector */}
          <div className="relative">
            <button
              onClick={() => setShowYearPicker(!showYearPicker)}
              className="appearance-none bg-transparent border-0 text-lg font-semibold text-gray-800 focus:outline-none focus:ring-0 cursor-pointer pr-6 hover:text-gray-900"
            >
              {currentMonth.getFullYear()}
              <ChevronRight className="w-4 h-4 text-gray-500 rotate-90 inline-block ml-1" />
            </button>

            {showYearPicker && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-32 max-h-60 overflow-y-auto">
                <div className="py-2">
                  {years.map((year) => (
                    <button
                      key={year}
                      onClick={() => {
                        handleYearChange(year);
                        setShowYearPicker(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${year === currentMonth.getFullYear()
                          ? 'bg-amber-50 text-amber-700 font-medium'
                          : 'text-gray-700'
                        }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-3">
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
              transition-all duration-200 text-sm
              ${!day.currentMonth ? 'text-gray-300' : ''}
              ${day.isSelected ? 'bg-amber-300' : 'hover:bg-gray-50'}
              ${day.isToday && !day.isSelected ? 'bg-blue-50 text-blue-600' : ''}
              min-h-10 md:min-h-12
            `}
          >
            <span className={`font-medium ${day.isSelected ? 'text-black' : ''}`}>
              {day.date.getDate()}
            </span>

            {/* Event indicator */}
            {day.hasEvents && (
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
                {[...Array(Math.min(3, events[day.date.toISOString().split('T')[0]]?.length || 0))].map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-blue-500 rounded-full"></div>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex flex-wrap gap-4 justify-center text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-amber-300 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-0.5">
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
            </div>
            <span>Has events</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-50 border border-blue-200 rounded"></div>
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;