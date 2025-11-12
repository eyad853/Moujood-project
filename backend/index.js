import dotenv from 'dotenv' 
dotenv.config()
import express from "express"
import cors from "cors"
import path from 'path';
import { fileURLToPath } from 'url'
import { Pool } from 'pg';
import session from 'express-session';
import passport from 'passport';
import authRouter from './routes/auth.js';
const app = express()

app.use(cors({
    origin:process.env.frontendURL,
    credentials: true
}))

// Make sure uploads directory exists - modern approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "uploads");

// Make uploads directory accessible
app.use('/uploads', express.static(uploadsDir));

app.use(express.json());

app.use(session({
  secret:process.env.SESSION_SECRET_KEY,
  cookie: { 
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 30 * 12  }
}))

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id); // store only user ID in session
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length > 0) done(null, result.rows[0]);
    else done(null, false);
  } catch (err) {
    done(err, null);
  }
});


app.use('/auth', authRouter)

export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mydb',
    password: '12345',
    port: 5432,
});

async function createTables() {
  try {

    // users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        confirm_password VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        logo VARCHAR(255),
        description TEXT,
        addresses TEXT,
        locations TEXT,
        number VARCHAR(50),
        user_type VARCHAR(20) CHECK (user_type IN ('client', 'business', 'superadmin')) DEFAULT 'client',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Tables "users" and "businesses" are ready!');
  } catch (err) {
    console.error('❌ Failed to create tables:', err.message);
    process.exit(1); // stop server if tables cannot be created
  }
}

async function startServer() {
  try {
    const client = await pool.connect()
    console.log('✅ Connected to PostgreSQL successfully!')
    client.release() // release connection back to pool

    await createTables();

    app.listen(process.env.PORT, () => console.log(`🚀 Server running on port ${process.env.PORT}`))
  } catch (err) {
    console.error('❌ Failed to connect to PostgreSQL:', err.message)
    process.exit(1)
  }
}

startServer()