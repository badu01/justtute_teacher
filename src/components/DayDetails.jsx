// components/DayDetails.jsx
import React, { useState } from 'react';
import { Edit2, Clock, Users, Trash2, ChevronLeft, ChevronRight, Save, X } from 'lucide-react';

const DayDetails = ({
    date,
    events,
    isEditing,
    onEditToggle,
    onCreateSession,
    onUpdateSession,
    onDeleteSession,
    students,
    currentSessionIndex,
    onSessionIndexChange
}) => {
    //   const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
    const [editingSession, setEditingSession] = useState(null);
    const [newSession, setNewSession] = useState({
        studentId: '',
        subject: '',
        topic: '',
        startTime: '09:00',
        endTime: '10:00'
    });
    const [loading, setLoading] = useState(false);



    // Get current session
    const currentSession = events[currentSessionIndex];

    // Format time for display
    const formatTimeForDisplay = (isoTime) => {
        const time = new Date(isoTime);
        return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    // Navigation handlers
    const handleNextSession = () => {
        if (currentSessionIndex < events.length - 1) {
            const newIndex = currentSessionIndex + 1;
            onSessionIndexChange(newIndex);
            setEditingSession(null);
        }
    };

    const handlePrevSession = () => {
        if (currentSessionIndex > 0) {
            const newIndex = currentSessionIndex - 1;
            onSessionIndexChange(newIndex);
            setEditingSession(null);
        }
    };

    // Edit handlers
    const handleEdit = () => {
        setEditingSession({ ...currentSession });
    };

    const handleSave = async () => {
        if (!editingSession) return;

        setLoading(true);
        const updateData = {
            studentId: editingSession.studentId,
            subject: editingSession.subject,
            topic: editingSession.topic || '',
            startTime: editingSession.startTime,
            endTime: editingSession.endTime
        };

        const success = await onUpdateSession(editingSession._id, updateData);
        setLoading(false);

        if (success) {
            setEditingSession(null);
        }
    };

    const handleCancel = () => {
        setEditingSession(null);
    };

    const handleDelete = async () => {
        if (!currentSession) return;

        if (window.confirm('Are you sure you want to delete this session?')) {
            setLoading(true);
            await onDeleteSession(currentSession._id);
            setLoading(false);

            // Reset to first session after deletion
            if (events.length > 1) {
                setCurrentSessionIndex(0);
            }
        }
    };

    const handleAddSession = async () => {
        if (newSession.studentId && newSession.subject && newSession.startTime && newSession.endTime) {
            setLoading(true);
            const success = await onCreateSession(newSession);
            setLoading(false);

            if (success) {
                setNewSession({
                    studentId: '',
                    subject: '',
                    topic: '',
                    startTime: '09:00',
                    endTime: '10:00'
                });
            }
        }
    };

    // Get day of month
    const getDayOfMonth = () => {
        return date.getDate();
    };

    return (
        <div className="bg-amber-300 p-4 md:p-6 h-full w-full flex flex-col">
            {/* Main Session Display Area */}
            <div className="grow flex flex-col">
                {events.length === 0 ? (
                    <div className="text-center">
                        <div className="text-6xl font-bold text-gray-700 mb-4">{getDayOfMonth()}</div>
                        <p className="text-gray-600">No sessions scheduled for this day</p>
                        {isEditing && (
                            <button
                                onClick={() => setEditingSession('new')}
                                className="mt-6 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                            >
                                + Add First Session
                            </button>
                        )}
                    </div>
                ) : editingSession === 'new' ? (
                    <div className="">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Create New Session</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Student *</label>
                                    <select
                                        value={newSession.studentId}
                                        onChange={(e) => setNewSession({ ...newSession, studentId: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select Student</option>
                                        {students.map(student => (
                                            <option key={student._id} value={student._id}>
                                                {student.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                                    <input
                                        type="text"
                                        value={newSession.subject}
                                        onChange={(e) => setNewSession({ ...newSession, subject: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., Biology"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                                    <input
                                        type="time"
                                        value={newSession.startTime}
                                        onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
                                    <input
                                        type="time"
                                        value={newSession.endTime}
                                        onChange={(e) => setNewSession({ ...newSession, endTime: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                                <input
                                    type="text"
                                    value={newSession.topic}
                                    onChange={(e) => setNewSession({ ...newSession, topic: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Topic for this session"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    onClick={() => setEditingSession(null)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddSession}
                                    disabled={loading || !newSession.studentId || !newSession.subject || !newSession.startTime || !newSession.endTime}
                                    className="px-4 py-2 bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors"
                                >
                                    {loading ? 'Creating...' : 'Create Session'}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : editingSession ? (
                    // Edit Session View
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-4">
                                <div className="text-5xl font-bold text-gray-800">{getDayOfMonth()}</div>
                                <div>
                                    <select
                                        value={editingSession.studentId}
                                        onChange={(e) => {
                                            const selectedStudent = students.find(s => s._id === e.target.value);
                                            setEditingSession({
                                                ...editingSession,
                                                studentId: e.target.value,
                                                studentName: selectedStudent?.name || editingSession.studentName
                                            });
                                        }}
                                        className="text-xl font-semibold text-gray-800 bg-transparent border-none focus:outline-none"
                                    >
                                        {students.map(student => (
                                            <option key={student._id} value={student._id}>
                                                {student.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                <input
                                    type="text"
                                    value={editingSession.subject}
                                    onChange={(e) => setEditingSession({ ...editingSession, subject: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                                    placeholder="Subject"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                                    <input
                                        type="time"
                                        value={editingSession.startTime ? new Date(editingSession.startTime).toTimeString().substring(0, 5) : ''}
                                        onChange={(e) => {
                                            const newStartTime = new Date(editingSession.startTime);
                                            const [hours, minutes] = e.target.value.split(':');
                                            newStartTime.setHours(parseInt(hours), parseInt(minutes));
                                            setEditingSession({ ...editingSession, startTime: newStartTime.toISOString() });
                                        }}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                                    <input
                                        type="time"
                                        value={editingSession.endTime ? new Date(editingSession.endTime).toTimeString().substring(0, 5) : ''}
                                        onChange={(e) => {
                                            const newEndTime = new Date(editingSession.endTime);
                                            const [hours, minutes] = e.target.value.split(':');
                                            newEndTime.setHours(parseInt(hours), parseInt(minutes));
                                            setEditingSession({ ...editingSession, endTime: newEndTime.toISOString() });
                                        }}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                                <input
                                    type="text"
                                    value={editingSession.topic || ''}
                                    onChange={(e) => setEditingSession({ ...editingSession, topic: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Topic for this session"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    onClick={handleCancel}
                                    disabled={loading}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="px-4 py-2 bg-black text-white hover:bg-gray-800 rounded-lg transition-colors flex items-center"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    // View Session Mode
                    <div className="flex flex-col justify-between h-full">
                        {/* Day and Student Row */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-6">
                                <div className="text-6xl font-bold text-gray-800">{getDayOfMonth()}</div>
                                <div>
                                    <div className="text-2xl font-semibold text-gray-800">{currentSession.studentName}</div>
                                </div>
                            </div>
                            <button
                                onClick={onEditToggle}
                                disabled={loading}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-sm ${isEditing
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-black text-white hover:bg-gray-800'
                                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <Edit2 className="w-4 h-4" />
                                <span>{isEditing ? 'Editing' : 'Edit Mode'}</span>
                            </button>

                            {isEditing && (
                                <div className="flex space-x-3">
                                    <button
                                        onClick={handleEdit}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Subject */}
                        <div className="mb-6">
                            <div className="text-lg text-gray-600 mb-1">Subject</div>
                            <div className="text-3xl font-bold text-gray-800">{currentSession.subject}</div>
                        </div>

                        {/* Time */}
                        <div className="mb-8">
                            <div className="text-lg text-gray-600 mb-1">Time</div>
                            <div className="flex items-center space-x-2">
                                <Clock className="w-5 h-5 text-gray-600" />
                                <span className="text-2xl font-semibold text-gray-800">
                                    {formatTimeForDisplay(currentSession.startTime)} - {formatTimeForDisplay(currentSession.endTime)}
                                </span>
                            </div>
                        </div>

                        {/* Session Counter and Navigation */}
                        <div className="flex items-center justify-between pt-2 border-t border-black/20">
                            <button
                                onClick={handlePrevSession}
                                disabled={currentSessionIndex === 0 || loading}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${currentSessionIndex === 0
                                        ? 'opacity-30 cursor-not-allowed'
                                        : 'hover:bg-amber-200'
                                    }`}
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span>Previous</span>
                            </button>

                            <div className="text-gray-600">
                                {currentSessionIndex + 1} / {events.length}
                            </div>

                            <button
                                onClick={handleNextSession}
                                disabled={currentSessionIndex === events.length - 1 || loading}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${currentSessionIndex === events.length - 1
                                        ? 'opacity-30 cursor-not-allowed'
                                        : 'hover:bg-amber-200'
                                    }`}
                            >
                                <span>Next</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Session Button (when not in edit mode and no sessions) */}
            {isEditing && !editingSession && events.length === 0 && (
                <div className="mt-6 text-center">
                    <button
                        onClick={() => setEditingSession('new')}
                        className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                        + Add Session for Today
                    </button>
                </div>
            )}

            {/* Add Another Session Button (when in edit mode and has sessions) */}
            {isEditing && !editingSession && events.length > 0 && (
                <div className="mt-6 text-center">
                    <button
                        onClick={() => setEditingSession('new')}
                        className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                        + Add Another Session
                    </button>
                </div>
            )}
        </div>
    );
};

export default DayDetails;