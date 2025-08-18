import React, { useState, useEffect } from 'react';
import { Bell, X, Calendar, MapPin, Gift, Cloud, Users, Clock, Sparkles, TrendingUp, Filter, Search } from 'lucide-react';

interface SmartNotification {
  id: string;
  type: 'contextual' | 'price_drop' | 'back_in_stock' | 'social' | 'weather' | 'calendar';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
  isRead: boolean;
  actionable: boolean;
  metadata: {
    productId?: string;
    eventId?: string;
    userId?: string;
    location?: string;
    price?: number;
    originalPrice?: number;
  };
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SmartNotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock notifications - in production, these would come from real-time APIs
  const mockNotifications: SmartNotification[] = [
    {
      id: '1',
      type: 'contextual',
      title: 'Perfect Weather for Outdoor Activities',
      message: 'It\'s 72°F and sunny! Great time for that hiking gear you\'ve been eyeing.',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      priority: 'medium',
      isRead: false,
      actionable: true,
      metadata: { location: 'Seattle, WA' }
    },
    {
      id: '2',
      type: 'price_drop',
      title: 'Price Drop Alert!',
      message: 'The Smart Fitness Tracker you liked is now 25% off - save $50!',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      priority: 'high',
      isRead: false,
      actionable: true,
      metadata: { productId: 'fitness-tracker', price: 149, originalPrice: 199 }
    },
    {
      id: '3',
      type: 'calendar',
      title: 'Upcoming Date Night',
      message: 'You have dinner reservations tomorrow. Here are some outfit suggestions!',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      priority: 'high',
      isRead: false,
      actionable: true,
      metadata: { eventId: 'dinner-date' }
    },
    {
      id: '4',
      type: 'social',
      title: 'Friend Activity',
      message: 'Sarah added 3 items to your shared "Weekend Outfits" shortlist',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      priority: 'medium',
      isRead: true,
      actionable: true,
      metadata: { userId: 'sarah-123' }
    },
    {
      id: '5',
      type: 'back_in_stock',
      title: 'Back in Stock!',
      message: 'The Cozy Knit Sweater in your size is available again',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      priority: 'medium',
      isRead: true,
      actionable: true,
      metadata: { productId: 'cozy-sweater' }
    }
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'contextual': return Sparkles;
      case 'price_drop': return TrendingUp;
      case 'back_in_stock': return Bell;
      case 'social': return Users;
      case 'weather': return Cloud;
      case 'calendar': return Calendar;
      default: return Bell;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'contextual': return 'text-purple-600 bg-purple-100';
      case 'price_drop': return 'text-green-600 bg-green-100';
      case 'back_in_stock': return 'text-blue-600 bg-blue-100';
      case 'social': return 'text-pink-600 bg-pink-100';
      case 'weather': return 'text-cyan-600 bg-cyan-100';
      case 'calendar': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    ));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesFilter = filter === 'all' || notif.type === filter;
    const matchesSearch = searchQuery === '' || 
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-md h-full bg-white shadow-2xl transform transition-transform duration-300 ease-out">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Bell className="h-6 w-6" />
              <h2 className="text-xl font-bold">Smart Notifications</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {unreadCount > 0 && (
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <p className="text-sm">
                You have <span className="font-bold">{unreadCount}</span> unread notifications
              </p>
            </div>
          )}
        </div>

        {/* Filters and Search */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notifications..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="all">All Notifications</option>
              <option value="contextual">Contextual</option>
              <option value="price_drop">Price Drops</option>
              <option value="social">Social</option>
              <option value="calendar">Calendar</option>
              <option value="weather">Weather</option>
            </select>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No notifications found</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredNotifications.map((notification) => {
                const IconComponent = getNotificationIcon(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={`border-l-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      getPriorityColor(notification.priority)
                    } ${!notification.isRead ? 'bg-white' : 'bg-gray-50'}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className={`font-medium text-gray-900 ${!notification.isRead ? 'font-bold' : ''}`}>
                            {notification.title}
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{notification.timestamp.toLocaleTimeString()}</span>
                          </div>
                          
                          {notification.actionable && (
                            <button className="px-3 py-1 bg-indigo-500 text-white text-xs rounded-lg hover:bg-indigo-600 transition-colors">
                              Take Action
                            </button>
                          )}
                        </div>
                        
                        {/* Metadata Display */}
                        {notification.metadata.price && (
                          <div className="mt-2 p-2 bg-green-100 rounded-lg">
                            <div className="flex items-center space-x-2 text-sm">
                              <span className="font-bold text-green-800">${notification.metadata.price}</span>
                              {notification.metadata.originalPrice && (
                                <span className="text-gray-500 line-through">
                                  ${notification.metadata.originalPrice}
                                </span>
                              )}
                              <span className="text-green-600 font-medium">
                                Save ${(notification.metadata.originalPrice || 0) - notification.metadata.price}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-3">
            <button
              onClick={() => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm"
            >
              Mark All Read
            </button>
            <button
              onClick={() => setNotifications([])}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}