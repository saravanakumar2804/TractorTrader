import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import MemoryStore from "memorystore";
import { isAuthenticated, isAdmin } from "./middleware/auth.middleware";
import { handleImageUpload, handleVideoUpload } from "./middleware/upload.middleware";
import express from "express";

// Controllers
import * as userController from "./controllers/user.controller";
import * as tractorController from "./controllers/tractor.controller";
import * as paymentController from "./controllers/payment.controller";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create session store
  const MemoryStoreSession = MemoryStore(session);
  
  // Configure session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "tractor-trade-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
      store: new MemoryStoreSession({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
    })
  );
  
  // Serve static files from uploads directory
  app.use("/uploads", express.static("uploads"));

  // User routes
  app.post("/api/auth/register", userController.registerUser);
  app.post("/api/auth/login", userController.loginUser);
  app.post("/api/auth/logout", userController.logoutUser);
  app.get("/api/auth/me", userController.getCurrentUser);
  app.put("/api/users/profile", isAuthenticated, userController.updateProfile);
  app.put("/api/users/password", isAuthenticated, userController.changePassword);

  // Tractor routes
  app.get("/api/tractors", tractorController.getTractors);
  app.get("/api/tractors/:id", tractorController.getTractor);
  app.post("/api/tractors", isAuthenticated, handleImageUpload, tractorController.createTractor);
  app.put("/api/tractors/:id", isAuthenticated, handleImageUpload, tractorController.updateTractor);
  app.delete("/api/tractors/:id", isAuthenticated, tractorController.deleteTractor);
  
  // Video upload route (separate to handle large files)
  app.post("/api/tractors/:id/video", isAuthenticated, handleVideoUpload, (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No video uploaded" });
    }
    res.status(200).json({ 
      message: "Video uploaded successfully",
      videoUrl: `/uploads/videos/${req.file.filename}`
    });
  });

  // Favorites routes
  app.post("/api/tractors/:id/favorite", isAuthenticated, tractorController.addToFavorites);
  app.delete("/api/tractors/:id/favorite", isAuthenticated, tractorController.removeFromFavorites);
  app.get("/api/favorites", isAuthenticated, tractorController.getFavorites);

  // Payment routes
  app.post("/api/tractors/:id/payment", isAuthenticated, paymentController.createPaymentOrder);
  app.post("/api/payments/verify", isAuthenticated, paymentController.verifyPayment);
  app.get("/api/tractors/:id/payments", isAuthenticated, paymentController.getTractorPayments);
  app.get("/api/payments", isAuthenticated, paymentController.getUserPayments);

  // Admin routes
  app.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      // Get all users from database
      const allUsers = await db.select().from(users);
      
      // Filter out passwords for security
      const usersWithoutPasswords = allUsers.map(user => {
        // Extract password from user object and return the rest
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.json(usersWithoutPasswords);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
