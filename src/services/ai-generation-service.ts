// AI content generation service
// This is a mock service that simulates AI API calls
// In a real implementation, this would connect to an AI API like OpenAI, Claude, etc.

import { 
  Platform, 
  ToneOfVoice, 
  AudienceType,
  ContentCategory, 
  buildPrompt 
} from './ai-prompts-service';

export interface AIGenerationRequest {
  action: string;
  content: string;
  platform?: Platform;
  tone?: ToneOfVoice;
  audience?: AudienceType;
  contentCategory?: ContentCategory;
  customInstructions?: string;
}

export interface AIGenerationResponse {
  generatedContent: string;
  usageTokens?: number;
  duration?: number;
}

/**
 * Generate content using AI
 * This is a mock implementation that simulates API calls to an AI service
 */
export async function generateContent(request: AIGenerationRequest): Promise<AIGenerationResponse> {
  // In a real implementation, this would make an API call to an AI service
  
  // Build the prompt using our prompt service
  const prompt = buildPrompt(
    request.action, 
    request.content,
    request.platform,
    request.tone,
    request.audience
  );
  
  // Add custom instructions if provided
  const finalPrompt = request.customInstructions 
    ? `${prompt}\n\nYtterligare instruktioner: ${request.customInstructions}`
    : prompt;
    
  // Log the prompt in development mode
  if (process.env.NODE_ENV === 'development') {
    console.log('AI Prompt:', finalPrompt);
  }
  
  // Simulate API call latency
  const startTime = Date.now();
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
  
  // Mock response - in a real implementation, this would be the AI model's response
  let result = '';
  
  // Generate different content based on the action
  switch(request.action) {
    case 'improve':
      result = improveContent(request.content, request.platform, request.tone);
      break;
    case 'shorten':
      result = shortenContent(request.content, request.platform);
      break;
    case 'expand':
      result = expandContent(request.content, request.platform, request.tone);
      break;
    case 'rephrase':
      result = rephraseContent(request.content, request.tone);
      break;
    case 'generate-headline':
      result = generateHeadlines(request.content, request.platform, request.tone);
      break;
    case 'tone-shift':
      result = shiftTone(request.content, request.tone, request.platform);
      break;
    case 'call-to-action':
      result = addCallToAction(request.content, request.platform);
      break;
    case 'seo-optimize':
      result = seoOptimize(request.content);
      break;
    case 'generate-hashtags':
      result = generateHashtags(request.content, request.platform);
      break;
    default:
      result = `Jag har analyserat ditt innehåll och har följande förslag till förbättringar:\n\n${request.content}\n\nDetta är ett bra innehåll som kommunicerar ditt budskap tydligt.`;
  }
  
  // Calculate simulated usage
  const duration = Date.now() - startTime;
  const usageTokens = Math.floor(finalPrompt.length / 4) + Math.floor(result.length / 4);
  
  return {
    generatedContent: result,
    usageTokens,
    duration
  };
}

// Helper functions to generate mock responses

function improveContent(content: string, platform?: Platform, tone?: ToneOfVoice): string {
  // Basic improvements
  let improved = content
    .replace(/detta är/gi, "detta representerar")
    .replace(/vi har/gi, "vi har framgångsrikt")
    .replace(/många/gi, "ett flertal")
    .replace(/bra/gi, "utmärkt")
    .replace(/viktig/gi, "avgörande");
  
  // Platform-specific improvements
  if (platform === 'instagram') {
    improved += "\n\n#kvalitet #innovation #inspiration";
  } else if (platform === 'linkedin') {
    improved = improved.replace(/Vi/g, "Vårt företag").replace(/vår/g, "vår branschledande");
    improved += "\n\nVad tycker ni om detta? Dela gärna era tankar i kommentarerna nedan.";
  } else if (platform === 'twitter') {
    // Ensure it's within character limit
    if (improved.length > 280) {
      improved = improved.substring(0, 277) + "...";
    }
  }
  
  // Tone adjustments
  if (tone === 'professional') {
    improved = improved.replace(/vi tror/gi, "vår analys indikerar").replace(/bör/gi, "rekommenderas att");
  } else if (tone === 'casual') {
    improved = improved.replace(/vi anser/gi, "vi känner").replace(/dessutom/gi, "plus att");
  }
  
  return improved;
}

