import React, { useState } from 'react';
import { SEORecommendation } from '@/services/seo-service';

interface SEORecommendationsProps {
  recommendations: SEORecommendation[];
}

export default function SEORecommendations({ recommendations }: SEORecommendationsProps) {
  const [filter, setFilter] = useState<'all' | 'error' | 'warning' | 'success'>('all');
  
  // Sort recommendations by impact and type
  const sortedRecommendations = [...recommendations].sort((a, b) => {
    // First sort by type (error > warning > success)
    const typeOrder = { error: 0, warning: 1, success: 2 };
    if (typeOrder[a.type] !== typeOrder[b.type]) {
      return typeOrder[a.type] - typeOrder[b.type];
    }
    
    // Then sort by impact (high > medium > low)
    const impactOrder = { high: 0, medium: 1, low: 2 };
    return impactOrder[a.impact] - impactOrder[b.impact];
  });
  
  const filteredRecommendations = filter === 'all' 
    ? sortedRecommendations 
    : sortedRecommendations.filter(rec => rec.type === filter);
  
  const counts = {
    error: recommendations.filter(rec => rec.type === 'error').length,
    warning: recommendations.filter(rec => rec.type === 'warning').length,
    success: recommendations.filter(rec => rec.type === 'success').length,
    all: recommendations.length
  };
  
  const getImpactBadge = (impact: 'high' | 'medium' | 'low') => {
    switch(impact) {
      case 'high':
        return <span className="px-2 py-1 rounded text-xs bg-red-900/30 text-red-400">Hög</span>;
      case 'medium':
        return <span className="px-2 py-1 rounded text-xs bg-yellow-900/30 text-yellow-400">Medium</span>;
      case 'low':
        return <span className="px-2 py-1 rounded text-xs bg-blue-900/30 text-blue-400">Låg</span>;
    }
  };
  
  const getTypeIcon = (type: 'error' | 'warning' | 'success') => {
    switch(type) {
      case 'error':
        return (
          <div className="flex-shrink-0 w-5 h-5 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="flex-shrink-0 w-5 h-5 text-yellow-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'success':
        return (
          <div className="flex-shrink-0 w-5 h-5 text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-full ${
            filter === 'all' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground'
          }`}
        >
          Alla
          <span className="px-1.5 py-0.5 bg-background/20 rounded-full text-xs">
            {counts.all}
          </span>
        </button>
        
        <button
          onClick={() => setFilter('error')}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-full ${
            filter === 'error' 
              ? 'bg-red-500 text-white' 
              : 'bg-red-500/20 text-red-400'
          }`}
        >
          Problem
          <span className={`px-1.5 py-0.5 rounded-full text-xs ${
            filter === 'error' ? 'bg-white/20 text-white' : 'bg-red-500/20 text-red-400'
          }`}>
            {counts.error}
          </span>
        </button>
        
        <button
          onClick={() => setFilter('warning')}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-full ${
            filter === 'warning' 
              ? 'bg-yellow-500 text-white' 
              : 'bg-yellow-500/20 text-yellow-400'
          }`}
        >
          Förbättringar
          <span className={`px-1.5 py-0.5 rounded-full text-xs ${
            filter === 'warning' ? 'bg-white/20 text-white' : 'bg-yellow-500/20 text-yellow-400'
          }`}>
            {counts.warning}
          </span>
        </button>
        
        <button
          onClick={() => setFilter('success')}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-full ${
            filter === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-green-500/20 text-green-400'
          }`}
        >
          Bra
          <span className={`px-1.5 py-0.5 rounded-full text-xs ${
            filter === 'success' ? 'bg-white/20 text-white' : 'bg-green-500/20 text-green-400'
          }`}>
            {counts.success}
          </span>
        </button>
      </div>
      
      <div className="space-y-3 mt-4">
        {filteredRecommendations.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">
            Inga rekommendationer att visa.
          </div>
        ) : (
          filteredRecommendations.map((recommendation) => (
            <div 
              key={recommendation.id}
              className="p-4 rounded-lg border border-border bg-card/50 backdrop-blur-sm"
            >
              <div className="flex gap-3">
                {getTypeIcon(recommendation.type)}
                
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-medium">{recommendation.message}</h3>
                    <div className="flex-shrink-0">
                      {getImpactBadge(recommendation.impact)}
                    </div>
                  </div>
                  
                  {recommendation.details && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {recommendation.details}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}