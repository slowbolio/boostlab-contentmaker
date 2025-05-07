# Backend Integration Guide

This guide explains how to integrate the React frontend with the OpenRouter-powered backend.

## Overview

The backend implementation provides:
- Authentication with JWT tokens
- MongoDB for data persistence
- AI content generation with OpenRouter
- Project and template management
- Docker containerization

## Connection Setup

### Step 1: Enable the Real Backend

To switch from the mock services to the real backend, call the `enableRealBackend` function:

```javascript
import { enableRealBackend } from '@/lib/backend-integration';

// Call this at app initialization
enableRealBackend();
```

### Step 2: Configure Environment Variables

Create or update `.env` file with the following values:

```
VITE_API_URL=http://localhost:8000/api
VITE_OPENROUTER_API_KEY=your-openrouter-api-key
```

## Authentication

The backend provides JWT-based authentication. Your current JWT token is:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MWI2ZjYyMTRiOTc3NDBmOTIxM2MyNCIsImlhdCI6MTc0NjYyODQ1MCwiZXhwIjoxNzQ3MjMzMjUwfQ.7EwSNLFqZq8oT-u6UaNLKdBWqu7LlbLU0xdw28AXHu0
```

### Using the Authentication Context

Use the `BackendAuthProvider` to manage authentication:

```jsx
// In your application entry point
import { BackendAuthProvider } from '@/contexts/backend-auth-context';

function App() {
  return (
    <BackendAuthProvider>
      {/* Your app components */}
    </BackendAuthProvider>
  );
}
```

Access authentication in your components:

```jsx
import { useBackendAuth } from '@/contexts/backend-auth-context';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useBackendAuth();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      // Handle successful login
    } catch (error) {
      // Handle error
    }
  };
  
  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <form onSubmit={handleLogin}>
          {/* Login form fields */}
        </form>
      )}
    </div>
  );
}
```

## Using AI Generation

The backend provides access to multiple AI models through OpenRouter.

### Available Services

```javascript
import { 
  useGenerateContent, 
  useImproveContent,
  useShortenContent,
  useExpandContent,
  useAIModels 
} from '@/hooks/use-ai-service';

function ContentEditor() {
  const { data: models, isLoading: modelsLoading } = useAIModels();
  const generateContent = useGenerateContent();
  
  const handleGenerate = async () => {
    try {
      const result = await generateContent.mutateAsync({
        action: 'improve',
        content: 'Your content here...',
        platform: 'instagram',
        model: 'anthropic/claude-2' // Optional - specify a specific model
      });
      
      console.log(result.generatedContent);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <div>
      <select>
        {models?.map(model => (
          <option key={model.id} value={model.id}>
            {model.name} ({model.provider})
          </option>
        ))}
      </select>
      <button onClick={handleGenerate} disabled={generateContent.isLoading}>
        {generateContent.isLoading ? 'Generating...' : 'Generate Content'}
      </button>
    </div>
  );
}
```

## Project Management

Manage projects using React Query hooks:

```javascript
import { useBackendProjects, useBackendCreateProject } from '@/hooks/use-backend-projects';

function ProjectsList() {
  const { data: projectsData, isLoading } = useBackendProjects();
  const createProject = useBackendCreateProject();
  
  const handleCreateProject = async () => {
    try {
      await createProject.mutateAsync({
        title: 'New Project',
        description: 'Project description',
        content: 'Initial content',
        platform: 'instagram'
      });
      // Handle success
    } catch (error) {
      // Handle error
    }
  };
  
  if (isLoading) return <div>Loading projects...</div>;
  
  return (
    <div>
      <button onClick={handleCreateProject}>Create New Project</button>
      <ul>
        {projectsData?.data.map(project => (
          <li key={project.id}>{project.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Template Management

Access content templates:

```javascript
import { useBackendTemplates, useBackendMarkTemplateAsUsed } from '@/hooks/use-backend-templates';

function TemplatesList() {
  const { data: templates, isLoading } = useBackendTemplates({ platform: 'instagram' });
  const markAsUsed = useBackendMarkTemplateAsUsed();
  
  const handleUseTemplate = async (id) => {
    try {
      const result = await markAsUsed.mutateAsync(id);
      // Handle template usage
    } catch (error) {
      // Handle error
    }
  };
  
  if (isLoading) return <div>Loading templates...</div>;
  
  return (
    <div>
      <ul>
        {templates?.map(template => (
          <li key={template.id}>
            {template.title}
            <button onClick={() => handleUseTemplate(template.id)}>
              Use Template
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## API Testing

Test API endpoints with curl:

```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# Generate content with AI
curl -X POST http://localhost:8000/api/ai/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"action":"improve","content":"Content to improve","platform":"instagram"}'

# Get available AI models
curl -X GET http://localhost:8000/api/ai/models \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Migration Strategy

To migrate from the mock data to the real backend:

1. Call `enableRealBackend()` at application initialization
2. Replace any import from generic services with the backend-specific versions:
   - Use `useBackendProjects` instead of `useProjects`
   - Use `useBackendTemplates` instead of `useTemplates`
3. Add the `BackendAuthProvider` to your application
4. Configure the environment variables in `.env`

## Troubleshooting

If you encounter issues with the backend connection:

1. Check that the backend is running: `docker-compose ps`
2. Verify the API URL in your environment variables
3. Check that your JWT token is valid
4. Examine the backend logs: `docker-compose logs -f api`
5. Use the `checkBackendConnection()` utility to test connectivity