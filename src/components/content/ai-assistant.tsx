import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Wand2, Zap, BrainCircuit, Type, MoreHorizontal, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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

export interface AIAssistantProps {
  currentContent?: string;
  onApplySuggestion?: (newContent: string) => void;
}

export function AIAssistant({ currentContent = '', onApplySuggestion }: AIAssistantProps) {
  const { toast } = useToast();
  const [selectedSuggestion, setSelectedSuggestion] = useState<SuggestionType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [prompt, setPrompt] = useState('');

  // Mock av AI-generering
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
    
    // Simulera API-anrop med timeout
    setTimeout(() => {
      let result = '';
      
      switch (selectedSuggestion) {
        case 'improve':
          result = currentContent.replace(
            /detta är/gi, 
            "detta representerar"
          ).replace(
            /vi har/gi,
            "vi har framgångsrikt"
          ) + "\n\n[Förbättrad stavning, grammatik och flöde]";
          break;
        case 'expand':
          result = currentContent + "\n\nDessutom är det viktigt att notera att denna strategi har visat sig vara effektiv i flera olika sammanhang. Studier visar att engagemang ökar med upp till 45% när innehållet är väl strukturerat och målgruppsanpassat. Genom att implementera dessa förändringar kan vi förvänta oss betydande förbättringar i både räckvidd och konvertering.";
          break;
        case 'summarize':
          result = "SAMMANFATTNING:\n" + currentContent.split('.').slice(0, 2).join('.') + ".";
          break;
        case 'headlines':
          result = "RUBRIKFÖRSLAG:\n\n1. \"Revolutionera din strategi: Nya insikter för 2025\"\n2. \"Framgång garanterad: 5 steg till bättre resultat\"\n3. \"Expertens hemlighet: Så når du dina mål snabbare\"";
          break;
        case 'localize':
          result = currentContent.replace(
            /customers/gi, 
            "kunder"
          ).replace(
            /strategy/gi,
            "strategi"
          ) + "\n\n[Anpassat för svensk publik]";
          break;
        case 'personalize':
          result = "PERSONALISERAD VERSION:\n\n" + currentContent.replace(
            /Kära kund/gi,
            "Hej där!"
          ) + "\n\n[Anpassad till en mer avslappnad och personlig ton]";
          break;
        default:
          result = currentContent;
      }
      
      // Använd anpassat prompt om det finns
      if (prompt) {
        result = `ANPASSAT BASERAT PÅ: "${prompt}"\n\n` + result + "\n\n[Anpassat enligt dina anvisningar]";
      }
      
      setGeneratedContent(result);
      setIsGenerating(false);
    }, 2000);
  };

  const handleResetSelection = () => {
    setSelectedSuggestion(null);
    setGeneratedContent('');
    setPrompt('');
  };

  const handleApplySuggestion = () => {
    if (onApplySuggestion && generatedContent) {
      onApplySuggestion(generatedContent);
      toast({
        title: "Förslag tillämpat",
        description: `${suggestions.find(s => s.id === selectedSuggestion)?.label} har tillämpats på ditt innehåll.`
      });
      handleResetSelection();
    }
  };

  return (
    <Card className="h-full border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center">
          <BrainCircuit className="mr-2 h-5 w-5 text-primary" />
          AI-Assistent
        </CardTitle>
        <CardDescription>
          Låt AI hjälpa dig att förbättra ditt innehåll
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        {!selectedSuggestion ? (
          // Visa lista med förslag när inget är valt
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
        ) : generatedContent ? (
          // Visa genererat innehåll
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-medium flex items-center">
                {suggestions.find(s => s.id === selectedSuggestion)?.icon}
                <span className="ml-2">{suggestions.find(s => s.id === selectedSuggestion)?.label}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleResetSelection}>
                Tillbaka
              </Button>
            </div>
            <div className="p-3 rounded-md bg-primary/5 border border-primary/10 text-sm whitespace-pre-wrap">
              {generatedContent}
            </div>
          </div>
        ) : (
          // Visa prompt input och genereringsknapp
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-medium flex items-center">
                {suggestions.find(s => s.id === selectedSuggestion)?.icon}
                <span className="ml-2">{suggestions.find(s => s.id === selectedSuggestion)?.label}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleResetSelection}>
                Avbryt
              </Button>
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
                    <span className="animate-pulse">Genererar...</span>
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
      </CardContent>
      {generatedContent && (
        <CardFooter>
          <Button 
            onClick={handleApplySuggestion} 
            className="w-full"
          >
            Tillämpa förslag
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}