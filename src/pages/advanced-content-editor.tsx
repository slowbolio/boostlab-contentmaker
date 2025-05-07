import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedAIAssistant } from "@/components/content/enhanced-ai-assistant";
import { AIContentPreview } from "@/components/content/ai-content-preview";
import SEOAnalyzer from "@/components/seo/seo-analyzer";
import RichTextEditor from "@/components/editor/rich-text-editor";
import ContentPreview from "@/components/editor/content-preview";
import MobilePublishing from "@/components/editor/mobile-publishing";
import { imageUploadService } from "@/components/editor/image-upload-service";
import { useToast } from "@/components/ui/use-toast";
import { 
  Save, 
  Send, 
  ImageIcon, 
  Search, 
  FileText, 
  Smartphone, 
  BarChart,
  ChevronDown,
  Settings,
  Loader2
} from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useCreateSavedProject, useUpdateSavedProject } from "@/hooks/use-saved-projects";
import { useAuthContext } from "@/contexts/auth-context";

export default function AdvancedContentEditor() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('editor');
  const [contentTitle, setContentTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [seoScore, setSeoScore] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  
  const createProjectMutation = useCreateSavedProject();
  const updateProjectMutation = useUpdateSavedProject();

  // Simulera mobilvy för testning
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkIfMobile();
    
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  // Ladda innehåll från tidigare projekt
  useEffect(() => {
    const state = location.state as { 
      project?: any,
      fromSavedProjects?: boolean 
    } | null;
    
    if (state?.fromSavedProjects && state.project) {
      const project = state.project;
      
      // Spara projekt-ID för att kunna uppdatera senare
      setProjectId(project.id);
      
      // Fyll i innehållet från det sparade projektet
      setContentTitle(project.title || '');
      setMetaDescription(project.description || '');
      
      // Om det finns HTML-innehåll, använd det
      if (project.htmlContent) {
        setContentHtml(project.htmlContent);
      } else {
        // Annars använd vanligt innehåll
        setContentHtml(`<p>${project.content || ''}</p>`);
      }
      
      setSelectedPlatform(project.platform || '');
      
      // Lägg till taggarna som nyckelord
      if (project.tags && project.tags.length > 0) {
        setKeywords(project.tags);
      }
      
      // Visa en bekräftelse till användaren
      toast({
        title: "Projekt laddat",
        description: `Projektet "${project.title}" har laddats för redigering.`,
      });
    }
  }, [location, toast]);

  const handleCreate = () => {
    if (!contentTitle.trim()) {
      toast({
        title: "Titel krävs",
        description: "Ange en titel för ditt innehåll.",
        variant: "destructive"
      });
      return;
    }

    if (!contentHtml.trim()) {
      toast({
        title: "Innehåll krävs",
        description: "Ange innehåll att publicera.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);

    // Först sparar vi projektet
    handleSaveProject().then(() => {
      toast({
        title: "Innehåll skapat",
        description: "Ditt innehåll har skapats och sparats som utkast."
      });
      setIsCreating(false);
    }).catch(() => {
      setIsCreating(false);
    });
  };
  
  const handleSaveProject = async () => {
    if (!contentTitle.trim()) {
      toast({
        title: "Titel krävs",
        description: "Ange en titel för att spara projektet.",
        variant: "destructive"
      });
      return Promise.reject("Titel krävs");
    }

    setIsSaving(true);
    
    try {
      // Extrahera ren text från HTML för content-fältet
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = contentHtml;
      const plainText = tempDiv.textContent || tempDiv.innerText || "";
      
      const projectData = {
        title: contentTitle,
        description: metaDescription || undefined,
        content: plainText.substring(0, 500), // Begränsa till 500 tecken för översikten
        htmlContent: contentHtml, // Spara hela HTML-innehållet
        platform: selectedPlatform || undefined,
        tags: keywords.length > 0 ? keywords : undefined,
        status: 'draft' as const,
        author: {
          id: user?.id.toString() || '1',
          name: user?.name || 'Användare'
        }
      };
      
      let savedProject;
      
      // Om vi har ett projektID, uppdatera det befintliga projektet
      if (projectId) {
        savedProject = await updateProjectMutation.mutateAsync({
          id: projectId,
          data: projectData
        });
        
        toast({
          title: "Projekt uppdaterat",
          description: "Dina ändringar har sparats."
        });
      } else {
        // Annars skapa ett nytt projekt
        savedProject = await createProjectMutation.mutateAsync(projectData);
        
        // Spara det nya projektets ID för framtida uppdateringar
        if (savedProject && savedProject.id) {
          setProjectId(savedProject.id);
        }
        
        toast({
          title: "Projekt sparat",
          description: "Ditt innehåll har sparats som ett projekt."
        });
      }
      
      return savedProject;
    } catch (error) {
      toast({
        title: "Kunde inte spara",
        description: "Ett fel uppstod när projektet skulle sparas.",
        variant: "destructive"
      });
      return Promise.reject(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const imageUrl = await imageUploadService.uploadImage(file);
      toast({
        title: "Bild uppladdad",
        description: "Din bild har laddats upp och infogats.",
      });
      return imageUrl;
    } catch (error) {
      let errorMessage = "Ett fel uppstod vid uppladdning av bilden.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Uppladdning misslyckades",
        description: errorMessage,
        variant: "destructive"
      });
      
      throw error;
    }
  };

  const handleApplySuggestion = (newContent: string) => {
    setContentHtml(newContent);
  };
  
  const handleAddKeyword = (keyword: string) => {
    if (keyword.trim() && !keywords.includes(keyword.trim())) {
      setKeywords([...keywords, keyword.trim()]);
    }
  };

  const handleAnalysisComplete = (score: number) => {
    setSeoScore(score);
  };
  
  const handlePublish = async (platforms: string[], schedule?: Date) => {
    // Detta är en simulerad publicering
    console.log('Publicerar till:', platforms);
    console.log('Schemalagd till:', schedule);
    
    // Simulera nätverksfördröjning
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // I en verklig implementation skulle vi anropa API för publicering här
    
    toast({
      title: schedule ? "Inlägg schemalagt" : "Inlägg publicerat",
      description: schedule 
        ? `Ditt inlägg är schemalagt för publicering på ${platforms.join(', ')}` 
        : `Ditt inlägg har publicerats på ${platforms.join(', ')}`
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Avancerad innehållsredigerare</h1>
        <p className="text-muted-foreground">
          Skapa professionellt innehåll med rich-editor, bilduppladdning och direktpublicering
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 overflow-x-auto">
              <TabsTrigger value="editor" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center">
                <Send className="mr-2 h-4 w-4" />
                Förhandsgranskning
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex items-center">
                <Search className="mr-2 h-4 w-4" />
                SEO
                {seoScore !== null && (
                  <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                    seoScore >= 80 ? 'bg-green-500/20 text-green-400' : 
                    seoScore >= 60 ? 'bg-green-500/20 text-green-400' : 
                    seoScore >= 40 ? 'bg-yellow-500/20 text-yellow-400' : 
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {seoScore}
                  </span>
                )}
              </TabsTrigger>
              {isMobileView && (
                <TabsTrigger value="mobile" className="flex items-center">
                  <Smartphone className="mr-2 h-4 w-4" />
                  Publicera
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="editor">
              <Card>
                <CardHeader>
                  <CardTitle>Innehållsredigerare</CardTitle>
                  <CardDescription>
                    Skapa och redigera innehåll med avancerade formateringsalternativ
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titel</Label>
                    <Input 
                      id="title" 
                      placeholder="Ange en titel för ditt innehåll" 
                      value={contentTitle}
                      onChange={(e) => setContentTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="meta-description">Meta beskrivning</Label>
                    <Textarea 
                      id="meta-description" 
                      placeholder="Ange en meta beskrivning för sökmotorer (120-160 tecken)" 
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      rows={2}
                    />
                    {metaDescription && (
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{metaDescription.length} tecken</span>
                        <span className={metaDescription.length < 120 || metaDescription.length > 160 ? 'text-yellow-400' : 'text-green-400'}>
                          Rekommenderat: 120-160 tecken
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="platform">Plattform</Label>
                    <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                      <SelectTrigger id="platform">
                        <SelectValue placeholder="Välj plattform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="content">Innehåll</Label>
                    <RichTextEditor
                      content={contentHtml}
                      onChange={setContentHtml}
                      onImageUploadRequest={handleImageUpload}
                      placeholder="Börja skriva eller använd verktygsfältet för att formatera..."
                      autoFocus={true}
                      maxHeight="600px" 
                      minHeight="500px"
                      mobileToolbarPosition="top"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={handleSaveProject}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Sparar...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Spara utkast</span>
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={handleCreate} 
                      disabled={isCreating || isSaving}
                      className="flex items-center gap-2"
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Skapar...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Skapa innehåll</span>
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle>Förhandsgranskning</CardTitle>
                  <CardDescription>
                    Så här kommer ditt innehåll att se ut på {selectedPlatform || 'vald plattform'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(!contentTitle && !contentHtml) ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Inget innehåll att förhandsgranska</p>
                      <p className="text-sm">Lägg till titel och innehåll i editor-fliken</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                              U
                            </div>
                            <div>
                              <div className="font-medium">Användare</div>
                              <div className="text-xs text-muted-foreground">Nu • Offentlig</div>
                            </div>
                          </div>
                          <div>
                            <Button variant="ghost" size="icon">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {contentTitle && <h3 className="text-lg font-bold mb-2">{contentTitle}</h3>}
                        
                        <ContentPreview 
                          html={contentHtml} 
                          platformStyle={selectedPlatform as any || 'default'} 
                          maxHeight="500px"
                        />
                        
                        <div className="flex justify-between items-center mt-4 pt-4 border-t">
                          <div className="flex items-center gap-4">
                            <button className="text-sm flex items-center gap-1 text-muted-foreground">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              Gilla
                            </button>
                            <button className="text-sm flex items-center gap-1 text-muted-foreground">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              Kommentera
                            </button>
                            <button className="text-sm flex items-center gap-1 text-muted-foreground">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                              </svg>
                              Dela
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        variant="default" 
                        className="w-full flex items-center gap-2"
                        onClick={() => setActiveTab('mobile')}
                      >
                        <Smartphone className="h-4 w-4" />
                        Publicera innehåll
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="seo">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Analys</CardTitle>
                  <CardDescription>
                    Optimera ditt innehåll för bättre synlighet i sökmotorer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(!contentTitle && !contentHtml) ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Inget innehåll att analysera</p>
                      <p className="text-sm">Lägg till titel och innehåll i editor-fliken för att få en SEO-analys</p>
                    </div>
                  ) : (
                    <SEOAnalyzer
                      initialContent={contentHtml}
                      initialTitle={contentTitle}
                      initialMetaDescription={metaDescription}
                      initialKeywords={keywords}
                      onAnalysisComplete={handleAnalysisComplete}
                      autoAnalyze={false}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="mobile">
              <Card>
                <CardHeader>
                  <CardTitle>Mobil publicering</CardTitle>
                  <CardDescription>
                    Publicera direkt från din mobila enhet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(!contentTitle && !contentHtml) ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Inget innehåll att publicera</p>
                      <p className="text-sm">Lägg till titel och innehåll i editor-fliken för att kunna publicera</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <ContentPreview 
                        html={contentHtml} 
                        platformStyle={selectedPlatform as any || 'default'} 
                        maxHeight="300px"
                      />
                      
                      <MobilePublishing 
                        title={contentTitle}
                        content={contentHtml}
                        onPublish={handlePublish}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="col-span-1 space-y-4">
          {/* AI Assistent */}
          <EnhancedAIAssistant 
            currentContent={contentHtml} 
            onApplySuggestion={handleApplySuggestion}
            selectedPlatform={selectedPlatform}
          />
          
          {/* AI Content Examples */}
          <AIContentPreview 
            platform={selectedPlatform || 'general'} 
          />
          
          {/* Keyword Suggestions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Search className="h-4 w-4" />
                SEO Nyckelord
              </CardTitle>
              <CardDescription>
                Lägg till nyckelord för SEO-optimering
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Lägg till nyckelord"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value) {
                        handleAddKeyword(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button variant="secondary" onClick={() => {
                    const input = document.querySelector('input[placeholder="Lägg till nyckelord"]') as HTMLInputElement;
                    if (input && input.value) {
                      handleAddKeyword(input.value);
                      input.value = '';
                    }
                  }}>
                    Lägg till
                  </Button>
                </div>
                
                {keywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword, index) => (
                      <div key={index} className="group flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs">
                        <span>{keyword}</span>
                        <button
                          onClick={() => setKeywords(keywords.filter(k => k !== keyword))}
                          className="opacity-60 hover:opacity-100 focus:opacity-100"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    Lägg till nyckelord för att förbättra din SEO
                  </p>
                )}
                
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-2">Föreslagna nyckelord</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlatform === 'instagram' && (
                      <>
                        <button onClick={() => handleAddKeyword('instagram')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">instagram</button>
                        <button onClick={() => handleAddKeyword('instapost')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">instapost</button>
                        <button onClick={() => handleAddKeyword('socialmedia')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">socialmedia</button>
                      </>
                    )}
                    {selectedPlatform === 'facebook' && (
                      <>
                        <button onClick={() => handleAddKeyword('facebook')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">facebook</button>
                        <button onClick={() => handleAddKeyword('facebookpost')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">facebookpost</button>
                        <button onClick={() => handleAddKeyword('socialmedia')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">socialmedia</button>
                      </>
                    )}
                    {selectedPlatform === 'linkedin' && (
                      <>
                        <button onClick={() => handleAddKeyword('linkedin')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">linkedin</button>
                        <button onClick={() => handleAddKeyword('business')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">business</button>
                        <button onClick={() => handleAddKeyword('professional')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">professional</button>
                      </>
                    )}
                    {selectedPlatform === 'twitter' && (
                      <>
                        <button onClick={() => handleAddKeyword('twitter')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">twitter</button>
                        <button onClick={() => handleAddKeyword('tweet')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">tweet</button>
                        <button onClick={() => handleAddKeyword('trending')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">trending</button>
                      </>
                    )}
                    {selectedPlatform === 'tiktok' && (
                      <>
                        <button onClick={() => handleAddKeyword('tiktok')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">tiktok</button>
                        <button onClick={() => handleAddKeyword('fyp')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">fyp</button>
                        <button onClick={() => handleAddKeyword('viral')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">viral</button>
                      </>
                    )}
                    {!selectedPlatform && (
                      <>
                        <button onClick={() => handleAddKeyword('content')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">content</button>
                        <button onClick={() => handleAddKeyword('marketing')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">marketing</button>
                        <button onClick={() => handleAddKeyword('socialmedia')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">socialmedia</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Publication Settings Card */}
          {!isMobileView && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Publiceringsalternativ
                </CardTitle>
                <CardDescription>
                  Hantera publikations- och delningsalternativ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <MobilePublishing 
                    title={contentTitle}
                    content={contentHtml}
                    onPublish={handlePublish}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}