function shortenContent(content: string, platform?: Platform): string {
  // Simple shortening - in a real implementation, this would use AI
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  let shortened = "";
  if (sentences.length <= 2) {
    shortened = content;
  } else if (platform === 'twitter') {
    // For Twitter, be extra concise
    shortened = sentences.slice(0, 1).join(". ") + ".";
    if (shortened.length > 280) {
      shortened = shortened.substring(0, 277) + "...";
    }
  } else {
    // For other platforms, include a few key sentences
    shortened = sentences.slice(0, Math.min(3, Math.ceil(sentences.length / 2))).join(". ") + ".";
  }
  
  // Add indication of shortening
  return "FÖRKORTAD VERSION:\n\n" + shortened;
}

function expandContent(content: string, platform?: Platform, tone?: ToneOfVoice): string {
  // Basic expansion
  let expanded = content + "\n\nDessutom är det viktigt att notera att denna strategi har visat sig effektiv i flera olika sammanhang. Studier visar att engagemang ökar med upp till 45% när innehållet är väl strukturerat och målgruppsanpassat.";
  
  // Platform-specific expansions
  if (platform === 'instagram') {
    expanded += "\n\nVi rekommenderar att du testar denna metod och delar dina resultat! Tagga oss i dina inlägg så att vi kan se och dela dina framgångar. #strategi #framgång #resultat";
  } else if (platform === 'linkedin') {
    expanded += "\n\nEn nyligen publicerad studie från Stanford University bekräftar dessa resultat och visar att företag som implementerar denna strategi ser en betydande ökning i både kundnöjdhet och konverteringsgrad.";
  } else if (platform === 'blog') {
    expanded += "\n\n## Tre konkreta steg för implementering\n\n1. **Analysera din nuvarande situation** - Börja med att granska dina nuvarande resultat och identifiera förbättringsområden.\n\n2. **Utveckla en strukturerad plan** - Baserat på din analys, skapa en detaljerad handlingsplan med tydliga mål och mätvärden.\n\n3. **Implementera och utvärdera** - Genomför din plan konsekvent och utvärdera regelbundet resultaten för att göra nödvändiga justeringar.";
  }
  
  // Tone adjustments
  if (tone === 'professional') {
    expanded = expanded.replace("Dessutom är det viktigt", "Det är ytterst väsentligt").replace("strategi har visat sig", "metodik har dokumenterats vara");
  } else if (tone === 'casual') {
    expanded = expanded.replace("Dessutom är det viktigt", "Plus att det är superbra").replace("studier visar", "folk har märkt");
  }
  
  return "UTÖKAT INNEHÅLL:\n\n" + expanded;
}

function rephraseContent(content: string, tone?: ToneOfVoice): string {
  // Basic rephrasing - replace common words/phrases
  let rephrased = content
    .replace(/vi erbjuder/gi, "vi tillhandahåller")
    .replace(/ger dig möjlighet/gi, "möjliggör för dig")
    .replace(/vår produkt/gi, "vår innovativa lösning")
    .replace(/mycket bra/gi, "exceptionell")
    .replace(/kunder/gi, "klienter");
  
  // Tone adjustments
  if (tone === 'professional') {
    rephrased = rephrased.replace(/vi tror/gi, "vår bedömning är").replace(/bör/gi, "rekommenderas att");
  } else if (tone === 'casual') {
    rephrased = rephrased.replace(/vi anser/gi, "vi känner").replace(/dessutom/gi, "plus att");
  } else if (tone === 'humorous') {
    rephrased = rephrased.replace(/viktigt/gi, "livsviktigt (okej, kanske inte på liv och död)").replace(/förbättra/gi, "pimpa");
  }
  
  return "OMFORMULERAD VERSION:\n\n" + rephrased;
}

