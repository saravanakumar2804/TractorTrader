import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import VideoPlayer from '@/components/ui/video-player';

interface TractorGalleryProps {
  images: string[];
  videoUrl?: string;
  title: string;
}

export default function TractorGallery({ images, videoUrl, title }: TractorGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [openLightbox, setOpenLightbox] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  
  // Handle thumbnail click
  const handleThumbnailClick = (index: number) => {
    setSelectedImage(index);
  };
  
  // Open lightbox
  const openImageInLightbox = (index: number) => {
    setLightboxIndex(index);
    setOpenLightbox(true);
  };
  
  // Navigation in lightbox
  const goToPrevious = () => {
    setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const goToNext = () => {
    setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main image or video display */}
      <div className="relative overflow-hidden rounded-lg bg-neutral-100 aspect-video cursor-pointer" onClick={() => openImageInLightbox(selectedImage)}>
        {videoUrl && selectedImage === images.length ? (
          <VideoPlayer src={videoUrl} aspectRatio="video" />
        ) : (
          <motion.img
            key={selectedImage}
            src={images[selectedImage]}
            alt={`${title} - Image ${selectedImage + 1}`}
            className="w-full h-full object-contain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>
      
      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <motion.div
            key={index}
            className={`relative cursor-pointer h-20 w-20 rounded-md overflow-hidden border-2 ${
              selectedImage === index ? 'border-primary' : 'border-transparent'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleThumbnailClick(index)}
          >
            <img 
              src={image} 
              alt={`${title} - Thumbnail ${index + 1}`}
              className="w-full h-full object-cover" 
            />
          </motion.div>
        ))}
        
        {/* Video thumbnail if available */}
        {videoUrl && (
          <motion.div
            className={`relative cursor-pointer h-20 w-20 rounded-md overflow-hidden border-2 ${
              selectedImage === images.length ? 'border-primary' : 'border-transparent'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleThumbnailClick(images.length)}
          >
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <i className="fas fa-play text-white"></i>
            </div>
            <img 
              src={images[0] || videoUrl} 
              alt={`${title} - Video`}
              className="w-full h-full object-cover" 
            />
          </motion.div>
        )}
      </div>
      
      {/* Lightbox */}
      <Dialog open={openLightbox} onOpenChange={setOpenLightbox}>
        <DialogContent className="max-w-5xl bg-black/90 border-none p-0">
          <div className="relative">
            <div className="flex items-center justify-center h-[80vh]">
              <img 
                src={images[lightboxIndex]} 
                alt={`${title} - Fullsize ${lightboxIndex + 1}`}
                className="max-h-full max-w-full object-contain" 
              />
            </div>
            
            {/* Navigation arrows */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
              onClick={goToPrevious}
            >
              <i className="fas fa-chevron-left"></i>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
              onClick={goToNext}
            >
              <i className="fas fa-chevron-right"></i>
            </Button>
            
            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {lightboxIndex + 1} / {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Skeleton loader for the gallery
export function TractorGallerySkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="w-full aspect-video rounded-lg" />
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[1, 2, 3, 4].map((index) => (
          <Skeleton key={index} className="h-20 w-20 rounded-md" />
        ))}
      </div>
    </div>
  );
}
