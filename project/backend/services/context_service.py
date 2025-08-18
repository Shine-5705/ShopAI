import requests
from datetime import datetime, timedelta
from typing import Dict, List, Optional

class ContextService:
    """Service for gathering and analyzing contextual information"""
    
    @staticmethod
    def get_weather_context(location: str = "Seattle, WA") -> Dict:
        """Get weather context for location (mock implementation)"""
        # In production, this would call a real weather API
        mock_weather = {
            "location": location,
            "temperature": 45,
            "condition": "cloudy",
            "humidity": 65,
            "wind_speed": 8,
            "forecast": "Partly cloudy with chance of rain",
            "feels_like": 42,
            "updated_at": datetime.now().isoformat()
        }
        
        return mock_weather
    
    @staticmethod
    def get_calendar_context(user_id: str) -> List[Dict]:
        """Get upcoming calendar events (mock implementation)"""
        # In production, this would integrate with calendar APIs
        mock_events = [
            {
                "id": "cal_1",
                "title": "Dinner with Sarah",
                "date": (datetime.now() + timedelta(days=1)).isoformat(),
                "type": "social",
                "location": "Downtown Restaurant",
                "attendees": ["Sarah Johnson"]
            },
            {
                "id": "cal_2",
                "title": "Team Meeting",
                "date": (datetime.now() + timedelta(days=2)).isoformat(),
                "type": "work",
                "location": "Office",
                "attendees": ["Team Members"]
            },
            {
                "id": "cal_3",
                "title": "Weekend Hiking",
                "date": (datetime.now() + timedelta(days=5)).isoformat(),
                "type": "recreation",
                "location": "Mountain Trail",
                "attendees": ["Hiking Group"]
            }
        ]
        
        return mock_events
    
    @staticmethod
    def get_location_context(user_id: str) -> Dict:
        """Get user location context"""
        # Mock location data
        return {
            "city": "Seattle",
            "state": "WA",
            "country": "USA",
            "timezone": "America/Los_Angeles",
            "local_time": datetime.now().isoformat(),
            "nearby_stores": [
                {"name": "Fashion District", "distance": "0.5 miles"},
                {"name": "Tech Hub Mall", "distance": "1.2 miles"},
                {"name": "Outdoor Gear Co", "distance": "2.1 miles"}
            ]
        }
    
    @staticmethod
    def analyze_shopping_context(user_id: str) -> Dict:
        """Analyze comprehensive shopping context"""
        weather = ContextService.get_weather_context()
        calendar = ContextService.get_calendar_context(user_id)
        location = ContextService.get_location_context(user_id)
        
        # Analyze context for shopping recommendations
        context_insights = {
            "weather_influence": ContextService._analyze_weather_influence(weather),
            "upcoming_events": ContextService._analyze_calendar_events(calendar),
            "location_opportunities": ContextService._analyze_location_opportunities(location),
            "shopping_urgency": ContextService._calculate_shopping_urgency(calendar, weather),
            "recommended_categories": ContextService._recommend_categories(weather, calendar)
        }
        
        return {
            "weather": weather,
            "calendar": calendar,
            "location": location,
            "insights": context_insights,
            "generated_at": datetime.now().isoformat()
        }
    
    @staticmethod
    def _analyze_weather_influence(weather: Dict) -> Dict:
        """Analyze how weather affects shopping needs"""
        temp = weather.get('temperature', 70)
        condition = weather.get('condition', 'clear')
        
        influence = {
            "temperature_category": "cold" if temp < 50 else "warm" if temp > 75 else "mild",
            "clothing_suggestions": [],
            "activity_impact": ""
        }
        
        if temp < 50:
            influence["clothing_suggestions"] = ["cozy sweaters", "warm coats", "boots"]
            influence["activity_impact"] = "Indoor activities preferred, warm clothing needed"
        elif temp > 75:
            influence["clothing_suggestions"] = ["light fabrics", "shorts", "sandals"]
            influence["activity_impact"] = "Outdoor activities ideal, breathable clothing recommended"
        else:
            influence["clothing_suggestions"] = ["layers", "light jacket", "versatile pieces"]
            influence["activity_impact"] = "Perfect for any activity, layering recommended"
        
        return influence
    
    @staticmethod
    def _analyze_calendar_events(calendar: List[Dict]) -> Dict:
        """Analyze upcoming events for shopping opportunities"""
        event_types = {}
        upcoming_needs = []
        
        for event in calendar:
            event_type = event.get('type', 'general')
            event_types[event_type] = event_types.get(event_type, 0) + 1
            
            # Suggest items based on event type
            if event_type == 'social':
                upcoming_needs.append({
                    "event": event['title'],
                    "suggestions": ["elegant dress", "nice shoes", "accessories"],
                    "urgency": "high" if event['date'] < (datetime.now() + timedelta(days=2)).isoformat() else "medium"
                })
            elif event_type == 'work':
                upcoming_needs.append({
                    "event": event['title'],
                    "suggestions": ["professional attire", "laptop accessories", "office supplies"],
                    "urgency": "medium"
                })
            elif event_type == 'recreation':
                upcoming_needs.append({
                    "event": event['title'],
                    "suggestions": ["outdoor gear", "comfortable shoes", "weather protection"],
                    "urgency": "low"
                })
        
        return {
            "event_distribution": event_types,
            "shopping_opportunities": upcoming_needs,
            "total_events": len(calendar)
        }
    
    @staticmethod
    def _analyze_location_opportunities(location: Dict) -> Dict:
        """Analyze location-based shopping opportunities"""
        return {
            "local_shopping": location.get('nearby_stores', []),
            "regional_preferences": ContextService._get_regional_preferences(location.get('city')),
            "delivery_options": ["same-day", "next-day", "standard"],
            "local_events": ["Fashion Week", "Tech Conference", "Outdoor Festival"]
        }
    
    @staticmethod
    def _get_regional_preferences(city: str) -> List[str]:
        """Get regional shopping preferences"""
        regional_prefs = {
            "Seattle": ["outdoor gear", "coffee accessories", "tech gadgets", "rain gear"],
            "Los Angeles": ["fashion", "beauty", "fitness gear", "sunglasses"],
            "New York": ["professional wear", "fashion", "home decor", "accessories"],
            "Miami": ["swimwear", "light clothing", "beach accessories", "party wear"]
        }
        
        return regional_prefs.get(city, ["general merchandise"])
    
    @staticmethod
    def _calculate_shopping_urgency(calendar: List[Dict], weather: Dict) -> str:
        """Calculate overall shopping urgency"""
        urgent_events = [e for e in calendar if e['date'] < (datetime.now() + timedelta(days=2)).isoformat()]
        temp = weather.get('temperature', 70)
        
        if urgent_events and (temp < 40 or temp > 85):
            return "high"
        elif urgent_events or temp < 50 or temp > 80:
            return "medium"
        else:
            return "low"
    
    @staticmethod
    def _recommend_categories(weather: Dict, calendar: List[Dict]) -> List[str]:
        """Recommend shopping categories based on context"""
        categories = []
        temp = weather.get('temperature', 70)
        
        # Weather-based categories
        if temp < 50:
            categories.extend(["fashion", "outerwear", "accessories"])
        elif temp > 75:
            categories.extend(["summer wear", "outdoor gear", "cooling accessories"])
        
        # Event-based categories
        event_types = [e.get('type') for e in calendar]
        if 'social' in event_types:
            categories.append("formal wear")
        if 'work' in event_types:
            categories.append("professional")
        if 'recreation' in event_types:
            categories.append("outdoor")
        
        return list(set(categories))  # Remove duplicates