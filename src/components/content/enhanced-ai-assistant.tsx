import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Wand2, 
  Zap, 
  BrainCircuit, 
  Type, 
  MoreHorizontal, 
  Sparkles, 
  Loader2, 
  ArrowLeft, 
  Check, 
  RefreshCw
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  buildPrompt, 
  ContentCategory,
  Platform,
  ToneOfVoice,
  AudienceType,
  promptTemplates
} from "@/services/ai-prompts-service";
import { generateContent } from '@/services/ai-generation-service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Map suggestion types to AI prompt actions
const suggestionToAction: Record<SuggestionType, string> = {
  'improve': 'improve',
  'expand': 'expand',
  'summarize': 'shorten',
  'headlines': 'generate-headline',
  'localize': 'rephrase',
  'personalize': 'tone-shift'
};

type SuggestionType = 'improve' | 'expand' | 'summarize' | 'localize' | 'personalize' | 'headlines';

interface SuggestionOption {
  id: SuggestionType;
  icon: React.ReactNode;
  label: string;
  description: string;
}

const suggestions: SuggestionOption[] = [
  {
    id: 'improve',
    icon: <Wand2 className="h-4 w-4" />,
    label: 'Förbättra skrivning',
    description: 'Förbättra text med förslag på grammatik, tydlighet och stil.'
  },
  {
    id: 'expand',
    icon: <Zap className="h-4 w-4" />,
    label: 'Expandera innehåll',
    description: 'Utöka ditt innehåll med fler relevanta detaljer.'
  },
  {
    id: 'summarize',
    icon: <Type className="h-4 w-4" />,
    label: 'Sammanfatta',
    description: 'Skapa en kortare version som behåller nyckelinnehållet.'
  },
  {
    id: 'headlines',
    icon: <Sparkles className="h-4 w-4" />,
    label: 'Föreslå rubriker',
    description: 'Generera engagerande rubrikalternativ för ditt innehåll.'
  },
  {
    id: 'localize',
    icon: <BrainCircuit className="h-4 w-4" />,
    label: 'Lokalisera',
    description: 'Anpassa innehåll för svenska målgrupper och kontext.'
  },
  {
    id: 'personalize',
    icon: <MoreHorizontal className="h-4 w-4" />,
    label: 'Personalisera',
    description: 'Anpassa ton och stil baserat på målgruppsinformation.'
  }
];

// Content categories for AI assistant
const contentCategories: { value: ContentCategory; label: string }[] = [
  { value: 'headline', label: 'Rubrik' },
  { value: 'body', label: 'Brödtext' },
  { value: 'tagline', label: 'Slogan' },
  { value: 'call-to-action', label: 'Call-to-action' },
  { value: 'product-description', label: 'Produktbeskrivning' },
  { value: 'story', label: 'Berättelse' },
  { value: 'persuasive', label: 'Övertygande' },
  { value: 'educational', label: 'Utbildande' },
  { value: 'announcement', label: 'Tillkännagivande' }
];

// Platform options
const platformOptions: { value: Platform; label: string }[] = [
  { value: 'general', label: 'Generellt' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'blog', label: 'Blogg' },
  { value: 'email', label: 'E-post' }
];

// Tone of voice options
const toneOptions: { value: ToneOfVoice; label: string }[] = [
  { value: 'professional', label: 'Professionell' },
  { value: 'casual', label: 'Avslappnad' },
  { value: 'formal', label: 'Formell' },
  { value: 'friendly', label: 'Vänlig' },
  { value: 'humorous', label: 'Humoristisk' },
  { value: 'inspirational', label: 'Inspirerande' },
  { value: 'authoritative', label: 'Auktoritativ' },
  { value: 'empathetic', label: 'Empatisk' }
];

// Audience options
const audienceOptions: { value: AudienceType; label: string }[] = [
  { value: 'general', label: 'Allmän publik' },
  { value: 'business', label: 'Företag' },
  { value: 'consumer', label: 'Konsumenter' },
  { value: 'technical', label: 'Teknisk publik' },
  { value: 'creative', label: 'Kreativa personer' },
  { value: 'executives', label: 'Chefer och beslutsfattare' },
  { value: 'millennials', label: 'Millennials' },
  { value: 'gen-z', label: 'Generation Z' }
];

