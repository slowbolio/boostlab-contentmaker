const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const port = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || 'boostlabsecret2025';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://boostlab:boostlabpass@localhost:27017/boostlab-content?authSource=admin';

// Enable middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Authentication token required' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Database connection
let db;
async function connectToMongo() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db();
    
    // Create collections if they don't exist
    await db.createCollection('users');
    await db.createCollection('projects');
    await db.createCollection('templates');
    await db.createCollection('contentItems');
    
    // Create indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('projects').createIndex({ userId: 1 });
    await db.collection('templates').createIndex({ platform: 1 });
    
    // Add default user if none exists
    const usersCount = await db.collection('users').countDocuments();
    if (usersCount === 0) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await db.collection('users').insertOne({
        email: 'demo@boostlab.com',
        password: hashedPassword,
        name: 'Demo User',
        role: 'admin',
        createdAt: new Date()
      });
      console.log('Created demo user');
    }
    
    // Add default templates if none exist
    const templatesCount = await db.collection('templates').countDocuments();
    if (templatesCount === 0) {
      const templates = [
        {
          title: 'Instagram Produkt Highlight',
          description: 'Perfekt för att presentera en ny produkt',
          platform: 'instagram',
          content: 'Upptäck vår nya [produkt]! Den hjälper dig att [fördel 1], [fördel 2] och [fördel 3]. Tillgänglig nu för endast [pris]. #[bransch] #[produkttyp]',
          usageCount: 0,
          createdAt: new Date()
        },
        {
          title: 'LinkedIn Företagsuppdatering',
          description: 'Professionell uppdatering om ditt företag',
          platform: 'linkedin',
          content: 'Vi är stolta över att tillkännage [nyhet]! Detta är ett viktigt steg för [företagsnamn] eftersom det [fördel/resultat]. Läs mer på vår hemsida: [länk]',
          usageCount: 0,
          createdAt: new Date()
        },
        {
          title: 'Facebook Event Inbjudan',
          description: 'Engagera följare för ett kommande event',
          platform: 'facebook',
          content: 'Missa inte vårt kommande event: [eventnamn]! När: [datum och tid]. Var: [plats]. Vi kommer att [aktivitet/tema]. Anmäl dig nu: [länk] #[eventhashtag]',
          usageCount: 0,
          createdAt: new Date()
        }
      ];
      
      await db.collection('templates').insertMany(templates);
      console.log('Created default templates');
    }
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// AUTH ROUTES
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      name,
      role: 'user',
      createdAt: new Date()
    });
    
    const token = jwt.sign(
      { id: result.insertedId, email, role: 'user' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      token,
      user: {
        id: result.insertedId,
        email,
        name,
        role: 'user'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/user', authenticateToken, async (req, res) => {
  try {
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(req.user.id) },
      { projection: { password: 0 } }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PROJECT ROUTES
app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    const { platform, status } = req.query;
    const query = { userId: req.user.id };
    
    if (platform) query.platform = platform;
    if (status) query.status = status;
    
    const projects = await db.collection('projects')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json({ 
      success: true,
      data: projects.map(project => ({
        id: project._id,
        title: project.title,
        description: project.description,
        content: project.content,
        platform: project.platform,
        status: project.status,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
      }))
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/projects', authenticateToken, async (req, res) => {
  try {
    const { title, description, content, platform } = req.body;
    
    const result = await db.collection('projects').insertOne({
      title,
      description,
      content,
      platform,
      status: 'draft',
      userId: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    res.status(201).json({
      success: true,
      data: {
        id: result.insertedId,
        title,
        description,
        content,
        platform,
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const project = await db.collection('projects').findOne({
      _id: new ObjectId(req.params.id),
      userId: req.user.id
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json({
      success: true,
      data: {
        id: project._id,
        title: project.title,
        description: project.description,
        content: project.content,
        platform: project.platform,
        status: project.status,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
      }
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, content, platform, status } = req.body;
    
    const project = await db.collection('projects').findOne({
      _id: new ObjectId(req.params.id),
      userId: req.user.id
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const result = await db.collection('projects').updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          ...(title && { title }),
          ...(description && { description }),
          ...(content && { content }),
          ...(platform && { platform }),
          ...(status && { status }),
          updatedAt: new Date()
        }
      }
    );
    
    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: 'No changes made to project' });
    }
    
    const updatedProject = await db.collection('projects').findOne({
      _id: new ObjectId(req.params.id)
    });
    
    res.json({
      success: true,
      data: {
        id: updatedProject._id,
        title: updatedProject.title,
        description: updatedProject.description,
        content: updatedProject.content,
        platform: updatedProject.platform,
        status: updatedProject.status,
        createdAt: updatedProject.createdAt,
        updatedAt: updatedProject.updatedAt
      }
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const project = await db.collection('projects').findOne({
      _id: new ObjectId(req.params.id),
      userId: req.user.id
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    await db.collection('projects').deleteOne({ _id: new ObjectId(req.params.id) });
    
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// TEMPLATE ROUTES
app.get('/api/templates', authenticateToken, async (req, res) => {
  try {
    const { platform } = req.query;
    const query = platform ? { platform } : {};
    
    const templates = await db.collection('templates')
      .find(query)
      .sort({ usageCount: -1, createdAt: -1 })
      .toArray();
    
    res.json(templates.map(template => ({
      id: template._id,
      title: template.title,
      description: template.description,
      platform: template.platform,
      content: template.content,
      usageCount: template.usageCount,
      createdAt: template.createdAt
    })));
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/templates/:id/use', authenticateToken, async (req, res) => {
  try {
    const template = await db.collection('templates').findOne({
      _id: new ObjectId(req.params.id)
    });
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    await db.collection('templates').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $inc: { usageCount: 1 } }
    );
    
    const updatedTemplate = await db.collection('templates').findOne({
      _id: new ObjectId(req.params.id)
    });
    
    res.json({
      id: updatedTemplate._id,
      title: updatedTemplate.title,
      description: updatedTemplate.description,
      platform: updatedTemplate.platform,
      content: updatedTemplate.content,
      usageCount: updatedTemplate.usageCount,
      createdAt: updatedTemplate.createdAt
    });
  } catch (error) {
    console.error('Use template error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// AI ROUTES
app.get('/api/ai/models', authenticateToken, async (req, res) => {
  try {
    const models = [
      {
        id: 'openai/gpt-4',
        name: 'GPT-4',
        provider: 'OpenAI',
        maxTokens: 8192,
        capabilities: ['text', 'marketing', 'social media']
      },
      {
        id: 'anthropic/claude-2',
        name: 'Claude 2',
        provider: 'Anthropic',
        maxTokens: 100000,
        capabilities: ['text', 'marketing', 'social media', 'long-form']
      },
      {
        id: 'meta/llama-2-70b',
        name: 'Llama 2 70B',
        provider: 'Meta',
        maxTokens: 4096,
        capabilities: ['text', 'marketing']
      }
    ];
    
    res.json(models);
  } catch (error) {
    console.error('Get AI models error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/ai/generate', authenticateToken, async (req, res) => {
  try {
    const { action, content, platform, tone, audience, model } = req.body;
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let generatedContent = '';
    const currentDate = new Date().toLocaleDateString();
    
    switch (action) {
      case 'generate':
        generatedContent = `Här är ditt nya innehåll för ${platform || 'sociala medier'} (genererat ${currentDate}):\n\n${content || 'Skapa fantastiskt innehåll med BoostLab! Vår AI hjälper dig att skapa engagerande inlägg på minuter. Prova idag!'}\n\nGenererat med: ${model || 'anthropic/claude-2'}`;
        break;
      case 'improve':
        generatedContent = `Förbättrad version för ${platform || 'sociala medier'} (genererat ${currentDate}):\n\n${content ? content + ' Detta innehåll har förbättrats för ökat engagemang och tydlighet. Det fokuserar på fördelarna med din produkt/tjänst och har en tydlig uppmaning till åtgärd. Perfekt för att öka interaktionen med din målgrupp!' : 'Vi har förbättrat ditt innehåll för att öka engagemang och konverteringar. Prova BoostLab idag!'}\n\nGenererat med: ${model || 'anthropic/claude-2'}`;
        break;
      case 'shorten':
        generatedContent = `Kortare version för ${platform || 'sociala medier'} (genererat ${currentDate}):\n\n${content ? content.split(' ').slice(0, 15).join(' ') + '... Läs mer på vår webbplats!' : 'Kortare version av ditt innehåll. Perfekt för sociala medier!'}\n\nGenererat med: ${model || 'anthropic/claude-2'}`;
        break;
      case 'expand':
        generatedContent = `Utökad version för ${platform || 'sociala medier'} (genererat ${currentDate}):\n\n${content ? content + '\n\nDetta är en utökad version av ditt ursprungliga innehåll. Vi har lagt till mer detaljer, förklaringar och sammanhang för att göra det mer informativt och värdefullt för din målgrupp. Detta hjälper till att etablera din expertis och auktoritet inom ditt område.\n\nDet utökade innehållet är särskilt användbart för plattformar som tillåter längre inlägg, som bloggar, LinkedIn artiklar eller utförliga Facebook-inlägg. Kom ihåg att inkludera relevant medieinnehåll som bilder eller videor för att förstärka budskapet ytterligare.' : 'Utökad version av ditt innehåll med mer detaljer och kontext!'}\n\nGenererat med: ${model || 'anthropic/claude-2'}`;
        break;
      case 'headlines':
        generatedContent = `Rubriker för ${platform || 'sociala medier'} (genererat ${currentDate}):\n\n1. "Revolutionera din innehållsstrategi med BoostLab!"\n2. "Skapa engagerande innehåll på minuter, inte timmar"\n3. "5 sätt BoostLab förbättrar din sociala medienärvaro"\n4. "Nå din målgrupp effektivare med AI-driven innehållsoptimering"\n5. "Öka konverteringar med intelligent innehållsskapande"\n\nGenererat med: ${model || 'anthropic/claude-2'}`;
        break;
      default:
        generatedContent = `Innehåll för ${platform || 'sociala medier'} (genererat ${currentDate}):\n\nSkapa fantastiskt innehåll med BoostLab! Vår AI hjälper dig att skapa engagerande inlägg på minuter. Prova idag!\n\nGenererat med: ${model || 'anthropic/claude-2'}`;
    }
    
    // Record this generation in the user's history
    await db.collection('contentItems').insertOne({
      userId: req.user.id,
      action,
      originalContent: content,
      generatedContent,
      platform,
      tone,
      audience,
      model,
      createdAt: new Date()
    });
    
    // Wait a bit to simulate processing
    setTimeout(() => {
      res.json({
        success: true,
        generatedContent,
        model: model || 'anthropic/claude-2',
        platform,
        tone,
        audience
      });
    }, 1000);
  } catch (error) {
    console.error('Generate content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ANALYTICS ROUTES
app.get('/api/analytics/overview', authenticateToken, async (req, res) => {
  try {
    const { timeRange = '30' } = req.query; // 7, 14, 30 days
    const days = parseInt(timeRange);
    
    // Get user's content items count
    const contentCount = await db.collection('contentItems').countDocuments({
      userId: req.user.id
    });
    
    // Get user's projects count
    const projectsCount = await db.collection('projects').countDocuments({
      userId: req.user.id
    });
    
    // Generate analytics data
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const analyticsData = [];
    for (let i = 0; i <= days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      // Generate some randomized but trending data
      const trend = 1 + ((days - (days - i)) * 0.01);
      const viewsBase = Math.floor(Math.random() * 50) + 100;
      const engagementBase = Math.floor(Math.random() * 30) + 40;
      const conversionBase = Math.floor(Math.random() * 10) + 5;
      
      analyticsData.push({
        date: dateString,
        views: Math.floor(viewsBase * trend),
        engagement: Math.floor(engagementBase * trend),
        conversions: Math.floor(conversionBase * trend)
      });
    }
    
    res.json({
      success: true,
      data: {
        totalContent: contentCount,
        activeProjects: projectsCount,
        abTests: Math.floor(projectsCount / 3), // Mock data for A/B tests
        aiCredits: 850, // Mock data for AI credits
        aiCreditsUsed: 45, // Percentage used
        performanceData: analyticsData
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/analytics/recent-activity', authenticateToken, async (req, res) => {
  try {
    const recentContentItems = await db.collection('contentItems')
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
    
    const recentProjects = await db.collection('projects')
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
    
    // Combine and sort by date
    const allActivities = [
      ...recentContentItems.map(item => ({
        type: 'content',
        action: item.action,
        platform: item.platform,
        date: item.createdAt
      })),
      ...recentProjects.map(project => ({
        type: 'project',
        title: project.title,
        platform: project.platform,
        status: project.status,
        date: project.createdAt
      }))
    ].sort((a, b) => b.date - a.date).slice(0, 5);
    
    res.json({
      success: true,
      data: allActivities
    });
  } catch (error) {
    console.error('Get recent activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
connectToMongo().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});