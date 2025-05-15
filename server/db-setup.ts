import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import * as schema from '../shared/schema';
import ws from 'ws';
import bcrypt from 'bcryptjs';

// Required for Neon database connections in serverless environments
neonConfig.webSocketConstructor = ws;

async function main() {
  console.log('Starting database setup...');
  
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  
  // Create connection pool
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  // Create drizzle database instance with schema
  const db = drizzle(pool, { schema });
  
  try {
    console.log('Creating database tables...');
    
    // Initialize tables directly (Drizzle supports schema pushes)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        phone TEXT,
        location TEXT,
        is_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS tractors (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        brand TEXT NOT NULL,
        model TEXT NOT NULL,
        year INTEGER NOT NULL,
        price INTEGER NOT NULL,
        horsepower INTEGER NOT NULL,
        hours INTEGER,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        location TEXT NOT NULL,
        seller_id INTEGER NOT NULL,
        status TEXT DEFAULT 'available',
        images TEXT[],
        video_url TEXT,
        specifications JSONB,
        features JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender_id INTEGER NOT NULL,
        receiver_id INTEGER NOT NULL,
        tractor_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        tractor_id INTEGER NOT NULL,
        buyer_id INTEGER NOT NULL,
        amount INTEGER NOT NULL,
        transaction_id TEXT NOT NULL,
        payment_status TEXT NOT NULL,
        razorpay_order_id TEXT,
        razorpay_payment_id TEXT,
        razorpay_signature TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        tractor_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        tractor_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    console.log('Database tables created successfully!');

    // Create admin user if it doesn't exist
    const adminExists = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.username, 'admin')
    });

    if (!adminExists) {
      console.log('Creating admin user...');
      
      // Hash the password
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      // Insert admin user
      await db.insert(schema.users).values({
        username: 'admin',
        password: hashedPassword,
        email: 'admin@tractortrade.com',
        name: 'Administrator',
        isAdmin: true,
      });
      
      console.log('Admin user created!');
    } else {
      console.log('Admin user already exists, skipping creation.');
    }
    
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Database setup failed:', error);
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Fatal error during database setup:', err);
  process.exit(1);
});