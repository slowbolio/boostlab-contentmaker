import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2, Clock, RotateCw, Sparkles, ZoomIn, Lightbulb, Wand2 } from "lucide-react";

type EnhancementType = 'improve' | 'expand' | 'summarize' | 'localize';
type ToneType = 'professional' | 'casual' | 'friendly' | 'formal';
type LengthType = 'short' | 'medium' | 'long';

interface EnhancementOption {
  value: EnhancementType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const enhancementOptions: EnhancementOption[] = [
  {
    value: 'improve',
    label: 'Förbättra kvalitet',
    description: 'Förbättra grammatik, tydlighet och allmän kvalitet',
    icon: <Sparkles className="h-4 w-4" />
  },
  {
    value: 'expand',
    label: 'Expandera innehåll',
    description: 'Lägg till mer detaljer och information',
    icon: <ZoomIn className="h-4 w-4" />
  },
  {
    value: 'summarize',
    label: 'Sammanfatta',
    description: 'Skapa en kortare version som behåller nyckelinnehållet',
    icon: <Lightbulb className="h-4 w-4" />
  },
  {
    value: 'localize',
    label: 'Lokalisera innehåll',
    description: 'Anpassa för svensk marknad och kultur',
    icon: <Wand2 className="h-4 w-4" />
  }
];

export default function ContentEnhancer() {
  const { toast } = useToast();
  const [originalContent, setOriginalContent] = useState('');
  const [enhancedContent, setEnhancedContent] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [selectedEnhancement, setSelectedEnhancement] = useState<EnhancementType>('improve');
  const [tone, setTone] = useState<ToneType>('professional');
  const [targetAudience, setTargetAudience] = useState('');
  const [platform, setPlatform] = useState('');
  const [length, setLength] = useState<LengthType>('medium');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');

  // Reset enhanced content when original content changes
  useEffect(() => {
    setEnhancedContent('');
  }, [originalContent, selectedEnhancement, tone, platform, length]);

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  const handleEnhance = () => {
    if (!originalContent.trim()) {
      toast({
        title: "Innehåll saknas",
        description: "Ange innehåll att förbättra",
        variant: "destructive"
      });
      return;
    }

    setIsEnhancing(true);

    // Simulera API-anrop för att förbättra innehållet
    setTimeout(() => {
      let result = '';
      switch (selectedEnhancement) {
        case 'improve':
          result = `${originalContent.trim()}

[Förbättrad version]:

${originalContent.trim().replace(
            /detta är/gi, 
            "detta representerar"
          ).replace(
            /vi har/gi,
            "vi har framgångsrikt"
          )} 

${keywords.length > 0 ? `\n\nNyckelord inkluderade: ${keywords.join(', ')}` : ''}
${targetAudience ? `\nAnpassad för: ${targetAudience}` : ''}`;
          break;
          
        case 'expand':
          result = `${originalContent.trim()}

[Expanderad version]:

${originalContent.trim()}

Dessutom är det viktigt att notera att denna strategi har visat sig vara effektiv i flera olika sammanhang. Studier visar att engagemang ökar med upp till 45% när innehållet är väl strukturerat och målgruppsanpassat. 

${keywords.length > 0 ? `\nFör att optimera innehållet ytterligare har vi fokuserat på följande nyckelområden: ${keywords.join(', ')}.` : ''}

Genom att implementera dessa förändringar kan vi förvänta oss betydande förbättringar i både räckvidd och konvertering, särskilt när det gäller ${targetAudience || 'vår målgrupp'}.

${platform ? `\nDetta innehåll är specifikt anpassat för ${platform} för att maximera engagemang på denna plattform.` : ''}`;
          break;
          
        case 'summarize':
          result = `${originalContent.trim()}

[Sammanfattad version]:

${originalContent.split('.').slice(0, length === 'short' ? 1 : length === 'medium' ? 2 : 3).join('.')}. 

${keywords.length > 0 ? `\nNyckelord: ${keywords.join(', ')}` : ''}`;
          break;
          
        case 'localize':
          result = `${originalContent.trim()}

[Lokaliserad för svensk marknad]:

${originalContent.trim().replace(
            /customers/gi, 
            "kunder"
          ).replace(
            /strategy/gi,
            "strategi"
          )} 

${platform ? `\nAnpassad för ${platform} på den svenska marknaden.` : ''}`;
          break;
          
        default:
          result = originalContent;
      }
      
      // Lägg till tone-justeringar
      let tonePrefix = '';
      switch (tone) {
        case 'professional':
          tonePrefix = 'Här är den professionellt förbättrade versionen av ditt innehåll:';
          break;
        case 'casual':
          tonePrefix = 'Här är en mer avslappnad version av ditt innehåll:';
          result = result.replace(/Vi är glada att/gi, "Kul att");
          break;
        case 'friendly':
          tonePrefix = 'Här är en vänligare version av ditt innehåll:';
          result = result.replace(/Välkommen/gi, "Hej där! Välkommen");
          break;
        case 'formal':
          tonePrefix = 'Här är den formella versionen av ditt innehåll:';
          result = result.replace(/Hej/gi, "Bästa");
          break;
      }
      
      setEnhancedContent(`${tonePrefix}\n\n${result}`);
      setIsEnhancing(false);
      
      toast({
        title: "Innehåll förbättrat",
        description: `${enhancementOptions.find(e => e.value === selectedEnhancement)?.label} har tillämpats på ditt innehåll`,
      });
    }, 2000);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(enhancedContent);
      toast({
        title: "Kopierat!",
        description: "Innehållet har kopierats till urklipp",
      });
    } catch (error) {
      toast({
        title: "Kunde inte kopiera",
        description: "Ett fel uppstod vid kopiering till urklipp",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Innehållsförbättrare</h1>
        <p className="text-muted-foreground">
          Förbättra ditt befintliga innehåll med AI-assistans
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Originalinnehåll</CardTitle>
              <CardDescription>
                Klistra in ditt nuvarande innehåll nedan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Klistra in ditt befintliga innehåll här..." 
                className="min-h-[200px]"
                value={originalContent}
                onChange={(e) => setOriginalContent(e.target.value)}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Förbättringsalternativ</CardTitle>
              <CardDescription>
                Välj hur du vill förbättra ditt innehåll
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {enhancementOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`p-4 rounded-lg border text-left transition-all hover:border-primary/50 ${
                      selectedEnhancement === option.value 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border'
                    }`}
                    onClick={() => setSelectedEnhancement(option.value)}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`p-1.5 rounded-full ${
                        selectedEnhancement === option.value 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {option.icon}
                      </div>
                      <h3 className="font-medium">{option.label}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </button>
                ))}
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tone">Ton</Label>
                    <Select value={tone} onValueChange={(value: ToneType) => setTone(value)}>
                      <SelectTrigger id="tone">
                        <SelectValue placeholder="Välj ton" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professionell</SelectItem>
                        <SelectItem value="casual">Avslappnad</SelectItem>
                        <SelectItem value="friendly">Vänlig</SelectItem>
                        <SelectItem value="formal">Formell</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="platform">Plattform</Label>
                    <Select value={platform} onValueChange={setPlatform}>
                      <SelectTrigger id="platform">
                        <SelectValue placeholder="Välj plattform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="website">Webbplats</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="targetAudience">Målgrupp</Label>
                    <Input 
                      id="targetAudience" 
                      placeholder="T.ex. 'Företagsledare, 30-50 år'" 
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="length">Längd</Label>
                    <Select value={length} onValueChange={(value: LengthType) => setLength(value)}>
                      <SelectTrigger id="length">
                        <SelectValue placeholder="Välj längd" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Kort</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="long">Lång</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="keywords">Nyckelord att inkludera</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="keywords" 
                      placeholder="Ange nyckelord" 
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <Button 
                      type="button" 
                      onClick={addKeyword}
                      variant="secondary"
                    >
                      Lägg till
                    </Button>
                  </div>
                  
                  {keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {keywords.map(keyword => (
                        <Badge 
                          key={keyword}
                          className="flex items-center gap-1 px-3 py-1"
                          variant="secondary"
                        >
                          {keyword}
                          <button 
                            className="ml-1 hover:text-destructive" 
                            onClick={() => removeKeyword(keyword)}
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleEnhance} 
                disabled={isEnhancing || !originalContent.trim()}
                className="w-full"
              >
                {isEnhancing ? (
                  <>
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                    Förbättrar...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Förbättra innehåll
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Förbättrat resultat</CardTitle>
              <CardDescription>
                AI-genererad förbättring av ditt innehåll
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[calc(100%-8rem)]">
              {enhancedContent ? (
                <Tabs defaultValue="result">
                  <TabsList className="mb-4">
                    <TabsTrigger value="result">Resultat</TabsTrigger>
                    <TabsTrigger value="comparison">Jämförelse</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="result" className="h-full">
                    <div className="rounded-lg border bg-muted/40 p-4 h-[400px] overflow-y-auto whitespace-pre-wrap">
                      {enhancedContent}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="comparison" className="h-full">
                    <div className="grid grid-cols-2 gap-4 h-[400px]">
                      <div className="rounded-lg border bg-muted/40 p-4 overflow-y-auto">
                        <h3 className="text-sm font-medium mb-2 flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Original
                        </h3>
                        <div className="text-sm">{originalContent}</div>
                      </div>
                      <div className="rounded-lg border bg-muted/40 p-4 overflow-y-auto">
                        <h3 className="text-sm font-medium mb-2 flex items-center text-primary">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Förbättrad
                        </h3>
                        <div className="text-sm">{enhancedContent}</div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="h-full flex items-center justify-center text-center text-muted-foreground border rounded-lg bg-muted/40 p-8">
                  <div>
                    <Sparkles className="h-12 w-12 mb-4 mx-auto opacity-20" />
                    <p className="mb-2">Ditt förbättrade innehåll kommer att visas här</p>
                    <p className="text-sm">Klistra in innehåll och välj förbättringsalternativ för att börja</p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              {enhancedContent && (
                <Button 
                  onClick={copyToClipboard} 
                  variant="secondary"
                >
                  Kopiera till urklipp
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}