// Template service för att hantera innehållsmallar
import { nanoid } from 'nanoid';

export interface ContentTemplate {
  id: string;
  title: string;
  description: string;
  template: string;
  platform: 'instagram' | 'facebook' | 'linkedin' | 'twitter' | 'tiktok' | 'general';
  category: 'promotion' | 'engagement' | 'announcement' | 'educational' | 'product' | 'event' | 'other';
  tags: string[];
  createdAt: string;
  premium: boolean;
}

// Mock-data för templates
const mockTemplates: ContentTemplate[] = [
  {
    id: '1',
    title: 'Produktlansering - Instagram',
    description: 'Perfekt för att presentera en ny produkt på Instagram',
    template: `✨ NYHET: [Produktnamn] är äntligen här! ✨

Vi är stolta över att presentera vår spännande nya [produkt] som kommer förändra hur du ser på [produktkategori].

🔥 [Produktnamn] ger dig:
• [Fördel 1]
• [Fördel 2]
• [Fördel 3]

Tillgänglig nu på vår hemsida - länk i bion!

#nyprodukt #lansering #[bransch] #innovation`,
    platform: 'instagram',
    category: 'product',
    tags: ['produkter', 'lansering', 'nyhet'],
    createdAt: '2023-01-15T12:00:00Z',
    premium: false
  },
  {
    id: '2',
    title: 'Företagsuppdatering - LinkedIn',
    description: 'Professionell uppdatering om företagets framgångar',
    template: `Stolta att meddela att [Företagsnamn] har uppnått [prestation/milstolpe]!

Detta representerar ett viktigt steg i vår resa mot [långsiktigt mål/vision].

Vi har framgångsrikt [beskrivning av hur milstolpen uppnåddes] tack vare vårt fantastiska team och stödet från våra kunder och partners.

Vad innebär detta för framtiden?
• [Framtida implikation 1]
• [Framtida implikation 2]
• [Framtida implikation 3]

Tack till alla som varit en del av denna resa så långt. Det bästa ligger fortfarande framför oss!

#[bransch] #företagsnyheter #tillväxt #innovation`,
    platform: 'linkedin',
    category: 'announcement',
    tags: ['företagsuppdatering', 'milstolpe', 'professionell'],
    createdAt: '2023-02-10T14:30:00Z',
    premium: false
  },
  {
    id: '3',
    title: 'Engagemangsinlägg - Facebook',
    description: 'Öka engagemanget med en fråga till följare',
    template: `God [morgon/eftermiddag/kväll] allesammans! 👋

Vi är nyfikna - [ställ en relevant fråga för din målgrupp]?

Dela med dig av dina tankar i kommentarerna nedan! Vi läser alla svar och kommer att dela med oss av våra egna tankar senare idag.

[Tillval: Lägg till en relaterad bild eller ett citat]

#[relevant hashtag] #konversation #[bransch]`,
    platform: 'facebook',
    category: 'engagement',
    tags: ['engagemang', 'fråga', 'samtal'],
    createdAt: '2023-03-05T09:15:00Z',
    premium: false
  },
  {
    id: '4',
    title: 'Produkttutorial - TikTok Script',
    description: 'Skript för en kort tutorial om hur man använder din produkt',
    template: `[Intro - 5 sek]
"Hej TikTok! Trött på [vanligt problem]? Här är hur [din produkt] löser det på under 30 sekunder!"

[Hook - 5 sek]
"Visste du att de flesta spenderar [statistik] timmar på [relaterad aktivitet]? Det är därför vi skapade detta!"

[Steg 1 - 5 sek]
"Först, [enkelt steg] - så enkelt!"

[Steg 2 - 5 sek]
"Sen [nästa steg] - ser du hur snabbt det går?"

[Steg 3 - 5 sek]
"Slutligen [sista steget] och... klart!"

[Resultat - 5 sek]
"Voilà! [Visa resultat] På bara några sekunder!"

[Call to action - 5 sek]
"Prova själv! Länk i bion. Kommentera om du vill se fler tips!"

#[produktkategori] #lifehack #[nischhashtag] #tutorial`,
    platform: 'tiktok',
    category: 'educational',
    tags: ['tutorial', 'howto', 'produktdemo'],
    createdAt: '2023-04-20T16:45:00Z',
    premium: true
  },
  {
    id: '5',
    title: 'Erbjudande/Rabatt - Allmän',
    description: 'Meddela kunder om ett tidsbegränsat erbjudande',
    template: `SPECIALERBJUDANDE: [X]% RABATT! ⏰

För en begränsad tid erbjuder vi [beskrivning av erbjudandet] på [produkt/tjänst].

🔥 Varför du bör agera nu:
• [Fördel 1]
• [Fördel 2]
• [Fördel 3]

⏱️ Erbjudandet gäller till och med [datum].

Använd rabattkoden: [RABATTKOD] vid kassan.

[Uppmaning till handling, t.ex. "Handla nu!", "Boka din tid idag!"]

[Länk till hemsida/köpsida]`,
    platform: 'general',
    category: 'promotion',
    tags: ['erbjudande', 'rabatt', 'kampanj'],
    createdAt: '2023-05-12T11:20:00Z',
    premium: false
  },
  {
    id: '6',
    title: 'Vittnesmål/Kundrecension - Instagram',
    description: 'Framhäv positiv feedback från en nöjd kund',
    template: `❤️ KUNDERNAS RÖST ❤️

"[Direkt citat från kund som beskriver sin positiva upplevelse med din produkt/tjänst]" - [Kundnamn/initial]

Vi älskar att höra hur [produkt/tjänst] har hjälpt våra kunder att [uppnå resultat/lösa problem].

Vill du också [förväntad fördel]? Upptäck hur vi kan hjälpa dig:
[Uppmaning till handling]

📣 Dela din egen upplevelse i kommentarerna!

#kundrecension #vittnesmål #[bransch] #[produktkategori]`,
    platform: 'instagram',
    category: 'engagement',
    tags: ['testimonial', 'kundrecension', 'nöjdkund'],
    createdAt: '2023-06-25T13:10:00Z',
    premium: false
  },
  {
    id: '7',
    title: 'Branschnyheter & Insikter - LinkedIn',
    description: 'Dela din expertis om aktuella branschtrender',
    template: `[BRANSCHNYHETER]: [Titel på insikt eller trend]

Vi har följt utvecklingen inom [bransch/område] och noterat en intressant trend: [beskriv trenden eller upptäckten].

Vad detta innebär för branschen:
• [Implikation 1]
• [Implikation 2]
• [Implikation 3]

Hos [Företagsnamn] anpassar vi oss till denna utveckling genom att [beskriv er strategi eller lösning].

Vad är dina tankar om denna trend? Har du märkt liknande mönster? Dela gärna dina insikter i kommentarerna!

#[bransch] #trender #innovation #insikter #framtiden`,
    platform: 'linkedin',
    category: 'educational',
    tags: ['insikter', 'trender', 'expertis', 'tankeledare'],
    createdAt: '2023-07-18T10:05:00Z',
    premium: true
  },
  {
    id: '8',
    title: 'Evenemangsinbjudan - Facebook',
    description: 'Bjud in följare till ett kommande event',
    template: `📅 SAVE THE DATE: [EVENEMANGSTITEL] 📅

Vi är glada att kunna bjuda in er till [typ av evenemang] den [datum] kl [tid] på [plats/online plattform].

🎯 Under detta evenemang kommer du att:
• [Fördel/aktivitet 1]
• [Fördel/aktivitet 2]
• [Fördel/aktivitet 3]

👥 Vem bör delta:
[Beskriv målgruppen eller vem evenemanget är lämpligt för]

🎟️ [Information om biljetter/anmälan, om tillämpligt]

📝 [Instruktioner för att registrera sig/delta]

Vi ser fram emot att se dig där! Tagga en vän som du vill ta med i kommentarerna.

#[evenemang] #[bransch] #[plats om relevant] #nätverk`,
    platform: 'facebook',
    category: 'event',
    tags: ['evenemang', 'inbjudan', 'nätverk'],
    createdAt: '2023-08-05T15:30:00Z',
    premium: false
  }
];

