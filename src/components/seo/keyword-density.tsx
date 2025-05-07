import React from 'react';
import { KeywordDensity as KeywordDensityType } from '@/services/seo-service';

interface KeywordDensityProps {
  keywordData: KeywordDensityType[];
}

export default function KeywordDensity({ keywordData }: KeywordDensityProps) {
  // Sort keywords by count descending
  const sortedKeywords = [...keywordData].sort((a, b) => b.count - a.count);
  
  const getKeywordStatus = (density: number) => {
    if (density === 0) return 'missing';
    if (density < 0.5) return 'low';
    if (density > 3) return 'high';
    return 'good';
  };
  
  const getDensityColor = (density: number) => {
    const status = getKeywordStatus(density);
    switch(status) {
      case 'missing': return 'text-red-500 bg-red-900/20';
      case 'low': return 'text-yellow-400 bg-yellow-900/20';
      case 'high': return 'text-orange-400 bg-orange-900/20';
      case 'good': return 'text-green-400 bg-green-900/20';
    }
  };
  
  const getStatusLabel = (density: number) => {
    const status = getKeywordStatus(density);
    switch(status) {
      case 'missing': return 'Saknas';
      case 'low': return 'För låg';
      case 'high': return 'För hög';
      case 'good': return 'Bra';
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">Nyckelordsdensitet</h3>
      
      <div className="space-y-3">
        {sortedKeywords.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            Inga nyckelord att analysera. Lägg till målnyckelord för att se densitetsdata.
          </div>
        ) : (
          sortedKeywords.map((keyword, index) => (
            <div key={index} className="p-3 rounded-lg border border-border bg-card/50">
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium truncate">"{keyword.keyword}"</div>
                <div className={`text-xs px-2 py-0.5 rounded-full ${getDensityColor(keyword.density)}`}>
                  {getStatusLabel(keyword.density)}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        keyword.density === 0 ? 'bg-red-500' :
                        keyword.density < 0.5 ? 'bg-yellow-500' :
                        keyword.density > 3 ? 'bg-orange-500' :
                        'bg-green-500'
                      }`}
                      style={{ 
                        width: `${Math.min(100, Math.max(keyword.density * 25, 4))}%` 
                      }}
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <div>
                    <span className="font-medium text-foreground">{keyword.count}</span> förekomster
                  </div>
                  <div>
                    <span className="font-medium text-foreground">{keyword.density.toFixed(1)}%</span> densitet
                  </div>
                </div>
              </div>
              
              {keyword.density === 0 && (
                <div className="mt-2 text-xs text-red-400">
                  Detta nyckelord saknas i din text.
                </div>
              )}
              {keyword.density > 0 && keyword.density < 0.5 && (
                <div className="mt-2 text-xs text-yellow-400">
                  Öka frekvensen för detta nyckelord (mål: 1-2%).
                </div>
              )}
              {keyword.density > 3 && (
                <div className="mt-2 text-xs text-orange-400">
                  Reducera frekvensen av detta nyckelord för att undvika nyckelordsstoppning.
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      <div className="text-xs text-muted-foreground mt-2">
        * Ideal nyckelordsdensitet är 1-2% för primära nyckelord
      </div>
    </div>
  );
}