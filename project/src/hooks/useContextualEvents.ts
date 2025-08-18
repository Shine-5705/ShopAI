import { useState, useEffect } from 'react';

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
  suggestions: any[];
  isPrivate: boolean;
  collaborators?: string[];
}

interface WeatherData {
  temperature: number;
  condition: string;
  location: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: string;
  attendees?: string[];
}

export function useContextualEvents(userId?: string) {
  const [events, setEvents] = useState<ContextualEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data sources - in production, these would be real APIs
  const mockWeatherData: WeatherData = {
    temperature: 45,
    condition: 'cold',
    location: 'Seattle, WA'
  };

  const mockCalendarEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Dinner with Sarah',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      type: 'social',
      attendees: ['Sarah Johnson']
    },
    {
      id: '2',
      title: 'Team Meeting',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      type: 'work'
    }
  ];

  const mockBirthdays = [
    {
      name: 'Sarah Johnson',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      interests: ['yoga', 'sustainable fashion', 'organic beauty']
    }
  ];

  const generateContextualEvents = (): ContextualEvent[] => {
    const generatedEvents: ContextualEvent[] = [];

    // Weather-based events
    if (mockWeatherData.temperature < 50) {
      generatedEvents.push({
        id: 'weather-cold',
        type: 'weather',
        title: 'Cold Weather Alert',
        description: `Temperature dropping to ${mockWeatherData.temperature}°F. Time to prep with warm essentials!`,
        date: new Date(Date.now() + 12 * 60 * 60 * 1000),
        priority: 'medium',
        context: {
          weather: mockWeatherData.condition,
          temperature: mockWeatherData.temperature,
          location: mockWeatherData.location
        },
        suggestions: [], // Would be populated with warm clothing suggestions
        isPrivate: true
      });
    }

    // Birthday events
    mockBirthdays.forEach(birthday => {
      const daysUntil = Math.ceil((birthday.date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      if (daysUntil <= 7) {
        generatedEvents.push({
          id: `birthday-${birthday.name.replace(' ', '-').toLowerCase()}`,
          type: 'birthday',
          title: `${birthday.name}'s Birthday ${daysUntil === 1 ? 'Tomorrow' : `in ${daysUntil} days`}`,
          description: `${birthday.name}'s birthday is coming up! Based on their interests, here are some thoughtful gift ideas.`,
          date: birthday.date,
          priority: daysUntil <= 2 ? 'high' : 'medium',
          context: {
            person: birthday.name,
            occasion: 'Birthday'
          },
          suggestions: [], // Would be populated based on interests
          isPrivate: false,
          collaborators: ['Mike', 'Emma', 'Alex']
        });
      }
    });

    // Calendar-based events
    mockCalendarEvents.forEach(calEvent => {
      const hoursUntil = (calEvent.date.getTime() - Date.now()) / (1000 * 60 * 60);
      if (hoursUntil <= 48 && hoursUntil > 0) {
        if (calEvent.type === 'social') {
          generatedEvents.push({
            id: `calendar-${calEvent.id}`,
            type: 'meeting',
            title: `Upcoming: ${calEvent.title}`,
            description: `You have "${calEvent.title}" coming up. Here are some outfit and gift suggestions!`,
            date: calEvent.date,
            priority: hoursUntil <= 24 ? 'high' : 'medium',
            context: {
              occasion: calEvent.title,
              person: calEvent.attendees?.[0]
            },
            suggestions: [], // Would be populated with relevant suggestions
            isPrivate: false,
            collaborators: calEvent.attendees || []
          });
        }
      }
    });

    // Seasonal/Festival events
    const now = new Date();
    const valentine = new Date(now.getFullYear(), 1, 14); // February 14
    const daysToValentine = Math.ceil((valentine.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysToValentine <= 14 && daysToValentine > 0) {
      generatedEvents.push({
        id: 'valentine-2024',
        type: 'festival',
        title: 'Valentine\'s Day Approaching',
        description: 'Show your love with thoughtful gifts. Based on your partner\'s preferences, here are some romantic ideas.',
        date: valentine,
        priority: daysToValentine <= 7 ? 'high' : 'medium',
        context: {
          occasion: 'Valentine\'s Day',
          person: 'Partner'
        },
        suggestions: [], // Would be populated with romantic gift ideas
        isPrivate: false,
        collaborators: ['Best Friend', 'Sister']
      });
    }

    return generatedEvents;
  };

  const fetchContextualData = async () => {
    try {
      setLoading(true);
      setError(null);

      // In production, this would make real API calls to:
      // - Weather services
      // - Calendar APIs (Google Calendar, Outlook, etc.)
      // - Social media APIs for birthdays/anniversaries
      // - Location services
      // - User preference data

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const contextualEvents = generateContextualEvents();
      setEvents(contextualEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contextual data');
    } finally {
      setLoading(false);
    }
  };

  const addCustomEvent = (event: Omit<ContextualEvent, 'id'>) => {
    const newEvent: ContextualEvent = {
      ...event,
      id: `custom-${Date.now()}`
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const dismissEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const snoozeEvent = (eventId: string, duration: number) => {
    // In production, this would set a reminder for later
    setTimeout(() => {
      // Re-add the event after the snooze duration
    }, duration);
    dismissEvent(eventId);
  };

  useEffect(() => {
    if (userId) {
      fetchContextualData();
    }
  }, [userId]);

  // Refresh contextual data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (userId) {
        fetchContextualData();
      }
    }, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, [userId]);

  return {
    events,
    loading,
    error,
    addCustomEvent,
    dismissEvent,
    snoozeEvent,
    refetch: fetchContextualData
  };
}