function generateHeadlines(content: string, platform?: Platform, tone?: ToneOfVoice): string {
  // Base headlines
  const headlines = [
    "5 sätt att revolutionera din strategi och maximera resultat",
    "Hemligheten bakom framgångsrik implementering avslöjad",
    "Så dubblerar du effektiviteten med denna beprövade metod",
    "Expertens 3 bästa tips för omedelbar förbättring",
    "Den ultimata guiden: Från nybörjare till expert på rekordtid"
  ];
  
  // Platform-specific headlines
  if (platform === 'linkedin') {
    return "RUBRIKFÖRSLAG FÖR LINKEDIN:\n\n1. \"Ny rapport: 76% av framgångsrika företag använder denna strategi\"\n2. \"5 insikter som förändrade min karriär inom [bransch]\"\n3. \"Varför traditionella metoder inte längre fungerar i 2025\"\n4. \"Data avslöjar: Så uppnår toppföretag 37% bättre resultat\"\n5. \"Expertpanel: De kritiska förändringarna varje ledare måste göra nu\"";
  } else if (platform === 'instagram') {
    return "RUBRIKFÖRSLAG FÖR INSTAGRAM:\n\n1. \"✨ Förändra ditt arbetsflöde med denna enkla metod! ✨\"\n2. \"Hemligheten bakom framgång avslöjad! 🔑 Swipa för att se\"\n3. \"Vi testade ALLA strategier så att du slipper! Resultatet? 🤯\"\n4. \"3 steg till fantastiska resultat 🚀 Steg 2 kommer överraska dig!\"\n5. \"Innan vs Efter: Se den otroliga skillnaden! 📊 #transformation\"";
  } else if (platform === 'twitter') {
    return "RUBRIKFÖRSLAG FÖR TWITTER:\n\n1. \"Studie: Denna strategi ger 42% bättre resultat på bara 30 dagar\"\n2. \"Jag testade 'experthacket' alla pratar om. Här är sanningen 🧵\"\n3. \"3 tecken på att du gör det fel (och hur du fixar det)\"\n4. \"Sluta slösa tid! Denna metod sparar 5+ timmar/vecka\"\n5. \"Varför 83% misslyckas med detta (och hur du lyckas)\"";
  }
  
  // Tone adjustments
  if (tone === 'professional') {
    return "PROFESSIONELLA RUBRIKFÖRSLAG:\n\n1. \"Studie: Dokumenterad 34% effektivitetsökning med denna metodologi\"\n2. \"Strategisk transformation: Implementeringsguide för ledarskapsgrupper\"\n3. \"Kvantifierade resultat: ROI-analys av den optimerade processen\"\n4. \"Branschöversikt: Kritiska framgångsfaktorer för 2025 och framåt\"\n5. \"Expertutvärdering: De fem mest impactfulla förbättringsområdena\"";
  } else if (tone === 'humorous') {
    return "HUMORISTISKA RUBRIKFÖRSLAG:\n\n1. \"Har du försökt detta? Min chef trodde jag var ett geni!\"\n2. \"Världens tråkigaste strategi (som råkar fungera OTROLIGT bra)\"\n3. \"Jag gjorde ALLT fel i 5 år - nu gör jag detta istället\"\n4. \"Det här är antingen genialiskt eller galet... och det fungerar!\"\n5. \"'Det kommer aldrig fungera' sa de... Gissa vad som hände sen!\"";
  }
  
  return "RUBRIKFÖRSLAG:\n\n1. \"" + headlines[0] + "\"\n2. \"" + headlines[1] + "\"\n3. \"" + headlines[2] + "\"\n4. \"" + headlines[3] + "\"\n5. \"" + headlines[4] + "\"";
}

