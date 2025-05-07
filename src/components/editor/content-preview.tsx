import React from 'react';
import { cn } from '@/lib/utils';

interface ContentPreviewProps {
  html: string;
  className?: string;
  maxHeight?: string;
  platformStyle?: 'default' | 'instagram' | 'facebook' | 'linkedin' | 'twitter' | 'tiktok';
}

export default function ContentPreview({
  html,
  className,
  maxHeight = '400px',
  platformStyle = 'default'
}: ContentPreviewProps) {
  const getPlatformStyles = () => {
    switch (platformStyle) {
      case 'instagram':
        return 'font-sans text-base bg-white text-black p-4 rounded-lg';
      case 'facebook':
        return 'font-sans text-base bg-[#F0F2F5] text-black p-4 rounded-lg';
      case 'linkedin':
        return 'font-sans text-base bg-white text-black p-4 border border-gray-300 rounded-lg';
      case 'twitter':
        return 'font-sans text-base bg-black text-white p-4 rounded-lg';
      case 'tiktok':
        return 'font-sans text-base bg-black text-white p-4 rounded-lg';
      default:
        return '';
    }
  };

  const getContent = () => {
    if (!html) {
      return <div className="text-muted-foreground text-center p-4">Ingen förhandsgranskning tillgänglig</div>;
    }

    // Säker rendering av HTML-innehåll (stöds eftersom vi använder React 18+)
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: html }} 
        className={cn(
          "prose dark:prose-invert max-w-none w-full",
          getPlatformStyles()
        )}
      />
    );
  };

  return (
    <div 
      className={cn(
        "w-full border rounded-md bg-background overflow-y-auto",
        className
      )}
      style={{ maxHeight }}
    >
      {getContent()}
    </div>
  );
}