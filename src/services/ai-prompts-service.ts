// Bibliotek med AI-prompts för olika innehållstyper och plattformar

export type ContentCategory = 
  | 'headline' 
  | 'body' 
  | 'tagline' 
  | 'call-to-action' 
  | 'product-description'
  | 'story'
  | 'persuasive'
  | 'educational'
  | 'announcement';

export type Platform = 
  | 'general'
  | 'instagram' 
  | 'facebook' 
  | 'linkedin' 
  | 'twitter'
  | 'tiktok'
  | 'blog'
  | 'email';

export type ToneOfVoice = 
  | 'professional' 
  | 'casual' 
  | 'formal' 
  | 'friendly' 
  | 'humorous'
  | 'inspirational'
  | 'authoritative'
  | 'empathetic';
  
export type AudienceType =
  | 'general'
  | 'business'
  | 'consumer'
  | 'technical'
  | 'creative'
  | 'executives'
  | 'millennials'
  | 'gen-z';

export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: ContentCategory;
  platform: Platform;
  tone?: ToneOfVoice;
  audience?: AudienceType;
  examples?: string[];
}

// Hjälpfunktion för att bygga prompts baserat på användarinnehåll och begärd åtgärd
export function buildPrompt(
  action: string,
  content: string, 
  platform?: Platform, 
  tone?: ToneOfVoice, 
  audience?: AudienceType
): string {
  let prompt = '';
  
  // Basera prompt på önskad åtgärd
  switch(action) {
    case 'improve':
      prompt = `Förbättra följande ${platform || 'innehåll'} med fokus på engagemang och tydlighet.`;
      if (tone) prompt += ` Använd en ${getToneDescription(tone)}.`;
      if (audience) prompt += ` Innehållet riktar sig till ${getAudienceDescription(audience)}.`;
      prompt += `\n\nOriginalinnehåll:\n${content}\n\nFörbättrat innehåll:`;
      break;
      
    case 'shorten':
      prompt = `Korta ner följande ${platform || 'innehåll'} utan att förlora viktiga budskap eller tonalitet.`;
      if (platform) prompt += ` Optimera för ${getPlatformDescription(platform)}.`;
      prompt += `\n\nOriginalinnehåll:\n${content}\n\nFörkortat innehåll:`;
      break;
      
    case 'expand':
      prompt = `Expandera följande ${platform || 'innehåll'} med ytterligare detaljer och engagerande språk.`;
      if (tone) prompt += ` Använd en ${getToneDescription(tone)}.`;
      if (audience) prompt += ` Innehållet riktar sig till ${getAudienceDescription(audience)}.`;
      prompt += `\n\nOriginalinnehåll:\n${content}\n\nUtvidgat innehåll:`;
      break;
      
    case 'rephrase':
      prompt = `Omformulera följande ${platform || 'innehåll'} med nya ord men bevara budskapet.`;
      if (tone) prompt += ` Använd en ${getToneDescription(tone)}.`;
      prompt += `\n\nOriginalinnehåll:\n${content}\n\nOmformulerat innehåll:`;
      break;
      
    case 'call-to-action':
      prompt = `Lägg till en stark uppmaning till handling i slutet av följande ${platform || 'innehåll'}.`;
      if (platform) prompt += ` Optimera för ${getPlatformDescription(platform)}.`;
      prompt += `\n\nOriginalinnehåll:\n${content}\n\nInnehåll med uppmaning:`;
      break;
      
    case 'tone-shift':
      const toneDesc = tone ? getToneDescription(tone) : 'professionell';
      prompt = `Ändra tonen i följande innehåll till en ${toneDesc} ton.`;
      if (platform) prompt += ` Optimera för ${getPlatformDescription(platform)}.`;
      prompt += `\n\nOriginalinnehåll:\n${content}\n\nInnehåll med ny ton:`;
      break;
      
    case 'seo-optimize':
      prompt = `Optimera följande innehåll för sökmotorer utan att förlora läsbarheten.`;
      if (platform) prompt += ` Innehållet är för ${getPlatformDescription(platform)}.`;
      prompt += `\n\nFokusera på naturlig användning av nyckelord, tydliga rubriker och engagerande språk.`;
      prompt += `\n\nOriginalinnehåll:\n${content}\n\nSEO-optimerat innehåll:`;
      break;
      
    case 'generate-headline':
      prompt = `Generera 5 kraftfulla rubriker baserat på följande innehåll.`;
      if (platform) prompt += ` Optimera för ${getPlatformDescription(platform)}.`;
      if (tone) prompt += ` Använd en ${getToneDescription(tone)}.`;
      prompt += `\n\nInnehåll:\n${content}\n\nRubriker:`;
      break;
      
    case 'generate-hashtags':
      prompt = `Generera 10 relevanta hashtags baserat på följande innehåll.`;
      if (platform) prompt += ` Optimera för ${getPlatformDescription(platform)}.`;
      prompt += `\n\nInnehåll:\n${content}\n\nHashtags:`;
      break;
      
    default:
      prompt = `Förbättra följande innehåll:\n\n${content}`;
  }
  
  return prompt;
}

