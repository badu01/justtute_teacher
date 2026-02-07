// components/DailyTopics.jsx (Fixed height layout)
import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Save, X, AlertCircle } from 'lucide-react';

const DailyTopics = ({ 
  date, 
  currentSession,
  isEditing, 
  onUpdateTopics
}) => {
  const [editingTopics, setEditingTopics] = useState([]);
  const [newTopic, setNewTopic] = useState('');
  const [loading, setLoading] = useState(false);

  // Extract topics from current session
  useEffect(() => {
    if (currentSession && currentSession.topic) {
      let topicsArray = [];
      
      if (typeof currentSession.topic === 'string') {
        if (currentSession.topic.includes(',')) {
          topicsArray = currentSession.topic.split(',')
            .map(topic => topic.trim())
            .filter(topic => topic.length > 0);
        } else if (currentSession.topic.includes('\n')) {
          topicsArray = currentSession.topic.split('\n')
            .map(topic => topic.trim())
            .filter(topic => topic.length > 0);
        } else {
          topicsArray = [currentSession.topic.trim()].filter(topic => topic.length > 0);
        }
      }
      
      setEditingTopics(topicsArray);
    } else {
      setEditingTopics([]);
    }
  }, [currentSession]);

  const handleSave = async () => {
    if (!currentSession || !currentSession._id) {
      console.error('No current session or session ID');
      return;
    }
    
    setLoading(true);
    try {
      const topicsString = editingTopics.join(', ');
      const success = await onUpdateTopics(currentSession._id, topicsString);
      
      if (success) {
        console.log('Topics updated successfully');
      } else {
        console.error('Failed to update topics');
      }
    } catch (error) {
      console.error('Error updating topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTopic = () => {
    if (newTopic.trim()) {
      setEditingTopics([...editingTopics, newTopic.trim()]);
      setNewTopic('');
    }
  };

  const handleRemoveTopic = (index) => {
    const updatedTopics = [...editingTopics];
    updatedTopics.splice(index, 1);
    setEditingTopics(updatedTopics);
  };

  const handleUpdateTopic = (index, value) => {
    const updatedTopics = [...editingTopics];
    updatedTopics[index] = value;
    setEditingTopics(updatedTopics);
  };

  const handleReset = () => {
    if (currentSession && currentSession.topic) {
      let topicsArray = [];
      
      if (typeof currentSession.topic === 'string') {
        if (currentSession.topic.includes(',')) {
          topicsArray = currentSession.topic.split(',')
            .map(topic => topic.trim())
            .filter(topic => topic.length > 0);
        } else if (currentSession.topic.includes('\n')) {
          topicsArray = currentSession.topic.split('\n')
            .map(topic => topic.trim())
            .filter(topic => topic.length > 0);
        } else {
          topicsArray = [currentSession.topic.trim()].filter(topic => topic.length > 0);
        }
      }
      
      setEditingTopics(topicsArray);
    } else {
      setEditingTopics([]);
    }
  };

  const getStudentName = () => {
    return currentSession ? currentSession.studentName : 'No session selected';
  };

  return (
    <div className="bg-[#1f1f1f] h-full w-full flex flex-col">
      {/* Header - Fixed height */}
      <div className="flex-shrink-0 p-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-lg font-bold text-white">Session Topics</h2>
              <p className="text-sm text-gray-400">
                {currentSession ? currentSession.subject : 'Select a session'} • {getStudentName()}
              </p>
            </div>
          </div>
          {isEditing && currentSession && (
            <div className="flex space-x-2">
              <button
                onClick={handleReset}
                disabled={loading}
                className="px-3 py-1 text-sm text-gray-300 hover:bg-gray-700 rounded transition-colors flex items-center"
              >
                <X className="w-3 h-3 mr-1" />
                Reset
              </button>
              <button
                onClick={handleSave}
                disabled={loading || !currentSession._id}
                className="px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-3 h-3 mr-1" />
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Topics Area - Takes remaining space with proper scrolling */}
      <div className="flex-1 overflow-hidden px-6">
        {!currentSession ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <AlertCircle className="w-12 h-12 mb-3 text-gray-600" />
            <p className="text-center">No session selected</p>
            <p className="text-sm text-gray-500 mt-1">Select a session to view topics</p>
          </div>
        ) : isEditing ? (
          <div className="h-full flex flex-col">
            {/* Topics list - Scrollable */}
            <div className="flex-1 overflow-y-auto pr-1">
              {editingTopics.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <BookOpen className="w-12 h-12 mb-3 text-gray-600" />
                  <p>No topics added yet</p>
                  <p className="text-sm mt-1">Add your first topic below</p>
                </div>
              ) : (
                <div className="space-y-2 pb-4">
                  {editingTopics.map((topic, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                      <div className="shrink-0 w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-medium text-white">{index + 1}</span>
                      </div>
                      <input
                        type="text"
                        value={topic}
                        onChange={(e) => handleUpdateTopic(index, e.target.value)}
                        className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter topic..."
                      />
                      <button
                        onClick={() => handleRemoveTopic(index)}
                        className="p-2 text-red-400 hover:text-red-300 rounded-lg transition-colors hover:bg-gray-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Topic Input - Fixed at bottom of scrollable area */}
            <div className="flex-shrink-0 pt-4 mt-4 border-t border-gray-700">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Add New Topic
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTopic()}
                  className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter a topic for this session..."
                />
                <button
                  onClick={handleAddTopic}
                  disabled={!newTopic.trim()}
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Press Enter or click the + button to add
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            {/* Read-only topics list - Scrollable */}
            <div className="flex-1 overflow-y-auto pr-1">
              {editingTopics.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <BookOpen className="w-12 h-12 mb-3 text-gray-600" />
                  <p className="text-center">No topics defined for this session</p>
                  <p className="text-sm text-gray-500 mt-1">Enable edit mode to add topics</p>
                </div>
              ) : (
                <div className="space-y-3 pb-4">
                  <div className="text-sm text-gray-400 mb-2">
                    Topics for {currentSession.subject} with {getStudentName()}:
                  </div>
                  {editingTopics.map((topic, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <div className="shrink-0 w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-medium text-white">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">{topic}</div>
                        {currentSession.subject && (
                          <div className="text-xs text-gray-400 mt-1">
                            {currentSession.subject} • Topic {index + 1}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info - Fixed height */}
      <div className="shrink-0 px-6 pb-6 pt-4 border-t border-gray-700">
        <div className="flex justify-between items-center text-sm text-gray-400">
          <div>
            {currentSession ? (
              <>
                <span className="font-medium text-white">{editingTopics.length}</span> topic{editingTopics.length !== 1 ? 's' : ''} for this session
              </>
            ) : (
              'Select a session to view topics'
            )}
          </div>
          <div>
            {currentSession && (
              <span className="text-gray-500">
                Session ID: {currentSession._id ? currentSession._id.substring(0, 8) + '...' : 'N/A'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyTopics;