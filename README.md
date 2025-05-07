# Content AI Platform

A React-based content creation platform with AI capabilities.

## Features

- AI-powered content generation
- Content enhancement with AI
- Project management
- Templates for various platforms
- A/B testing
- Analytics

## Backend Integration

This project can now be integrated with the custom backend implementation using:

- Express.js
- MongoDB
- JWT Authentication
- OpenRouter AI integration

## Setup Instructions

### Frontend Development

1. Install dependencies
```bash
npm install
```

2. Start the development server
```bash
npm run dev
```

3. Build for production
```bash
npm run build
```

### Backend Integration

The app supports two authentication modes:

1. **Mock Mode (Development)**: Uses simulated authentication and mock data
2. **Backend Mode (Production)**: Uses the actual backend with MongoDB and OpenRouter

#### Switching to Backend Mode

In your frontend code, you can enable the real backend mode:

```javascript
import { enableRealBackend } from './services/backend-auth-service';

// Call this function to switch to using the real backend
enableRealBackend();
```

#### Environment Variables

Create or update your `.env` file with:

```
VITE_API_URL=http://localhost:8000/api
VITE_OPENROUTER_API_KEY=your-openrouter-api-key
```

## Backend Setup

To use the custom backend:

1. Navigate to the backend directory:
```bash
cd ../backend-implementation
```

2. Set up environment variables in `.env`:
```
PORT=8000
MONGODB_URI=mongodb://mongodb:27017/content-ai
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d
AI_API_KEY=your-openrouter-api-key
```

3. Start the backend with Docker:
```bash
docker-compose up -d
```

See the `FRONTEND_INTEGRATION.md` file in the backend directory for detailed integration instructions.