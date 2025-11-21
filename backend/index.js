import dotenv from 'dotenv' 
dotenv.config()
import express from "express"
import cors from "cors"
import path from 'path';
import http from 'http'
import { fileURLToPath } from 'url'
import { Pool } from 'pg';
import session from 'express-session';
import passport from 'passport';
import authRouter from './routes/auth.js';
import { Server } from 'socket.io';
import './config/googleAuth.js'
const app = express()
const server = http.createServer(app);
const io = new Server(server , {
  cors: {
    origin:process.env.frontendURL,
    credentials: true// Allow requests from this origin
  },
});

app.set('io' , io)

app.use(cors({
    origin:process.env.frontendURL,
    credentials: true
}))

io.on("connection", (socket) => {
  console.log("A user connected");
})

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
    // Check users first
    let result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

    if (result.rows.length > 0) {
      return done(null, { ...result.rows[0], accountType: "user" });
    }

    // Then check businesses
    result = await pool.query("SELECT * FROM businesses WHERE id = $1", [id]);

    if (result.rows.length > 0) {
      return done(null, { ...result.rows[0], accountType: "business" });
    }

    return done(null, false);

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
        gender VARCHAR(20) CHECK (gender IN ('male', 'female')) DEFAULT 'male',
        city VARCHAR(100) DEFAULT 'Cairo',
        user_type VARCHAR(20) CHECK (user_type IN ('client', 'super_admin')) DEFAULT 'client',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS businesses (
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
        qr_code VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS offers (
        offer_id SERIAL PRIMARY KEY,
        business_id INT NOT NULL,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        image VARCHAR(255),
        offer_price_before DECIMAL(10,2) NOT NULL,
        offer_price_after DECIMAL(10,2),
        category VARCHAR(80) NOT NULL
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (business_id) REFERENCES businesses(id)
      );

      CREATE TABLE IF NOT EXISTS scans (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        business_id INT REFERENCES businesses(id) ON DELETE CASCADE,
        offer_id INT REFERENCES offers(id) ON DELETE CASCADE,
        scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS likes (
        id SERIAL PRIMARY KEY,
        offer_id INTEGER REFERENCES offers(id),
        user_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(offer_id, user_id)
      )

      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        offer_id INTEGER REFERENCES offers(id),
        user_id INTEGER REFERENCES users(id),
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )

      CREATE TABLE IF NOT EXISTS sales (
        id SERIAL PRIMARY KEY,
        offer_id INTEGER REFERENCES offers(id),
        user_id INTEGER REFERENCES users(id),
        amount DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )

      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        image VARCHAR(150) NOT NULL,
        parent_id INTEGER REFERENCES categories(id)  -- NULL means main category
      )

      CRAETE TABLE IF NOT EXISTS notifications(
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        receiver_type VARCHAR(20) CHECK (receiver_type IN ('user', 'business')) NOT NULL,
        receiver_id INTEGER NOT NULL,
        content TEXT NOT NOLL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
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

    server.listen(process.env.PORT, () => console.log(`🚀 Server running on port ${process.env.PORT}`))
  } catch (err) {
    console.error('❌ Failed to connect to PostgreSQL:', err.message)
    process.exit(1)
  }
}

startServer()