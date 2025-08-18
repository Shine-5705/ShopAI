# AI Shopping Assistant Backend

Flask-based backend API for the AI Shopping Assistant platform.

## Features

- **AI Chat API**: Intelligent conversation handling with context awareness
- **Product Recommendations**: Personalized product suggestions based on user context
- **Contextual Events**: Weather, calendar, and location-based shopping triggers
- **Shortlist Management**: Collaborative shopping lists with voting and comments
- **AR Integration**: Augmented reality try-on experiences

## Setup

### Prerequisites

- Python 3.8+
- pip (Python package manager)

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

### Running the Server

#### Development Mode
```bash
python app.py
```

#### Production Mode
```bash
FLASK_ENV=production python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### AI Chat
- `POST /api/ai/chat` - Send message to AI assistant

### Products
- `GET /api/products` - Get products with filtering
- `POST /api/products/recommendations` - Get personalized recommendations

### Contextual Events
- `GET /api/contextual/events` - Get contextual shopping events

### Shortlists
- `GET /api/shortlists` - Get user shortlists
- `POST /api/shortlists` - Create new shortlist

### AR Experiences
- `GET /api/ar/experiences` - Get AR try-on experiences

## Architecture

### Services
- **AIService**: Handles AI response generation and intent analysis
- **ContextService**: Manages contextual data (weather, calendar, location)

### Models
- **Product**: Product catalog management
- **AIInteraction**: Chat interaction logging
- **Shortlist**: Shopping list management
- **ContextualEvent**: Event-driven shopping triggers

## Development

### Adding New Endpoints

1. Add route to `app.py`
2. Implement business logic in appropriate service
3. Add corresponding model if needed
4. Update API client in frontend

### Testing

```bash
# Run with debug mode
FLASK_DEBUG=True python app.py

# Test endpoints
curl http://localhost:5000/api/health
```

## Deployment

### Environment Variables

- `FLASK_ENV`: Environment (development/production)
- `PORT`: Server port (default: 5000)
- `SECRET_KEY`: Flask secret key

### Production Considerations

- Use a production WSGI server (gunicorn, uWSGI)
- Set up proper logging
- Configure database connections
- Implement authentication middleware
- Add rate limiting
- Set up monitoring and health checks

## Integration with Frontend

The backend is designed to work seamlessly with the React frontend. The frontend uses the API client (`src/lib/api.ts`) to communicate with these endpoints.

### CORS Configuration

CORS is enabled for all origins in development. For production, configure specific allowed origins in the Flask-CORS settings.