// Exempeldatabas med prompt-mallar för olika användningsområden
export const promptTemplates: PromptTemplate[] = [
  {
    id: 'instagram-engagement',
    title: 'Instagram engagemang',
    description: 'Skapa engagerande innehåll för Instagram',
    prompt: 'Skapa ett engagerande Instagram-inlägg om följande ämne med en uppmaning till handling. Inkludera relevanta emoji och en fråga som uppmuntrar till kommentarer:',
    category: 'body',
    platform: 'instagram',
    tone: 'friendly',
    examples: [
      '✨ Nya kollektionen är äntligen här! Dessa handgjorda smycken är perfekta för sommarens alla fester. 🌸 Vilket smycke är din favorit? Kommentera nedan! #handgjordasmycken #sommarkollektion'
    ]
  },
  {
    id: 'linkedin-thought-leadership',
    title: 'LinkedIn tankeledare',
    description: 'Positionera dig som expert inom ditt område på LinkedIn',
    prompt: 'Omvandla följande innehåll till ett professionellt LinkedIn-inlägg som positionerar författaren som en tankeledare. Inkludera en insiktsfull reflektion och en fråga i slutet:',
    category: 'body',
    platform: 'linkedin',
    tone: 'professional',
    examples: [
      'Jag reflekterade nyligen över hur AI förändrar rekryteringsbranschen. Efter 15 års erfarenhet ser jag tre tydliga trender:\n\n1. Automatiserad första screening sparar rekryterare 30% tid\n2. Fördomar minskar när AI konfigureras korrekt\n3. Kandidatupplevelsen förbättras med snabbare återkoppling\n\nMen tekniken ersätter inte det mänskliga omdömet - den förstärker det.\n\nHur har AI förändrat ditt arbete? Dela gärna dina erfarenheter nedan.'
    ]
  },
  {
    id: 'product-description',
    title: 'Produktbeskrivning',
    description: 'Skapa övertygande produktbeskrivningar',
    prompt: 'Skapa en övertygande produktbeskrivning baserat på följande information. Fokusera på fördelar snarare än funktioner och använd sensoriskt språk:',
    category: 'product-description',
    platform: 'general',
    tone: 'persuasive',
    examples: [
      'Upplev ultimat komfort med vår handgjorda läderfåtölj. Den ergonomiska designen stöder din rygg perfekt medan det mjuka, fullnarviga lädret omsluter dig i lyx. Tillverkad av hantverkare med över 30 års erfarenhet ger varje fåtölj ett unikt uttryck som bara blir vackrare med tiden. Perfekt för långa kvällar med en god bok eller stimulerande samtal med vänner.'
    ]
  },
  {
    id: 'facebook-announcement',
    title: 'Facebook tillkännagivande',
    description: 'Annonsera nyheter eller erbjudanden på Facebook',
    prompt: 'Skapa ett Facebook-inlägg som tillkännager följande nyhet eller erbjudande. Gör det engagerande och dela-vänligt med en tydlig uppmaning till handling:',
    category: 'announcement',
    platform: 'facebook',
    tone: 'friendly',
    examples: [
      '🎉 STOR NYHET! 🎉\n\nVi är glada att kunna meddela att vi öppnar en ny butik i Göteborg den 15 juni! Kom till invigningen och få 20% rabatt på hela sortimentet samt en goodiebag till de 50 första kunderna!\n\nTagga en vän som du vill ta med dig till öppningen! ❤️\n\n#NyButik #Göteborg #Invigning'
    ]
  },
  {
    id: 'twitter-concise',
    title: 'Twitter koncist budskap',
    description: 'Formulera slagkraftiga korta budskap för Twitter',
    prompt: 'Omvandla följande innehåll till ett koncist och slagkraftigt Twitter-inlägg på max 280 tecken. Inkludera relevanta hashtags:',
    category: 'body',
    platform: 'twitter',
    tone: 'casual',
    examples: [
      'Just släppt vår nya rapport om framtidens arbetsplats - 76% av anställda vill ha hybridlösningar även efter pandemin. Ladda ner hela rapporten här: [länk] #FremtidensArbete #HybridWork'
    ]
  },
  {
    id: 'blog-intro',
    title: 'Bloggintroduktion',
    description: 'Skapa en fängslande introduktion till en bloggartikel',
    prompt: 'Skriv en fängslande introduktion (3-5 meningar) till en bloggartikel med följande ämne. Väck läsarens intresse direkt och ge en försmak av vad artikeln kommer att innehålla:',
    category: 'body',
    platform: 'blog',
    tone: 'friendly',
    examples: [
      'Har du någonsin undrat varför vissa människor lyckas med sina morgonrutiner medan andra ständigt kämpar? Det är inte bara en fråga om viljestyrka - det handlar om vetenskapligt beprövade strategier för att skapa hållbara vanor. I den här artikeln avslöjar jag tre överraskande upptäckter från beteendeforskningen som kan förändra dina morgnar för alltid.'
    ]
  },
  {
    id: 'email-subject-lines',
    title: 'E-postämnesrader',
    description: 'Skapa ämnesrader som öppnas',
    prompt: 'Generera 5 engagerande ämnesrader för ett e-postutskick med följande innehåll. Fokusera på att väcka nyfikenhet utan clickbait:',
    category: 'headline',
    platform: 'email',
    tone: 'friendly',
    examples: [
      '1. Exklusivt för dig: Vår hemliga sommarkollektion är här\n2. Har du sett vår mest efterfrågade produkt någonsin?\n3. [Förnamn], här är erbjudandet du har väntat på\n4. Slut på lager inom 24 timmar (vi är inte säkra på om vi får in fler)\n5. 3 stilhemligheter som förändrade allt för våra kunder'
    ]
  },
  {
    id: 'tiktok-script',
    title: 'TikTok manus',
    description: 'Skapa korta, engagerande manus för TikTok-videor',
    prompt: 'Skriv ett kort, engagerande manus för en 30-sekunders TikTok-video om följande ämne. Inkludera en hook i början och en uppmaning till handling i slutet:',
    category: 'body',
    platform: 'tiktok',
    tone: 'casual',
    audience: 'gen-z',
    examples: [
      '[Hook - 5 sek]\n"Visste du att 80% gör detta fel när de tvättar ansiktet? Jag var också en av dem!"\n\n[Innehåll - 20 sek]\n"De flesta sköljer med för varmt vatten vilket strippar huden på naturliga oljor. Använd istället ljummet vatten och massera rengöringen i 60 sekunder för att verkligen lösa upp smink och orenheter. Avsluta med en kallvattensköljning för att stänga porerna och ge extra lyster!"\n\n[Call to action - 5 sek]\n"Testa detta ikväll och kommentera skillnaden du märker! Följ för fler skönhetstips som faktiskt fungerar! #hudvård #skönhetstips"'
    ]
  }
];

