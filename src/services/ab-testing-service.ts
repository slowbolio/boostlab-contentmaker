import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_WORDPRESS_URL || 'http://localhost:8000/wp-json';
const API_NAMESPACE = 'boostlab/v1';

export interface ABTest {
  id: number;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'completed';
  content: string;
  original_content: string;
  variants: ABTestVariant[];
  created_at: string;
  updated_at: string;
  metrics: ABTestMetrics;
  winner_id?: number;
}

export interface ABTestVariant {
  id: number;
  test_id: number;
  title: string;
  content: string;
  impressions: number;
  conversions: number;
  created_at: string;
}

export interface ABTestMetrics {
  total_impressions: number;
  total_conversions: number;
  conversion_rate: number;
  start_date?: string;
  end_date?: string;
}

export interface CreateABTestPayload {
  title: string;
  description: string;
  content: string;
  num_variants?: number;
  generateWithAI?: boolean;
}

export interface UpdateABTestPayload {
  id: number;
  title?: string;
  description?: string;
  status?: 'draft' | 'active' | 'completed';
  winner_id?: number;
}

export interface RecordMetricPayload {
  test_id: number;
  variant_id: number;
  event_type: 'impression' | 'conversion';
}

// Simulerad data för utvecklingsmiljö
const MOCK_TESTS: ABTest[] = [
  {
    id: 1,
    title: "Produktbeskrivning Test",
    description: "Testa olika sätt att beskriva vår huvudprodukt",
    status: "active",
    content: "Vår produkt hjälper dig att skapa innehåll snabbare och bättre.",
    original_content: "Vår produkt hjälper dig att skapa innehåll snabbare och bättre.",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    variants: [
      {
        id: 1,
        test_id: 1,
        title: "Variant A (Original)",
        content: "Vår produkt hjälper dig att skapa innehåll snabbare och bättre.",
        impressions: 234,
        conversions: 18,
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 2,
        test_id: 1,
        title: "Variant B",
        content: "Öka din produktivitet med vår AI-drivna innehållsskapande verktyg.",
        impressions: 245,
        conversions: 25,
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 3,
        test_id: 1,
        title: "Variant C",
        content: "Spara tid och pengar med vår revolutionerande innehållsskapande lösning.",
        impressions: 218,
        conversions: 12,
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ],
    metrics: {
      total_impressions: 697,
      total_conversions: 55,
      conversion_rate: 7.9,
      start_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 2,
    title: "CTA Knapptest",
    description: "Testa olika Call-to-Action-formuleringar",
    status: "completed",
    content: "Kom igång nu",
    original_content: "Kom igång nu",
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    variants: [
      {
        id: 4,
        test_id: 2,
        title: "Variant A (Original)",
        content: "Kom igång nu",
        impressions: 412,
        conversions: 31,
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 5,
        test_id: 2,
        title: "Variant B",
        content: "Starta din gratis provperiod",
        impressions: 398,
        conversions: 42,
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ],
    metrics: {
      total_impressions: 810,
      total_conversions: 73,
      conversion_rate: 9.0,
      start_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    winner_id: 5
  },
  {
    id: 3,
    title: "Rubriktest för landningssida",
    description: "Testa olika rubriker för landningssidan",
    status: "draft",
    content: "Skapa bättre innehåll med AI",
    original_content: "Skapa bättre innehåll med AI",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    variants: [
      {
        id: 6,
        test_id: 3,
        title: "Variant A (Original)",
        content: "Skapa bättre innehåll med AI",
        impressions: 0,
        conversions: 0,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 7,
        test_id: 3,
        title: "Variant B",
        content: "Revolutionera din innehållsproduktion med AI",
        impressions: 0,
        conversions: 0,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ],
    metrics: {
      total_impressions: 0,
      total_conversions: 0,
      conversion_rate: 0,
      start_date: undefined
    }
  }
];

class ABTestingService {
  private baseUrl: string;
  private token: string | null;
  private mockMode: boolean = true; // Använd simulerat läge i utvecklingsmiljö
  private mockTests: ABTest[] = [...MOCK_TESTS];
  private nextId: number = 4; // Nästa ID för nya tester
  private nextVariantId: number = 8; // Nästa ID för nya varianter

  constructor() {
    this.baseUrl = `${API_BASE_URL}/${API_NAMESPACE}`;
    this.token = localStorage.getItem('wp_token');
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

  async getTests(): Promise<ABTest[]> {
    // I utvecklingsmiljö, returnera simulerad data
    if (this.mockMode) {
      // Simulera nätverksfördröjning
      await new Promise(resolve => setTimeout(resolve, 500));
      return [...this.mockTests];
    }

    // Faktisk implementering för produktionsmiljö
    try {
      const response = await axios.get(`${this.baseUrl}/abtests`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching AB tests:', error);
      throw error;
    }
  }

  async getTest(id: number): Promise<ABTest> {
    // I utvecklingsmiljö, returnera simulerad data
    if (this.mockMode) {
      // Simulera nätverksfördröjning
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const test = this.mockTests.find(t => t.id === id);
      if (!test) {
        throw new Error(`Test with ID ${id} not found`);
      }
      
      return { ...test };
    }

    // Faktisk implementering för produktionsmiljö
    try {
      const response = await axios.get(`${this.baseUrl}/abtests/${id}`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching AB test ${id}:`, error);
      throw error;
    }
  }

  async createTest(data: CreateABTestPayload): Promise<ABTest> {
    // I utvecklingsmiljö, skapa simulerad test
    if (this.mockMode) {
      // Simulera nätverksfördröjning
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const now = new Date().toISOString();
      const newTest: ABTest = {
        id: this.nextId++,
        title: data.title,
        description: data.description,
        status: 'draft',
        content: data.content,
        original_content: data.content,
        created_at: now,
        updated_at: now,
        variants: [
          {
            id: this.nextVariantId++,
            test_id: this.nextId - 1,
            title: "Variant A (Original)",
            content: data.content,
            impressions: 0,
            conversions: 0,
            created_at: now
          }
        ],
        metrics: {
          total_impressions: 0,
          total_conversions: 0,
          conversion_rate: 0
        }
      };
      
      // Om generateWithAI är sant, skapa ytterligare varianter
      if (data.generateWithAI && data.num_variants) {
        for (let i = 1; i < data.num_variants; i++) {
          newTest.variants.push({
            id: this.nextVariantId++,
            test_id: this.nextId - 1,
            title: `Variant ${String.fromCharCode(65 + i)}`,
            content: `${data.content} (AI-genererad variant ${i})`,
            impressions: 0,
            conversions: 0,
            created_at: now
          });
        }
      }
      
      this.mockTests.push(newTest);
      return { ...newTest };
    }

    // Faktisk implementering för produktionsmiljö
    try {
      const response = await axios.post(`${this.baseUrl}/abtests`, data, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating AB test:', error);
      throw error;
    }
  }

  async updateTest(data: UpdateABTestPayload): Promise<ABTest> {
    // I utvecklingsmiljö, uppdatera simulerad test
    if (this.mockMode) {
      // Simulera nätverksfördröjning
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const testIndex = this.mockTests.findIndex(t => t.id === data.id);
      if (testIndex === -1) {
        throw new Error(`Test with ID ${data.id} not found`);
      }
      
      const test = this.mockTests[testIndex];
      const updatedTest = {
        ...test,
        ...data,
        updated_at: new Date().toISOString()
      };
      
      // Om status uppdateras till "completed" och ingen vinnare är angiven,
      // välj varianten med högst konverteringsgrad
      if (data.status === 'completed' && !data.winner_id) {
        let highestRate = 0;
        let winnerVariantId = 0;
        
        for (const variant of updatedTest.variants) {
          const convRate = variant.conversions / (variant.impressions || 1);
          if (convRate > highestRate) {
            highestRate = convRate;
            winnerVariantId = variant.id;
          }
        }
        
        if (winnerVariantId) {
          updatedTest.winner_id = winnerVariantId;
        }
        
        // Uppdatera metrics slut-datum
        if (!updatedTest.metrics.end_date) {
          updatedTest.metrics.end_date = new Date().toISOString();
        }
      }
      
      // Om status uppdateras till "active" och det inte finns något start-datum,
      // sätt start-datum till nu
      if (data.status === 'active' && !updatedTest.metrics.start_date) {
        updatedTest.metrics.start_date = new Date().toISOString();
      }
      
      this.mockTests[testIndex] = updatedTest;
      return { ...updatedTest };
    }

    // Faktisk implementering för produktionsmiljö
    try {
      const response = await axios.put(`${this.baseUrl}/abtests/${data.id}`, data, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating AB test ${data.id}:`, error);
      throw error;
    }
  }

  async deleteTest(id: number): Promise<boolean> {
    // I utvecklingsmiljö, ta bort simulerad test
    if (this.mockMode) {
      // Simulera nätverksfördröjning
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const testIndex = this.mockTests.findIndex(t => t.id === id);
      if (testIndex === -1) {
        throw new Error(`Test with ID ${id} not found`);
      }
      
      this.mockTests.splice(testIndex, 1);
      return true;
    }

    // Faktisk implementering för produktionsmiljö
    try {
      await axios.delete(`${this.baseUrl}/abtests/${id}`, {
        headers: this.getHeaders()
      });
      return true;
    } catch (error) {
      console.error(`Error deleting AB test ${id}:`, error);
      throw error;
    }
  }

  async generateVariants(testId: number, numVariants: number = 2): Promise<ABTestVariant[]> {
    // I utvecklingsmiljö, skapa simulerade varianter
    if (this.mockMode) {
      // Simulera nätverksfördröjning
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const testIndex = this.mockTests.findIndex(t => t.id === testId);
      if (testIndex === -1) {
        throw new Error(`Test with ID ${testId} not found`);
      }
      
      const test = this.mockTests[testIndex];
      const now = new Date().toISOString();
      const newVariants: ABTestVariant[] = [];
      
      // Generera nya varianter
      for (let i = 0; i < numVariants; i++) {
        const newVariant: ABTestVariant = {
          id: this.nextVariantId++,
          test_id: testId,
          title: `AI-genererad variant ${test.variants.length + i}`,
          content: `${test.content} (AI-genererad variant ${test.variants.length + i} med lite extra text för att göra den unik)`,
          impressions: 0,
          conversions: 0,
          created_at: now
        };
        
        newVariants.push(newVariant);
        test.variants.push(newVariant);
      }
      
      return newVariants;
    }

    // Faktisk implementering för produktionsmiljö
    try {
      const response = await axios.post(
        `${this.baseUrl}/abtests/${testId}/generate-variants`, 
        { num_variants: numVariants },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error generating variants for test ${testId}:`, error);
      throw error;
    }
  }

  async getRecommendation(testId: number): Promise<{ recommendation: string, winner_id: number }> {
    // I utvecklingsmiljö, skapa simulerad rekommendation
    if (this.mockMode) {
      // Simulera nätverksfördröjning
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const test = this.mockTests.find(t => t.id === testId);
      if (!test) {
        throw new Error(`Test with ID ${testId} not found`);
      }
      
      // Hitta varianten med högst konverteringsgrad
      let highestRate = 0;
      let winnerVariant = test.variants[0];
      
      for (const variant of test.variants) {
        const convRate = variant.conversions / (variant.impressions || 1);
        if (convRate > highestRate) {
          highestRate = convRate;
          winnerVariant = variant;
        }
      }
      
      const improvementPercent = Math.round(
        ((winnerVariant.conversions / (winnerVariant.impressions || 1)) / 
        (test.variants[0].conversions / (test.variants[0].impressions || 1)) - 1) * 100
      );
      
      return {
        recommendation: `Baserat på testresultaten rekommenderar vi variant "${winnerVariant.title}" som den bästa varianten. Den har en förbättring på ${improvementPercent}% jämfört med originalvarianten.`,
        winner_id: winnerVariant.id
      };
    }

    // Faktisk implementering för produktionsmiljö
    try {
      const response = await axios.get(`${this.baseUrl}/abtests/${testId}/recommendation`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error(`Error getting recommendation for test ${testId}:`, error);
      throw error;
    }
  }

  async recordMetric(data: RecordMetricPayload): Promise<boolean> {
    // I utvecklingsmiljö, registrera simulerad metrik
    if (this.mockMode) {
      // Simulera nätverksfördröjning
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const testIndex = this.mockTests.findIndex(t => t.id === data.test_id);
      if (testIndex === -1) {
        throw new Error(`Test with ID ${data.test_id} not found`);
      }
      
      const test = this.mockTests[testIndex];
      const variantIndex = test.variants.findIndex(v => v.id === data.variant_id);
      
      if (variantIndex === -1) {
        throw new Error(`Variant with ID ${data.variant_id} not found in test ${data.test_id}`);
      }
      
      const variant = test.variants[variantIndex];
      
      // Uppdatera metriker
      if (data.event_type === 'impression') {
        variant.impressions++;
        test.metrics.total_impressions++;
      } else if (data.event_type === 'conversion') {
        variant.conversions++;
        test.metrics.total_conversions++;
      }
      
      // Uppdatera konverteringsgrad
      test.metrics.conversion_rate = Math.round(
        (test.metrics.total_conversions / test.metrics.total_impressions) * 1000
      ) / 10; // Avrunda till 1 decimal
      
      return true;
    }

    // Faktisk implementering för produktionsmiljö
    try {
      await axios.post(`${this.baseUrl}/abtests/${data.test_id}/metrics`, data, {
        headers: this.getHeaders()
      });
      return true;
    } catch (error) {
      console.error(`Error recording metric for test ${data.test_id}:`, error);
      throw error;
    }
  }

  async startTest(id: number): Promise<ABTest> {
    return this.updateTest({ id, status: 'active' });
  }

  async completeTest(id: number, winnerId?: number): Promise<ABTest> {
    return this.updateTest({ 
      id, 
      status: 'completed',
      winner_id: winnerId
    });
  }
}

export default new ABTestingService();