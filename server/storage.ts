import {
  users,
  tractors,
  messages,
  payments,
  reviews,
  favorites,
  type User,
  type InsertUser,
  type Tractor,
  type InsertTractor,
  type Message,
  type InsertMessage,
  type Payment,
  type InsertPayment,
  type Review,
  type InsertReview,
  type Favorite,
  type InsertFavorite,
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Tractor operations
  getTractor(id: number): Promise<Tractor | undefined>;
  getTractors(options?: { category?: string; search?: string; sellerId?: number; }): Promise<Tractor[]>;
  createTractor(tractor: InsertTractor): Promise<Tractor>;
  updateTractor(id: number, tractor: Partial<Tractor>): Promise<Tractor | undefined>;
  deleteTractor(id: number): Promise<boolean>;
  
  // Message operations
  getMessage(id: number): Promise<Message | undefined>;
  getMessagesByTractorId(tractorId: number): Promise<Message[]>;
  getMessagesByUserId(userId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<boolean>;
  
  // Payment operations
  getPayment(id: number): Promise<Payment | undefined>;
  getPaymentsByTractorId(tractorId: number): Promise<Payment[]>;
  getPaymentsByBuyerId(buyerId: number): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, payment: Partial<Payment>): Promise<Payment | undefined>;
  
  // Review operations
  getReview(id: number): Promise<Review | undefined>;
  getReviewsByTractorId(tractorId: number): Promise<Review[]>;
  getReviewsByUserId(userId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Favorite operations
  getFavorite(id: number): Promise<Favorite | undefined>;
  getFavoritesByUserId(userId: number): Promise<Favorite[]>;
  createFavorite(favorite: InsertFavorite): Promise<Favorite>;
  deleteFavorite(id: number): Promise<boolean>;
  isFavorite(userId: number, tractorId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tractors: Map<number, Tractor>;
  private messages: Map<number, Message>;
  private payments: Map<number, Payment>;
  private reviews: Map<number, Review>;
  private favorites: Map<number, Favorite>;
  private userIdCounter: number;
  private tractorIdCounter: number;
  private messageIdCounter: number;
  private paymentIdCounter: number;
  private reviewIdCounter: number;
  private favoriteIdCounter: number;

  constructor() {
    this.users = new Map();
    this.tractors = new Map();
    this.messages = new Map();
    this.payments = new Map();
    this.reviews = new Map();
    this.favorites = new Map();
    this.userIdCounter = 1;
    this.tractorIdCounter = 1;
    this.messageIdCounter = 1;
    this.paymentIdCounter = 1;
    this.reviewIdCounter = 1;
    this.favoriteIdCounter = 1;
    
    // Create admin user by default
    this.createUser({
      username: "admin",
      password: "admin123", // In production, this would be hashed
      email: "admin@tractortrade.com",
      name: "Administrator",
      isAdmin: true,
    } as InsertUser);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const newUser: User = { ...user, id, createdAt: new Date() };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Tractor operations
  async getTractor(id: number): Promise<Tractor | undefined> {
    return this.tractors.get(id);
  }

  async getTractors(options?: { category?: string; search?: string; sellerId?: number; }): Promise<Tractor[]> {
    let tractors = Array.from(this.tractors.values());
    
    if (options) {
      if (options.category) {
        tractors = tractors.filter(tractor => tractor.category === options.category);
      }
      
      if (options.search) {
        const searchLower = options.search.toLowerCase();
        tractors = tractors.filter(tractor => 
          tractor.title.toLowerCase().includes(searchLower) ||
          tractor.brand.toLowerCase().includes(searchLower) ||
          tractor.model.toLowerCase().includes(searchLower) ||
          tractor.description.toLowerCase().includes(searchLower)
        );
      }
      
      if (options.sellerId) {
        tractors = tractors.filter(tractor => tractor.sellerId === options.sellerId);
      }
    }
    
    return tractors;
  }

  async createTractor(tractor: InsertTractor): Promise<Tractor> {
    const id = this.tractorIdCounter++;
    const newTractor: Tractor = { ...tractor, id, createdAt: new Date() };
    this.tractors.set(id, newTractor);
    return newTractor;
  }

  async updateTractor(id: number, tractorData: Partial<Tractor>): Promise<Tractor | undefined> {
    const tractor = await this.getTractor(id);
    if (!tractor) return undefined;
    
    const updatedTractor = { ...tractor, ...tractorData };
    this.tractors.set(id, updatedTractor);
    return updatedTractor;
  }

  async deleteTractor(id: number): Promise<boolean> {
    return this.tractors.delete(id);
  }

  // Message operations
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getMessagesByTractorId(tractorId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => message.tractorId === tractorId
    );
  }

  async getMessagesByUserId(userId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => message.senderId === userId || message.receiverId === userId
    );
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const newMessage: Message = { ...message, id, createdAt: new Date(), read: false };
    this.messages.set(id, newMessage);
    return newMessage;
  }

  async markMessageAsRead(id: number): Promise<boolean> {
    const message = await this.getMessage(id);
    if (!message) return false;
    
    message.read = true;
    this.messages.set(id, message);
    return true;
  }

  // Payment operations
  async getPayment(id: number): Promise<Payment | undefined> {
    return this.payments.get(id);
  }

  async getPaymentsByTractorId(tractorId: number): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(
      (payment) => payment.tractorId === tractorId
    );
  }

  async getPaymentsByBuyerId(buyerId: number): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(
      (payment) => payment.buyerId === buyerId
    );
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const id = this.paymentIdCounter++;
    const newPayment: Payment = { ...payment, id, createdAt: new Date() };
    this.payments.set(id, newPayment);
    return newPayment;
  }

  async updatePayment(id: number, paymentData: Partial<Payment>): Promise<Payment | undefined> {
    const payment = await this.getPayment(id);
    if (!payment) return undefined;
    
    const updatedPayment = { ...payment, ...paymentData };
    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }

  // Review operations
  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async getReviewsByTractorId(tractorId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.tractorId === tractorId
    );
  }

  async getReviewsByUserId(userId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.userId === userId
    );
  }

  async createReview(review: InsertReview): Promise<Review> {
    const id = this.reviewIdCounter++;
    const newReview: Review = { ...review, id, createdAt: new Date() };
    this.reviews.set(id, newReview);
    return newReview;
  }

  // Favorite operations
  async getFavorite(id: number): Promise<Favorite | undefined> {
    return this.favorites.get(id);
  }

  async getFavoritesByUserId(userId: number): Promise<Favorite[]> {
    return Array.from(this.favorites.values()).filter(
      (favorite) => favorite.userId === userId
    );
  }

  async createFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const id = this.favoriteIdCounter++;
    const newFavorite: Favorite = { ...favorite, id, createdAt: new Date() };
    this.favorites.set(id, newFavorite);
    return newFavorite;
  }

  async deleteFavorite(id: number): Promise<boolean> {
    return this.favorites.delete(id);
  }

  async isFavorite(userId: number, tractorId: number): Promise<boolean> {
    return Array.from(this.favorites.values()).some(
      (favorite) => favorite.userId === userId && favorite.tractorId === tractorId
    );
  }
}

// Import DatabaseStorage class
import { DatabaseStorage } from "./database-storage";

// Create singleton instance of storage
// Use DatabaseStorage for production, MemStorage for development (if needed)
export const storage = new DatabaseStorage();
