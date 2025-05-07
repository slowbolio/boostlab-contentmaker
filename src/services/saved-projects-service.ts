// Service för att hantera sparade projekt
import { nanoid } from 'nanoid';

export interface SavedProject {
  id: string;
  title: string;
  description?: string;
  content: string;
  htmlContent?: string;
  platform?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'archived';
  author: {
    id: string;
    name: string;
  };
}

// Mock-data för utveckling
const mockProjects: SavedProject[] = [
  {
    id: '1',
    title: 'Produktlansering Instagram',
    description: 'Innehåll för lanseringen av vår nya produkt',
    content: 'Stor nyhet! 🎉 Vi lanserar vår nya produkt idag. Efter månader av utveckling och tester är vi glada att kunna presentera...',
    htmlContent: '<p>Stor nyhet! 🎉 Vi lanserar vår nya produkt idag. Efter månader av utveckling och tester är vi glada att kunna presentera...</p>',
    platform: 'instagram',
    tags: ['lansering', 'produkt', 'nyhet'],
    createdAt: '2023-06-10T14:30:00Z',
    updatedAt: '2023-06-12T09:15:00Z',
    status: 'published',
    author: {
      id: '1',
      name: 'Admin User'
    }
  },
  {
    id: '2',
    title: 'LinkedIn företagsuppdatering',
    description: 'Månadsuppdatering om företagets framgångar',
    content: 'Vi är glada att kunna meddela att vi har uppnått vår kvartalsvis tillväxtmål. Med 30% ökning i nya kunder och...',
    htmlContent: '<p>Vi är glada att kunna meddela att vi har uppnått vår kvartalsvis tillväxtmål. Med 30% ökning i nya kunder och...</p>',
    platform: 'linkedin',
    tags: ['företagsuppdatering', 'tillväxt', 'framgång'],
    createdAt: '2023-07-01T11:20:00Z',
    updatedAt: '2023-07-02T15:45:00Z',
    status: 'draft',
    author: {
      id: '1',
      name: 'Admin User'
    }
  },
  {
    id: '3',
    title: 'Facebook kampanj - sommarerbjudande',
    description: 'Kampanjinnehåll för sommarerbjudanden',
    content: 'SOMMARKAMPANJ! 🌞 Få 20% rabatt på alla våra sommarprodukter med koden SOMMAR2023. Erbjudandet gäller till...',
    htmlContent: '<p>SOMMARKAMPANJ! 🌞 Få 20% rabatt på alla våra sommarprodukter med koden SOMMAR2023. Erbjudandet gäller till...</p>',
    platform: 'facebook',
    tags: ['kampanj', 'sommar', 'erbjudande', 'rabatt'],
    createdAt: '2023-06-15T09:00:00Z',
    updatedAt: '2023-06-16T10:30:00Z',
    status: 'draft',
    author: {
      id: '1',
      name: 'Admin User'
    }
  },
  {
    id: '4',
    title: 'Twitter teknisk uppdatering',
    description: 'Information om systemuppdateringar',
    content: 'Viktig information: Vi kommer att uppdatera vår plattform mellan kl. 02-04 imorgon natt. Vissa funktioner kan vara otillgängliga under denna tid...',
    htmlContent: '<p>Viktig information: Vi kommer att uppdatera vår plattform mellan kl. 02-04 imorgon natt. Vissa funktioner kan vara otillgängliga under denna tid...</p>',
    platform: 'twitter',
    tags: ['systemuppdatering', 'information', 'teknisk'],
    createdAt: '2023-07-05T16:20:00Z',
    updatedAt: '2023-07-05T16:20:00Z',
    status: 'archived',
    author: {
      id: '1',
      name: 'Admin User'
    }
  }
];

class SavedProjectsService {
  private projects: SavedProject[] = [...mockProjects];
  private storageKey = 'boostlab_saved_projects';

  constructor() {
    this.loadFromLocalStorage();
  }

  // Ladda projekt från localStorage om tillgängligt
  private loadFromLocalStorage(): void {
    try {
      const savedData = localStorage.getItem(this.storageKey);
      if (savedData) {
        this.projects = JSON.parse(savedData);
      }
    } catch (error) {
      console.error('Failed to load saved projects from localStorage:', error);
    }
  }

  // Spara till localStorage
  private saveToLocalStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.projects));
    } catch (error) {
      console.error('Failed to save projects to localStorage:', error);
    }
  }

  // Hämta alla projekt
  async getProjects(): Promise<SavedProject[]> {
    // Simulera API-fördröjning
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.projects].sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ));
      }, 300);
    });
  }

  // Filtrera projekt baserat på status
  async getProjectsByStatus(status: SavedProject['status']): Promise<SavedProject[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.projects.filter(project => project.status === status)
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        resolve(filtered);
      }, 300);
    });
  }

  // Filtrera projekt efter plattform
  async getProjectsByPlatform(platform: string): Promise<SavedProject[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.projects.filter(project => project.platform === platform)
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        resolve(filtered);
      }, 300);
    });
  }

  // Hämta ett specifikt projekt
  async getProjectById(id: string): Promise<SavedProject | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.projects.find(project => project.id === id));
      }, 200);
    });
  }

  // Skapa ett nytt projekt
  async createProject(projectData: Omit<SavedProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<SavedProject> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const now = new Date().toISOString();
        const newProject: SavedProject = {
          ...projectData,
          id: nanoid(),
          createdAt: now,
          updatedAt: now
        };
        
        this.projects.push(newProject);
        this.saveToLocalStorage();
        resolve(newProject);
      }, 500);
    });
  }

  // Uppdatera ett befintligt projekt
  async updateProject(id: string, projectData: Partial<SavedProject>): Promise<SavedProject | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.projects.findIndex(project => project.id === id);
        if (index !== -1) {
          this.projects[index] = {
            ...this.projects[index],
            ...projectData,
            updatedAt: new Date().toISOString()
          };
          this.saveToLocalStorage();
          resolve(this.projects[index]);
        } else {
          resolve(undefined);
        }
      }, 500);
    });
  }

  // Ta bort ett projekt
  async deleteProject(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const initialLength = this.projects.length;
        this.projects = this.projects.filter(project => project.id !== id);
        const success = this.projects.length < initialLength;
        if (success) {
          this.saveToLocalStorage();
        }
        resolve(success);
      }, 300);
    });
  }

  // Arkivera ett projekt istället för att ta bort det
  async archiveProject(id: string): Promise<SavedProject | undefined> {
    return this.updateProject(id, { status: 'archived' });
  }

  // Publicera ett projekt
  async publishProject(id: string): Promise<SavedProject | undefined> {
    return this.updateProject(id, { status: 'published' });
  }

  // Återställ ett projekt till utkast
  async moveProjectToDraft(id: string): Promise<SavedProject | undefined> {
    return this.updateProject(id, { status: 'draft' });
  }

  // Sök efter projekt baserat på nyckelord
  async searchProjects(query: string): Promise<SavedProject[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lowerQuery = query.toLowerCase();
        const results = this.projects.filter(project => 
          project.title.toLowerCase().includes(lowerQuery) ||
          (project.description && project.description.toLowerCase().includes(lowerQuery)) ||
          project.content.toLowerCase().includes(lowerQuery) ||
          project.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
        resolve(results);
      }, 300);
    });
  }
}

export default new SavedProjectsService();