function shiftTone(content: string, tone?: ToneOfVoice, platform?: Platform): string {
  let shiftedContent = content;
  
  if (tone === 'professional') {
    shiftedContent = shiftedContent
      .replace(/Hej!/gi, "Bästa klient,")
      .replace(/jättebra/gi, "exceptionellt")
      .replace(/kul/gi, "givande")
      .replace(/vi tror/gi, "vår bedömning är")
      .replace(/bör/gi, "rekommenderas att");
      
    return "MED PROFESSIONELL TON:\n\n" + shiftedContent + "\n\n[Anpassad till en professionell och formell ton lämplig för affärssammanhang]";
    
  } else if (tone === 'casual') {
    shiftedContent = shiftedContent
      .replace(/Kära kund/gi, "Hej du!")
      .replace(/vi önskar informera/gi, "vi vill berätta")
      .replace(/vänligen/gi, "bara")
      .replace(/erhålla/gi, "få")
      .replace(/dessutom/gi, "plus att");
      
    return "MED AVSLAPPNAD TON:\n\n" + shiftedContent + "\n\n[Anpassad till en avslappnad och samtalsliknande ton för en mer personlig känsla]";
    
  } else if (tone === 'humorous') {
    shiftedContent = shiftedContent
      .replace(/vi vill informera/gi, "håll i hatten - vi har nyheter")
      .replace(/vårt företag har/gi, "vi har på något mirakulöst sätt")
      .replace(/viktigt att notera/gi, "nu kommer det roliga")
      .replace(/ta kontakt/gi, "slänga iväg ett meddelande");
      
    return "MED HUMORISTISK TON:\n\n" + shiftedContent + "\n\n[Anpassad med en humoristisk och lättsam ton som är underhållande att läsa]";
    
  } else if (tone === 'inspirational') {
    shiftedContent = shiftedContent
      .replace(/vi erbjuder/gi, "vi möjliggör")
      .replace(/förbättra/gi, "transformera")
      .replace(/bra resultat/gi, "exceptionella genombrott")
      .replace(/hjälpa/gi, "inspirera");
      
    return "MED INSPIRERANDE TON:\n\n" + shiftedContent + "\n\n[Anpassad med en inspirerande och motiverande ton som uppmuntrar till handling]";
  }
  
  // Default to friendly tone
  shiftedContent = shiftedContent
    .replace(/Kära kund/gi, "Hej där!")
    .replace(/vi önskar meddela/gi, "vi vill berätta för dig")
    .replace(/var god och/gi, "vänligen")
    .replace(/erhålla/gi, "få");
    
  return "MED VÄNLIG TON:\n\n" + shiftedContent + "\n\n[Anpassad till en vänlig och tillgänglig ton]";
}

function addCallToAction(content: string, platform?: Platform): string {
  let baseContent = content;
  let cta = "";
  
  // Platform-specific CTAs
  if (platform === 'instagram') {
    cta = "\n\n👉 Dubbeltryck för att gilla och kommentera vad du tycker! Tagga en vän som behöver se detta! 👇 #inspo #tips #följförmer";
  } else if (platform === 'linkedin') {
    cta = "\n\nVad är din erfarenhet av detta? Dela gärna dina tankar i kommentarerna nedan. Om du fann detta värdefullt, uppskatta jag om du delar det med ditt nätverk.";
  } else if (platform === 'facebook') {
    cta = "\n\nGilla, kommentera och dela om du håller med! Tagga någon som behöver se detta. ❤️";
  } else if (platform === 'twitter') {
    cta = "\n\nRTa om du håller med! Följ för fler insikter. #tips #innovation";
  } else if (platform === 'email') {
    cta = "\n\n<strong>Klicka här för att ta del av vårt exklusiva erbjudande – endast tillgängligt de nästa 48 timmarna!</strong>\n\nMed vänliga hälsningar,\n[Ditt namn]";
  } else if (platform === 'blog') {
    cta = "\n\n<h3>Vad tycker du?</h3>\n\nHar du testat dessa strategier? Hur har de fungerat för dig? Dela gärna dina erfarenheter i kommentarsfältet nedan. \n\nOm du vill lära dig mer om detta ämne, prenumerera på vårt nyhetsbrev för att få våra senaste artiklar direkt i din inkorg.";
  } else {
    cta = "\n\nKontakta oss idag för att ta nästa steg! Fyll i kontaktformuläret på vår webbplats eller ring oss på [telefonnummer] för en kostnadsfri konsultation.";
  }
  
  return "MED CALL-TO-ACTION:\n\n" + baseContent + cta;
}

