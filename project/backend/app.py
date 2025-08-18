from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from datetime import datetime, timedelta
import random

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Mock data for development
MOCK_PRODUCTS = [
    {
        "id": "1",
        "name": "Cozy Knit Sweater",
        "price": 89,
        "originalPrice": 120,
        "rating": 4.8,
        "reviews": 342,
        "image": "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=400",
        "category": "fashion",
        "tags": ["cozy", "winter", "casual"],
        "description": "Soft and comfortable knit sweater perfect for chilly weather"
    },
    {
        "id": "2",
        "name": "Smart Fitness Tracker",
        "price": 199,
        "rating": 4.6,
        "reviews": 1283,
        "image": "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400",
        "category": "electronics",
        "tags": ["fitness", "health", "smart"],
        "description": "Advanced fitness tracking with heart rate monitoring"
    },
    {
        "id": "3",
        "name": "Elegant Evening Dress",
        "price": 159,
        "originalPrice": 240,
        "rating": 4.9,
        "reviews": 156,
        "image": "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=400",
        "category": "fashion",
        "tags": ["elegant", "formal", "evening"],
        "description": "Sophisticated dress perfect for special occasions"
    }
]

MOCK_CONTEXTUAL_EVENTS = [
    {
        "id": "weather-cold",
        "type": "weather",
        "title": "Cold Weather Alert",
        "description": "Temperature dropping to 45°F. Time to prep with warm essentials!",
        "priority": "medium",
        "context": {
            "weather": "cold",
            "temperature": 45,
            "location": "Seattle, WA"
        },
        "suggestions": ["cozy", "winter", "warm"]
    },
    {
        "id": "birthday-sarah",
        "type": "birthday",
        "title": "Sarah's Birthday Tomorrow",
        "description": "Your friend Sarah's birthday is coming up!",
        "priority": "high",
        "context": {
            "person": "Sarah Johnson",
            "occasion": "Birthday"
        },
        "suggestions": ["gift", "birthday", "special"]
    }
]

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    })

