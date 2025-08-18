import random
from typing import Dict, List
from datetime import datetime

class AIService:
    """AI service for generating responses and recommendations"""
    
    @staticmethod
    def generate_chat_response(message: str, context: Dict = None) -> Dict:
        """Generate AI chat response based on message and context"""
        message_lower = message.lower()
        context = context or {}
        
        # Analyze message intent
        intent = AIService._analyze_intent(message_lower)
        
        # Generate response based on intent
        if intent == 'weather_shopping':
            return AIService._generate_weather_response(context)
        elif intent == 'trending':
            return AIService._generate_trending_response()
        elif intent == 'gifts':
            return AIService._generate_gift_response()
        elif intent == 'deals':
            return AIService._generate_deals_response()
        elif intent == 'ar_tryons':
            return AIService._generate_ar_response()
        else:
            return AIService._generate_default_response()
    
    @staticmethod
    def _analyze_intent(message: str) -> str:
        """Analyze user message to determine intent"""
        weather_keywords = ['cozy', 'winter', 'cold', 'warm', 'weather']
        trending_keywords = ['trending', 'popular', 'hot', 'latest']
        gift_keywords = ['gift', 'present', 'birthday', 'anniversary']
        deal_keywords = ['deal', 'sale', 'discount', 'cheap', 'bargain']
        ar_keywords = ['ar', 'try on', 'virtual', 'augmented']
        
        if any(keyword in message for keyword in weather_keywords):
            return 'weather_shopping'
        elif any(keyword in message for keyword in trending_keywords):
            return 'trending'
        elif any(keyword in message for keyword in gift_keywords):
            return 'gifts'
        elif any(keyword in message for keyword in deal_keywords):
            return 'deals'
        elif any(keyword in message for keyword in ar_keywords):
            return 'ar_tryons'
        else:
            return 'general'
    
    @staticmethod
    def _generate_weather_response(context: Dict) -> Dict:
        """Generate weather-based shopping response"""
        temperature = context.get('temperature', 70)
        
        if temperature < 50:
            text = f"Brrr! With the temperature at {temperature}°F, you'll want to stay cozy! I found some perfect warm essentials that'll keep you comfortable and stylish. ❄️"
            suggestions = [
                "Show me cozy sweaters 🧥",
                "Find warm accessories 🧣",
                "Winter boots please 👢"
            ]
        else:
            text = f"Perfect weather at {temperature}°F! Great time for lighter, breathable fabrics and outdoor activities. ☀️"
            suggestions = [
                "Show me summer styles 👕",
                "Find outdoor gear 🏃‍♀️",
                "Light accessories 🕶️"
            ]
        
        return {
            "text": text,
            "type": "contextual",
            "suggestions": suggestions,
            "context_used": ["weather", "temperature"],
            "confidence": 0.95
        }
    
    @staticmethod
    def _generate_trending_response() -> Dict:
        """Generate trending items response"""
        return {
            "text": "The hottest trends right now are absolutely incredible! I've curated the most popular items that everyone's talking about. These are flying off the shelves! 🔥",
            "type": "trending",
            "suggestions": [
                "Show sustainable fashion 🌱",
                "Tech gadgets trending 📱",
                "Home decor trends 🏠"
            ],
            "confidence": 0.92
        }
    
    @staticmethod
    def _generate_gift_response() -> Dict:
        """Generate gift recommendation response"""
        return {
            "text": "Gift hunting is my specialty! I love helping find the perfect present that'll make someone's day. Tell me about the person and I'll find something amazing! 🎁",
            "type": "gifts",
            "suggestions": [
                "Gifts for her 💝",
                "Gifts for him 🎯",
                "Unique gift ideas ✨"
            ],
            "confidence": 0.88
        }
    
    @staticmethod
    def _generate_deals_response() -> Dict:
        """Generate deals and discounts response"""
        return {
            "text": "You're in luck! I found some incredible deals with savings up to 60% off! These flash sales won't last long, so grab them while you can! 💸",
            "type": "deals",
            "suggestions": [
                "Show all deals 🏷️",
                "Fashion discounts 👗",
                "Electronics sales 📱"
            ],
            "confidence": 0.94
        }
    
    @staticmethod
    def _generate_ar_response() -> Dict:
        """Generate AR try-on response"""
        return {
            "text": "AR try-ons are amazing! You can see exactly how products look on you before buying. No more guessing - just perfect fits every time! 📱✨",
            "type": "ar",
            "suggestions": [
                "Try on glasses 👓",
                "Virtual clothing 👕",
                "Makeup try-on 💄"
            ],
            "confidence": 0.90
        }
    
    @staticmethod
    def _generate_default_response() -> Dict:
        """Generate default response"""
        responses = [
            "I'm here to help you find exactly what you're looking for! What can I help you discover today? ✨",
            "Great question! I have access to millions of products and can help you find the perfect match. What's on your mind? 🛍️",
            "I love helping with shopping decisions! Whether you need something specific or want to browse, I'm here to assist. 💫"
        ]
        
        return {
            "text": random.choice(responses),
            "type": "general",
            "suggestions": [
                "Show me trending items 📈",
                "Find deals for me 💰",
                "Help me with AR try-ons 📱",
                "Surprise me! ✨"
            ],
            "confidence": 0.85
        }
    
    @staticmethod
    def generate_product_recommendations(context: Dict, limit: int = 6) -> List[Dict]:
        """Generate personalized product recommendations"""
        recommendations = []
        
        # Mock recommendation logic - in production, this would use ML models
        base_products = [
            {
                "id": "rec_1",
                "name": "AI Recommended Sweater",
                "price": 89,
                "category": "fashion",
                "rating": 4.8,
                "aiReason": "Perfect for your style preferences and current weather",
                "relevanceScore": 0.95
            },
            {
                "id": "rec_2", 
                "name": "Smart Fitness Tracker",
                "price": 199,
                "category": "electronics",
                "rating": 4.6,
                "aiReason": "Matches your health and fitness goals",
                "relevanceScore": 0.88
            }
        ]
        
        # Customize based on context
        weather = context.get('weather')
        if weather == 'cold':
            for product in base_products:
                if product['category'] == 'fashion':
                    product['aiReason'] = f"Perfect for cold weather. {product['aiReason']}"
                    product['relevanceScore'] += 0.05
        
        return base_products[:limit]
    
    @staticmethod
    def analyze_user_preferences(interactions: List[Dict]) -> Dict:
        """Analyze user preferences from interaction history"""
        categories = {}
        keywords = {}
        
        for interaction in interactions:
            message = interaction.get('message', '').lower()
            
            # Count category mentions
            if 'fashion' in message or 'clothes' in message:
                categories['fashion'] = categories.get('fashion', 0) + 1
            if 'electronics' in message or 'tech' in message:
                categories['electronics'] = categories.get('electronics', 0) + 1
            
            # Extract keywords
            words = message.split()
            for word in words:
                if len(word) > 3:  # Only meaningful words
                    keywords[word] = keywords.get(word, 0) + 1
        
        return {
            'preferred_categories': categories,
            'frequent_keywords': keywords,
            'analysis_date': datetime.now().isoformat()
        }