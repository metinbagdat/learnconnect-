import { pool } from "./db";
import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import * as schema from "@shared/schema";

async function runMigration() {
  console.log("Starting database migration...");
  
  try {
    const db = drizzle({ client: pool, schema });
    
    // Add new columns to users table
    await pool.query(`
      ALTER TABLE IF EXISTS users 
      ADD COLUMN IF NOT EXISTS interests TEXT[];
    `);
    
    // Add new columns to courses table
    await pool.query(`
      ALTER TABLE IF EXISTS courses 
      ADD COLUMN IF NOT EXISTS level TEXT,
      ADD COLUMN IF NOT EXISTS is_ai_generated BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
    `);
    
    // Create modules table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS modules (
        id SERIAL PRIMARY KEY,
        course_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        "order" INTEGER NOT NULL
      );
    `);
    
    // Create lessons table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS lessons (
        id SERIAL PRIMARY KEY,
        module_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT,
        "order" INTEGER NOT NULL,
        duration_minutes INTEGER
      );
    `);
    
    // Add lastAccessedAt column to user_courses table
    await pool.query(`
      ALTER TABLE IF EXISTS user_courses
      ADD COLUMN IF NOT EXISTS last_accessed_at TIMESTAMP;
    `);
    
    // Create user_lessons table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_lessons (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        lesson_id INTEGER NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        progress INTEGER DEFAULT 0,
        last_accessed_at TIMESTAMP
      );
    `);
    
    // Add points column to assignments table
    await pool.query(`
      ALTER TABLE IF EXISTS assignments
      ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 10;
    `);
    
    // Create user_assignments table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_assignments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        assignment_id INTEGER NOT NULL,
        status TEXT DEFAULT 'not_started',
        submitted_at TIMESTAMP,
        grade INTEGER,
        feedback TEXT
      );
    `);
    
    // Add criteria column to badges table
    await pool.query(`
      ALTER TABLE IF EXISTS badges
      ADD COLUMN IF NOT EXISTS criteria TEXT;
    `);
    
    // Create course_recommendations table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS course_recommendations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        recommendations JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Create learning_paths table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS learning_paths (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        goal TEXT NOT NULL,
        estimated_duration INTEGER,
        progress INTEGER DEFAULT 0,
        is_ai_generated BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Create learning_path_steps table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS learning_path_steps (
        id SERIAL PRIMARY KEY,
        path_id INTEGER NOT NULL,
        course_id INTEGER NOT NULL,
        "order" INTEGER NOT NULL,
        required BOOLEAN DEFAULT FALSE,
        notes TEXT,
        completed BOOLEAN DEFAULT FALSE
      );
    `);
    
    console.log("Database migration completed successfully!");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await pool.end();
  }
}

// Run the migration
runMigration();