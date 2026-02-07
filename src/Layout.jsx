import React, { useState } from 'react';
import Calendar from './components/Calendar';
import DayDetails from './components/DayDetails';
import DailyTopics from './components/DailyTopics';
import { initialEvents, initialTopics } from './data/dummyData';

function Layout() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState(initialEvents);
  const [topics, setTopics] = useState(initialTopics);
  const [isEditing, setIsEditing] = useState(false);

  // Format date to YYYY-MM-DD for consistency
  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Get events for selected date
  const getEventsForDate = () => {
    const dateKey = formatDateKey(selectedDate);
    return events[dateKey] || [];
  };

  // Get topics for selected date
  const getTopicsForDate = () => {
    const dateKey = formatDateKey(selectedDate);
    return topics[dateKey] || [];
  };

  // Handle date selection from calendar
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Update event for selected date
  const updateEvent = (eventIndex, updatedEvent) => {
    const dateKey = formatDateKey(selectedDate);
    setEvents(prev => {
      const newEvents = { ...prev };
      if (!newEvents[dateKey]) newEvents[dateKey] = [];
      newEvents[dateKey][eventIndex] = updatedEvent;
      return newEvents;
    });
  };

  // Add new event for selected date
  const addEvent = (newEvent) => {
    const dateKey = formatDateKey(selectedDate);
    setEvents(prev => {
      const newEvents = { ...prev };
      if (!newEvents[dateKey]) newEvents[dateKey] = [];
      newEvents[dateKey].push(newEvent);
      return newEvents;
    });
  };

  // Update topics for selected date
  const updateTopics = (updatedTopics) => {
    const dateKey = formatDateKey(selectedDate);
    setTopics(prev => ({
      ...prev,
      [dateKey]: updatedTopics
    }));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Main container - Entire screen divided into two parts */}
      <div className="h-screen flex flex-col">
        {/* Upper part - Takes 3/4 of the screen */}
        <div className="h-3/4 flex flex-col md:flex-row">
          
          {/* Left side - Calendar */}
          <div className="md:w-1/2 h-full">
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              events={events}
            />
          </div>

          {/* Right side - Calendar Details */}
          <div className="md:w-1/2 h-full overflow-auto bg-amber-300">
            <DayDetails
              date={selectedDate}
              events={getEventsForDate()}
              isEditing={isEditing}
              onEditToggle={() => setIsEditing(!isEditing)}
              onUpdateEvent={updateEvent}
              onAddEvent={addEvent}
            />
          </div>

        </div>

        {/* Lower part - Takes remaining 1/4 of the screen */}
        <div className="overflow-visible h-fit">
          <DailyTopics
            date={selectedDate}
            topics={getTopicsForDate()}
            isEditing={isEditing}
            onUpdateTopics={updateTopics}
          />
        </div>
      </div>
    </div>
  );
}

export default Layout