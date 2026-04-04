import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Save, X, AlertCircle } from 'lucide-react';

const inputCls = "w-full bg-black border-2 border-zinc-800 text-white text-sm p-3 focus:border-yellow-400 focus:outline-none transition-colors duration-150 placeholder-zinc-600 font-light";
const labelCls = "text-[10px] font-bold tracking-[0.2em] text-yellow-400 uppercase block mb-1.5";

const DailyTopics = ({ date, currentSession, isEditing, onUpdateTopics }) => {
  const [editingTopics, setEditingTopics] = useState([]);
  const [newTopic, setNewTopic] = useState('');
  const [loading, setLoading] = useState(false);

  const parseTopics = (session) => {
    if (!session?.topic) return [];
    const t = session.topic;
    if (t.includes(',')) return t.split(',').map(s => s.trim()).filter(Boolean);
    if (t.includes('\n')) return t.split('\n').map(s => s.trim()).filter(Boolean);
    return [t.trim()].filter(Boolean);
  };

  useEffect(() => { setEditingTopics(parseTopics(currentSession)); }, [currentSession]);

  const handleSave = async () => {
    if (!currentSession?._id) return;
    setLoading(true);
    try {
      await onUpdateTopics(currentSession._id, editingTopics.join(', '));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleAdd = () => {
    if (newTopic.trim()) { setEditingTopics([...editingTopics, newTopic.trim()]); setNewTopic(''); }
  };

  const handleRemove = (i) => setEditingTopics(editingTopics.filter((_, idx) => idx !== i));
  const handleUpdate = (i, val) => { const t = [...editingTopics]; t[i] = val; setEditingTopics(t); };
  const handleReset = () => setEditingTopics(parseTopics(currentSession));

  return (
    <div className="bg-black h-full w-full flex flex-col border-t-2 border-zinc-900"
      style={{ fontFamily: "'Unbounded', sans-serif" }}>

      {/* ── Header ── */}
      <div className="flex-shrink-0 px-5 sm:px-6 py-4 border-b border-zinc-900 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 border border-yellow-400/30 bg-yellow-400/10 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-3.5 h-3.5 text-yellow-400" />
          </div>
          <div>
            <p className="text-white font-black text-xs leading-none">Session Topics</p>
            <p className="text-zinc-600 text-[10px] font-light mt-0.5">
              {currentSession ? `${currentSession.subject} · ${currentSession.studentName}` : 'Select a session'}
            </p>
          </div>
        </div>

        {isEditing && currentSession && (
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={handleReset} disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 border-2 border-zinc-800 text-zinc-500 text-[10px] font-bold tracking-widest hover:border-zinc-600 hover:text-white transition-all disabled:opacity-50">
              <X className="w-3 h-3" /> RESET
            </button>
            <button onClick={handleSave} disabled={loading || !currentSession._id}
              className="flex items-center gap-1.5 px-3 py-2 bg-yellow-400 text-black text-[10px] font-black tracking-widest hover:bg-yellow-300 transition-colors disabled:opacity-50">
              {loading
                ? <><span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" /> SAVING</>
                : <><Save className="w-3 h-3" /> SAVE</>}
            </button>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-hidden px-5 sm:px-6 py-4 flex flex-col">

        {/* No session selected */}
        {!currentSession && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
            <AlertCircle className="w-8 h-8 text-zinc-800" />
            <p className="text-zinc-600 text-xs font-light">No session selected</p>
            <p className="text-zinc-800 text-[10px]">Select a session above to view topics</p>
          </div>
        )}

        {/* Edit mode */}
        {currentSession && isEditing && (
          <div className="flex-1 overflow-hidden flex flex-col gap-4">
            {/* Topics list */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {editingTopics.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-2 py-8 text-center">
                  <BookOpen className="w-8 h-8 text-zinc-800" />
                  <p className="text-zinc-600 text-xs font-light">No topics yet</p>
                </div>
              ) : (
                editingTopics.map((topic, i) => (
                  <div key={i} className="flex items-center gap-3 border border-zinc-900 bg-zinc-950 p-3">
                    <span className="w-6 h-6 bg-yellow-400 text-black text-[10px] font-black flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <input type="text" value={topic} onChange={(e) => handleUpdate(i, e.target.value)}
                      className="flex-1 bg-transparent border-0 text-white text-sm font-light focus:outline-none placeholder-zinc-600"
                      placeholder="Topic name..." />
                    <button onClick={() => handleRemove(i)}
                      className="w-7 h-7 flex items-center justify-center text-zinc-700 hover:text-red-400 transition-colors flex-shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add topic */}
            <div className="flex-shrink-0 border-t border-zinc-900 pt-4">
              <label className={labelCls}>Add New Topic</label>
              <div className="flex gap-2">
                <input type="text" value={newTopic} onChange={(e) => setNewTopic(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                  className={inputCls} placeholder="Enter topic and press Enter..." />
                <button onClick={handleAdd} disabled={!newTopic.trim()}
                  className="w-12 flex-shrink-0 bg-yellow-400 text-black flex items-center justify-center hover:bg-yellow-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-zinc-700 text-[9px] mt-2 tracking-widest">PRESS ENTER OR CLICK + TO ADD</p>
            </div>
          </div>
        )}

        {/* Read-only mode */}
        {currentSession && !isEditing && (
          <div className="flex-1 overflow-y-auto pr-1">
            {editingTopics.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                <BookOpen className="w-8 h-8 text-zinc-800" />
                <p className="text-zinc-600 text-xs font-light">No topics defined for this session</p>
                <p className="text-zinc-800 text-[10px]">Enable edit mode to add topics</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-zinc-600 text-[10px] font-bold tracking-widest uppercase mb-3">
                  {currentSession.subject} · {currentSession.studentName}
                </p>
                {editingTopics.map((topic, i) => (
                  <div key={i} className="flex items-start gap-3 border border-zinc-900 bg-zinc-950 p-4 hover:border-zinc-800 transition-colors">
                    <span className="w-6 h-6 bg-yellow-400 text-black text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-light">{topic}</p>
                      <p className="text-zinc-700 text-[9px] tracking-widest uppercase mt-1">
                        {currentSession.subject} · Topic {i + 1}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="flex-shrink-0 px-5 sm:px-6 py-3 border-t border-zinc-900 flex items-center justify-between">
        <span className="text-zinc-700 text-[10px] font-bold tracking-widest">
          {currentSession
            ? <><span className="text-yellow-400">{editingTopics.length}</span> topic{editingTopics.length !== 1 ? 's' : ''}</>
            : 'Select a session'}
        </span>
        {currentSession && (
          <span className="text-zinc-800 text-[9px] tracking-widest font-light">
            ID: {currentSession._id ? currentSession._id.substring(0, 8) + '...' : 'N/A'}
          </span>
        )}
      </div>
    </div>
  );
};

export default DailyTopics;