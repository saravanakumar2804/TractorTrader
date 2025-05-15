import { eq, and, or } from "drizzle-orm";
import { db } from "./db";
import {
  users, tractors, messages, payments, reviews, favorites,
  type User, type Tractor, type Message, type Payment, type Review, type Favorite,
  type InsertUser, type InsertTractor, type InsertMessage, type InsertPayment, type InsertReview, type InsertFavorite
} from "@shared/schema";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Tractor operations
  async getTractor(id: number): Promise<Tractor | undefined> {
    const [tractor] = await db.select().from(tractors).where(eq(tractors.id, id));
    return tractor;
  }

  async getTractors(options?: { category?: string; search?: string; sellerId?: number; }): Promise<Tractor[]> {
    let query = db.select().from(tractors);

    if (options) {
      const filters = [];

      if (options.category) {
        filters.push(eq(tractors.category, options.category));
      }

      if (options.sellerId) {
        filters.push(eq(tractors.sellerId, options.sellerId));
      }

      if (filters.length > 0) {
        query = query.where(and(...filters));
      }

      // Handle search - need to do this after fetching if using PostgreSQL
      // For proper text search, consider using PostgreSQL's full text search capabilities
    }

    const results = await query;

    // Apply text search filter in memory if needed
    if (options?.search) {
      const searchLower = options.search.toLowerCase();
      return results.filter(tractor =>
        tractor.title.toLowerCase().includes(searchLower) ||
        tractor.description.toLowerCase().includes(searchLower) ||
        tractor.brand.toLowerCase().includes(searchLower) ||
        tractor.model.toLowerCase().includes(searchLower)
      );
    }

    return results;
  }

  async createTractor(tractor: InsertTractor): Promise<Tractor> {
    const [newTractor] = await db.insert(tractors).values(tractor).returning();
    return newTractor;
  }

  async updateTractor(id: number, tractorData: Partial<Tractor>): Promise<Tractor | undefined> {
    const [updatedTractor] = await db
      .update(tractors)
      .set(tractorData)
      .where(eq(tractors.id, id))
      .returning();
    return updatedTractor;
  }

  async deleteTractor(id: number): Promise<boolean> {
    await db.delete(tractors).where(eq(tractors.id, id));
    // We consider the operation successful if no exception is thrown
    return true;
  }

  // Message operations
  async getMessage(id: number): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message;
  }

  async getMessagesByTractorId(tractorId: number): Promise<Message[]> {
    return db.select().from(messages).where(eq(messages.tractorId, tractorId));
  }

  async getMessagesByUserId(userId: number): Promise<Message[]> {
    return db.select().from(messages).where(
      or(
        eq(messages.senderId, userId),
        eq(messages.receiverId, userId)
      )
    );
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  async markMessageAsRead(id: number): Promise<boolean> {
    await db
      .update(messages)
      .set({ read: true })
      .where(eq(messages.id, id));
    // We consider the operation successful if no exception is thrown
    return true;
  }

  // Payment operations
  async getPayment(id: number): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment;
  }

  async getPaymentsByTractorId(tractorId: number): Promise<Payment[]> {
    return db.select().from(payments).where(eq(payments.tractorId, tractorId));
  }

  async getPaymentsByBuyerId(buyerId: number): Promise<Payment[]> {
    return db.select().from(payments).where(eq(payments.buyerId, buyerId));
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    return newPayment;
  }

  async updatePayment(id: number, paymentData: Partial<Payment>): Promise<Payment | undefined> {
    const [updatedPayment] = await db
      .update(payments)
      .set(paymentData)
      .where(eq(payments.id, id))
      .returning();
    return updatedPayment;
  }

  // Review operations
  async getReview(id: number): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review;
  }

  async getReviewsByTractorId(tractorId: number): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.tractorId, tractorId));
  }

  async getReviewsByUserId(userId: number): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.userId, userId));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }

  // Favorite operations
  async getFavorite(id: number): Promise<Favorite | undefined> {
    const [favorite] = await db.select().from(favorites).where(eq(favorites.id, id));
    return favorite;
  }

  async getFavoritesByUserId(userId: number): Promise<Favorite[]> {
    return db.select().from(favorites).where(eq(favorites.userId, userId));
  }

  async createFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const [newFavorite] = await db.insert(favorites).values(favorite).returning();
    return newFavorite;
  }

  async deleteFavorite(id: number): Promise<boolean> {
    await db.delete(favorites).where(eq(favorites.id, id));
    // We consider the operation successful if no exception is thrown
    return true;
  }

  async isFavorite(userId: number, tractorId: number): Promise<boolean> {
    const [favorite] = await db
      .select()
      .from(favorites)
      .where(
        and(
          eq(favorites.userId, userId),
          eq(favorites.tractorId, tractorId)
        )
      );
    return !!favorite;
  }
}