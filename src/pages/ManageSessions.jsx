import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, LogOut } from 'lucide-react';
import Calendar from '../components/Calendar';
import DayDetails from '../components/DayDetails';
import DailyTopics from '../components/DailyTopics';
import { sessionsAPI } from '../services/apiService';

function ManageSessions() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sessions, setSessions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);

  const formatDateKey = (date) => date.toISOString().split('T')[0];

  const transformSessionsToEvents = (sessionsData) => {
    const events = {};
    sessionsData.forEach(session => {
      const dateKey = formatDateKey(new Date(session.startTime));
      if (!events[dateKey]) events[dateKey] = [];
      const start = new Date(session.startTime);
      const end = new Date(session.endTime);
      const fmt = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      events[dateKey].push({
        _id: session._id,
        time: `${fmt(start)} - ${fmt(end)}`,
        subject: session.subject,
        studentName: session.student.name,
        studentId: session.student._id,
        topic: session.topic || '',
        startTime: session.startTime,
        endTime: session.endTime,
      });
    });
    return events;
  };

  const extractStudents = (sessionsData) => {
    const map = new Map();
    sessionsData.forEach(s => { if (s.student && !map.has(s.student._id)) map.set(s.student._id, s.student); });
    return Array.from(map.values());
  };

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await sessionsAPI.getSessions();
      if (response.status === 'success') {
        setSessions(response.sessions);
        setStudents(extractStudents(response.sessions));
      }
    } catch (e) { console.error('Failed to fetch sessions:', e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSessions(); }, []);

  const events = transformSessionsToEvents(sessions);

  const getEventsForDate = () => events[formatDateKey(selectedDate)] || [];

  const getCurrentSession = () => {
    const dateEvents = getEventsForDate();
    return dateEvents.length > 0 && currentSessionIndex < dateEvents.length
      ? dateEvents[currentSessionIndex] : null;
  };

  const handleDateSelect = (date) => { setSelectedDate(date); setCurrentSessionIndex(0); };

  const handleCreateSession = async (sessionData) => {
    try {
      setLoading(true);
      const response = await sessionsAPI.createSession({
        studentId: sessionData.studentId, subject: sessionData.subject,
        topic: sessionData.topic || '', date: formatDateKey(selectedDate),
        startTime: sessionData.startTime, endTime: sessionData.endTime,
      });
      if (response.status === 'success') { await fetchSessions(); return true; }
      return false;
    } catch (e) { console.error(e); return false; }
    finally { setLoading(false); }
  };

  const handleUpdateSession = async (sessionId, updateData) => {
    try {
      setLoading(true);
      const response = await sessionsAPI.updateSession(sessionId, {
        ...updateData, date: formatDateKey(selectedDate),
      });
      if (response.status === 'success') { await fetchSessions(); return true; }
      return false;
    } catch (e) { console.error(e); return false; }
    finally { setLoading(false); }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      setLoading(true);
      const response = await sessionsAPI.deleteSession(sessionId);
      if (response.status === 'success') {
        await fetchSessions();
        const dateEvents = getEventsForDate();
        if (currentSessionIndex >= dateEvents.length) setCurrentSessionIndex(Math.max(0, dateEvents.length - 1));
        return true;
      }
      return false;
    } catch (e) { console.error(e); return false; }
    finally { setLoading(false); }
  };

  const handleUpdateTopics = async (sessionId, topicsString) => {
    try {
      setLoading(true);
      const response = await sessionsAPI.updateSession(sessionId, { topic: topicsString });
      if (response.status === 'success') { await fetchSessions(); return true; }
      return false;
    } catch (e) { console.error(e); return false; }
    finally { setLoading(false); }
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center" style={{ fontFamily: "'Unbounded', sans-serif" }}>
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-5" />
          <p className="text-zinc-600 text-[10px] tracking-[0.25em] uppercase">Loading sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-full bg-black text-white flex flex-col" style={{ fontFamily: "'Unbounded', sans-serif" }}>

      {/* ── STICKY HEADER — mirrors Dashboard ── */}
      <div className="flex-shrink-0 sticky top-0 z-20 bg-black border-b border-zinc-900">
        <div className="px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 text-zinc-600 hover:text-yellow-400 text-[10px] font-bold tracking-widest uppercase transition-colors">
              <ChevronLeft className="w-3 h-3" /> Dashboard
            </button>
            <div className="w-px h-5 bg-zinc-900" />
            <div>
              <p className="text-[9px] tracking-[0.3em] text-zinc-700 uppercase mb-0.5">Schedule</p>
              <h1 className="text-sm font-black text-white tracking-tight leading-none">MANAGE SESSIONS</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Selected date badge */}
            <div className="hidden sm:flex items-center gap-2 border border-zinc-900 bg-zinc-950 px-3 py-2">
              <span className="text-yellow-400 font-black text-sm leading-none">{selectedDate.getDate()}</span>
              <div>
                <p className="text-white text-[10px] font-bold leading-none">
                  {selectedDate.toLocaleDateString([], { month: 'short' })}
                </p>
                <p className="text-zinc-600 text-[9px]">{selectedDate.getFullYear()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN LAYOUT — same structure, themed ── */}
      <div className="flex flex-col flex-1 md:h-[calc(100vh-65px)] overflow-hidden">

        {/* Upper half: Calendar + DayDetails */}
        <div className="flex-1 md:h-3/4 flex flex-col md:flex-row overflow-hidden">

          {/* Calendar */}
          <div className="h-1/2 md:h-full md:w-1/2 overflow-hidden">
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              events={events}
            />
          </div>

          {/* DayDetails */}
          <div className="md:w-1/2 h-full overflow-auto">
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
              onSessionIndexChange={setCurrentSessionIndex}
            />
          </div>
        </div>

        {/* Lower: DailyTopics */}
        <div className="h-64 md:h-1/4 flex-shrink-0 border-t-2 border-zinc-900 overflow-hidden">
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