// Hjälpfunktioner för beskrivningar
function getPlatformDescription(platform: Platform): string {
  switch(platform) {
    case 'instagram': return 'Instagram med fokus på visuellt innehåll och engagemang';
    case 'facebook': return 'Facebook med fokus på communitykänsla och delningar';
    case 'linkedin': return 'LinkedIn med professionell tonalitet';
    case 'twitter': return 'Twitter med kortfattat, slagkraftigt innehåll';
    case 'tiktok': return 'TikTok med fokus på snabbt, underhållande innehåll';
    case 'blog': return 'bloggar med utförligare innehåll';
    case 'email': return 'e-postmarknadsföring';
    default: return 'olika plattformar';
  }
}

function getToneDescription(tone: ToneOfVoice): string {
  switch(tone) {
    case 'professional': return 'professionell och trovärdig ton';
    case 'casual': return 'avslappnad och samtalsliknande ton';
    case 'formal': return 'formell och respektfull ton';
    case 'friendly': return 'vänlig och inbjudande ton';
    case 'humorous': return 'humoristisk och underhållande ton';
    case 'inspirational': return 'inspirerande och motiverande ton';
    case 'authoritative': return 'auktoritativ och självsäker ton';
    case 'empathetic': return 'empatisk och förstående ton';
    default: return 'lämplig ton';
  }
}

function getAudienceDescription(audience: AudienceType): string {
  switch(audience) {
    case 'business': return 'företag och affärsprofessionella';
    case 'consumer': return 'konsumenter och slutanvändare';
    case 'technical': return 'en teknisk publik med specialistkunskap';
    case 'creative': return 'kreativa yrkespersoner';
    case 'executives': return 'företagsledare och beslutsfattare';
    case 'millennials': return 'millenniegenerationen';
    case 'gen-z': return 'generation Z';
    default: return 'en bred publik';
  }
}