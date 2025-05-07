import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_WORDPRESS_URL || 'http://localhost:8000/wp-json';
const API_NAMESPACE = 'boostlab/v1';

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  roles: string[];
  token?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

// Simulerad användare för utvecklingsmiljö
const MOCK_USER: User = {
  id: 1,
  username: 'admin',
  name: 'Admin User',
  email: 'admin@example.com',
  roles: ['administrator'],
  token: 'mock-token-123'
};

class AuthService {
  private baseUrl: string;
  private token: string | null;
  private mockMode: boolean = true; // Använd simulerat läge i utvecklingsmiljö

  constructor() {
    this.baseUrl = `${API_BASE_URL}/${API_NAMESPACE}`;
    this.token = localStorage.getItem('wp_token');
    
    // Kontrollera om token redan finns i localStorage från tidigare sessioner
    if (!this.token && this.mockMode) {
      // I utvecklingsläge, sätt en simulerad token direkt
      this.token = 'mock-token-123';
      localStorage.setItem('wp_token', this.token);
    }
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token ? { 'Authorization': `Bearer ${this.token}` } : {})
    };
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('wp_token', token);
  }

  getToken() {
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('wp_token');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  async login(credentials: LoginCredentials): Promise<User> {
    // I utvecklingsmiljö, simulera inloggning
    if (this.mockMode) {
      // Kontrollera att användarnamn och lösenord är ifyllda
      if (!credentials.username || !credentials.password) {
        throw new Error('Username and password are required');
      }
      
      // Simulera en kort fördröjning för att efterlikna en nätverksbegäran
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Acceptera alla inloggningsuppgifter i utvecklingsmiljön
      // I en produktionsmiljö skulle detta kontrolleras mot servern
      this.setToken(MOCK_USER.token || 'mock-token-123');
      return { ...MOCK_USER };
    }
    
    // Faktisk implementering för produktionsmiljö
    try {
      const response = await axios.post(`${this.baseUrl}/auth/login`, credentials);
      const { token, user } = response.data;
      
      if (token) {
        this.setToken(token);
        return { ...user, token };
      }
      
      throw new Error('Authentication failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<boolean> {
    // I utvecklingsmiljö, simulera utloggning
    if (this.mockMode) {
      this.clearToken();
      return true;
    }
    
    // Faktisk implementering för produktionsmiljö
    try {
      if (this.token) {
        await axios.post(
          `${this.baseUrl}/auth/logout`,
          {},
          { headers: this.getHeaders() }
        );
      }
      this.clearToken();
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      this.clearToken();
      return false;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    // I utvecklingsmiljö, returnera simulerad användare
    if (this.mockMode) {
      if (!this.token) return null;
      return MOCK_USER;
    }
    
    // Faktisk implementering för produktionsmiljö
    if (!this.token) return null;
    
    try {
      const response = await axios.get(
        `${this.baseUrl}/auth/me`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async verifyToken(): Promise<boolean> {
    // I utvecklingsmiljö, acceptera alltid token
    if (this.mockMode) {
      return !!this.token;
    }
    
    // Faktisk implementering för produktionsmiljö
    if (!this.token) return false;
    
    try {
      const response = await axios.post(
        `${this.baseUrl}/auth/verify`,
        {},
        { headers: this.getHeaders() }
      );
      return response.data.valid === true;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  }
}

export default new AuthService();