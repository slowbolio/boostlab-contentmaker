import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, Smartphone, Send, Clock, Share2, Facebook, Instagram, Linkedin, Twitter, Share } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ContentPreview from './content-preview';

interface MobilePublishingProps {
  title: string;
  content: string;
  platforms?: ('facebook' | 'instagram' | 'linkedin' | 'twitter')[];
  onPublish?: (platforms: string[], schedule?: Date) => Promise<void>;
}

export default function MobilePublishing({
  title,
  content,
  platforms = ['facebook', 'instagram', 'linkedin', 'twitter'],
  onPublish
}: MobilePublishingProps) {
  const { toast } = useToast();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [schedulePost, setSchedulePost] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [publishingStatus, setPublishingStatus] = useState<'idle' | 'publishing' | 'published'>('idle');
  const [previewPlatform, setPreviewPlatform] = useState<string | null>(null);
  
  const handleTogglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };
  
  const handlePublish = async () => {
    if (selectedPlatforms.length === 0) {
      toast({
        title: "Välj minst en plattform",
        description: "Du måste välja minst en plattform att publicera på.",
        variant: "destructive"
      });
      return;
    }
    
    if (schedulePost && !selectedDate) {
      toast({
        title: "Välj ett datum",
        description: "Du måste välja ett datum för schemalagd publicering.",
        variant: "destructive"
      });
      return;
    }
    
    setPublishingStatus('publishing');
    
    try {
      if (onPublish) {
        await onPublish(selectedPlatforms, schedulePost ? selectedDate || undefined : undefined);
      } else {
        // Demo-fördröjning
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      setPublishingStatus('published');
      
      toast({
        title: schedulePost ? "Inlägg schemalagt" : "Inlägg publicerat",
        description: schedulePost 
          ? `Ditt inlägg är schemalagt för ${selectedDate?.toLocaleString()}` 
          : "Ditt inlägg har publicerats framgångsrikt.",
      });
    } catch (error) {
      setPublishingStatus('idle');
      
      toast({
        title: "Publicering misslyckades",
        description: "Ett fel uppstod vid publicering. Försök igen senare.",
        variant: "destructive"
      });
    }
  };
  
  const handleScheduleChange = (value: boolean) => {
    setSchedulePost(value);
    
    if (value && !selectedDate) {
      // Sätt förvalt schemaläggningsdatum till imorgon
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      setSelectedDate(tomorrow);
    }
  };
  
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(event.target.value));
  };
  
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };
  
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5" />;
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      default:
        return <Share className="h-5 w-5" />;
    }
  };
  
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'instagram':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600';
      case 'linkedin':
        return 'bg-blue-700 hover:bg-blue-800';
      case 'twitter':
        return 'bg-blue-400 hover:bg-blue-500';
      default:
        return 'bg-slate-600 hover:bg-slate-700';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          <span>Mobil publicering</span>
        </CardTitle>
        <CardDescription>
          Publicera direkt från din mobila enhet
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Välj plattformar</h3>
          <div className="flex flex-wrap gap-2">
            {platforms.map(platform => (
              <Button
                key={platform}
                variant={selectedPlatforms.includes(platform) ? "default" : "outline"}
                className="flex items-center gap-2"
                onClick={() => handleTogglePlatform(platform)}
              >
                {getPlatformIcon(platform)}
                <span className="capitalize">{platform}</span>
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="schedule-post" className="flex items-center gap-2 cursor-pointer">
            <Clock className="h-4 w-4" />
            <span>Schemalägg inlägg</span>
          </Label>
          <Switch
            id="schedule-post"
            checked={schedulePost}
            onCheckedChange={handleScheduleChange}
          />
        </div>
        
        {schedulePost && (
          <div className="space-y-2">
            <Label htmlFor="schedule-date">Välj datum och tid</Label>
            <input
              id="schedule-date"
              type="datetime-local"
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onChange={handleDateChange}
              min={new Date().toISOString().split('.')[0].slice(0, -3)}
              value={selectedDate?.toISOString().split('.')[0].slice(0, -3) || ''}
            />
            {selectedDate && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(selectedDate)}</span>
              </div>
            )}
          </div>
        )}
        
        <div className="pt-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full flex items-center gap-2"
                onClick={() => setPreviewPlatform(selectedPlatforms[0] || platforms[0])}
              >
                <Share2 className="h-4 w-4" />
                Förhandsgranska inlägg
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Förhandsgranskning</DialogTitle>
                <DialogDescription>
                  Så här kommer ditt inlägg att se ut på valda plattformar
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <Select 
                  value={previewPlatform || platforms[0]} 
                  onValueChange={setPreviewPlatform}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Välj plattform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map(platform => (
                      <SelectItem key={platform} value={platform}>
                        <div className="flex items-center gap-2">
                          {getPlatformIcon(platform)}
                          <span className="capitalize">{platform}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <ContentPreview 
                  html={content} 
                  platformStyle={previewPlatform as any || 'default'} 
                  maxHeight="300px"
                />
              </div>
              
              <DialogFooter>
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => handleTogglePlatform(previewPlatform || platforms[0])}>
                  {selectedPlatforms.includes(previewPlatform || platforms[0]) 
                    ? 'Ta bort från valda' 
                    : 'Lägg till i valda'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full flex items-center gap-2"
          onClick={handlePublish}
          disabled={publishingStatus === 'publishing' || selectedPlatforms.length === 0}
        >
          {publishingStatus === 'publishing' ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span>Publicerar...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>{schedulePost ? 'Schemalägg publicering' : 'Publicera nu'}</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}