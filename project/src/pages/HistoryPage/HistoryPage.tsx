import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronDown, ChevronUp, Filter } from 'lucide-react';

interface SessionRecord {
  id: string;
  date: Date;
  duration: number; // in minutes
  emotions: string[];
  summary: string;
  notes?: string;
}

const HistoryPage: React.FC = () => {
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [filterEmotions, setFilterEmotions] = useState<string[]>([]);
  const [filterDateRange, setFilterDateRange] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Mock session data
  const sessionRecords: SessionRecord[] = [
    {
      id: '1',
      date: new Date('2023-06-10T14:30:00'),
      duration: 25,
      emotions: ['happy', 'neutral'],
      summary: 'Discussed work-related stress and practiced relaxation techniques.',
      notes: 'Feeling more optimistic about work projects. Relaxation techniques were effective.'
    },
    {
      id: '2',
      date: new Date('2023-06-05T10:15:00'),
      duration: 30,
      emotions: ['anxious', 'sad', 'neutral'],
      summary: 'Explored feelings of anxiety about upcoming presentation.',
      notes: 'Identified specific triggers and developed coping strategies.'
    },
    {
      id: '3',
      date: new Date('2023-05-28T16:00:00'),
      duration: 20,
      emotions: ['frustrated', 'angry', 'neutral'],
      summary: 'Addressed conflict with family member.',
      notes: 'Practiced communication techniques and boundary setting.'
    },
    {
      id: '4',
      date: new Date('2023-05-20T11:30:00'),
      duration: 35,
      emotions: ['sad', 'anxious', 'hopeful'],
      summary: 'Discussed feelings of loneliness and isolation.',
      notes: 'Identified social activities to engage in. Set goal to reach out to one friend per week.'
    },
    {
      id: '5',
      date: new Date('2023-05-15T09:00:00'),
      duration: 15,
      emotions: ['happy', 'excited'],
      summary: 'Celebrated progress in personal development goals.',
      notes: 'Acknowledged achievements and discussed future aspirations.'
    },
  ];

  // Get all unique emotions
  const allEmotions = [...new Set(sessionRecords.flatMap(session => session.emotions))];

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Toggle session details
  const toggleSession = (id: string) => {
    setActiveSession(activeSession === id ? null : id);
  };

  // Toggle emotion filter
  const toggleEmotionFilter = (emotion: string) => {
    setFilterEmotions(prev => 
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  // Apply filters
  const filteredSessions = sessionRecords.filter(session => {
    // Filter by emotions
    if (filterEmotions.length > 0 && !filterEmotions.some(emotion => session.emotions.includes(emotion))) {
      return false;
    }
    
    // Filter by date range
    const now = new Date();
    if (filterDateRange === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      if (session.date < weekAgo) return false;
    } else if (filterDateRange === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      if (session.date < monthAgo) return false;
    } else if (filterDateRange === 'year') {
      const yearAgo = new Date();
      yearAgo.setFullYear(now.getFullYear() - 1);
      if (session.date < yearAgo) return false;
    }
    
    return true;
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-neutral-50">
      <motion.div 
        className="container-fluid"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="mb-12">
          <motion.h1 variants={itemVariants} className="text-3xl font-bold text-gray-900 mb-2">
            Session History
          </motion.h1>
          <motion.p variants={itemVariants} className="text-gray-600">
            Review your past therapy sessions and track your progress
          </motion.p>
        </div>

        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="text-gray-500 hover:text-gray-700 flex items-center"
              >
                {isFilterOpen ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Hide Filters
                  </>
                ) : (
                  <>
                    <Filter className="h-4 w-4 mr-1" />
                    Show Filters
                  </>
                )}
              </button>
            </div>
            
            {isFilterOpen && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Date Range</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFilterDateRange('all')}
                      className={`px-3 py-1 rounded-full text-sm ${
                        filterDateRange === 'all'
                          ? 'bg-sage text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      All Time
                    </button>
                    <button
                      onClick={() => setFilterDateRange('week')}
                      className={`px-3 py-1 rounded-full text-sm ${
                        filterDateRange === 'week'
                          ? 'bg-sage text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Past Week
                    </button>
                    <button
                      onClick={() => setFilterDateRange('month')}
                      className={`px-3 py-1 rounded-full text-sm ${
                        filterDateRange === 'month'
                          ? 'bg-sage text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Past Month
                    </button>
                    <button
                      onClick={() => setFilterDateRange('year')}
                      className={`px-3 py-1 rounded-full text-sm ${
                        filterDateRange === 'year'
                          ? 'bg-sage text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Past Year
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Emotions</h3>
                  <div className="flex flex-wrap gap-2">
                    {allEmotions.map(emotion => (
                      <button
                        key={emotion}
                        onClick={() => toggleEmotionFilter(emotion)}
                        className={`px-3 py-1 rounded-full text-sm capitalize ${
                          filterEmotions.includes(emotion)
                            ? 'bg-sage text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {emotion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          {filteredSessions.length > 0 ? (
            filteredSessions.map(session => (
              <motion.div
                key={session.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleSession(session.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">{formatDate(session.date)}</h3>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatTime(session.date)} • {session.duration} mins
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex space-x-1 mr-4">
                        {session.emotions.map(emotion => (
                          <span 
                            key={emotion} 
                            className="px-2 py-1 rounded-full text-xs capitalize bg-gray-100 text-gray-700"
                          >
                            {emotion}
                          </span>
                        ))}
                      </div>
                      {activeSession === session.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
                
                {activeSession === session.id && (
                  <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Session Summary</h4>
                      <p className="text-gray-800">{session.summary}</p>
                    </div>
                    
                    {session.notes && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Personal Notes</h4>
                        <p className="text-gray-800">{session.notes}</p>
                      </div>
                    )}
                    
                    <div className="mt-4 flex space-x-2">
                      <button className="btn bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm py-2">
                        <Calendar className="h-4 w-4 mr-2" />
                        Add to Calendar
                      </button>
                      <button className="btn bg-sage text-white text-sm py-2">
                        View Full Session
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No sessions found</h3>
              <p className="text-gray-600 mb-4">
                {filterEmotions.length > 0 || filterDateRange !== 'all'
                  ? 'Try adjusting your filters to see more results'
                  : 'You haven\'t had any therapy sessions yet'}
              </p>
              
              {filterEmotions.length > 0 || filterDateRange !== 'all' ? (
                <button 
                  onClick={() => {
                    setFilterEmotions([]);
                    setFilterDateRange('all');
                  }}
                  className="btn bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
                >
                  Clear Filters
                </button>
              ) : (
                <button className="btn btn-primary">
                  Start a Session
                </button>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HistoryPage;