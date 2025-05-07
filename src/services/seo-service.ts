// SEO Analysis service

export interface SEOAnalysisResult {
  score: number;
  recommendations: SEORecommendation[];
  keywordDensity: KeywordDensity[];
  readabilityScore: number;
  contentLength: number;
  titleLength: number;
  metaDescriptionLength: number;
}

export interface SEORecommendation {
  id: string;
  type: 'error' | 'warning' | 'success';
  message: string;
  impact: 'high' | 'medium' | 'low';
  details?: string;
}

export interface KeywordDensity {
  keyword: string;
  count: number;
  density: number;
}

export interface SEOAnalysisParams {
  content: string;
  title: string;
  metaDescription: string;
  targetKeywords: string[];
  url?: string;
}

class SEOService {
  // Analyze the content and provide SEO recommendations
  async analyzeSEO(params: SEOAnalysisParams): Promise<SEOAnalysisResult> {
    const { content, title, metaDescription, targetKeywords } = params;
    
    // In a real implementation, this might call an external API or use a more sophisticated algorithm
    // For now, we'll use a simplified analysis
    
    const contentText = this.stripHtml(content);
    const wordCount = this.countWords(contentText);
    const recommendations: SEORecommendation[] = [];
    let score = 100; // Start with perfect score and deduct based on issues
    
    // Title analysis
    if (!title) {
      recommendations.push({
        id: 'missing-title',
        type: 'error',
        message: 'Title saknas',
        impact: 'high',
        details: 'Lägg till en titel för innehållet. Titeln är en av de viktigaste SEO-faktorerna.'
      });
      score -= 20;
    } else if (title.length < 30) {
      recommendations.push({
        id: 'short-title',
        type: 'warning',
        message: 'Titeln är kort',
        impact: 'medium',
        details: 'Titeln är kortare än rekommenderade 30-60 tecken. Överväg att göra den mer beskrivande.'
      });
      score -= 5;
    } else if (title.length > 60) {
      recommendations.push({
        id: 'long-title',
        type: 'warning',
        message: 'Titeln är för lång',
        impact: 'medium',
        details: 'Titeln är längre än rekommenderade 60 tecken och kan bli avklippt i sökresultaten.'
      });
      score -= 5;
    } else {
      recommendations.push({
        id: 'good-title',
        type: 'success',
        message: 'Titeln har bra längd',
        impact: 'high'
      });
    }
    
    // Check if title contains target keywords
    const titleContainsKeyword = targetKeywords.some(keyword => 
      title.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (!titleContainsKeyword && targetKeywords.length > 0) {
      recommendations.push({
        id: 'title-missing-keyword',
        type: 'warning',
        message: 'Titeln innehåller inte nyckelord',
        impact: 'high',
        details: 'Inkludera minst ett av dina målnyckelord i titeln för bättre SEO.'
      });
      score -= 10;
    } else if (targetKeywords.length > 0) {
      recommendations.push({
        id: 'title-has-keyword',
        type: 'success',
        message: 'Titeln innehåller nyckelord',
        impact: 'high'
      });
    }
    
    // Meta description analysis
    if (!metaDescription) {
      recommendations.push({
        id: 'missing-meta-description',
        type: 'error',
        message: 'Metabeskrivning saknas',
        impact: 'high',
        details: 'Lägg till en metabeskrivning. Den visas i sökresultaten och påverkar klickfrekvensen.'
      });
      score -= 15;
    } else if (metaDescription.length < 120) {
      recommendations.push({
        id: 'short-meta-description',
        type: 'warning',
        message: 'Metabeskrivningen är kort',
        impact: 'medium',
        details: 'Metabeskrivningen är kortare än rekommenderade 120-160 tecken. Gör den mer beskrivande.'
      });
      score -= 5;
    } else if (metaDescription.length > 160) {
      recommendations.push({
        id: 'long-meta-description',
        type: 'warning',
        message: 'Metabeskrivningen är för lång',
        impact: 'medium',
        details: 'Metabeskrivningen är längre än rekommenderade 160 tecken och kan bli avklippt i sökresultaten.'
      });
      score -= 5;
    } else {
      recommendations.push({
        id: 'good-meta-description',
        type: 'success',
        message: 'Metabeskrivningen har bra längd',
        impact: 'medium'
      });
    }
    
    // Check if meta description contains target keywords
    const metaContainsKeyword = targetKeywords.some(keyword => 
      metaDescription.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (!metaContainsKeyword && targetKeywords.length > 0) {
      recommendations.push({
        id: 'meta-missing-keyword',
        type: 'warning',
        message: 'Metabeskrivningen innehåller inte nyckelord',
        impact: 'medium',
        details: 'Inkludera minst ett av dina målnyckelord i metabeskrivningen för bättre CTR.'
      });
      score -= 5;
    } else if (targetKeywords.length > 0) {
      recommendations.push({
        id: 'meta-has-keyword',
        type: 'success',
        message: 'Metabeskrivningen innehåller nyckelord',
        impact: 'medium'
      });
    }
    
    // Content length analysis
    if (wordCount < 300) {
      recommendations.push({
        id: 'thin-content',
        type: 'warning',
        message: 'Innehållet är tunt',
        impact: 'high',
        details: 'Innehållet har mindre än 300 ord. Längre, mer uttömmande innehåll rangordnas ofta bättre.'
      });
      score -= 15;
    } else if (wordCount > 300 && wordCount < 600) {
      recommendations.push({
        id: 'moderate-content',
        type: 'warning',
        message: 'Innehållet har måttlig längd',
        impact: 'medium',
        details: 'Överväg att expandera innehållet till minst 600-1000 ord för bättre rankning.'
      });
      score -= 5;
    } else {
      recommendations.push({
        id: 'good-content-length',
        type: 'success',
        message: 'Innehållet har bra längd',
        impact: 'high'
      });
    }
    
    // Heading analysis
    const headings = this.extractHeadings(content);
    if (headings.h1 > 1) {
      recommendations.push({
        id: 'multiple-h1',
        type: 'error',
        message: 'Flera H1-rubriker hittades',
        impact: 'medium',
        details: 'Använd endast en H1-rubrik per sida, vanligtvis för huvudtiteln.'
      });
      score -= 10;
    }
    
    if (headings.h1 === 0) {
      recommendations.push({
        id: 'missing-h1',
        type: 'error',
        message: 'Ingen H1-rubrik hittades',
        impact: 'high',
        details: 'Lägg till en H1-rubrik som innehåller ditt primära nyckelord.'
      });
      score -= 15;
    }
    
    if (headings.total === 0) {
      recommendations.push({
        id: 'no-headings',
        type: 'warning',
        message: 'Inga rubriker hittades',
        impact: 'medium',
        details: 'Använd rubriker (H1-H6) för att strukturera ditt innehåll och göra det mer läsbart.'
      });
      score -= 10;
    } else if (headings.total > 0 && headings.h2 === 0) {
      recommendations.push({
        id: 'no-h2',
        type: 'warning',
        message: 'Inga H2-rubriker hittades',
        impact: 'low',
        details: 'Använd H2-rubriker för att dela upp ditt innehåll i logiska sektioner.'
      });
      score -= 5;
    }
    
    // Keyword density analysis
    let keywordDensity: KeywordDensity[] = [];
    if (targetKeywords.length > 0) {
      keywordDensity = this.analyzeKeywordDensity(contentText, targetKeywords);
      
      const primaryKeyword = targetKeywords[0];
      const primaryKeywordData = keywordDensity.find(k => k.keyword === primaryKeyword);
      
      if (!primaryKeywordData || primaryKeywordData.density === 0) {
        recommendations.push({
          id: 'missing-primary-keyword',
          type: 'error',
          message: 'Primärt nyckelord saknas i innehållet',
          impact: 'high',
          details: `Lägg till nyckelordet "${primaryKeyword}" i innehållet.`
        });
        score -= 20;
      } else if (primaryKeywordData.density < 0.5) {
        recommendations.push({
          id: 'low-keyword-density',
          type: 'warning',
          message: 'Låg nyckeldordsdensitet',
          impact: 'medium',
          details: `Nyckelordet "${primaryKeyword}" förekommer för sällan (${primaryKeywordData.density.toFixed(1)}%). Sikta på 1-2%.`
        });
        score -= 10;
      } else if (primaryKeywordData.density > 3) {
        recommendations.push({
          id: 'keyword-stuffing',
          type: 'warning',
          message: 'Möjlig nyckelordsstoppning upptäckt',
          impact: 'high',
          details: `Nyckelordet "${primaryKeyword}" används för ofta (${primaryKeywordData.density.toFixed(1)}%). Detta kan anses som nyckelordsstoppning.`
        });
        score -= 15;
      } else {
        recommendations.push({
          id: 'good-keyword-density',
          type: 'success',
          message: 'Bra nyckelordsdensitet',
          impact: 'high',
          details: `Nyckelordet "${primaryKeyword}" används med en bra frekvens (${primaryKeywordData.density.toFixed(1)}%).`
        });
      }
    }
    
    // Internal links analysis
    const internalLinks = this.countInternalLinks(content);
    if (internalLinks === 0 && wordCount > 300) {
      recommendations.push({
        id: 'no-internal-links',
        type: 'warning',
        message: 'Inga interna länkar',
        impact: 'medium',
        details: 'Lägg till interna länkar till relevant innehåll på din webbplats för bättre SEO.'
      });
      score -= 5;
    }
    
    // Image analysis
    const imagesWithoutAlt = this.countImagesWithoutAlt(content);
    if (imagesWithoutAlt > 0) {
      recommendations.push({
        id: 'images-missing-alt',
        type: 'warning',
        message: 'Bilder saknar alt-attribut',
        impact: 'medium',
        details: `${imagesWithoutAlt} bild(er) saknar alt-attribut. Lägg till beskrivande alt-text för alla bilder.`
      });
      score -= (imagesWithoutAlt * 2);
    }
    
    // Calculate readability score using Flesch-Kincaid (simplified)
    const readabilityScore = this.calculateReadabilityScore(contentText);
    
    if (readabilityScore < 50) {
      recommendations.push({
        id: 'poor-readability',
        type: 'warning',
        message: 'Svårläst innehåll',
        impact: 'medium',
        details: 'Innehållet kan vara svårt att läsa. Förenkla meningar och använd mer vanliga ord.'
      });
      score -= 10;
    } else if (readabilityScore >= 80) {
      recommendations.push({
        id: 'excellent-readability',
        type: 'success',
        message: 'Utmärkt läsbarhet',
        impact: 'medium'
      });
    }
    
    // Ensure score is within 0-100 range
    score = Math.max(0, Math.min(100, score));
    
    return {
      score,
      recommendations,
      keywordDensity,
      readabilityScore,
      contentLength: wordCount,
      titleLength: title.length,
      metaDescriptionLength: metaDescription.length
    };
  }
  
  // Helper methods
  private stripHtml(html: string): string {
    // Simple HTML stripping, a real impl might use a proper HTML parser
    return html.replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  private countWords(text: string): number {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }
  
  private extractHeadings(html: string): { h1: number; h2: number; h3: number; h4: number; h5: number; h6: number; total: number } {
    const headings = {
      h1: (html.match(/<h1[^>]*>/gi) || []).length,
      h2: (html.match(/<h2[^>]*>/gi) || []).length,
      h3: (html.match(/<h3[^>]*>/gi) || []).length,
      h4: (html.match(/<h4[^>]*>/gi) || []).length,
      h5: (html.match(/<h5[^>]*>/gi) || []).length,
      h6: (html.match(/<h6[^>]*>/gi) || []).length,
      total: 0
    };
    
    headings.total = headings.h1 + headings.h2 + headings.h3 + headings.h4 + headings.h5 + headings.h6;
    return headings;
  }
  
  private analyzeKeywordDensity(text: string, keywords: string[]): KeywordDensity[] {
    const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    const totalWords = words.length;
    
    return keywords.map(keyword => {
      const keywordLower = keyword.toLowerCase();
      // Count occurrences of the keyword
      const regex = new RegExp('\\b' + keywordLower + '\\b', 'gi');
      const count = (text.toLowerCase().match(regex) || []).length;
      
      // Calculate density as percentage
      const density = (count / totalWords) * 100;
      
      return {
        keyword,
        count,
        density
      };
    });
  }
  
  private countInternalLinks(html: string): number {
    // This is a simplified version. In a real implementation, 
    // you'd check for links that point to the same domain
    const linkMatches = html.match(/<a[^>]*href="[^"]*"[^>]*>/gi) || [];
    return linkMatches.length;
  }
  
  private countImagesWithoutAlt(html: string): number {
    const allImages = html.match(/<img[^>]*>/gi) || [];
    const imagesWithAlt = html.match(/<img[^>]*alt="[^"]*"[^>]*>/gi) || [];
    return allImages.length - imagesWithAlt.length;
  }
  
  private calculateReadabilityScore(text: string): number {
    // This is a very simplified readability calculator
    // In a real implementation, you would use a proper algorithm like Flesch-Kincaid
    
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const syllables = this.countSyllables(text);
    
    if (sentences.length === 0 || words.length === 0) {
      return 0;
    }
    
    // Calculate average sentence length
    const avgSentenceLength = words.length / sentences.length;
    
    // Calculate average syllables per word
    const avgSyllablesPerWord = syllables / words.length;
    
    // Simplified Flesch Reading Ease calculation
    const score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
    
    // Ensure score is within 0-100 range
    return Math.max(0, Math.min(100, score));
  }
  
  private countSyllables(text: string): number {
    // Very simplified syllable counter
    // In a real implementation, you would use a dictionary or more sophisticated algorithm
    text = text.toLowerCase();
    text = text.replace(/[,.!?;:()\-]/, '');
    const words = text.split(/\s+/);
    
    let syllableCount = 0;
    for (const word of words) {
      if (word.length <= 3) {
        syllableCount += 1;
        continue;
      }
      
      // Count vowel groups as syllables
      let wordSyllables = (word.match(/[aeiouyåäö]{1,2}/g) || []).length;
      
      // Adjust for common patterns
      if (word.endsWith('e')) {
        wordSyllables -= 1;
      }
      if (word.endsWith('le') && word.length > 2) {
        wordSyllables += 1;
      }
      if (word.endsWith('es') || word.endsWith('ed')) {
        wordSyllables -= 1;
      }
      
      // Ensure at least one syllable per word
      wordSyllables = Math.max(1, wordSyllables);
      syllableCount += wordSyllables;
    }
    
    return syllableCount;
  }
}

export const seoService = new SEOService();