import React, { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Upload, Image, FileVideo } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface FileUploadProps {
  multiple?: boolean;
  maxFiles?: number;
  accept?: string;
  onChange: (files: File[]) => void;
  onRemove?: (index: number) => void;
  value?: File[];
  className?: string;
  uploadText?: string;
  variant?: 'default' | 'image' | 'video';
  disabled?: boolean;
  maxSize?: number; // in MB
}

export function FileUpload({
  multiple = false,
  maxFiles = 10,
  accept = '*/*',
  onChange,
  onRemove,
  value = [],
  className,
  uploadText = 'Upload files',
  variant = 'default',
  disabled = false,
  maxSize = 5, // Default 5MB max file size
}: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFiles(selectedFiles);
    
    // Reset the input value to allow selecting the same file again
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleFiles = (files: File[]) => {
    setError(null);

    // Check for max files
    if (multiple && value.length + files.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files`);
      return;
    }

    // Check for file size
    const oversizedFiles = files.filter(file => file.size > maxSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError(`Some files exceed the ${maxSize}MB limit`);
      return;
    }

    // Handle the files
    const newFiles = multiple ? [...value, ...files] : files;
    onChange(newFiles);
  };

  const handleRemove = (index: number) => {
    if (onRemove) {
      onRemove(index);
    } else {
      const newFiles = [...value];
      newFiles.splice(index, 1);
      onChange(newFiles);
    }
    setError(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const getIconByFileType = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-5 h-5" />;
    } else if (file.type.startsWith('video/')) {
      return <FileVideo className="w-5 h-5" />;
    } else {
      return <Upload className="w-5 h-5" />;
    }
  };

  const getPreviewByFileType = (file: File, index: number) => {
    if (file.type.startsWith('image/')) {
      return (
        <div className="group relative w-24 h-24 rounded-md overflow-hidden border">
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
            aria-label="Remove file"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      );
    } else {
      return (
        <div className="group relative flex items-center p-2 border rounded-md gap-2">
          {getIconByFileType(file)}
          <span className="text-sm truncate max-w-[150px]">{file.name}</span>
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="ml-auto"
            aria-label="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      );
    }
  };

  let dropzoneClasses = cn(
    'flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors',
    isDragging ? 'border-primary bg-primary/5' : 'border-border',
    disabled && 'opacity-50 cursor-not-allowed',
    className
  );

  // Different styles based on variant
  if (variant === 'image') {
    dropzoneClasses = cn(
      dropzoneClasses,
      'aspect-video bg-muted/40'
    );
  } else if (variant === 'video') {
    dropzoneClasses = cn(
      dropzoneClasses,
      'aspect-video bg-muted/40'
    );
  }

  return (
    <div className="space-y-4">
      <div
        className={dropzoneClasses}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
          id="file-upload"
        />
        
        {variant === 'image' ? (
          <div className="flex flex-col items-center justify-center text-center">
            <Image className="w-8 h-8 mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag & drop images here or click to browse
            </p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
            >
              Choose Images
            </Button>
          </div>
        ) : variant === 'video' ? (
          <div className="flex flex-col items-center justify-center text-center">
            <FileVideo className="w-8 h-8 mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag & drop video here or click to browse
            </p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
            >
              Choose Video
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">{uploadText}</p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
            >
              Browse Files
            </Button>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive mt-2">{error}</p>
      )}

      {value.length > 0 && (
        <div className="mt-4">
          <AnimatePresence>
            <div className="flex flex-wrap gap-2">
              {value.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  {getPreviewByFileType(file, index)}
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
