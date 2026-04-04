import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin, GraduationCap, BookOpen,
  Calendar, Clock, Laptop, Car, Award, Users, School,
  ChevronRight, LogOut, Edit2, CheckCircle, XCircle,
  AlertCircle, Briefcase, Home, Star, Target, TrendingUp,
  Shield, Zap, BarChart2, ArrowRight
} from 'lucide-react';
import { sessionsAPI } from '../services/apiService';

// ─── Shared primitives ────────────────────────────────────────────────────────

const SectionTitle = ({ children }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="text-yellow-400 font-black text-[10px] tracking-widest uppercase whitespace-nowrap">
      {children}
    </span>
    <div className="flex-1 h-px bg-zinc-900" />
  </div>
);

const InfoRow = ({ label, value, icon: Icon }) => (
  <div className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-4 py-3 border-b border-zinc-900 last:border-0 px-4 sm:px-5">
    <div className="flex items-center gap-2 sm:w-44 flex-shrink-0">
      {Icon && <Icon className="w-3 h-3 text-zinc-700 flex-shrink-0" />}
      <span className="text-[10px] font-bold tracking-widest text-zinc-600 uppercase">{label}</span>
    </div>
    <span className="text-sm text-white font-light">
      {value || <span className="text-zinc-700 italic text-xs">Not provided</span>}
    </span>
  </div>
);

const Tag = ({ children }) => (
  <span className="px-3 py-1.5 text-xs font-bold border-2 border-yellow-400/30 bg-yellow-400/10 text-yellow-400 tracking-wide">
    {children}
  </span>
);

const StatCard = ({ label, value, icon: Icon, sub }) => (
  <div className="bg-zinc-950 border border-zinc-900 p-5 sm:p-6 group hover:border-yellow-400/40 transition-all duration-300 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-yellow-400/20 group-hover:border-yellow-400/50 transition-colors duration-300" />
    <div className="w-9 h-9 bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-5 group-hover:bg-yellow-400 group-hover:border-yellow-400 transition-all duration-300">
      <Icon className="w-4 h-4 text-yellow-400 group-hover:text-black transition-colors duration-300" />
    </div>
    <p className="text-zinc-600 text-[10px] font-bold tracking-widest uppercase mb-1.5">{label}</p>
    <p className="text-2xl sm:text-3xl font-black text-white leading-none">{value}</p>
    {sub && <p className="text-zinc-700 text-[10px] mt-2 font-light">{sub}</p>}
  </div>
);

