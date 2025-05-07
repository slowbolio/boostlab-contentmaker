import React from 'react';

interface ReadabilityScoreProps {
  readabilityScore: number;
  contentLength: number;
}

export default function ReadabilityScore({ readabilityScore, contentLength }: ReadabilityScoreProps) {
  // Determine readability level
  const getReadabilityLevel = (score: number) => {
    if (score >= 90) return { level: 'Mycket lätt', description: 'Lätt att förstå för en genomsnittlig 10-11-åring. De flesta meningar innehåller vanliga ord och enkel meningsbyggnad.' };
    if (score >= 80) return { level: 'Lätt', description: 'Lätt att förstå för en genomsnittlig 12-13-åring. Innehåller mestadels korta, enkla meningar.' };
    if (score >= 70) return { level: 'Ganska lätt', description: 'Lätt att förstå för en genomsnittlig 14-15-åring. Innehåller några längre meningar.' };
    if (score >= 60) return { level: 'Standard', description: 'Lätt att förstå för en genomsnittlig 16-17-åring. Läsbar för de flesta internetanvändare.' };
    if (score >= 50) return { level: 'Ganska svårt', description: 'Ganska svårt att läsa. Bäst förståeligt för personer med gymnasieutbildning.' };
    if (score >= 30) return { level: 'Svårt', description: 'Svårt att läsa. Bäst förståeligt för universitetsutbildade.' };
    return { level: 'Mycket svårt', description: 'Mycket svårt att läsa. Bäst förståeligt för universitetsutbildade. Innehåller många svåra ord och komplexa meningar.' };
  };
  
  const readabilityInfo = getReadabilityLevel(readabilityScore);
  
  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    if (score >= 30) return 'text-orange-400';
    return 'text-red-500';
  };
  
  // Get word count class
  const getWordCountClass = (wordCount: number) => {
    if (wordCount < 300) return 'text-red-400';
    if (wordCount < 600) return 'text-yellow-400';
    return 'text-green-400';
  };
  
  // Get word count message
  const getWordCountMessage = (wordCount: number) => {
    if (wordCount < 300) return 'För kort (minst 300 rekommenderas)';
    if (wordCount < 600) return 'Acceptabel längd (mer än 600 rekommenderas)';
    if (wordCount < 1000) return 'Bra längd';
    return 'Utmärkt längd';
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
          <div className="text-sm text-muted-foreground mb-1">Läsbarhetspoäng</div>
          <div className="flex items-end gap-2">
            <div className={`text-3xl font-bold ${getScoreColor(readabilityScore)}`}>
              {Math.round(readabilityScore)}
            </div>
            <div className="text-sm text-muted-foreground">/100</div>
          </div>
          <div className="mt-2 text-sm font-medium">{readabilityInfo.level}</div>
          <div className="mt-1 text-xs text-muted-foreground">{readabilityInfo.description}</div>
          
          <div className="mt-4">
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full ${getScoreColor(readabilityScore)}`}
                style={{ width: `${readabilityScore}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Svårt</span>
              <span>Medel</span>
              <span>Lätt</span>
            </div>
          </div>
        </div>
        
        <div className="p-4 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
          <div className="text-sm text-muted-foreground mb-1">Innehållslängd</div>
          <div className="flex items-end gap-2">
            <div className={`text-3xl font-bold ${getWordCountClass(contentLength)}`}>
              {contentLength}
            </div>
            <div className="text-sm text-muted-foreground">ord</div>
          </div>
          <div className={`mt-2 text-sm ${getWordCountClass(contentLength)}`}>
            {getWordCountMessage(contentLength)}
          </div>
          
          <div className="mt-4">
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full ${getWordCountClass(contentLength)}`}
                style={{ width: `${Math.min(100, (contentLength / 10))}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>300</span>
              <span>600</span>
              <span>1000+</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-sm">
        <h3 className="font-medium mb-2">Läsbarhetsrekommendationer:</h3>
        <ul className="list-disc text-sm text-muted-foreground ml-5 space-y-1">
          <li>Använd korta, enkla meningar när det är möjligt</li>
          <li>Välj enkla ord framför komplexa</li>
          <li>Undvik onödigt yrkesmässigt fackspråk eller jargong</li>
          <li>Dela upp texten i stycken med tydliga rubriker</li>
          <li>Använd punktlistor för att förtydliga och förenkla information</li>
          <li>Skriv i aktiv form snarare än passiv form när möjligt</li>
        </ul>
      </div>
    </div>
  );
}