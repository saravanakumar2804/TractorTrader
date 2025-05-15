import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import FileUpload from '@/components/ui/file-upload';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TRACTOR_CATEGORIES, TRACTOR_BRANDS, YEARS } from '@/lib/constants';

// Define schema for the form
const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  brand: z.string().min(1, 'Please select a brand'),
  model: z.string().min(1, 'Model is required'),
  year: z.string().min(1, 'Please select a year'),
  price: z.string().min(1, 'Price is required'),
  horsepower: z.string().min(1, 'Horsepower is required'),
  hours: z.string().optional(),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string().min(1, 'Please select a category'),
  location: z.string().min(1, 'Location is required'),
});

type FormValues = z.infer<typeof formSchema>;

export default function SellTractor() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Check if user is logged in
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/auth/me'],
    onError: () => {
      toast({
        title: 'Authentication Required',
        description: 'You need to log in to sell a tractor',
        variant: 'destructive',
      });
      navigate('/login');
    },
  });
  
  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      brand: '',
      model: '',
      year: '',
      price: '',
      horsepower: '',
      hours: '',
      description: '',
      category: '',
      location: '',
    },
  });
  
  // Handle image upload
  const handleImagesChange = (files: File[]) => {
    setImages(files);
  };
  
  // Handle video upload
  const handleVideoChange = (files: File[]) => {
    if (files.length > 0) {
      setVideo(files[0]);
    } else {
      setVideo(null);
    }
  };
  
  // Create tractor mutation
  const createTractorMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      setIsUploading(true);
      
      try {
        // Create FormData for file uploads
        const formData = new FormData();
        
        // Add form fields
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, value);
        });
        
        // Add images
        images.forEach(image => {
          formData.append('images', image);
        });
        
        // Make the API request
        const response = await fetch('/api/tractors', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to create tractor listing');
        }
        
        const result = await response.json();
        
        // If there's a video, upload it separately
        if (video && result.tractor.id) {
          const videoFormData = new FormData();
          videoFormData.append('video', video);
          
          const videoResponse = await fetch(`/api/tractors/${result.tractor.id}/video`, {
            method: 'POST',
            body: videoFormData,
            credentials: 'include',
          });
          
          if (!videoResponse.ok) {
            throw new Error('Failed to upload video');
          }
        }
        
        return result;
      } finally {
        setIsUploading(false);
      }
    },
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: 'Your tractor has been listed successfully',
      });
      navigate(`/tractors/${data.tractor.id}`);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create your tractor listing. Please try again.',
        variant: 'destructive',
      });
      console.error('Error creating tractor:', error);
    },
  });
  
  // Handle form submission
  const onSubmit = (data: FormValues) => {
    if (images.length === 0) {
      toast({
        title: 'Images Required',
        description: 'Please upload at least one image of your tractor',
        variant: 'destructive',
      });
      return;
    }
    
    createTractorMutation.mutate(data);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="mb-6">
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            You need to be logged in to sell a tractor. Please log in or create an account.
          </AlertDescription>
        </Alert>
        <div className="flex gap-4">
          <Button onClick={() => navigate('/login')}>Log In</Button>
          <Button variant="outline" onClick={() => navigate('/register')}>Create Account</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Sell Your Tractor | TractorTrade</title>
        <meta 
          name="description" 
          content="List your tractor for sale. Upload photos, videos, and detailed specifications to attract potential buyers." 
        />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-heading font-bold text-3xl mb-4">Sell Your Tractor</h1>
          <p className="text-neutral-600 mb-8">
            Fill in the details below to list your tractor for sale. The more information you provide, the better chances of selling quickly.
          </p>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <h2 className="font-heading font-bold text-xl">Basic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Listing Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 2021 John Deere 5055E Utility Tractor" {...field} />
                        </FormControl>
                        <FormDescription>
                          Create a descriptive title that includes key details
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select brand" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TRACTOR_BRANDS.map((brand) => (
                              <SelectItem key={brand.value} value={brand.value}>
                                {brand.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 5055E" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {YEARS.map((year) => (
                              <SelectItem key={year.value} value={year.value}>
                                {year.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TRACTOR_CATEGORIES.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Mumbai, Maharashtra" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Separator />
                
                <h2 className="font-heading font-bold text-xl">Technical Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (₹)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="e.g. 500000" 
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="horsepower"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Horsepower (HP)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="e.g. 55" 
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="hours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hours (optional)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="e.g. 1500" 
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Engine hours or mileage
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide a detailed description of your tractor, including condition, features, and any additional information buyers should know..."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Be as detailed as possible to attract potential buyers.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Separator />
                
                <h2 className="font-heading font-bold text-xl">Upload Media</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Tractor Images</h3>
                    <FileUpload
                      multiple
                      maxFiles={10}
                      accept="image/*"
                      onChange={handleImagesChange}
                      variant="image"
                      uploadText="Upload images of your tractor (required)"
                      maxSize={5} // 5MB
                    />
                    <p className="text-sm text-neutral-500 mt-1">
                      Upload up to 10 images of your tractor from different angles. First image will be the cover image.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Tractor Video (optional)</h3>
                    <FileUpload
                      multiple={false}
                      accept="video/*"
                      onChange={handleVideoChange}
                      variant="video"
                      uploadText="Upload a video of your tractor (optional)"
                      maxSize={50} // 50MB
                    />
                    <p className="text-sm text-neutral-500 mt-1">
                      Upload a short video demonstrating your tractor in action.
                    </p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full py-6 text-lg"
                    disabled={isUploading || createTractorMutation.isPending}
                  >
                    {isUploading || createTractorMutation.isPending ? (
                      <span className="flex items-center">
                        <i className="fas fa-spinner fa-spin mr-2"></i> Uploading...
                      </span>
                    ) : (
                      <span>List My Tractor For Sale</span>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </motion.div>
      </div>
    </>
  );
}