@app.route('/api/ai/chat', methods=['POST'])
def ai_chat():
    """AI Chat endpoint for processing user messages"""
    try:
        data = request.get_json()
        message = data.get('message', '')
        context = data.get('context', {})
        user_id = data.get('userId')
        
        # Generate AI response based on message content
        response = generate_ai_response(message, context)
        
        # Log interaction (in production, save to database)
        if user_id:
            print(f"AI Interaction - User: {user_id}, Message: {message}")
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/products', methods=['GET'])
def get_products():
    """Get products with optional filtering"""
    try:
        category = request.args.get('category')
        search = request.args.get('search', '').lower()
        limit = int(request.args.get('limit', 20))
        
        products = MOCK_PRODUCTS.copy()
        
        # Filter by category
        if category:
            products = [p for p in products if p['category'] == category]
        
        # Filter by search query
        if search:
            products = [p for p in products if 
                       search in p['name'].lower() or 
                       search in p['description'].lower() or
                       any(search in tag.lower() for tag in p['tags'])]
        
        # Apply limit
        products = products[:limit]
        
        return jsonify({
            "products": products,
            "total": len(products),
            "filters_applied": {
                "category": category,
                "search": search,
                "limit": limit
            }
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/products/recommendations', methods=['POST'])
def get_recommendations():
    """Get personalized product recommendations"""
    try:
        data = request.get_json()
        user_id = data.get('userId')
        context = data.get('context', {})
        limit = data.get('limit', 6)
        
        # Generate contextual recommendations
        recommendations = generate_recommendations(context, limit)
        
        return jsonify({
            "recommendations": recommendations,
            "context": context,
            "generated_at": datetime.now().isoformat()
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/contextual/events', methods=['GET'])
def get_contextual_events():
    """Get contextual events for the user"""
    try:
        user_id = request.args.get('userId')
        
        # In production, this would fetch real contextual data
        events = MOCK_CONTEXTUAL_EVENTS.copy()
        
        # Add some dynamic elements
        for event in events:
            event['timestamp'] = datetime.now().isoformat()
            event['isActive'] = True
        
        return jsonify({
            "events": events,
            "user_id": user_id,
            "generated_at": datetime.now().isoformat()
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/shortlists', methods=['GET', 'POST'])
def handle_shortlists():
    """Handle shortlist operations"""
    try:
        if request.method == 'GET':
            user_id = request.args.get('userId')
            # Mock shortlists data
            shortlists = [
                {
                    "id": "1",
                    "name": "Weekend Outfits",
                    "description": "Casual looks for the weekend",
                    "items": [MOCK_PRODUCTS[0], MOCK_PRODUCTS[2]],
                    "collaborators": ["Sarah", "Mike"],
                    "isPublic": False,
                    "createdAt": datetime.now().isoformat()
                }
            ]
            return jsonify({"shortlists": shortlists})
        
        elif request.method == 'POST':
            data = request.get_json()
            # Create new shortlist
            new_shortlist = {
                "id": str(random.randint(1000, 9999)),
                "name": data.get('name'),
                "description": data.get('description', ''),
                "items": [],
                "collaborators": [],
                "isPublic": data.get('isPublic', False),
                "createdAt": datetime.now().isoformat()
            }
            return jsonify(new_shortlist), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/ar/experiences', methods=['GET'])
def get_ar_experiences():
    """Get AR try-on experiences"""
    try:
        category = request.args.get('category', 'glasses')
        
        ar_experiences = [
            {
                "id": "1",
                "name": "Ray-Ban Aviator Classic",
                "category": category,
                "price": 159,
                "originalPrice": 199,
                "rating": 4.8,
                "reviews": 2341,
                "image": "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=400",
                "compatibility": ["Phone", "Tablet", "Smart Mirror"],
                "description": "Classic aviator sunglasses with gold frame"
            }
        ]
        
        return jsonify({
            "experiences": ar_experiences,
            "category": category
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def generate_ai_response(message, context):
    """Generate AI response based on message and context"""
    message_lower = message.lower()
    
    # Weather-based responses
    if any(word in message_lower for word in ['cozy', 'winter', 'cold']):
        return {
            "text": "Perfect timing! With the chilly weather today, I found some cozy essentials that'll keep you warm and stylish. This chunky knit sweater has amazing reviews! 🤗",
            "type": "product",
            "suggestions": [
                "Show me matching accessories 🧣",
                "Find winter boots too 👢",
                "What about a warm coat? 🧥"
            ],
            "products": [MOCK_PRODUCTS[0]]
        }
    
    # Trending requests
    elif any(word in message_lower for word in ['trending', 'popular']):
        return {
            "text": "The hottest trends right now are absolutely amazing! I've curated the top trending items that match your vibe! 🔥",
            "type": "product",
            "suggestions": [
                "Show me sustainable fashion 🌱",
                "Find smart home deals 🏠",
                "Wellness products for me 💆‍♀️"
            ],
            "products": MOCK_PRODUCTS[:2]
        }
    
    # Gift suggestions
    elif any(word in message_lower for word in ['gift', 'present']):
        return {
            "text": "Gift hunting is my specialty! I have some incredible personalized gift ideas that'll make you the best gift-giver ever! 💝",
            "type": "suggestion",
            "suggestions": [
                "Show me personalized options 💝",
                "Gifts under $50 💰",
                "Luxury gift ideas ✨"
            ],
            "products": [MOCK_PRODUCTS[2]]
        }
    
    # Deal requests
    elif any(word in message_lower for word in ['deal', 'sale', 'discount']):
        return {
            "text": "You're in luck! I found some incredible flash deals just for you! Limited-time offers with free shipping! ⚡",
            "type": "deal",
            "suggestions": [
                "Show me all deals 💸",
                "Fashion deals only 👗",
                "Electronics on sale 📱"
            ],
            "products": [p for p in MOCK_PRODUCTS if p.get('originalPrice')]
        }
    
    # Default response
    else:
        return {
            "text": "Great question! I'm here to help you find exactly what you're looking for. Based on your preferences, here are some perfect matches! ✨",
            "type": "text",
            "suggestions": [
                "Show me trending items 🔥",
                "Find deals for me 💰",
                "Surprise me! ✨"
            ],
            "products": MOCK_PRODUCTS[:3]
        }

def generate_recommendations(context, limit):
    """Generate product recommendations based on context"""
    recommendations = []
    
    # Weather-based recommendations
    if context.get('weather') == 'cold' or context.get('temperature', 70) < 50:
        recommendations.extend([p for p in MOCK_PRODUCTS if 'cozy' in p['tags'] or 'winter' in p['tags']])
    
    # Default recommendations
    if len(recommendations) < limit:
        recommendations.extend(MOCK_PRODUCTS)
    
    # Add AI reasoning
    for rec in recommendations:
        rec['aiReason'] = generate_ai_reason(rec, context)
        rec['relevanceScore'] = random.uniform(0.8, 0.99)
    
    return recommendations[:limit]

def generate_ai_reason(product, context):
    """Generate AI reasoning for product recommendations"""
    reasons = [
        f"Perfect match for your {product['category']} preferences",
        f"Highly rated ({product['rating']} stars) by similar users",
        f"Trending in your area with {product['reviews']} positive reviews",
        f"Great value with excellent quality-to-price ratio"
    ]
    
    if context.get('weather') == 'cold' and 'cozy' in product['tags']:
        return "Perfect for today's chilly weather. Matches your preference for comfortable styles."
    
    return random.choice(reasons)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)