function seoOptimize(content: string): string {
  // Simple SEO optimization simulation
  const keywords = extractPossibleKeywords(content);
  let optimized = content;
  
  // Add headline tags
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length > 3) {
    // Create a headline from first sentence
    const headline = sentences[0].trim();
    const remainder = content.replace(headline, '').trim();
    optimized = `<h1>${headline}</h1>\n\n${remainder}`;
    
    // Add subheadings
    if (sentences.length > 6) {
      const middleIndex = Math.floor(sentences.length / 2);
      const subheading = sentences[middleIndex].trim();
      optimized = optimized.replace(subheading, `\n\n<h2>${subheading}</h2>\n\n`);
    }
  }
  
  // Add meta description suggestion
  const metaDescription = sentences.slice(0, 2).join(". ").substring(0, 155);
  
  // Add keyword emphasis
  if (keywords.length > 0) {
    keywords.forEach(keyword => {
      // Only bold the first instance of each keyword to avoid over-optimization
      optimized = optimized.replace(new RegExp(keyword, 'i'), `<strong>${keyword}</strong>`);
    });
  }
  
  // Create the final return value with recommendations
  return `SEO-OPTIMERAT INNEHÅLL:\n\n${optimized}\n\n---\n\nSEO REKOMMENDATIONER:\n\n1. Föreslagen meta-beskrivning (155 tecken):\n"${metaDescription}"\n\n2. Identifierade nyckelord:\n${keywords.slice(0, 5).join(', ')}\n\n3. Rekommendationer:\n- Lägg till intern länkning till relaterade artiklar\n- Inkludera minst en relevant bild med alt-text\n- Använd beskrivande URL-slug baserad på huvudrubriken`;
}

function generateHashtags(content: string, platform?: Platform): string {
  const keywords = extractPossibleKeywords(content);
  const commonHashtags = ['content', 'marknadsföring', 'digitalt', 'strategi', 'tips', 'inspiration'];
  
  // Platform-specific hashtags
  let platformTags: string[] = [];
  if (platform === 'instagram') {
    platformTags = ['instagram', 'instapost', 'instadaily', 'instagood', 'instainspo'];
  } else if (platform === 'linkedin') {
    platformTags = ['linkedin', 'business', 'professional', 'career', 'leadership'];
  } else if (platform === 'twitter') {
    platformTags = ['twitter', 'tweet', 'trending', 'followback'];
  } else if (platform === 'facebook') {
    platformTags = ['facebook', 'share', 'community', 'social'];
  } else if (platform === 'tiktok') {
    platformTags = ['tiktok', 'fyp', 'foryou', 'foryoupage', 'viral'];
  }
  
  // Combine and select hashtags
  const allPossibleTags = [...keywords.slice(0, 5), ...commonHashtags, ...platformTags];
  const selectedTags = allPossibleTags
    .sort(() => Math.random() - 0.5)
    .slice(0, 10)
    .map(tag => `#${tag.toLowerCase().replace(/\s+/g, '')}`);
  
  return `FÖRESLAGNA HASHTAGS:\n\n${selectedTags.join(' ')}`;
}

// Helper function to extract potential keywords from content
function extractPossibleKeywords(content: string): string[] {
  // In a real implementation, this would use NLP techniques
  // Here we'll just use a simple word frequency analysis
  
  const stopWords = ['and', 'the', 'is', 'of', 'to', 'a', 'in', 'för', 'att', 'och', 'är', 'med', 'på', 'det', 'som', 'en', 'i'];
  const words = content.toLowerCase().match(/\b[a-zåäö]{3,}\b/g) || [];
  
  // Count word frequencies
  const wordCounts: Record<string, number> = {};
  words.forEach(word => {
    if (!stopWords.includes(word)) {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
  });
  
  // Convert to array and sort by frequency
  const sortedWords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
  
  return sortedWords.slice(0, 10);
}