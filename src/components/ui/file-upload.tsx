'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Loader2, CheckCircle2, FileText, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface FileUploadProps {
  label?: string;
  value?: string; // Cloudinary URL
  onChange: (url: string | null) => void;
  accept?: string;
  maxSize?: number; // in bytes
  error?: string;
  disabled?: boolean;
  className?: string;
  category?: string; // Document category for Cloudinary folder organization
}

export function FileUpload({
  label,
  value,
  onChange,
  accept = 'image/*,application/pdf',
  maxSize = 10 * 1024 * 1024, // 10MB default
  error,
  disabled = false,
  className,
  category,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const dropZoneRef = React.useRef<HTMLDivElement>(null);

  // Check if value is an image
  const isImage = value && /\.(jpg|jpeg|png|gif|webp)$/i.test(value);

  // Load preview when value changes
  React.useEffect(() => {
    if (value && isImage) {
      setPreviewUrl(value);
    } else {
      setPreviewUrl(null);
    }
  }, [value, isImage]);

  const uploadFile = async (file: File) => {
    // Validate file size
    if (file.size > maxSize) {
      setUploadError(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
      return;
    }

    // Validate file type
    const acceptedTypes = accept.split(',').map((type) => type.trim());
    const isValidType = acceptedTypes.some((type) => {
      if (type.endsWith('/*')) {
        const baseType = type.split('/')[0];
        return file.type.startsWith(`${baseType}/`);
      }
      return file.type === type;
    });

    if (!isValidType) {
      setUploadError(`Invalid file type. Accepted types: ${accept}`);
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'kyc');
      if (category) {
        formData.append('category', category);
      }
      formData.append('save_to_documents', 'false');

      // Get auth token
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Upload to Cloudinary
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/cloudinary/upload`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Upload failed');
      }

      const data = await response.json();
      if (data.success && data.data?.url) {
        onChange(data.data.url);
      } else {
        throw new Error('Upload failed: No URL returned');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Upload failed. Please try again.';
      setUploadError(errorMessage);
      onChange(null);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled || isUploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const handleRemove = () => {
    onChange(null);
    setUploadError(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label className="text-sm sm:text-base">{label}</Label>}
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative rounded-lg border-2 border-dashed transition-colors',
          isDragging && 'border-primary bg-primary/5',
          value && !isDragging && 'border-border bg-muted/30',
          !value &&
            !isDragging &&
            'border-border bg-background hover:border-primary/50 hover:bg-muted/50',
          (disabled || isUploading) && 'opacity-50 cursor-not-allowed',
          'p-3 sm:p-4'
        )}
      >
        <Input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          disabled={disabled || isUploading}
          className="hidden"
          id={`file-upload-${label?.toLowerCase().replace(/\s+/g, '-') || 'file'}`}
        />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-4 sm:py-6">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
            <p className="text-xs sm:text-sm text-muted-foreground">Uploading file...</p>
          </div>
        ) : value ? (
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
            {/* Preview */}
            {previewUrl ? (
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                <Image src={previewUrl} alt="Preview" fill className="object-cover" unoptimized />
              </div>
            ) : (
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-md border border-border bg-muted">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
              </div>
            )}

            {/* File Info */}
            <div className="flex-1 min-w-0 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600 dark:text-green-500" />
                <p className="text-xs sm:text-sm font-medium truncate">
                  File uploaded successfully
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-1 truncate">{value}</p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-3">
                <Label
                  htmlFor={`file-upload-${label?.toLowerCase().replace(/\s+/g, '-') || 'file'}`}
                  className={cn(
                    'cursor-pointer flex-1 sm:flex-initial',
                    disabled && 'cursor-not-allowed opacity-50'
                  )}
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={disabled}
                    onClick={() => fileInputRef.current?.click()}
                    className="h-9 sm:h-7 w-full sm:w-auto"
                  >
                    Change
                  </Button>
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  disabled={disabled}
                  className="h-9 sm:h-7 w-full sm:w-auto"
                >
                  <X className="h-3 w-3 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-4 sm:py-6">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-muted">
              <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <Label
                htmlFor={`file-upload-${label?.toLowerCase().replace(/\s+/g, '-') || 'file'}`}
                className={cn(
                  'cursor-pointer text-xs sm:text-sm font-medium text-primary hover:underline',
                  disabled && 'cursor-not-allowed opacity-50'
                )}
              >
                Click to upload
              </Label>
              <p className="text-xs text-muted-foreground mt-1">or drag and drop</p>
              <p className="text-xs text-muted-foreground mt-1 px-2">
                {accept.includes('image') && accept.includes('pdf')
                  ? 'Images or PDF'
                  : accept.includes('image')
                    ? 'Images only'
                    : 'PDF only'}{' '}
                (max {Math.round(maxSize / 1024 / 1024)}MB)
              </p>
            </div>
          </div>
        )}
      </div>
      {(error || uploadError) && (
        <p className="text-sm text-destructive flex items-center gap-1" role="alert">
          <X className="h-3 w-3" />
          {error || uploadError}
        </p>
      )}
    </div>
  );
}
