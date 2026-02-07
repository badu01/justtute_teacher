// App.jsx (Updated with API integration)
import React, { useState, useEffect } from 'react';
import Calendar from '../components/Calendar';
import DayDetails from '../components/DayDetails';
import DailyTopics from '../components/DailyTopics';
import { sessionsAPI } from '../services/apiService';
import { Loader2 } from 'lucide-react';

function ManageSessions() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sessions, setSessions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);

  // Format date to YYYY-MM-DD for consistency
  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Convert API session data to events format
  const transformSessionsToEvents = (sessionsData) => {
    const events = {};
    
    sessionsData.forEach(session => {
      const sessionDate = new Date(session.startTime);
      const dateKey = formatDateKey(sessionDate);
      
      if (!events[dateKey]) {
        events[dateKey] = [];
      }
      
      // Format time
      const startTime = new Date(session.startTime);
      const endTime = new Date(session.endTime);
      const timeString = `${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`;
      
      events[dateKey].push({
        _id: session._id,
        time: timeString,
        subject: session.subject,
        studentName: session.student.name,
        studentId: session.student._id,
        topic: session.topic || '',
        startTime: session.startTime,
        endTime: session.endTime
      });
    });
    
    return events;
  };

  // Get unique students from sessions
  const extractStudents = (sessionsData) => {
    const studentMap = new Map();
    
    sessionsData.forEach(session => {
      if (session.student && !studentMap.has(session.student._id)) {
        studentMap.set(session.student._id, session.student);
      }
    });
    
    return Array.from(studentMap.values());
  };

  // Fetch sessions from API
  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await sessionsAPI.getSessions();
      if (response.status === 'success') {
        setSessions(response.sessions);
        setStudents(extractStudents(response.sessions));
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchSessions();
  }, []);

  // Transform sessions for components
  const events = transformSessionsToEvents(sessions);

  // Get events for selected date
  const getEventsForDate = () => {
    const dateKey = formatDateKey(selectedDate);
    return events[dateKey] || [];
  };

  // Get current session
  const getCurrentSession = () => {
    const dateEvents = getEventsForDate();
    if (dateEvents.length > 0 && currentSessionIndex < dateEvents.length) {
      return dateEvents[currentSessionIndex];
    }
    return null;
  };

  // Handle date selection from calendar
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setCurrentSessionIndex(0); // Reset to first session when date changes
  };

  // Create new session
  const handleCreateSession = async (sessionData) => {
    try {
      setLoading(true);
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      const apiData = {
        studentId: sessionData.studentId,
        subject: sessionData.subject,
        topic: sessionData.topic || '',
        date: formattedDate,
        startTime: `${sessionData.startTime}:00`,
        endTime: `${sessionData.endTime}:00`
      };
      
      console.log('Creating session with data:', apiData);
      
      const response = await sessionsAPI.createSession(apiData);
      
      if (response.status === 'success') {
        // Refresh sessions
        await fetchSessions();
        // Set current session index to the new session
        const dateEvents = getEventsForDate();
        setCurrentSessionIndex(dateEvents.length - 1);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to create session:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update session
  const handleUpdateSession = async (sessionId, updateData) => {
    try {
      setLoading(true);
      
      // Format the data for API
      const formattedData = {
        studentId: updateData.studentId,
        subject: updateData.subject,
        topic: updateData.topic || '',
        date: selectedDate.toISOString().split('T')[0],
        startTime: updateData.startTime,
        endTime: updateData.endTime
      };
      
      console.log('Updating session:', sessionId, 'with data:', formattedData);
      
      const response = await sessionsAPI.updateSession(sessionId, formattedData);
      
      if (response.status === 'success') {
        // Refresh sessions
        await fetchSessions();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update session:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete session
  const handleDeleteSession = async (sessionId) => {
    try {
      setLoading(true);
      
      console.log('Deleting session:', sessionId);
      
      const response = await sessionsAPI.deleteSession(sessionId);
      
      if (response.status === 'success') {
        // Refresh sessions
        await fetchSessions();
        // Adjust current session index if needed
        const dateEvents = getEventsForDate();
        if (currentSessionIndex >= dateEvents.length) {
          setCurrentSessionIndex(Math.max(0, dateEvents.length - 1));
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete session:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update topics for a specific session
  const handleUpdateTopics = async (sessionId, topicsString) => {
    try {
      setLoading(true);
      
      console.log('Updating topics for session:', sessionId, 'topics:', topicsString);
      
      const response = await sessionsAPI.updateSession(sessionId, { 
        topic: topicsString 
      });
      
      if (response.status === 'success') {
        // Refresh sessions to get updated data
        await fetchSessions();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update topics:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update current session index (called from DayDetails)
  const updateCurrentSessionIndex = (newIndex) => {
    setCurrentSessionIndex(newIndex);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
          <p className="mt-2 text-gray-600">Loading sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
        {/* Main container */}
        <div className="flex flex-col h-full md:h-screen">
            {/* Upper part - Mobile: Calendar takes 50%, DayDetails takes 50% */}
            <div className="flex-1 md:h-3/4 flex flex-col md:flex-row">
                
                {/* Calendar - Mobile: 50% height */}
                <div className="h-1/2 md:h-full md:w-1/2">
                    <Calendar
                        selectedDate={selectedDate}
                        onDateSelect={handleDateSelect}
                        events={events}
                    />
                </div>

                {/* DayDetails - Mobile: 50% height, with proper overflow */}
                <div className=" md:w-1/2 h-full overflow-auto bg-amber-300">
                    <DayDetails
                        date={selectedDate}
                        events={getEventsForDate()}
                        isEditing={isEditing}
                        onEditToggle={() => setIsEditing(!isEditing)}
                        onCreateSession={handleCreateSession}
                        onUpdateSession={handleUpdateSession}
                        onDeleteSession={handleDeleteSession}
                        students={students}
                        currentSessionIndex={currentSessionIndex}
                        onSessionIndexChange={updateCurrentSessionIndex}
                    />
                </div>

            </div>

            {/* Lower part - Mobile: auto height */}
            <div className="h-auto md:h-1/4">
                <DailyTopics
                    date={selectedDate}
                    currentSession={getCurrentSession()}
                    isEditing={isEditing}
                    onUpdateTopics={handleUpdateTopics}
                />
            </div>
        </div>
    </div>
  );
}

export default ManageSessions;