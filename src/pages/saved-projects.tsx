import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  useSavedProjects,
  useSavedProjectsByStatus,
  useDeleteSavedProject,
  useArchiveSavedProject,
  usePublishSavedProject,
  useUpdateSavedProject
} from "@/hooks/use-saved-projects";
import { useToast } from "@/components/ui/use-toast";
import { 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Archive, 
  Send, 
  Clock, 
  AlertCircle,
  X,
  Check,
  Loader2,
  FileText,
  Filter,
  PenLine,
  GalleryVerticalEnd
} from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

export default function SavedProjects() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filteredPlatform, setFilteredPlatform] = useState<string | null>(null);
  
  // Mutations för att hantera projekt
  const deleteMutation = useDeleteSavedProject();
  const archiveMutation = useArchiveSavedProject();
  const publishMutation = usePublishSavedProject();
  const updateMutation = useUpdateSavedProject();
  
  // Hämta projekt beroende på aktiv flik
  const { 
    data: allProjects = [], 
    isLoading: isLoadingAll 
  } = useSavedProjects();
  
  const { 
    data: draftProjects = [], 
    isLoading: isLoadingDrafts 
  } = useSavedProjectsByStatus('draft');
  
  const { 
    data: publishedProjects = [], 
    isLoading: isLoadingPublished 
  } = useSavedProjectsByStatus('published');
  
  const { 
    data: archivedProjects = [], 
    isLoading: isLoadingArchived 
  } = useSavedProjectsByStatus('archived');
  
  // Hämta projekt baserat på aktuell flik
  const getProjects = () => {
    switch (activeTab) {
      case "drafts":
        return draftProjects;
      case "published":
        return publishedProjects;
      case "archived":
        return archivedProjects;
      default:
        return allProjects;
    }
  };
  
  // Filtrera projekt baserat på sökfråga och plattform
  const filteredProjects = getProjects().filter(project => {
    const matchesSearch = searchQuery === "" || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.tags && project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesPlatform = filteredPlatform === null || project.platform === filteredPlatform;
    
    return matchesSearch && matchesPlatform;
  });
  
  // Få unika plattformar för filtrering
  const platforms = [...new Set(allProjects.map(project => project.platform).filter(Boolean))];
  
  // Hantera borttagning av projekt
  const handleDeleteProject = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast({
        title: "Projekt borttaget",
        description: "Projektet har tagits bort permanent."
      });
    } catch (error) {
      toast({
        title: "Kunde inte ta bort",
        description: "Ett fel uppstod vid borttagning av projektet.",
        variant: "destructive"
      });
    }
  };
  
  // Hantera arkivering av projekt
  const handleArchiveProject = async (id: string) => {
    try {
      await archiveMutation.mutateAsync(id);
      toast({
        title: "Projekt arkiverat",
        description: "Projektet har flyttats till arkivet."
      });
    } catch (error) {
      toast({
        title: "Kunde inte arkivera",
        description: "Ett fel uppstod vid arkivering av projektet.",
        variant: "destructive"
      });
    }
  };
  
  // Hantera publicering av projekt
  const handlePublishProject = async (id: string) => {
    try {
      await publishMutation.mutateAsync(id);
      toast({
        title: "Projekt publicerat",
        description: "Projektet har markerats som publicerat."
      });
    } catch (error) {
      toast({
        title: "Kunde inte publicera",
        description: "Ett fel uppstod vid publicering av projektet.",
        variant: "destructive"
      });
    }
  };
  
  // Återställ projekt till utkast
  const handleMoveToDraft = async (id: string) => {
    try {
      await updateMutation.mutateAsync({
        id,
        data: { status: 'draft' }
      });
      toast({
        title: "Flyttat till utkast",
        description: "Projektet har flyttats till dina utkast."
      });
    } catch (error) {
      toast({
        title: "Kunde inte flytta",
        description: "Ett fel uppstod vid flyttning av projektet.",
        variant: "destructive"
      });
    }
  };
  
  // Redigera ett projekt
  const handleEditProject = (project: any) => {
    if (project.htmlContent) {
      // Om HTML-innehåll finns, navigera till den avancerade redigeraren
      navigate('/advanced-editor', { 
        state: { 
          project,
          fromSavedProjects: true
        }
      });
    } else {
      // Annars använd standard innehållsskaparen
      navigate('/content-creator', { 
        state: { 
          project,
          fromSavedProjects: true
        }
      });
    }
  };
  
  // Formatera datum
  const formatDateRelative = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "d MMM yyyy HH:mm", { locale: sv });
    } catch (error) {
      return "Ogiltigt datum";
    }
  };
  
  // Visa status med färgkodad badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return (
          <Badge variant="outline" className="flex items-center gap-1 border-blue-500/50 text-blue-500">
            <Clock className="h-3 w-3" />
            <span>Utkast</span>
          </Badge>
        );
      case 'published':
        return (
          <Badge variant="outline" className="flex items-center gap-1 border-green-500/50 text-green-500">
            <Check className="h-3 w-3" />
            <span>Publicerad</span>
          </Badge>
        );
      case 'archived':
        return (
          <Badge variant="outline" className="flex items-center gap-1 border-amber-500/50 text-amber-500">
            <Archive className="h-3 w-3" />
            <span>Arkiverad</span>
          </Badge>
        );
      default:
        return null;
    }
  };
  
  // Visa plattform med färgkodad badge
  const renderPlatformBadge = (platform?: string) => {
    if (!platform) return null;
    
    const platformConfig: Record<string, { color: string, icon: any }> = {
      'instagram': { color: 'pink', icon: <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.897 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.897-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg> },
      'facebook': { color: 'blue', icon: <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
      'linkedin': { color: 'sky', icon: <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
      'twitter': { color: 'cyan', icon: <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg> },
      'tiktok': { color: 'slate', icon: <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg> },
    };
    
    const config = platformConfig[platform] || { color: 'slate', icon: <FileText className="h-3 w-3" /> };
    
    return (
      <Badge variant="outline" className={`flex items-center gap-1 border-${config.color}-500/50 text-${config.color}-500`}>
        {config.icon}
        <span className="capitalize">{platform}</span>
      </Badge>
    );
  };
  
  const isLoading = isLoadingAll || isLoadingDrafts || isLoadingPublished || isLoadingArchived;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sparade projekt</h1>
        <p className="text-muted-foreground">
          Hantera dina sparade innehållsprojekt
        </p>
      </div>
      
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Sök efter projekt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>Plattform</span>
                {filteredPlatform && <Badge variant="secondary" className="ml-1 text-xs">{filteredPlatform}</Badge>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilteredPlatform(null)}>
                <Check className={`mr-2 h-4 w-4 ${!filteredPlatform ? 'opacity-100' : 'opacity-0'}`} />
                <span>Alla plattformar</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {platforms.map(platform => platform && (
                <DropdownMenuItem key={platform} onClick={() => setFilteredPlatform(platform)}>
                  <Check className={`mr-2 h-4 w-4 ${filteredPlatform === platform ? 'opacity-100' : 'opacity-0'}`} />
                  <span className="capitalize">{platform}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={() => navigate('/content-creator')} size="sm" className="flex items-center gap-1">
            <PenLine className="h-4 w-4" />
            <span>Skapa nytt</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <GalleryVerticalEnd className="h-4 w-4" />
            <span>Alla</span>
            {!isLoading && <Badge variant="secondary" className="ml-1">{allProjects.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="drafts" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Utkast</span>
            {!isLoading && <Badge variant="secondary" className="ml-1">{draftProjects.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="published" className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            <span>Publicerade</span>
            {!isLoading && <Badge variant="secondary" className="ml-1">{publishedProjects.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="archived" className="flex items-center gap-2">
            <Archive className="h-4 w-4" />
            <span>Arkiverade</span>
            {!isLoading && <Badge variant="secondary" className="ml-1">{archivedProjects.length}</Badge>}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Laddar projekt...</p>
              </div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <FileText className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Inga projekt hittades</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                {searchQuery || filteredPlatform
                  ? "Inga projekt matchar dina sökkriterier. Prova att ändra din sökning eller filter."
                  : "Du har inga projekt i den här kategorin ännu. Skapa ett nytt projekt för att komma igång."}
              </p>
              {!searchQuery && !filteredPlatform && (
                <Button 
                  className="mt-4"
                  onClick={() => navigate('/content-creator')}
                >
                  Skapa nytt projekt
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-1 pr-8">
                        <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                        {project.description && (
                          <CardDescription className="line-clamp-2">
                            {project.description}
                          </CardDescription>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditProject(project)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Redigera</span>
                          </DropdownMenuItem>
                          
                          {project.status === 'draft' && (
                            <DropdownMenuItem onClick={() => handlePublishProject(project.id)}>
                              <Send className="mr-2 h-4 w-4" />
                              <span>Markera som publicerad</span>
                            </DropdownMenuItem>
                          )}
                          
                          {project.status !== 'draft' && (
                            <DropdownMenuItem onClick={() => handleMoveToDraft(project.id)}>
                              <Clock className="mr-2 h-4 w-4" />
                              <span>Flytta till utkast</span>
                            </DropdownMenuItem>
                          )}
                          
                          {project.status !== 'archived' && (
                            <DropdownMenuItem onClick={() => handleArchiveProject(project.id)}>
                              <Archive className="mr-2 h-4 w-4" />
                              <span>Arkivera</span>
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem 
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Ta bort</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="relative border rounded-md p-3 text-sm text-muted-foreground h-24 overflow-hidden">
                      <div className="line-clamp-4">{project.content}</div>
                      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background to-transparent" />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start gap-2 pt-0 pb-3">
                    <div className="flex justify-between items-center w-full mt-1">
                      <div className="flex items-center space-x-2">
                        {renderStatusBadge(project.status)}
                        {project.platform && renderPlatformBadge(project.platform)}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDateRelative(project.updatedAt)}
                      </span>
                    </div>
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {project.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{project.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}