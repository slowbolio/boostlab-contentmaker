import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Platform } from "@/services/ai-prompts-service";
import { promptTemplates } from "@/services/ai-prompts-service";
import { Lightbulb, Copy, RefreshCw, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export interface AIContentPreviewProps {
  platform?: string;
  contentCategory?: string;
}

export function AIContentPreview({ platform = 'general', contentCategory = 'body' }: AIContentPreviewProps) {
  const { toast } = useToast();
  const [example, setExample] = useState<string>('');
  const [copied, setCopied] = useState(false);
  
  // Get relevant example based on platform and content category
  useEffect(() => {
    generateExample();
  }, [platform, contentCategory]);

  const generateExample = () => {
    // First try to find a matching template from the prompt library
    const matchingTemplates = promptTemplates.filter(template => 
      (template.platform === platform || platform === 'general') &&
      (template.category === contentCategory || contentCategory === 'body')
    );
    
    if (matchingTemplates.length > 0) {
      // Pick a random matching template
      const randomTemplate = matchingTemplates[Math.floor(Math.random() * matchingTemplates.length)];
      
      // Use one of the examples if available, otherwise create a generic example
      if (randomTemplate.examples && randomTemplate.examples.length > 0) {
        setExample(randomTemplate.examples[0]);
        return;
      }
    }
    
    // Fallback to platform-specific examples
    switch (platform as Platform) {
      case 'instagram':
        setExample("✨ Äntligen lanserar vi vår nya kollektion! Dessa exklusiva designs har tagits fram med stor omsorg för dig som värdesätter både stil och funktion. Swipa för att se fler bilder och besök vår hemsida för mer info! 🛍️\n\nVilken är din favorit? Kommentera nedan! #nykollektion #design #kvalitet");
        break;
      case 'facebook':
        setExample("STORA NYHETER! 🎉\n\nVi är så glada att kunna meddela att vi öppnar en ny butik i Stockholm den 15 september! För att fira erbjuder vi 20% rabatt på HELA sortimentet under invigningshelgen.\n\nVi kommer också ha specialerbjudanden, överraskningar och goodies till de första 50 kunderna varje dag.\n\nTagga en vän som behöver veta detta och dela gärna inlägget! Vi ses där! ❤️");
        break;
      case 'linkedin':
        setExample("Jag är glad att tillkännage att vårt företag just har lanserat en ny innovativ lösning som revolutionerar hur företag hanterar sin datadrivna beslutsprocess.\n\nEfter 18 månaders intensiv forskning och utveckling har vårt team skapat en plattform som:\n\n✅ Reducerar analystiden med 68%\n✅ Ökar prognosprecisionen med 42%\n✅ Integrerar sömlöst med befintliga system\n\nDetta är resultatet av fantastiskt teamarbete och ett starkt fokus på kundernas verkliga behov.\n\nVill du veta mer om hur denna lösning kan hjälpa ditt företag? Kommentera nedan eller skicka mig ett direktmeddelande.");
        break;
      case 'twitter':
        setExample("Vårt team har just lanserat vår nya app som sparar dig 3 timmar i veckan på administration. Redan 1000+ nöjda användare! Testa gratis: [länk] #produktivitet #tidsbesparing");
        break;
      case 'blog':
        setExample("# 5 strategier för att förbättra din digitala närvaro\n\nI dagens digitala landskap räcker det inte längre att bara finnas online. För att verkligen sticka ut behöver du en genomtänkt strategi som maximerar din synlighet och engagemang.\n\nLåt oss utforska fem beprövade metoder som kan transformera din digitala närvaro och ge konkreta resultat...");
        break;
      case 'email':
        setExample("Ämne: Exklusivt erbjudande: 30% rabatt - bara 48 timmar kvar!\n\nHej [Förnamn],\n\nJag hoppas att allt är bra med dig.\n\nJag ville personligen meddela dig om vårt exklusiva erbjudande som bara gäller under de nästa 48 timmarna. Som en del av vår värdefulla kundkrets får du 30% rabatt på hela vårt premiumsortiment.\n\nKlicka på knappen nedan för att ta del av erbjudandet innan det försvinner:\n\n[TA DEL AV ERBJUDANDET]\n\nTack för att du fortsätter att välja oss.\n\nMed vänliga hälsningar,\n[Ditt namn]\n[Din position]\n[Företagsnamn]");
        break;
      case 'tiktok':
        setExample("[Start med hook 3 sek]\n\"Visste du att 80% gör detta fel när de använder sociala medier? Jag var också en av dem!\"\n\n[Visa problemet 10 sek]\n\"De flesta lägger all tid på innehåll, men glömmer bort detta kritiska steg som kan öka din räckvidd med över 300%!\"\n\n[Visa lösningen 15 sek]\n\"Hemligheten är att analysera dina topp 3 inlägg varje vecka och identifiera mönster i vad som engagerar din publik. Se här hur jag gör det på bara 2 minuter per vecka!\"\n\n[Call to action 2 sek]\n\"Följ för fler tips som faktiskt fungerar! #socialmediatips #growth #fyp\"");
        break;
      default:
        setExample("Välkommen till vår nya webbplats! Vi är glada över att presentera våra tjänster och produkter för dig. Vårt team är dedikerat till att leverera högsta kvalitet och service.\n\nUtforska vårt sortiment och kontakta oss om du har några frågor. Vi ser fram emot att höra från dig!");
        break;
    }
  };

  const copyExample = () => {
    navigator.clipboard.writeText(example);
    setCopied(true);
    toast({
      title: "Kopierat!",
      description: "Exemplet har kopierats till urklipp.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center">
          <Lightbulb className="mr-2 h-4 w-4 text-primary" />
          Innehållsexempel
        </CardTitle>
        <CardDescription>
          Inspiration för {
            platform === 'general' ? 'ditt innehåll' : 
            platform === 'instagram' ? 'Instagram' : 
            platform === 'facebook' ? 'Facebook' : 
            platform === 'linkedin' ? 'LinkedIn' : 
            platform === 'twitter' ? 'Twitter' : 
            platform === 'tiktok' ? 'TikTok' : 
            platform === 'blog' ? 'bloggar' : 
            platform === 'email' ? 'e-postutskick' : 
            'ditt innehåll'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="p-3 rounded-md bg-secondary/20 text-sm whitespace-pre-wrap border border-secondary/20 max-h-[200px] overflow-y-auto">
            {example}
          </div>
          <div className="flex justify-between">
            <Button variant="outline" size="sm" onClick={generateExample}>
              <RefreshCw className="mr-2 h-3 w-3" />
              Nytt exempel
            </Button>
            <Button variant="secondary" size="sm" onClick={copyExample}>
              {copied ? (
                <>
                  <Check className="mr-2 h-3 w-3" />
                  Kopierat!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-3 w-3" />
                  Kopiera
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}