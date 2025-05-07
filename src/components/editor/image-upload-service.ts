// Mock service för bilduppladdningar
// I en riktig implementation skulle detta kopplas till en backend/molntjänst

export interface UploadedImage {
  id: string;
  url: string;
  filename: string;
  size: number;
  width?: number;
  height?: number;
  createdAt: Date;
}

// Genererar ett unikt ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Konverterar storlek till läsbart format
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

class ImageUploadService {
  // Sparar uppladdade bilder i minnet (endast för demo)
  private uploadedImages: UploadedImage[] = [];
  
  // Simulerar uppladdning till en server
  async uploadImage(file: File): Promise<string> {
    // Validera filtyp
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Ogiltig filtyp. Endast JPG, PNG, GIF och WEBP stöds.');
    }
    
    // Validera filstorlek (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('Filen är för stor. Maximal filstorlek är 5MB.');
    }
    
    // Simulera nätverksfördröjning
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Skapa en Data URL för förhandsgranskning
    // I en riktig implementation skulle filen skickas till en server
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (!event.target?.result) {
          reject(new Error('Kunde inte läsa filen.'));
          return;
        }
        
        const url = event.target.result as string;
        
        // Skapa ett bildobjekt för att få dimensioner
        const img = new Image();
        img.onload = () => {
          const uploadedImage: UploadedImage = {
            id: generateId(),
            url,
            filename: file.name,
            size: file.size,
            width: img.width,
            height: img.height,
            createdAt: new Date()
          };
          
          this.uploadedImages.push(uploadedImage);
          resolve(url);
        };
        
        img.onerror = () => {
          reject(new Error('Kunde inte läsa bilden.'));
        };
        
        img.src = url;
      };
      
      reader.onerror = () => {
        reject(new Error('Kunde inte läsa filen.'));
      };
      
      reader.readAsDataURL(file);
    });
  }
  
  // Hämta alla uppladdade bilder
  getUploadedImages(): UploadedImage[] {
    return [...this.uploadedImages];
  }
  
  // Ta bort en bild
  removeImage(id: string): void {
    this.uploadedImages = this.uploadedImages.filter(img => img.id !== id);
  }
}

export const imageUploadService = new ImageUploadService();