export interface EnhancedAIAssistantProps {
  currentContent?: string;
  onApplySuggestion?: (newContent: string) => void;
  selectedPlatform?: string;
}

export function EnhancedAIAssistant({ 
  currentContent = '', 
  onApplySuggestion,
  selectedPlatform
}: EnhancedAIAssistantProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'quick' | 'advanced'>('quick');
  
  // Quick tab state
  const [selectedSuggestion, setSelectedSuggestion] = useState<SuggestionType | null>(null);
  const [prompt, setPrompt] = useState('');
  
  // Advanced tab state
  const [contentCategory, setContentCategory] = useState<ContentCategory>('body');
  const [platform, setPlatform] = useState<Platform>(selectedPlatform as Platform || 'general');
  const [tone, setTone] = useState<ToneOfVoice>('professional');
  const [audience, setAudience] = useState<AudienceType>('general');
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  
  // Shared state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  // Update platform when selectedPlatform prop changes
  useEffect(() => {
    if (selectedPlatform && Object.values(platformOptions).some(opt => opt.value === selectedPlatform)) {
      setPlatform(selectedPlatform as Platform);
    }
  }, [selectedPlatform]);

  // Use AI generation service for content enhancement

  const generateSuggestion = async () => {
    if (!currentContent) {
      toast({
        title: "Inget innehåll att förbättra",
        description: "Lägg till innehåll först innan du använder AI-assistenten.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Determine the action based on the active tab and selection
    let action = 'improve';
    
    if (activeTab === 'quick' && selectedSuggestion) {
      // Map selected suggestion to action
      action = suggestionToAction[selectedSuggestion];
    }
    
    try {
      // Create request object for AI generation service
      const request = {
        action,
        content: currentContent,
        platform,
        tone,
        audience,
        contentCategory,
        customInstructions: activeTab === 'quick' ? prompt : customPrompt
      };
      
      // Special handling for templates
      if (activeTab === 'advanced' && selectedTemplate) {
        // Use a template from the prompt library
        const template = promptTemplates.find(t => t.id === selectedTemplate);
        if (template) {
          request.action = 'template';
          request.customInstructions = template.prompt;
          
          // Set relevant parameters for context
          request.platform = template.platform;
          if (template.tone) request.tone = template.tone;
          if (template.audience) request.audience = template.audience;
          
          // Update UI state to reflect template settings
          setPlatform(template.platform);
          if (template.tone) setTone(template.tone);
          if (template.audience) setAudience(template.audience);
        }
      }
      
      // Call the AI generation service
      const response = await generateContent(request);
      
      // Set the generated content
      setGeneratedContent(response.generatedContent);
      
      // Optional: Log usage metrics for development/testing
      if (process.env.NODE_ENV === 'development') {
        console.log('AI Generation Usage:', {
          tokens: response.usageTokens,
          duration: response.duration
        });
      }
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Fel vid generering",
        description: "Ett fel uppstod när innehållet skulle genereras. Försök igen.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to generate random headlines based on platform and tone
  function getRandomHeadline(platform: Platform, tone: ToneOfVoice): string {
    const linkedinHeadlines = [
      "5 strategier som revolutionerar din karriär inom branschen",
      "Ny forskning visar: Så ökar du produktiviteten med 35%",
      "Därför överträffar våra kunder branschgenomsnittet med 28%",
      "Framtidens arbetsplats: Tre trender varje ledare måste förstå",
      "Exklusiv rapport: Detta kommer förändra marknaden inom 6 månader"
    ];
    
    const instagramHeadlines = [
      "✨ Förändra ditt liv med dessa enkla steg ✨",
      "Hemligheten bakom framgång 🔑 - swipa för att se!",
      "För otroliga resultat 🚀 - prova detta!",
      "Den ultimata guiden för att nå dina mål 💯",
      "3 saker framgångsrika personer gör varje morgon ☀️"
    ];
    
    const facebookHeadlines = [
      "Du kommer inte tro vad som händer när du börjar med detta...",
      "Vi avslöjar: Detta är hemligheten bakom framgång",
      "STORA NYHETER! Vi lanserar äntligen...",
      "Har du testat detta? 9 av 10 rekommenderar!",
      "Så enkelt kan du förbättra ditt liv – steg för steg guide"
    ];
    
    // Select headline pool based on platform
    let headlines: string[] = [];
    
    if (platform === 'linkedin') {
      headlines = linkedinHeadlines;
    } else if (platform === 'instagram') {
      headlines = instagramHeadlines;
    } else if (platform === 'facebook') {
      headlines = facebookHeadlines;
    } else {
      // Default headline pool
      headlines = [
        "Revolutionera din strategi: Nya insikter för 2025",
        "Framgång garanterad: 5 steg till bättre resultat",
        "Expertens hemlighet: Så når du dina mål snabbare",
        "Vad de inte berättar om framgång: Insikter från branschexperter",
        "Den ultimata guiden: Från nybörjare till expert på rekordtid"
      ];
    }
    
    // Apply tone adjustments (simplified)
    const randomIndex = Math.floor(Math.random() * headlines.length);
    let headline = headlines[randomIndex];
    
    if (tone === 'formal') {
      headline = headline.replace(/revolutionera/i, "transformera").replace(/otroliga/i, "exceptionella");
    } else if (tone === 'humorous') {
      headline = headline.replace(/strategi/i, "hemliga recept").replace(/insikter/i, "aha-upplevelser");
    }
    
    return headline;
  }
  
  // Helper function to get CTA based on platform and tone
  function getCTA(platform: Platform, tone: ToneOfVoice): string {
    let cta = "CALL TO ACTION:\n\n";
    
    if (platform === 'instagram') {
      cta += "👉 Dubbeltryck för att gilla och kommentera nedan vad du tycker! Tagga en vän som behöver se detta! 👇";
    } else if (platform === 'linkedin') {
      cta += "Vad tycker du? Dela gärna dina erfarenheter i kommentarsfältet nedan. Om du fann detta värdefullt, uppskatta jag om du delar det med ditt nätverk.";
    } else if (platform === 'facebook') {
      cta += "Gilla, kommentera och dela om du håller med! Tagga någon som behöver se detta. ❤️";
    } else if (platform === 'twitter') {
      cta += "Retweeta om du håller med! Följ för fler insikter. #innovation #framtid";
    } else if (platform === 'email') {
      cta += "Klicka här för att ta del av vårt exklusiva erbjudande – endast tillgängligt de nästa 48 timmarna!";
    } else {
      cta += "Kontakta oss idag för att ta nästa steg mot dina mål!";
    }
    
    // Adjust based on tone
    if (tone === 'formal') {
      cta = cta.replace(/Tagga/g, "Nämn").replace(/Gilla/g, "Visa uppskattning");
    } else if (tone === 'humorous') {
      cta = cta.replace(/behöver se detta/g, "behöver detta i sitt liv").replace(/Kontakta oss/g, "Släng iväg ett meddelande");
    }
    
    return cta;
  }
  
  // Helper function to get random taglines based on tone
  function getRandomTagline(tone: ToneOfVoice): string {
    const professionalTaglines = [
      "Expertis. Innovation. Resultat.",
      "Förverkliga potentialen. Uppnå excellens.",
      "Din partner för hållbar framgång.",
      "Framtidssäkra din verksamhet.",
      "Precision i varje detalj."
    ];
    
    const casualTaglines = [
      "Gör livet enklare. Varje dag.",
      "Vi fixar det. Du njuter.",
      "Känn skillnaden direkt!",
      "För alla som vill ha mer.",
      "Livet är för kort för krångel."
    ];
    
    const inspirationalTaglines = [
      "Drömmar blir verklighet. Varje dag.",
      "Inspirera. Skapa. Förändra.",
      "Sikta högre. Nå längre.",
      "Omöjligt är bara ett ord.",
      "Förvandla visioner till verklighet."
    ];
    
    let taglines: string[];
    
    if (tone === 'professional' || tone === 'formal' || tone === 'authoritative') {
      taglines = professionalTaglines;
    } else if (tone === 'casual' || tone === 'friendly' || tone === 'humorous') {
      taglines = casualTaglines;
    } else {
      taglines = inspirationalTaglines;
    }
    
    const randomIndex = Math.floor(Math.random() * taglines.length);
    return taglines[randomIndex];
  }
  
  // Helper function to create a product description
  function getProductDescription(platform: Platform, tone: ToneOfVoice, audience: AudienceType): string {
    let description = "";
    
    // Base description
    const baseDesc = "Vår revolutionerande produkt kombinerar banbrytande teknologi med elegant design för att ge dig en oöverträffad upplevelse. Med fokus på användarvänlighet, hållbarhet och prestanda har vi skapat något som verkligen förändrar hur du interagerar med vardagen.";
    
    // Modify for platform
    if (platform === 'instagram') {
      description = `${baseDesc} Perfekt för den moderna livsstilen och ett måste för alla som värdesätter både form och funktion. Swipa för att se fler bilder och upptäck varför alla pratar om den! ✨ #innovation #design #kvalitet`;
    } else if (platform === 'linkedin') {
      description = `${baseDesc} Våra kunder rapporterar en produktivitetsökning på upp till 27% efter implementering. ROI har i genomsnitt uppnåtts inom 4,5 månader, vilket gör denna investering till en självklarhet för framåtsträvande organisationer.`;
    } else {
      description = baseDesc;
    }
    
    // Adjust for audience
    if (audience === 'technical') {
      description += " Med avancerade algoritmer och optimerad prestanda överträffar den branschstandarden med 35% samtidigt som energiförbrukningen minskas med 40%.";
    } else if (audience === 'business') {
      description += " Strategiskt implementerad i er verksamhet kan den reducera operativa kostnader samtidigt som kundnöjdheten ökar - en direkt positiv inverkan på både topline och bottomline.";
    } else if (audience === 'gen-z') {
      description += " Den är inte bara smart, utan också helt anpassningsbar för att matcha din personliga stil. Och ja, den är självklart klimatsmart också! Styla den, dela den, älska den.";
    }
    
    // Final tone adjustments
    if (tone === 'humorous') {
      description = description.replace("revolutionerande", "sjukt coola").replace("banbrytande teknologi", "teknik som får raketer att se tråkiga ut");
    } else if (tone === 'formal') {
      description = description.replace("ger dig", "tillhandahåller").replace("något som verkligen förändrar", "en innovation som transformerar");
    }
    
    return description;
  }
  
  // Helper function to enhance content based on platform
  function getEnhancedContent(content: string, platform: Platform): string {
    let enhanced = content;
    
    // Platform-specific enhancements
    if (platform === 'instagram') {
      enhanced = enhanced.replace(/\. /g, "! ").replace(/\./g, "! ");
      enhanced += "\n\n#content #engagement #quality";
    } else if (platform === 'linkedin') {
      enhanced = "Kära anslutningar,\n\n" + enhanced;
      enhanced += "\n\nVad anser ni om detta? Dela gärna era insikter i kommentarerna.";
    } else if (platform === 'twitter') {
      // Ensure it's within Twitter's character limit
      if (enhanced.length > 280) {
        enhanced = enhanced.substring(0, 277) + "...";
      }
    }
    
    return enhanced;
  }

  const handleResetSelection = () => {
    setSelectedSuggestion(null);
    setGeneratedContent('');
    setPrompt('');
    setCustomPrompt('');
    setSelectedTemplate('');
  };

  const handleApplySuggestion = () => {
    if (onApplySuggestion && generatedContent) {
      onApplySuggestion(generatedContent);
      
      // Construct message based on active tab
      let message = "";
      if (activeTab === 'quick' && selectedSuggestion) {
        message = `${suggestions.find(s => s.id === selectedSuggestion)?.label} har tillämpats på ditt innehåll.`;
      } else {
        message = "Optimerat innehåll har tillämpats.";
      }
      
      toast({
        title: "Förslag tillämpat",
        description: message
      });
      
      handleResetSelection();
    }
  };

  return (
    <Card className="h-full border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center">
          <BrainCircuit className="mr-2 h-5 w-5 text-primary" />
          AI-Assistent 2.0
        </CardTitle>
        <CardDescription>
          Skapa, optimera och anpassa ditt innehåll med AI
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        {/* Tabs for quick vs advanced */}
        {!selectedSuggestion && !generatedContent && (
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'quick' | 'advanced')} className="mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="quick">Snabbstart</TabsTrigger>
              <TabsTrigger value="advanced">Avancerad</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        
        {activeTab === 'quick' && !selectedSuggestion && !generatedContent && (
          // Visa lista med snabba förslag
          <div className="space-y-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => setSelectedSuggestion(suggestion.id)}
                className="w-full p-3 text-left rounded-md hover:bg-primary/10 transition-colors border border-transparent hover:border-primary/20"
              >
                <div className="flex items-center">
                  <div className="mr-3 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {suggestion.icon}
                  </div>
                  <div>
                    <div className="font-medium">{suggestion.label}</div>
                    <div className="text-xs text-muted-foreground">{suggestion.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
        
        {activeTab === 'advanced' && !selectedSuggestion && !generatedContent && (
          // Advanced options form
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Innehållstyp</label>
              <Select value={contentCategory} onValueChange={(value) => setContentCategory(value as ContentCategory)}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj innehållstyp" />
                </SelectTrigger>
                <SelectContent>
                  {contentCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Plattform</label>
              <Select value={platform} onValueChange={(value) => setPlatform(value as Platform)}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj plattform" />
                </SelectTrigger>
                <SelectContent>
                  {platformOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Ton</label>
              <Select value={tone} onValueChange={(value) => setTone(value as ToneOfVoice)}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj ton" />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Målgrupp</label>
              <Select value={audience} onValueChange={(value) => setAudience(value as AudienceType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj målgrupp" />
                </SelectTrigger>
                <SelectContent>
                  {audienceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Anpassad instruktion (valfri)</label>
              <Textarea
                placeholder="Beskriv hur du vill att AI ska anpassa innehållet..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Eller välj en prompt-mall</label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj en färdig mall (valfritt)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Ingen mall</SelectItem>
                  {promptTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTemplate && (
                <div className="text-xs text-muted-foreground">
                  {promptTemplates.find(t => t.id === selectedTemplate)?.description}
                </div>
              )}
            </div>
            
            <Button 
              className="w-full" 
              onClick={generateSuggestion}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Genererar...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generera innehåll
                </>
              )}
            </Button>
          </div>
        )}
        
        {activeTab === 'quick' && selectedSuggestion && !generatedContent && (
          // Show prompt input and generate button for quick options
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-medium flex items-center">
                {suggestions.find(s => s.id === selectedSuggestion)?.icon}
                <span className="ml-2">{suggestions.find(s => s.id === selectedSuggestion)?.label}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleResetSelection}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Tillbaka
              </Button>
            </div>
            
            {/* Platform and tone options for quick suggestions */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-medium">Plattform</label>
                <Select value={platform} onValueChange={(value) => setPlatform(value as Platform)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Välj plattform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platformOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-medium">Ton</label>
                <Select value={tone} onValueChange={(value) => setTone(value as ToneOfVoice)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Välj ton" />
                  </SelectTrigger>
                  <SelectContent>
                    {toneOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Input
                placeholder="Valfritt: ge specifika instruktioner..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <Button 
                className="w-full" 
                onClick={generateSuggestion}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Genererar...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generera förslag
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
        
        {generatedContent && (
          // Show generated content
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-medium flex items-center">
                {activeTab === 'quick' ? (
                  suggestions.find(s => s.id === selectedSuggestion)?.icon
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
                <span className="ml-2">
                  {activeTab === 'quick' 
                    ? suggestions.find(s => s.id === selectedSuggestion)?.label
                    : 'Anpassat innehåll'
                  }
                </span>
              </div>
              <div className="flex gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={generateSuggestion} 
                  className="h-8 px-2 text-xs"
                  disabled={isGenerating}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Generera ny
                </Button>
                <Button variant="ghost" size="sm" onClick={handleResetSelection} className="h-8">
                  Tillbaka
                </Button>
              </div>
            </div>
            <div className="p-3 rounded-md bg-primary/5 border border-primary/10 text-sm whitespace-pre-wrap">
              {generatedContent}
            </div>
          </div>
        )}
      </CardContent>
      {generatedContent && (
        <CardFooter>
          <Button 
            onClick={handleApplySuggestion} 
            className="w-full"
          >
            <Check className="mr-2 h-4 w-4" />
            Tillämpa förslag
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}