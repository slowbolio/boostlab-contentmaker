import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock content data
const generateMockContent = () => {
  const contentTypes = ['Blog', 'Social Media', 'Email', 'Landing Page'];
  const platforms = ['Facebook', 'Instagram', 'LinkedIn', 'Twitter', 'Website', 'Blog'];
  const titles = [
    '10 tips för att förbättra din marknadsföring',
    'Så här ökar du din digitala närvaro 2023',
    'Guide: Kom igång med sociala medier',
    'Öka konverteringar med content marketing',
    'Skapa innehåll som driver resultat',
    'Framtiden för digital marknadsföring',
    'Analys: Trender inom content marketing',
    'De bästa verktygen för innehållsskapare',
    'Hur du mäter ROI på innehållsmarknadsföring',
    'Strategier för att öka organisk trafik'
  ];
  
  return Array.from({ length: 10 }, (_, i) => {
    const views = Math.floor(Math.random() * 2000) + 100;
    const engagement = Math.floor(Math.random() * 500) + 50;
    const conversions = Math.floor(Math.random() * 50) + 5;
    
    // Calculate score based on a weighted formula
    const score = (views * 0.4) + (engagement * 0.4) + (conversions * 0.2);
    
    return {
      id: i + 1,
      title: titles[i],
      contentType: contentTypes[Math.floor(Math.random() * contentTypes.length)],
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      publishDate: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      views,
      engagement,
      conversions,
      score: Math.floor(score)
    };
  }).sort((a, b) => b.score - a.score); // Sort by score descending
};

const mockContent = generateMockContent();

type SortKey = 'score' | 'views' | 'engagement' | 'conversions';

export default function ContentRanking() {
  const [sortKey, setSortKey] = useState<SortKey>('score');
  const [sortedContent, setSortedContent] = useState(mockContent);
  
  const handleSort = (key: SortKey) => {
    setSortKey(key);
    setSortedContent([...mockContent].sort((a, b) => b[key] - a[key]));
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Bäst presterande innehåll</CardTitle>
        <CardDescription>Rankad lista över ditt mest framgångsrika innehåll</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <button 
            onClick={() => handleSort('score')}
            className={`text-xs px-3 py-1 rounded-md ${
              sortKey === 'score' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground'
            }`}
          >
            Total poäng
          </button>
          <button 
            onClick={() => handleSort('views')}
            className={`text-xs px-3 py-1 rounded-md ${
              sortKey === 'views' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground'
            }`}
          >
            Visningar
          </button>
          <button 
            onClick={() => handleSort('engagement')}
            className={`text-xs px-3 py-1 rounded-md ${
              sortKey === 'engagement' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground'
            }`}
          >
            Engagemang
          </button>
          <button 
            onClick={() => handleSort('conversions')}
            className={`text-xs px-3 py-1 rounded-md ${
              sortKey === 'conversions' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground'
            }`}
          >
            Konverteringar
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Rank</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Titel</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Typ</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Plattform</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Publicerad</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Visningar</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Engagemang</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Konverteringar</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Poäng</th>
              </tr>
            </thead>
            <tbody>
              {sortedContent.map((content, index) => (
                <tr 
                  key={content.id} 
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full font-medium ${
                      index === 0 ? 'bg-amber-500 text-amber-950' : 
                      index === 1 ? 'bg-gray-300 text-gray-800' :
                      index === 2 ? 'bg-amber-700 text-amber-100' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-3 px-4 max-w-md truncate">{content.title}</td>
                  <td className="py-3 px-4">
                    <Badge variant="outline">{content.contentType}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge 
                      className={
                        content.platform === 'Facebook' ? 'bg-blue-600' :
                        content.platform === 'Instagram' ? 'bg-purple-600' :
                        content.platform === 'LinkedIn' ? 'bg-blue-800' :
                        content.platform === 'Twitter' ? 'bg-blue-400' :
                        content.platform === 'Website' ? 'bg-gray-600' :
                        'bg-orange-600'
                      }
                    >
                      {content.platform}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{content.publishDate}</td>
                  <td className="py-3 px-4 text-right">{content.views.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">{content.engagement.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">{content.conversions.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-medium">{content.score.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}