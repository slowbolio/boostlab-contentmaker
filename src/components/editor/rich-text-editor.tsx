import React, { useCallback, useEffect } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  ImagePlus,
  Check,
  ChevronsUpDown
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface RichTextEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  onImageUploadRequest?: (file: File) => Promise<string>;
  placeholder?: string;
  autoFocus?: boolean;
  readOnly?: boolean;
  maxHeight?: string;
  minHeight?: string;
  mobileToolbarPosition?: 'top' | 'bottom';
  editorClass?: string;
}

export default function RichTextEditor({
  content = '',
  onChange,
  onImageUploadRequest,
  placeholder = 'Börja skriva...',
  autoFocus = false,
  readOnly = false,
  maxHeight = '600px',
  minHeight = '400px',
  mobileToolbarPosition = 'top',
  editorClass,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          class: 'text-primary underline',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable: !readOnly,
    autofocus: autoFocus,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editor || !e.target.files?.length || !onImageUploadRequest) return;
    
    const file = e.target.files[0];
    
    try {
      const uploadedUrl = await onImageUploadRequest(file);
      editor.chain().focus().setImage({ src: uploadedUrl }).run();
    } catch (error) {
      console.error("Image upload failed:", error);
    }
    
    // Reset the input
    e.target.value = '';
  }, [editor, onImageUploadRequest]);

  const handleMobileImageUpload = useCallback(async () => {
    // Create a temporary file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // Use camera for mobile devices
    
    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      if (!editor || !target?.files?.length || !onImageUploadRequest) return;
      
      const file = target.files[0];
      
      try {
        const uploadedUrl = await onImageUploadRequest(file);
        editor.chain().focus().setImage({ src: uploadedUrl }).run();
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    };
    
    input.click();
  }, [editor, onImageUploadRequest]);

  const setLink = useCallback(() => {
    if (!editor) return;
    
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl || '');
    
    // cancelled
    if (url === null) return;
    
    // empty
    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }
    
    // update link
    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="relative w-full flex flex-col">
      {/* Desktop Toolbar */}
      <div className="hidden md:flex items-center gap-1 p-1 border rounded-md mb-2 bg-muted/20 overflow-x-auto">
        <ToggleGroup type="multiple" className="flex flex-wrap">
          <ToggleGroupItem 
            value="bold" 
            aria-label="Toggle bold" 
            onClick={() => editor.chain().focus().toggleBold().run()}
            data-state={editor.isActive('bold') ? 'on' : 'off'}
            size="sm"
          >
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          
          <ToggleGroupItem 
            value="italic" 
            aria-label="Toggle italic" 
            onClick={() => editor.chain().focus().toggleItalic().run()}
            data-state={editor.isActive('italic') ? 'on' : 'off'}
            size="sm"
          >
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          
          <ToggleGroupItem 
            value="underline" 
            aria-label="Toggle underline" 
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            data-state={editor.isActive('underline') ? 'on' : 'off'}
            size="sm"
          >
            <UnderlineIcon className="h-4 w-4" />
          </ToggleGroupItem>
          
          <ToggleGroupItem 
            value="link" 
            aria-label="Add link" 
            onClick={setLink}
            data-state={editor.isActive('link') ? 'on' : 'off'}
            size="sm"
          >
            <LinkIcon className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        
        <span className="w-px h-6 bg-border mx-1" />
        
        <ToggleGroup type="single" className="flex flex-wrap">
          <ToggleGroupItem 
            value="h1" 
            aria-label="Heading 1" 
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            data-state={editor.isActive('heading', { level: 1 }) ? 'on' : 'off'}
            size="sm"
          >
            <Heading1 className="h-4 w-4" />
          </ToggleGroupItem>
          
          <ToggleGroupItem 
            value="h2" 
            aria-label="Heading 2" 
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            data-state={editor.isActive('heading', { level: 2 }) ? 'on' : 'off'}
            size="sm"
          >
            <Heading2 className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        
        <span className="w-px h-6 bg-border mx-1" />
        
        <ToggleGroup type="single" className="flex flex-wrap">
          <ToggleGroupItem 
            value="bulletList" 
            aria-label="Bullet list" 
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            data-state={editor.isActive('bulletList') ? 'on' : 'off'}
            size="sm"
          >
            <List className="h-4 w-4" />
          </ToggleGroupItem>
          
          <ToggleGroupItem 
            value="orderedList" 
            aria-label="Ordered list" 
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            data-state={editor.isActive('orderedList') ? 'on' : 'off'}
            size="sm"
          >
            <ListOrdered className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        
        <span className="w-px h-6 bg-border mx-1" />
        
        <ToggleGroup type="single" className="flex flex-wrap">
          <ToggleGroupItem 
            value="left" 
            aria-label="Align left" 
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            data-state={editor.isActive({ textAlign: 'left' }) ? 'on' : 'off'}
            size="sm"
          >
            <AlignLeft className="h-4 w-4" />
          </ToggleGroupItem>
          
          <ToggleGroupItem 
            value="center" 
            aria-label="Align center" 
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            data-state={editor.isActive({ textAlign: 'center' }) ? 'on' : 'off'}
            size="sm"
          >
            <AlignCenter className="h-4 w-4" />
          </ToggleGroupItem>
          
          <ToggleGroupItem 
            value="right" 
            aria-label="Align right" 
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            data-state={editor.isActive({ textAlign: 'right' }) ? 'on' : 'off'}
            size="sm"
          >
            <AlignRight className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        
        <span className="w-px h-6 bg-border mx-1" />
        
        {onImageUploadRequest && (
          <div className="relative">
            <Button 
              size="sm" 
              variant="ghost"
              onClick={handleMobileImageUpload}
              className="p-2"
            >
              <ImagePlus className="h-4 w-4" />
            </Button>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        )}
      </div>
      
      {/* Mobile Toolbar (at top or bottom) */}
      <div className={cn(
        "md:hidden flex items-center gap-1 p-1 border rounded-md bg-muted/20 overflow-x-auto",
        mobileToolbarPosition === 'top' ? "mb-2" : "mt-2 order-1"
      )}>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="px-2 py-1 h-8">
              <Bold className="h-4 w-4 mr-1" />
              <ChevronsUpDown className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-1" align="start">
            <div className="grid grid-cols-3 gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={cn("flex-1 p-2", editor.isActive('bold') && "bg-muted")}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={cn("flex-1 p-2", editor.isActive('italic') && "bg-muted")}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={cn("flex-1 p-2", editor.isActive('underline') && "bg-muted")}
              >
                <UnderlineIcon className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={cn("flex-1 p-2", editor.isActive('heading', { level: 1 }) && "bg-muted")}
              >
                <Heading1 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={cn("flex-1 p-2", editor.isActive('heading', { level: 2 }) && "bg-muted")}
              >
                <Heading2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={setLink}
                className={cn("flex-1 p-2", editor.isActive('link') && "bg-muted")}
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="px-2 py-1 h-8">
              <List className="h-4 w-4 mr-1" />
              <ChevronsUpDown className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-1" align="start">
            <div className="grid grid-cols-2 gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={cn("flex-1 p-2", editor.isActive('bulletList') && "bg-muted")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={cn("flex-1 p-2", editor.isActive('orderedList') && "bg-muted")}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={cn("flex-1 p-2", editor.isActive({ textAlign: 'left' }) && "bg-muted")}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={cn("flex-1 p-2", editor.isActive({ textAlign: 'center' }) && "bg-muted")}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        {onImageUploadRequest && (
          <Button 
            variant="outline" 
            size="sm" 
            className="px-2 py-1 h-8"
            onClick={handleMobileImageUpload}
          >
            <ImagePlus className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Bubble Menu */}
      {editor && !readOnly && (
        <BubbleMenu 
          editor={editor} 
          tippyOptions={{ duration: 100 }}
          className="flex items-center gap-1 p-1 rounded-md border bg-background shadow-md"
        >
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn("p-1 h-8 w-8", editor.isActive('bold') && "bg-muted")}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn("p-1 h-8 w-8", editor.isActive('italic') && "bg-muted")}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={cn("p-1 h-8 w-8", editor.isActive('underline') && "bg-muted")}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={setLink}
            className={cn("p-1 h-8 w-8", editor.isActive('link') && "bg-muted")}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </BubbleMenu>
      )}
      
      {/* Editor Content */}
      <EditorContent 
        editor={editor} 
        className={cn(
          "prose prose-invert max-w-none w-full bg-card rounded-md border p-3 focus-within:outline-none focus-within:ring-1 focus-within:ring-primary overflow-y-auto",
          editorClass,
          readOnly ? "opacity-80 cursor-default" : ""
        )}
        style={{ 
          maxHeight, 
          minHeight 
        }}
      />
    </div>
  );
}