import { Request, Response } from 'express';
import { storage } from '../storage';
import { insertTractorSchema } from '@shared/schema';
import { ZodError } from 'zod';
import path from 'path';
import fs from 'fs';

// Get all tractors with filtering options
export const getTractors = async (req: Request, res: Response) => {
  try {
    const { category, search, sellerId } = req.query;
    
    const tractors = await storage.getTractors({
      category: category as string,
      search: search as string,
      sellerId: sellerId ? parseInt(sellerId as string) : undefined,
    });
    
    res.status(200).json(tractors);
  } catch (error) {
    console.error('Error fetching tractors:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get single tractor by ID
export const getTractor = async (req: Request, res: Response) => {
  try {
    const tractorId = parseInt(req.params.id);
    
    if (isNaN(tractorId)) {
      return res.status(400).json({ message: 'Invalid tractor ID' });
    }
    
    const tractor = await storage.getTractor(tractorId);
    
    if (!tractor) {
      return res.status(404).json({ message: 'Tractor not found' });
    }
    
    res.status(200).json(tractor);
  } catch (error) {
    console.error('Error fetching tractor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create new tractor
export const createTractor = async (req: Request, res: Response) => {
  try {
    // Check if user is authenticated
    if (!req.session?.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Handle file uploads (images and video)
    const images = req.files as Express.Multer.File[];
    const video = req.file;
    
    // Parse request body
    const tractorData = {
      ...req.body,
      sellerId: req.session.userId,
      price: parseInt(req.body.price),
      horsepower: parseInt(req.body.horsepower),
      year: parseInt(req.body.year),
      hours: req.body.hours ? parseInt(req.body.hours) : undefined,
    };
    
    // Add image paths if uploaded
    if (images && images.length > 0) {
      tractorData.images = images.map((image) => `/uploads/images/${image.filename}`);
    }
    
    // Add video path if uploaded
    if (video) {
      tractorData.videoUrl = `/uploads/videos/${video.filename}`;
    }
    
    // Convert specifications and features from JSON strings to objects
    if (req.body.specifications) {
      tractorData.specifications = JSON.parse(req.body.specifications);
    }
    
    if (req.body.features) {
      tractorData.features = JSON.parse(req.body.features);
    }
    
    // Validate tractor data
    const validatedData = insertTractorSchema.parse(tractorData);
    
    // Create tractor in storage
    const tractor = await storage.createTractor(validatedData);
    
    res.status(201).json({
      message: 'Tractor created successfully',
      tractor,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    
    console.error('Error creating tractor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update tractor
export const updateTractor = async (req: Request, res: Response) => {
  try {
    // Check if user is authenticated
    if (!req.session?.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const tractorId = parseInt(req.params.id);
    
    if (isNaN(tractorId)) {
      return res.status(400).json({ message: 'Invalid tractor ID' });
    }
    
    // Get existing tractor
    const existingTractor = await storage.getTractor(tractorId);
    
    if (!existingTractor) {
      return res.status(404).json({ message: 'Tractor not found' });
    }
    
    // Check if user is the seller or an admin
    const user = await storage.getUser(req.session.userId);
    if (existingTractor.sellerId !== req.session.userId && !user?.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this tractor' });
    }
    
    // Handle file uploads (images and video)
    const images = req.files as Express.Multer.File[];
    const video = req.file;
    
    // Prepare update data
    const updateData: any = {
      ...req.body,
    };
    
    // Handle numeric fields
    if (req.body.price) updateData.price = parseInt(req.body.price);
    if (req.body.horsepower) updateData.horsepower = parseInt(req.body.horsepower);
    if (req.body.year) updateData.year = parseInt(req.body.year);
    if (req.body.hours) updateData.hours = parseInt(req.body.hours);
    
    // Add new image paths if uploaded
    if (images && images.length > 0) {
      updateData.images = [...(existingTractor.images || []), ...images.map(image => `/uploads/images/${image.filename}`)];
    }
    
    // Add video path if uploaded
    if (video) {
      // If there was an existing video, delete it
      if (existingTractor.videoUrl) {
        const oldVideoPath = path.join(process.cwd(), existingTractor.videoUrl.replace('/', ''));
        if (fs.existsSync(oldVideoPath)) {
          fs.unlinkSync(oldVideoPath);
        }
      }
      updateData.videoUrl = `/uploads/videos/${video.filename}`;
    }
    
    // Convert specifications and features from JSON strings to objects if provided
    if (req.body.specifications) {
      updateData.specifications = JSON.parse(req.body.specifications);
    }
    
    if (req.body.features) {
      updateData.features = JSON.parse(req.body.features);
    }
    
    // Update tractor in storage
    const updatedTractor = await storage.updateTractor(tractorId, updateData);
    
    res.status(200).json({
      message: 'Tractor updated successfully',
      tractor: updatedTractor,
    });
  } catch (error) {
    console.error('Error updating tractor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete tractor
export const deleteTractor = async (req: Request, res: Response) => {
  try {
    // Check if user is authenticated
    if (!req.session?.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const tractorId = parseInt(req.params.id);
    
    if (isNaN(tractorId)) {
      return res.status(400).json({ message: 'Invalid tractor ID' });
    }
    
    // Get existing tractor
    const existingTractor = await storage.getTractor(tractorId);
    
    if (!existingTractor) {
      return res.status(404).json({ message: 'Tractor not found' });
    }
    
    // Check if user is the seller or an admin
    const user = await storage.getUser(req.session.userId);
    if (existingTractor.sellerId !== req.session.userId && !user?.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this tractor' });
    }
    
    // Delete associated files
    if (existingTractor.images && existingTractor.images.length > 0) {
      existingTractor.images.forEach(imagePath => {
        const fullPath = path.join(process.cwd(), imagePath.replace('/', ''));
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }
    
    if (existingTractor.videoUrl) {
      const videoPath = path.join(process.cwd(), existingTractor.videoUrl.replace('/', ''));
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
    }
    
    // Delete tractor from storage
    await storage.deleteTractor(tractorId);
    
    res.status(200).json({ message: 'Tractor deleted successfully' });
  } catch (error) {
    console.error('Error deleting tractor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add tractor to favorites
export const addToFavorites = async (req: Request, res: Response) => {
  try {
    // Check if user is authenticated
    if (!req.session?.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const tractorId = parseInt(req.params.id);
    
    if (isNaN(tractorId)) {
      return res.status(400).json({ message: 'Invalid tractor ID' });
    }
    
    // Check if tractor exists
    const tractor = await storage.getTractor(tractorId);
    
    if (!tractor) {
      return res.status(404).json({ message: 'Tractor not found' });
    }
    
    // Check if already in favorites
    const isFavorite = await storage.isFavorite(req.session.userId, tractorId);
    
    if (isFavorite) {
      return res.status(400).json({ message: 'Tractor is already in favorites' });
    }
    
    // Add to favorites
    const favorite = await storage.createFavorite({
      userId: req.session.userId,
      tractorId,
    });
    
    res.status(201).json({
      message: 'Tractor added to favorites',
      favorite,
    });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Remove tractor from favorites
export const removeFromFavorites = async (req: Request, res: Response) => {
  try {
    // Check if user is authenticated
    if (!req.session?.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const tractorId = parseInt(req.params.id);
    
    if (isNaN(tractorId)) {
      return res.status(400).json({ message: 'Invalid tractor ID' });
    }
    
    // Find the favorite record
    const favorites = await storage.getFavoritesByUserId(req.session.userId);
    const favorite = favorites.find(f => f.tractorId === tractorId);
    
    if (!favorite) {
      return res.status(404).json({ message: 'Tractor not found in favorites' });
    }
    
    // Remove from favorites
    await storage.deleteFavorite(favorite.id);
    
    res.status(200).json({ message: 'Tractor removed from favorites' });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user's favorite tractors
export const getFavorites = async (req: Request, res: Response) => {
  try {
    // Check if user is authenticated
    if (!req.session?.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Get user's favorites
    const favorites = await storage.getFavoritesByUserId(req.session.userId);
    
    // Get tractor details for each favorite
    const tractors = await Promise.all(
      favorites.map(async (favorite) => {
        const tractor = await storage.getTractor(favorite.tractorId);
        return tractor;
      })
    );
    
    // Filter out any undefined tractors (in case they were deleted)
    const validTractors = tractors.filter(Boolean);
    
    res.status(200).json(validTractors);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
