import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar = ({ selectedDate, onDateSelect, events }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const years = useMemo(() => {
    const cur = new Date().getFullYear();
    return Array.from({ length: 21 }, (_, i) => cur - 10 + i);
  }, []);

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const hasEvents = (date) => {
    const key = date.toISOString().split('T')[0];
    return events[key] && events[key].length > 0;
  };

  const eventCount = (date) => {
    const key = date.toISOString().split('T')[0];
    return events[key]?.length || 0;
  };

  const generateCalendarDays = () => {
    const totalDays = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);
    const days = [];
    const today = new Date();

    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const prevMonthDays = daysInMonth(prevMonth);
    for (let i = firstDay - 1; i >= 0; i--) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, prevMonthDays - i);
      days.push({ date, currentMonth: false, isToday: false, hasEvents: hasEvents(date) });
    }
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      days.push({
        date, currentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        isSelected: date.toDateString() === selectedDate.toDateString(),
        hasEvents: hasEvents(date),
        count: eventCount(date),
      });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i);
      days.push({ date, currentMonth: false, isToday: false, hasEvents: hasEvents(date) });
    }
    return days;
  };

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    onDateSelect(today);
  };

  const calendarDays = generateCalendarDays();
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  return (
    <div className="bg-black h-full w-full flex flex-col border-r border-zinc-900 p-4 sm:p-6"
      style={{ fontFamily: "'Unbounded', sans-serif" }}>

      {/* ── Month / Year Nav ── */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <button onClick={handlePrevMonth}
          className="w-8 h-8 border-2 border-zinc-800 flex items-center justify-center text-zinc-500 hover:border-yellow-400 hover:text-yellow-400 transition-all">
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          {/* Month picker */}
          <div className="relative">
            <button onClick={() => { setShowMonthPicker(!showMonthPicker); setShowYearPicker(false); }}
              className="flex items-center gap-1 text-sm font-black text-white hover:text-yellow-400 transition-colors">
              {months[currentMonth.getMonth()]}
              <ChevronRight className="w-3 h-3 rotate-90 text-zinc-600" />
            </button>
            {showMonthPicker && (
              <div className="absolute top-full left-0 mt-2 bg-zinc-950 border-2 border-zinc-800 z-30 w-36 max-h-56 overflow-y-auto shadow-xl">
                {months.map((m, i) => (
                  <button key={m} onClick={() => { setCurrentMonth(new Date(currentMonth.getFullYear(), i, 1)); setShowMonthPicker(false); }}
                    className={`w-full px-4 py-2.5 text-left text-xs font-bold transition-colors ${i === currentMonth.getMonth() ? 'bg-yellow-400 text-black' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}>
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Year picker */}
          <div className="relative">
            <button onClick={() => { setShowYearPicker(!showYearPicker); setShowMonthPicker(false); }}
              className="flex items-center gap-1 text-sm font-black text-white hover:text-yellow-400 transition-colors">
              {currentMonth.getFullYear()}
              <ChevronRight className="w-3 h-3 rotate-90 text-zinc-600" />
            </button>
            {showYearPicker && (
              <div className="absolute top-full left-0 mt-2 bg-zinc-950 border-2 border-zinc-800 z-30 w-28 max-h-56 overflow-y-auto shadow-xl">
                {years.map((y) => (
                  <button key={y} onClick={() => { setCurrentMonth(new Date(y, currentMonth.getMonth(), 1)); setShowYearPicker(false); }}
                    className={`w-full px-4 py-2.5 text-left text-xs font-bold transition-colors ${y === currentMonth.getFullYear() ? 'bg-yellow-400 text-black' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}>
                    {y}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={goToToday}
            className="text-[9px] font-bold tracking-widest uppercase text-zinc-600 hover:text-yellow-400 border border-zinc-800 hover:border-yellow-400 px-2 py-1 transition-all">
            TODAY
          </button>
          <button onClick={handleNextMonth}
            className="w-8 h-8 border-2 border-zinc-800 flex items-center justify-center text-zinc-500 hover:border-yellow-400 hover:text-yellow-400 transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Day name headers ── */}
      <div className="grid grid-cols-7 mb-2 flex-shrink-0">
        {dayNames.map((d) => (
          <div key={d} className="text-center text-[9px] font-bold tracking-widest text-zinc-700 uppercase py-2">
            {d}
          </div>
        ))}
      </div>

      {/* ── Calendar grid ── */}
      <div className="grid grid-cols-7 gap-px flex-1 bg-zinc-900">
        {calendarDays.map((day, idx) => (
          <button key={idx}
            onClick={() => day.currentMonth && onDateSelect(day.date)}
            disabled={!day.currentMonth}
            className={`
              relative flex flex-col items-center justify-center transition-all duration-150 bg-black
              min-h-10 md:min-h-12
              ${!day.currentMonth ? 'opacity-20 cursor-default' : 'hover:bg-zinc-900 cursor-pointer'}
              ${day.isSelected ? '!bg-yellow-400' : ''}
              ${day.isToday && !day.isSelected ? 'ring-1 ring-inset ring-yellow-400/40' : ''}
            `}
          >
            <span className={`text-xs font-bold leading-none ${
              day.isSelected ? 'text-black' :
              day.isToday ? 'text-yellow-400' :
              day.currentMonth ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              {day.date.getDate()}
            </span>

            {/* Event dots */}
            {day.hasEvents && !day.isSelected && (
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                {Array.from({ length: Math.min(3, day.count) }).map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-yellow-400" />
                ))}
              </div>
            )}
            {day.hasEvents && day.isSelected && (
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                {Array.from({ length: Math.min(3, day.count) }).map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-black" />
                ))}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* ── Legend ── */}
      <div className="flex-shrink-0 pt-4 mt-3 border-t border-zinc-900">
        <div className="flex flex-wrap gap-4 justify-center">
          {[
            { el: <div className="w-4 h-4 bg-yellow-400" />, label: 'Selected' },
            { el: <div className="w-4 h-4 border border-yellow-400/40" />, label: 'Today' },
            { el: <div className="flex gap-0.5 items-center"><div className="w-1 h-1 rounded-full bg-yellow-400" /><div className="w-1 h-1 rounded-full bg-yellow-400" /></div>, label: 'Has sessions' },
          ].map(({ el, label }) => (
            <div key={label} className="flex items-center gap-2">
              {el}
              <span className="text-[9px] text-zinc-600 tracking-widest uppercase">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;