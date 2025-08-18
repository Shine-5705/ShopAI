import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Cloud, Gift, Heart, Users, Bell, X, Plus, MessageCircle, ThumbsUp, Star, Clock, Sparkles, TrendingUp, Sun, CloudRain, Snowflake } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface ContextualEvent {
  id: string;
  type: 'birthday' | 'anniversary' | 'festival' | 'weather' | 'season' | 'meeting' | 'travel';
  title: string;
  description: string;
  date: Date;
  priority: 'high' | 'medium' | 'low';
  context: {
    person?: string;
    location?: string;
    weather?: string;
    temperature?: number;
    occasion?: string;
  };
  suggestions: ProductSuggestion[];
  isPrivate: boolean;
  collaborators?: string[];
}

interface ProductSuggestion {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  aiReason: string;
  relevanceScore: number;
  category: string;
}

interface Notification {
  id: string;
  event: ContextualEvent;
  timestamp: Date;
  isRead: boolean;
  isActive: boolean;
}

export function ContextualAssistant() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeEvent, setActiveEvent] = useState<ContextualEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [collaborativeNotes, setCollaborativeNotes] = useState<string>('');
  const [eventVotes, setEventVotes] = useState<Record<string, { up: number; down: number }>>({});

  // Mock contextual events - in production, this would come from APIs
  const mockEvents: ContextualEvent[] = [
    {
      id: '1',
      type: 'birthday',
      title: "Sarah's Birthday Tomorrow",
      description: "Your friend Sarah's birthday is coming up! Based on her interests in sustainable fashion and yoga, here are some thoughtful gift ideas.",
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      priority: 'high',
      context: {
        person: 'Sarah Johnson',
        occasion: 'Birthday'
      },
      suggestions: [
        {
          id: '1',
          name: 'Eco-Friendly Yoga Mat',
          price: 89,
          originalPrice: 120,
          image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400',
          rating: 4.8,
          aiReason: 'Perfect for Sarah\'s yoga practice. Made from sustainable materials she loves.',
          relevanceScore: 0.95,
          category: 'fitness'
        },
        {
          id: '2',
          name: 'Organic Skincare Set',
          price: 75,
          image: 'https://images.pexels.com/photos/3612181/pexels-photo-3612181.jpeg?auto=compress&cs=tinysrgb&w=400',
          rating: 4.9,
          aiReason: 'Matches her preference for natural, organic beauty products.',
          relevanceScore: 0.92,
          category: 'beauty'
        }
      ],
      isPrivate: false,
      collaborators: ['Mike', 'Emma', 'Alex']
    },
    {
      id: '2',
      type: 'weather',
      title: 'Cold Front Approaching',
      description: 'Temperature dropping to 35°F this weekend. Time to prep with cozy essentials!',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      priority: 'medium',
      context: {
        weather: 'Cold',
        temperature: 35,
        location: 'Seattle, WA'
      },
      suggestions: [
        {
          id: '3',
          name: 'Thermal Winter Coat',
          price: 199,
          originalPrice: 299,
          image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=400',
          rating: 4.7,
          aiReason: 'Perfect for the upcoming cold weather. Highly rated for warmth.',
          relevanceScore: 0.88,
          category: 'fashion'
        }
      ],
      isPrivate: true,
      collaborators: []
    },
    {
      id: '3',
      type: 'festival',
      title: 'Valentine\'s Day Approaching',
      description: 'Show your love with thoughtful gifts. Based on your partner\'s preferences, here are some romantic ideas.',
      date: new Date('2024-02-14'),
      priority: 'high',
      context: {
        occasion: 'Valentine\'s Day',
        person: 'Partner'
      },
      suggestions: [
        {
          id: '4',
          name: 'Elegant Jewelry Set',
          price: 159,
          image: 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=400',
          rating: 4.9,
          aiReason: 'Timeless elegance that matches their sophisticated style.',
          relevanceScore: 0.94,
          category: 'jewelry'
        }
      ],
      isPrivate: false,
      collaborators: ['Best Friend', 'Sister']
    }
  ];

  // Initialize notifications
  useEffect(() => {
    const newNotifications = mockEvents.map(event => ({
      id: `notif-${event.id}`,
      event,
      timestamp: new Date(),
      isRead: false,
      isActive: true
    }));
    setNotifications(newNotifications);

    // Initialize votes
    const votes: Record<string, { up: number; down: number }> = {};
    mockEvents.forEach(event => {
      event.suggestions.forEach(suggestion => {
        votes[suggestion.id] = { up: Math.floor(Math.random() * 10), down: Math.floor(Math.random() * 3) };
      });
    });
    setEventVotes(votes);
  }, []);

  // Auto-trigger notifications based on priority and timing
  useEffect(() => {
    const checkForActiveEvents = () => {
      const now = new Date();
      const urgentEvents = mockEvents.filter(event => {
        const timeDiff = event.date.getTime() - now.getTime();
        const hoursUntil = timeDiff / (1000 * 60 * 60);
        
        return (
          (event.priority === 'high' && hoursUntil <= 48) ||
          (event.priority === 'medium' && hoursUntil <= 24) ||
          (event.type === 'weather' && hoursUntil <= 12)
        );
      });

      if (urgentEvents.length > 0 && !activeEvent) {
        setActiveEvent(urgentEvents[0]);
        setShowEventModal(true);
      }
    };

    const interval = setInterval(checkForActiveEvents, 30000); // Check every 30 seconds
    checkForActiveEvents(); // Initial check

    return () => clearInterval(interval);
  }, [activeEvent]);

  const handleEventAction = (action: 'dismiss' | 'snooze' | 'view') => {
    if (action === 'dismiss') {
      setShowEventModal(false);
      setActiveEvent(null);
    } else if (action === 'snooze') {
      setShowEventModal(false);
      // Re-trigger in 1 hour
      setTimeout(() => {
        setShowEventModal(true);
      }, 60 * 60 * 1000);
    } else if (action === 'view') {
      setShowEventModal(true);
    }
  };

  const handleVote = (suggestionId: string, voteType: 'up' | 'down') => {
    setEventVotes(prev => ({
      ...prev,
      [suggestionId]: {
        ...prev[suggestionId],
        [voteType]: prev[suggestionId][voteType] + 1
      }
    }));
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'birthday': return Gift;
      case 'anniversary': return Heart;
      case 'festival': return Sparkles;
      case 'weather': return Cloud;
      case 'season': return Sun;
      case 'meeting': return Calendar;
      case 'travel': return MapPin;
      default: return Bell;
    }
  };

  const getWeatherIcon = (weather: string) => {
    switch (weather?.toLowerCase()) {
      case 'cold': return Snowflake;
      case 'rain': return CloudRain;
      case 'sunny': return Sun;
      default: return Cloud;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-pink-500';
      case 'medium': return 'from-orange-500 to-yellow-500';
      case 'low': return 'from-blue-500 to-indigo-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Floating Notification Bell */}
      <div className="fixed top-24 right-6 z-40">
        <div className="relative">
          <button
            onClick={() => handleEventAction('view')}
            className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-110 group"
          >
            <Bell className="h-6 w-6 text-indigo-600 group-hover:animate-pulse" />
            {notifications.filter(n => !n.isRead && n.isActive).length > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-bounce">
                {notifications.filter(n => !n.isRead && n.isActive).length}
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Smart Event Modal */}
      {showEventModal && activeEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in">
            {/* Header */}
            <div className={`bg-gradient-to-r ${getPriorityColor(activeEvent.priority)} text-white p-6 relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-4 left-4 w-20 h-20 border border-white/30 rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-16 h-16 border border-white/20 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 w-12 h-12 border border-white/10 rounded-full"></div>
              </div>
              
              <div className="relative flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                    {React.createElement(getEventIcon(activeEvent.type), { className: "h-8 w-8" })}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{activeEvent.title}</h2>
                    <p className="text-white/90 text-lg leading-relaxed">{activeEvent.description}</p>
                    
                    {/* Context Info */}
                    <div className="flex flex-wrap gap-3 mt-4">
                      {activeEvent.context.person && (
                        <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">{activeEvent.context.person}</span>
                        </div>
                      )}
                      {activeEvent.context.weather && (
                        <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                          {React.createElement(getWeatherIcon(activeEvent.context.weather), { className: "h-4 w-4" })}
                          <span className="text-sm">{activeEvent.context.weather}</span>
                          {activeEvent.context.temperature && (
                            <span className="text-sm">({activeEvent.context.temperature}°F)</span>
                          )}
                        </div>
                      )}
                      {activeEvent.context.location && (
                        <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{activeEvent.context.location}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{activeEvent.date.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleEventAction('dismiss')}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* AI Curated Suggestions */}
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-6">
                  <Sparkles className="h-6 w-6 text-indigo-600" />
                  <h3 className="text-xl font-bold text-gray-900">AI-Curated Suggestions</h3>
                  <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                    {activeEvent.suggestions.length} items
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeEvent.suggestions.map((suggestion) => (
                    <div key={suggestion.id} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group">
                      <div className="flex gap-4">
                        <img
                          src={suggestion.image}
                          alt={suggestion.name}
                          className="w-20 h-20 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                            {suggestion.name}
                          </h4>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-xl font-bold text-indigo-600">${suggestion.price}</span>
                            {suggestion.originalPrice && (
                              <span className="text-gray-400 line-through text-sm">${suggestion.originalPrice}</span>
                            )}
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600 ml-1">{suggestion.rating}</span>
                            </div>
                          </div>
                          
                          {/* AI Reasoning */}
                          <div className="bg-indigo-50 p-3 rounded-lg mb-3">
                            <div className="flex items-start space-x-2">
                              <TrendingUp className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-indigo-800 leading-relaxed">{suggestion.aiReason}</p>
                            </div>
                          </div>

                          {/* Collaborative Voting */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleVote(suggestion.id, 'up')}
                                className="flex items-center space-x-1 px-3 py-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                              >
                                <ThumbsUp className="h-4 w-4" />
                                <span className="text-sm font-medium">{eventVotes[suggestion.id]?.up || 0}</span>
                              </button>
                              <button
                                onClick={() => handleVote(suggestion.id, 'down')}
                                className="flex items-center space-x-1 px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                              >
                                <ThumbsUp className="h-4 w-4 rotate-180" />
                                <span className="text-sm font-medium">{eventVotes[suggestion.id]?.down || 0}</span>
                              </button>
                            </div>
                            <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
                              <Plus className="h-4 w-4" />
                              <span>Add to Shortlist</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Collaborative Features */}
              {!activeEvent.isPrivate && activeEvent.collaborators && activeEvent.collaborators.length > 0 && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                  <div className="flex items-center space-x-2 mb-4">
                    <Users className="h-5 w-5 text-purple-600" />
                    <h4 className="font-bold text-gray-900">Collaborative Planning</h4>
                  </div>
                  
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-sm text-gray-600">Collaborators:</span>
                    <div className="flex space-x-2">
                      {activeEvent.collaborators.map((collaborator, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full text-sm font-medium"
                        >
                          {collaborator[0]}
                        </div>
                      ))}
                    </div>
                    <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                      + Invite more
                    </button>
                  </div>

                  <div className="space-y-3">
                    <textarea
                      value={collaborativeNotes}
                      onChange={(e) => setCollaborativeNotes(e.target.value)}
                      placeholder="Add notes or suggestions for the group..."
                      className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/80 backdrop-blur-sm"
                      rows={3}
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MessageCircle className="h-4 w-4" />
                        <span>3 comments from collaborators</span>
                      </div>
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        Share Update
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleEventAction('snooze')}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors flex items-center space-x-2"
                  >
                    <Clock className="h-4 w-4" />
                    <span>Remind Later</span>
                  </button>
                  <button
                    onClick={() => handleEventAction('dismiss')}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
                <div className="flex space-x-3">
                  <button className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
                    <Heart className="h-4 w-4" />
                    <span>Create Shortlist</span>
                  </button>
                  <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Share with Friends</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}