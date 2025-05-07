import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import SEOScoreIndicator from './seo-score-indicator';
import SEORecommendations from './seo-recommendations';
import KeywordDensity from './keyword-density';
import ReadabilityScore from './readability-score';
import { useSEOAnalysis } from '@/hooks/use-seo-analysis';
import { SEOAnalysisParams } from '@/services/seo-service';

interface SEOAnalyzerProps {
  initialContent?: string;
  initialTitle?: string;
  initialMetaDescription?: string;
  initialKeywords?: string[];
  onAnalysisComplete?: (score: number) => void;
  autoAnalyze?: boolean;
}

export default function SEOAnalyzer({
  initialContent = '',
  initialTitle = '',
  initialMetaDescription = '',
  initialKeywords = [],
  onAnalysisComplete,
  autoAnalyze = true
}: SEOAnalyzerProps) {
  const [title, setTitle] = useState(initialTitle);
  const [metaDescription, setMetaDescription] = useState(initialMetaDescription);
  const [content, setContent] = useState(initialContent);
  const [keywords, setKeywords] = useState<string[]>(initialKeywords);
  const [keywordInput, setKeywordInput] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  const { analyze, isAnalyzing, results, reset } = useSEOAnalysis();
  
  // Run analysis when inputs change (if autoAnalyze is true)
  useEffect(() => {
    if (autoAnalyze) {
      const timer = setTimeout(() => {
        runAnalysis();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [title, metaDescription, content, keywords, autoAnalyze]);
  
  // Notify parent when analysis is complete
  useEffect(() => {
    if (results && onAnalysisComplete) {
      onAnalysisComplete(results.score);
    }
  }, [results, onAnalysisComplete]);
  
  const runAnalysis = () => {
    if (!content) return;
    
    const params: SEOAnalysisParams = {
      content,
      title,
      metaDescription,
      targetKeywords: keywords
    };
    
    analyze(params);
  };
  
  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };
  
  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };
  
  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>SEO Analys</span>
          {results && (
            <SEOScoreIndicator score={results.score} size="sm" />
          )}
        </CardTitle>
        <CardDescription>
          Optimera ditt innehåll för sökmotorer
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 space-y-6">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="title">Titel</Label>
                <Input
                  id="title"
                  placeholder="Ange sidrubrik/titel"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                {results && (
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Nuvarande längd: {title.length} tecken</span>
                    <span className={title.length < 30 || title.length > 60 ? 'text-red-400' : 'text-green-400'}>
                      Rekommenderat: 30-60 tecken
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="meta-description">Metabeskrivning</Label>
                <Textarea
                  id="meta-description"
                  placeholder="Ange metabeskrivning för sidan"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={3}
                />
                {results && (
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Nuvarande längd: {metaDescription.length} tecken</span>
                    <span className={metaDescription.length < 120 || metaDescription.length > 160 ? 'text-red-400' : 'text-green-400'}>
                      Rekommenderat: 120-160 tecken
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="keywords">Målnyckelord</Label>
                <div className="flex gap-2">
                  <Input
                    id="keywords"
                    placeholder="Lägg till nyckelord"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addKeyword();
                      }
                    }}
                  />
                  <Button 
                    variant="secondary"
                    onClick={addKeyword}
                    type="button"
                  >
                    Lägg till
                  </Button>
                </div>
                
                {keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {keywords.map((keyword, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-1.5 bg-secondary px-3 py-1 rounded-full text-sm"
                      >
                        <span>{keyword}</span>
                        <button
                          type="button"
                          onClick={() => removeKeyword(keyword)}
                          className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-muted"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {!autoAnalyze && (
                <Button 
                  className="w-full" 
                  onClick={runAnalysis}
                  disabled={isAnalyzing || !content}
                >
                  {isAnalyzing ? 'Analyserar...' : 'Analysera innehåll'}
                </Button>
              )}
            </div>
            
            {results && (
              <div className="flex justify-center pt-4">
                <SEOScoreIndicator score={results.score} />
              </div>
            )}
          </div>
          
          <div className="md:col-span-8">
            {!results ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 border border-dashed border-border rounded-lg">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 text-primary">
                    <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                    <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">SEO Analys</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  {autoAnalyze 
                    ? 'Fyll i informationen till vänster för att få en SEO-analys av ditt innehåll.' 
                    : 'Klicka på "Analysera innehåll" för att få en SEO-analys av ditt innehåll.'}
                </p>
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="overview">Översikt</TabsTrigger>
                  <TabsTrigger value="readability">Läsbarhet</TabsTrigger>
                  <TabsTrigger value="keywords">Nyckelord</TabsTrigger>
                  <TabsTrigger value="recommendations">Rekommendationer</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-0">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
                      <h3 className="text-sm font-medium mb-2">Sammanfattning</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Totalpoäng</div>
                          <div className="text-lg font-bold">{results.score}/100</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Status</div>
                          <div className={`text-lg font-bold ${
                            results.score >= 80 ? 'text-green-500' :
                            results.score >= 60 ? 'text-green-400' :
                            results.score >= 40 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {results.score >= 80 ? 'Utmärkt' :
                             results.score >= 60 ? 'Bra' :
                             results.score >= 40 ? 'Behöver förbättras' :
                             'Bristfällig'}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Innehållslängd</div>
                          <div className={`text-lg font-bold ${
                            results.contentLength >= 600 ? 'text-green-400' :
                            results.contentLength >= 300 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {results.contentLength} ord
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Läsbarhet</div>
                          <div className={`text-lg font-bold ${
                            results.readabilityScore >= 70 ? 'text-green-400' :
                            results.readabilityScore >= 50 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {results.readabilityScore.toFixed(0)}/100
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
                      <h3 className="text-sm font-medium mb-2">Viktiga problem att åtgärda</h3>
                      <div className="space-y-3">
                        {results.recommendations
                          .filter(rec => rec.type === 'error')
                          .slice(0, 3)
                          .map((rec) => (
                            <div key={rec.id} className="flex gap-2 text-sm">
                              <div className="flex-shrink-0 w-5 h-5 text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div>{rec.message}</div>
                            </div>
                          ))}
                        
                        {results.recommendations.filter(rec => rec.type === 'error').length === 0 && (
                          <div className="text-sm text-green-400 flex gap-2 items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                            </svg>
                            <span>Inga kritiska problem hittades!</span>
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => setActiveTab('recommendations')}
                        className="mt-3 text-xs text-primary hover:underline"
                      >
                        Visa alla rekommendationer →
                      </button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="readability" className="mt-0">
                  <ReadabilityScore 
                    readabilityScore={results.readabilityScore} 
                    contentLength={results.contentLength} 
                  />
                </TabsContent>
                
                <TabsContent value="keywords" className="mt-0">
                  <KeywordDensity keywordData={results.keywordDensity} />
                </TabsContent>
                
                <TabsContent value="recommendations" className="mt-0">
                  <SEORecommendations recommendations={results.recommendations} />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}