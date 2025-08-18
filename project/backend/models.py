from datetime import datetime
from typing import List, Dict, Optional

class Product:
    """Product model"""
    def __init__(self, id: str, name: str, price: float, category: str, 
                 description: str = "", image: str = "", rating: float = 0.0,
                 reviews: int = 0, tags: List[str] = None, original_price: float = None):
        self.id = id
        self.name = name
        self.price = price
        self.original_price = original_price
        self.category = category
        self.description = description
        self.image = image
        self.rating = rating
        self.reviews = reviews
        self.tags = tags or []
        self.created_at = datetime.now()

    def to_dict(self) -> Dict:
        """Convert product to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'originalPrice': self.original_price,
            'category': self.category,
            'description': self.description,
            'image': self.image,
            'rating': self.rating,
            'reviews': self.reviews,
            'tags': self.tags,
            'createdAt': self.created_at.isoformat()
        }

class AIInteraction:
    """AI interaction model"""
    def __init__(self, user_id: str, message: str, response: Dict, 
                 context: Dict = None, interaction_type: str = "chat"):
        self.id = f"ai_{datetime.now().timestamp()}"
        self.user_id = user_id
        self.message = message
        self.response = response
        self.context = context or {}
        self.interaction_type = interaction_type
        self.timestamp = datetime.now()

    def to_dict(self) -> Dict:
        """Convert interaction to dictionary"""
        return {
            'id': self.id,
            'userId': self.user_id,
            'message': self.message,
            'response': self.response,
            'context': self.context,
            'type': self.interaction_type,
            'timestamp': self.timestamp.isoformat()
        }

class Shortlist:
    """Shortlist model"""
    def __init__(self, user_id: str, name: str, description: str = "",
                 is_public: bool = False, collaborators: List[str] = None):
        self.id = f"shortlist_{datetime.now().timestamp()}"
        self.user_id = user_id
        self.name = name
        self.description = description
        self.is_public = is_public
        self.collaborators = collaborators or []
        self.items = []
        self.created_at = datetime.now()
        self.updated_at = datetime.now()

    def add_item(self, product: Product):
        """Add product to shortlist"""
        self.items.append(product)
        self.updated_at = datetime.now()

    def to_dict(self) -> Dict:
        """Convert shortlist to dictionary"""
        return {
            'id': self.id,
            'userId': self.user_id,
            'name': self.name,
            'description': self.description,
            'isPublic': self.is_public,
            'collaborators': self.collaborators,
            'items': [item.to_dict() for item in self.items],
            'createdAt': self.created_at.isoformat(),
            'updatedAt': self.updated_at.isoformat()
        }

class ContextualEvent:
    """Contextual event model"""
    def __init__(self, event_type: str, title: str, description: str,
                 priority: str = "medium", context: Dict = None):
        self.id = f"event_{datetime.now().timestamp()}"
        self.type = event_type
        self.title = title
        self.description = description
        self.priority = priority
        self.context = context or {}
        self.timestamp = datetime.now()
        self.is_active = True

    def to_dict(self) -> Dict:
        """Convert event to dictionary"""
        return {
            'id': self.id,
            'type': self.type,
            'title': self.title,
            'description': self.description,
            'priority': self.priority,
            'context': self.context,
            'timestamp': self.timestamp.isoformat(),
            'isActive': self.is_active
        }