const SessionMiniCard = ({ session, onClick }) => {
  const start = new Date(session.startTime);
  const isToday = new Date().toDateString() === start.toDateString();
  const isPending = start > new Date();
  const timeStr = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  const dateStr = isToday ? 'Today' : start.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <button onClick={onClick}
      className="w-full flex items-center justify-between px-5 py-3.5 border-b border-zinc-900 last:border-0 hover:bg-zinc-900/50 transition-colors text-left group">
      <div className="flex items-center gap-3 min-w-0">
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isToday ? 'bg-yellow-400' : isPending ? 'bg-green-500' : 'bg-zinc-700'}`} />
        <div className="min-w-0">
          <p className="text-white text-xs font-bold truncate">{session.subject}</p>
          <p className="text-zinc-600 text-[10px] font-light truncate">{session.student?.name || 'Student'}</p>
        </div>
      </div>
      <div className="text-right flex-shrink-0 ml-3">
        <p className={`text-[10px] font-bold ${isToday ? 'text-yellow-400' : isPending ? 'text-green-500' : 'text-zinc-600'}`}>{dateStr}</p>
        <p className="text-zinc-700 text-[10px]">{timeStr}</p>
      </div>
    </button>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [allSessions, setAllSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserData(user.teacher || user);
      } catch (e) { console.error(e); }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchSessions = async () => {
      setSessionsLoading(true);
      try {
        const response = await sessionsAPI.getSessions(1, 100);
        if (response.status === 'success') {
          setAllSessions(response.sessions);
          const today = new Date(); today.setHours(0, 0, 0, 0);
          const upcoming = response.sessions
            .filter(s => new Date(s.startTime) >= today)
            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
            .slice(0, 5);
          setUpcomingSessions(upcoming);
        }
      } catch (e) { console.error(e); }
      finally { setSessionsLoading(false); }
    };
    fetchSessions();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center" style={{ fontFamily: "'Unbounded', sans-serif" }}>
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-5" />
          <p className="text-zinc-600 text-[10px] tracking-[0.25em] uppercase">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4" style={{ fontFamily: "'Unbounded', sans-serif" }}>
        <div className="text-center border border-zinc-900 bg-zinc-950 p-10 max-w-sm w-full">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-5" />
          <p className="text-white text-sm font-black mb-2">No user data found</p>
          <p className="text-zinc-600 text-xs font-light mb-7">Your session may have expired.</p>
          <button onClick={() => navigate('/login')}
            className="w-full py-3 bg-yellow-400 text-black text-[10px] font-black tracking-widest hover:bg-yellow-300 transition-colors">
            RETURN TO LOGIN →
          </button>
        </div>
      </div>
    );
  }

  const todayCount = upcomingSessions.filter(s =>
    new Date(s.startTime).toDateString() === new Date().toDateString()
  ).length;

  // Calculate teaching stats
  const pendingSessions = allSessions.filter(s => new Date(s.startTime) > new Date()).length;
  const completedSessions = allSessions.filter(s => new Date(s.startTime) < new Date()).length;
  const totalSubjects = userData.subjects?.length || 0;
  const totalLocations = userData.preferredLocation?.length || 0;

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'teaching', label: 'Teaching' },
    { id: 'account', label: 'Account' },
  ];

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "'Unbounded', sans-serif" }}>

      {/* ── STICKY HEADER ── */}
      <div className="sticky top-0 z-20 bg-black border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-5 pb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[9px] tracking-[0.3em] text-zinc-700 uppercase mb-1">Welcome back</p>
            <h1 className="text-sm sm:text-base font-black text-white tracking-tight leading-none">TUTOR DASHBOARD</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5 border border-zinc-900 bg-zinc-950 px-3 py-2">
              <div className="w-6 h-6 bg-yellow-400 flex items-center justify-center flex-shrink-0">
                <span className="text-black text-[10px] font-black">{userData.name?.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="text-white text-[10px] font-bold leading-none">{userData.name}</p>
                <p className="text-zinc-600 text-[9px] tracking-wider mt-0.5">{userData.role || 'Tutor'}</p>
              </div>
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 border-2 border-zinc-800 text-zinc-500 text-[10px] font-bold tracking-widest hover:border-zinc-600 hover:text-white transition-all">
              <LogOut className="w-3 h-3" />
              <span className="hidden sm:inline">EXIT</span>
            </button>
          </div>
        </div>

        {/* Tab rail */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className="flex flex-col gap-1.5 pb-3 pr-6 last:pr-0 text-left">
                  <div className={`h-[3px] w-full transition-all duration-300 ${active ? 'bg-yellow-400' : 'bg-transparent hover:bg-zinc-800'}`} />
                  <span className={`text-[10px] font-bold tracking-widest uppercase px-0.5 transition-colors ${active ? 'text-yellow-400' : 'text-zinc-700 hover:text-zinc-400'}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── PAGE BODY ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 pb-28">

        {/* Stat cards — always visible */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-10">
          <StatCard label="Students" value={userData.students?.length ?? 0} icon={Users} sub="Active assignments" />
          <StatCard label="Amount Earned" value={`₹${(userData.amountEarned ?? 0).toLocaleString('en-IN')}`} icon={Award} sub="Total lifetime earnings" />
          <StatCard label="Experience" value={`${userData.teachingExperienceYears ?? 0} Yrs`} icon={Briefcase} sub="Teaching background" />
        </div>

        {/* Session CTA — always visible */}
        <div className="mb-10">
          <button onClick={() => navigate('/sessions')}
            className="w-full group border-2 border-zinc-900 bg-zinc-950 hover:border-yellow-400 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
            <div className="relative flex items-center justify-between p-5 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 border-2 border-zinc-800 group-hover:border-yellow-400 group-hover:bg-yellow-400 flex items-center justify-center transition-all duration-300">
                  <Calendar className="w-5 h-5 text-zinc-600 group-hover:text-black transition-colors duration-300" />
                </div>
                <div className="text-left">
                  <p className="text-white font-black text-sm group-hover:text-yellow-400 transition-colors duration-300">Manage Sessions</p>
                  <p className="text-zinc-600 text-[10px] tracking-wider font-light mt-0.5">
                    {todayCount > 0 ? `${todayCount} session${todayCount > 1 ? 's' : ''} scheduled today` : 'View and manage your teaching schedule'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-zinc-700 group-hover:text-yellow-400 transition-colors duration-300">
                <span className="text-[10px] font-bold tracking-widest uppercase hidden sm:block">Go to Calendar</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </button>
        </div>

        {/* ══ PROFILE TAB ══ */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <SectionTitle>PERSONAL INFORMATION</SectionTitle>
                <div className="border border-zinc-900 bg-zinc-950">
                  <InfoRow label="Full Name" value={userData.name} icon={User} />
                  <InfoRow label="Gender" value={userData.gender} icon={User} />
                  <InfoRow label="Email" value={userData.email} icon={Mail} />
                  <InfoRow label="Mobile" value={userData.mobileNumber} icon={Phone} />
                  <InfoRow label="Address" value={userData.address} icon={MapPin} />
                  <InfoRow label="Residence Type" value={userData.residenceType} icon={Home} />
                </div>
              </div>

              <div>
                <SectionTitle>ACADEMIC INFORMATION</SectionTitle>
                <div className="border border-zinc-900 bg-zinc-950">
                  <InfoRow label="College" value={userData.collegeName} icon={School} />
                  <InfoRow label="Course" value={userData.course} icon={GraduationCap} />
                  <InfoRow label="Department" value={userData.department} icon={BookOpen} />
                  <InfoRow label="Current Year" value={userData.currentYear} icon={Target} />
                  <InfoRow label="Pass-out Year" value={userData.yearOfPassOut} icon={Calendar} />
                </div>
              </div>

              <div>
                <SectionTitle>ACADEMIC PERFORMANCE</SectionTitle>
                <div className="border border-zinc-900 bg-zinc-950">
                  <InfoRow label="10th Mark" value={userData.tenthMark ? `${userData.tenthMark}%` : null} icon={Award} />
                  <InfoRow label="10th Syllabus" value={userData.tenthSyllabus} icon={BookOpen} />
                  <InfoRow label="+2 Percentage" value={userData.plusTwoPercentage ? `${userData.plusTwoPercentage}%` : null} icon={TrendingUp} />
                  <InfoRow label="+2 Syllabus" value={userData.plusTwoSyllabus} icon={BookOpen} />
                </div>
              </div>
            </div>

            {/* Right sidebar */}
            <div className="space-y-8">

              {/* ── Upcoming sessions hint ── */}
              <div>
                <div className="flex items-center justify-between gap-4">
                  <SectionTitle>UPCOMING SESSIONS</SectionTitle>
                  <button onClick={() => navigate('/sessions')}
                    className="text-[10px] text-yellow-400 font-bold tracking-widest uppercase hover:underline pb-4 flex-shrink-0">
                    View All →
                  </button>
                </div>

                {todayCount > 0 && (
                  <div className="flex items-center gap-2 border border-yellow-400/20 bg-yellow-400/5 px-3 py-2.5 mb-3">
                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full flex-shrink-0 animate-pulse" />
                    <span className="text-yellow-400 text-[10px] font-bold tracking-wider">
                      {todayCount} session{todayCount > 1 ? 's' : ''} today
                    </span>
                  </div>
                )}

                <div className="border border-zinc-900 bg-zinc-950">
                  {sessionsLoading ? (
                    <div className="px-5 py-6 flex items-center justify-center gap-2">
                      <div className="w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-zinc-600 text-[10px] tracking-widest">Loading...</span>
                    </div>
                  ) : upcomingSessions.length === 0 ? (
                    <div className="px-5 py-6 text-center">
                      <Calendar className="w-6 h-6 text-zinc-800 mx-auto mb-2" />
                      <p className="text-zinc-700 text-xs font-light">No upcoming sessions</p>
                      <button onClick={() => navigate('/sessions')}
                        className="mt-3 text-[10px] text-yellow-400 font-bold tracking-widest uppercase hover:underline">
                        Schedule one →
                      </button>
                    </div>
                  ) : (
                    <>
                      {upcomingSessions.map((s) => (
                        <SessionMiniCard key={s._id} session={s} onClick={() => navigate('/sessions')} />
                      ))}
                      <button onClick={() => navigate('/sessions')}
                        className="w-full flex items-center justify-center gap-2 px-5 py-3 text-[10px] font-bold tracking-widest text-zinc-600 hover:text-yellow-400 uppercase transition-colors border-t border-zinc-900">
                        Open Calendar <ArrowRight className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Verification */}
              <div>
                <SectionTitle>ACCOUNT STATUS</SectionTitle>
                <div className={`border p-5 ${userData.isverified ? 'border-green-500/30 bg-green-500/5' : 'border-yellow-400/30 bg-yellow-400/5'}`}>
                  <div className="flex items-start gap-3">
                    {userData.isverified
                      ? <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      : <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />}
                    <div>
                      <p className={`font-black text-[10px] tracking-widest uppercase ${userData.isverified ? 'text-green-500' : 'text-yellow-400'}`}>
                        {userData.isverified ? 'Verified Account' : 'Verification Pending'}
                      </p>
                      <p className="text-zinc-500 text-[10px] font-light mt-1.5 leading-relaxed">
                        {userData.isverified
                          ? 'Full access granted. You can receive tuition assignments.'
                          : 'Admin review in progress. Usually 2–3 business days.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile completion */}
              <div>
                <SectionTitle>PROFILE COMPLETION</SectionTitle>
                <div className="border border-zinc-900 bg-zinc-950 p-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-zinc-600 text-[10px] font-bold tracking-widest uppercase">Progress</span>
                    <span className="text-yellow-400 font-black text-sm">85%</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-[3px] mb-5">
                    <div className="bg-yellow-400 h-[3px]" style={{ width: '85%' }} />
                  </div>
                  <p className="text-zinc-600 text-[10px] font-light leading-relaxed mb-5">
                    Complete your profile to get matched with more students.
                  </p>
                  <button className="w-full py-3 border-2 border-zinc-800 text-zinc-500 text-[10px] font-bold tracking-widest hover:border-yellow-400 hover:text-yellow-400 transition-all flex items-center justify-center gap-2">
                    <Edit2 className="w-3 h-3" /> COMPLETE PROFILE
                  </button>
                </div>
              </div>

              {/* Resources */}
              <div>
                <SectionTitle>RESOURCES</SectionTitle>
                <div className="border border-zinc-900 bg-zinc-950 divide-y divide-zinc-900">
                  {[
                    { icon: Laptop, label: 'Laptop', has: userData.hasLaptop },
                    { icon: Car, label: 'Personal Vehicle', has: userData.hasPersonalVehicle },
                  ].map(({ icon: Icon, label, has }) => (
                    <div key={label} className="flex items-center justify-between px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-3.5 h-3.5 text-zinc-600" />
                        <span className="text-zinc-400 text-xs font-light">{label}</span>
                      </div>
                      <div className={`flex items-center gap-1.5 text-[10px] font-bold ${has ? 'text-green-500' : 'text-red-500'}`}>
                        {has ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {has ? 'Yes' : 'No'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ TEACHING TAB ══ */}
        {activeTab === 'teaching' && (
          <div className="space-y-8">
            {/* Teaching Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="bg-zinc-950 border border-zinc-900 p-4">
                <p className="text-zinc-600 text-[9px] font-bold tracking-widest uppercase mb-1">Pending Sessions</p>
                <p className="text-2xl font-black text-yellow-400">{pendingSessions}</p>
                <p className="text-zinc-700 text-[9px] mt-1">Awaiting completion</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-900 p-4">
                <p className="text-zinc-600 text-[9px] font-bold tracking-widest uppercase mb-1">Completed</p>
                <p className="text-2xl font-black text-green-500">{completedSessions}</p>
                <p className="text-zinc-700 text-[9px] mt-1">Finished sessions</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-900 p-4">
                <p className="text-zinc-600 text-[9px] font-bold tracking-widest uppercase mb-1">Subjects</p>
                <p className="text-2xl font-black text-white">{totalSubjects}</p>
                <p className="text-zinc-700 text-[9px] mt-1">Can teach</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-900 p-4">
                <p className="text-zinc-600 text-[9px] font-bold tracking-widest uppercase mb-1">Locations</p>
                <p className="text-2xl font-black text-white">{totalLocations}</p>
                <p className="text-zinc-700 text-[9px] mt-1">Service areas</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div>
                <SectionTitle>SUBJECTS</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {userData.subjects?.length ? userData.subjects.map((s, i) => <Tag key={i}>{s}</Tag>) : <span className="text-zinc-700 text-xs italic">None added</span>}
                </div>
              </div>
              <div>
                <SectionTitle>PREFERRED CLASSES</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {userData.preferredClasses?.length ? userData.preferredClasses.map((c, i) => <Tag key={i}>{c}</Tag>) : <span className="text-zinc-700 text-xs italic">None added</span>}
                </div>
              </div>
              <div>
                <SectionTitle>PREFERRED SYLLABUS</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {userData.preferredSyllabus?.length ? userData.preferredSyllabus.map((s, i) => <Tag key={i}>{s}</Tag>) : <span className="text-zinc-700 text-xs italic">None added</span>}
                </div>
              </div>
            </div>

            <div>
              <SectionTitle>TEACHING MODE</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { val: 'OFFLINE (Preferred by More Parents)', label: 'Offline', note: 'Preferred by more parents' },
                  { val: 'ONLINE', label: 'Online', note: 'Via video call' },
                  { val: 'BOTH', label: 'Both', note: 'Fully flexible' },
                ].map(({ val, label, note }) => {
                  const active = userData.teachingMode === val;
                  return (
                    <div key={val} className={`py-5 px-5 border-2 ${active ? 'border-yellow-400 bg-yellow-400/5' : 'border-zinc-900 bg-zinc-950 opacity-40'}`}>
                      <p className={`text-xs font-black ${active ? 'text-yellow-400' : 'text-white'}`}>{label}</p>
                      <p className="text-zinc-600 text-[10px] font-light mt-1">{note}</p>
                      {active && <span className="inline-block mt-2 text-[9px] font-black tracking-widest text-yellow-400 uppercase">● Selected</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <SectionTitle>PREFERRED LOCATIONS</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {userData.preferredLocation?.length ? userData.preferredLocation.map((loc, i) => <Tag key={i}>{loc}</Tag>) : <span className="text-zinc-700 text-xs italic">None added</span>}
                </div>
              </div>
              <div>
                <SectionTitle>COMFORTABLE TIMINGS</SectionTitle>
                <div className="border border-zinc-900 bg-zinc-950 divide-y divide-zinc-900">
                  {userData.comfortableTiming?.length
                    ? userData.comfortableTiming.map((t, i) => (
                        <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                          <Clock className="w-3 h-3 text-zinc-700 flex-shrink-0" />
                          <span className="text-sm text-white font-light">{t}</span>
                        </div>
                      ))
                    : <div className="px-5 py-4 text-zinc-700 text-xs italic">No timings added</div>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ ACCOUNT TAB ══ */}
        {activeTab === 'account' && (
          <div className="max-w-2xl space-y-8">
            <div>
              <SectionTitle>VERIFICATION STATUS</SectionTitle>
              <div className={`border p-6 flex items-start gap-4 ${userData.isverified ? 'border-green-500/30 bg-green-500/5' : 'border-yellow-400/30 bg-yellow-400/5'}`}>
                {userData.isverified
                  ? <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  : <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />}
                <div>
                  <p className={`font-black text-sm mb-1 ${userData.isverified ? 'text-green-500' : 'text-yellow-400'}`}>
                    {userData.isverified ? 'Your account is verified' : 'Verification in progress'}
                  </p>
                  <p className="text-zinc-500 text-xs font-light leading-relaxed">
                    {userData.isverified
                      ? 'You have full access and can be matched with students in your preferred areas.'
                      : "Our admin team is reviewing your application. You'll receive an email once verified."}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <SectionTitle>ACCOUNT DETAILS</SectionTitle>
              <div className="border border-zinc-900 bg-zinc-950">
                <InfoRow label="Name" value={userData.name} icon={User} />
                <InfoRow label="Email" value={userData.email} icon={Mail} />
                <InfoRow label="Role" value={userData.role || 'Tutor'} icon={Shield} />
              </div>
            </div>

            <div>
              <SectionTitle>SESSION</SectionTitle>
              <div className="border border-zinc-900 bg-zinc-950 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-white text-xs font-black mb-1">Sign out of your account</p>
                  <p className="text-zinc-600 text-[10px] font-light">You'll need to log in again to access the dashboard.</p>
                </div>
                <button onClick={handleLogout}
                  className="flex-shrink-0 px-6 py-3 border-2 border-zinc-800 text-zinc-500 text-[10px] font-bold tracking-widest hover:border-red-500 hover:text-red-400 transition-all flex items-center gap-2">
                  <LogOut className="w-3 h-3" /> SIGN OUT
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── STICKY FOOTER ── */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-black/95 backdrop-blur border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <p className="text-zinc-700 text-[9px] tracking-[0.25em] uppercase">Tutor Portal · Secured Access</p>
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${userData.isverified ? 'bg-green-500' : 'bg-yellow-400'}`} />
            <span className="text-zinc-700 text-[9px] tracking-widest uppercase">{userData.isverified ? 'Verified' : 'Pending'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;