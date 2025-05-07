import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import SEOAnalyzer from "@/components/seo/seo-analyzer";

export default function SEOAnalysis() {
  const [content, setContent] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [seoScore, setSeoScore] = useState<number | null>(null);
  
  const handleAnalysisComplete = (score: number) => {
    setSeoScore(score);
    setAnalyzing(false);
  };
  
  const handleAnalyze = () => {
    if (content.trim()) {
      setAnalyzing(true);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">SEO Analys</h1>
        <p className="text-muted-foreground">
          Optimera ditt innehåll för bättre synlighet i sökmotorer
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {!analyzing ? (
          <Card>
            <CardHeader>
              <CardTitle>Analysera innehåll</CardTitle>
              <CardDescription>
                Klistra in ditt innehåll för att få en detaljerad SEO-analys
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Klistra in innehållet som du vill analysera här..."
                  rows={10}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="resize-none"
                />
                <Button onClick={handleAnalyze} disabled={!content.trim()}>
                  Starta analys
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <SEOAnalyzer 
            initialContent={content}
            onAnalysisComplete={handleAnalysisComplete}
            autoAnalyze={false}
          />
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Varför SEO-analys är viktigt</CardTitle>
            <CardDescription>
              Maximera din synlighet och nå rätt målgrupp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium">Bättre synlighet</h3>
                <p className="text-sm text-muted-foreground">
                  Öka chanserna att ditt innehåll rankas högre i sökresultaten och når fler potentiella kunder.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium">Relevans</h3>
                <p className="text-sm text-muted-foreground">
                  Skapa innehåll som är relevant för din målgrupp och de söktermer de använder för att hitta lösningar.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium">Ökad trafik</h3>
                <p className="text-sm text-muted-foreground">
                  SEO-optimerat innehåll driver mer organisk trafik till din webbplats, vilket kan leda till fler konverteringar.
                </p>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-yellow-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Pro-tips för SEO</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Använd relevanta nyckelord i titlar, meta-beskrivningar och rubriker. Skapa värdefullt, 
                    unikt innehåll som löser problem för din målgrupp. Se till att ditt innehåll är läsbart 
                    och välstrukturerat med tydliga rubriker och korta stycken.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}