class TemplatesService {
  private templates: ContentTemplate[] = [...mockTemplates];

  async getTemplates(): Promise<ContentTemplate[]> {
    // Simulera nätverksfördröjning
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.templates]);
      }, 500);
    });
  }

  async getTemplatesByPlatform(platform: string): Promise<ContentTemplate[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (platform === 'all') {
          resolve([...this.templates]);
        } else {
          resolve(this.templates.filter(t => t.platform === platform));
        }
      }, 500);
    });
  }

  async getTemplatesByCategory(category: string): Promise<ContentTemplate[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.templates.filter(t => t.category === category));
      }, 500);
    });
  }

  async getTemplateById(id: string): Promise<ContentTemplate | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.templates.find(t => t.id === id));
      }, 300);
    });
  }

  async createTemplate(templateData: Omit<ContentTemplate, 'id' | 'createdAt'>): Promise<ContentTemplate> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTemplate: ContentTemplate = {
          ...templateData,
          id: nanoid(),
          createdAt: new Date().toISOString()
        };
        this.templates.push(newTemplate);
        resolve(newTemplate);
      }, 800);
    });
  }

  async updateTemplate(id: string, templateData: Partial<ContentTemplate>): Promise<ContentTemplate | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.templates.findIndex(t => t.id === id);
        if (index !== -1) {
          this.templates[index] = {
            ...this.templates[index],
            ...templateData
          };
          resolve(this.templates[index]);
        } else {
          resolve(undefined);
        }
      }, 800);
    });
  }

  async deleteTemplate(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const initialLength = this.templates.length;
        this.templates = this.templates.filter(t => t.id !== id);
        resolve(this.templates.length < initialLength);
      }, 500);
    });
  }
}

export default new TemplatesService();