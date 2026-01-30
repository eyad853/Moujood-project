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
import { Server } from 'socket.io';
import fs from 'fs'
import authRouter from './routes/auth.js';
import notificationsRouter from './routes/notifications.js';
import settingsRouter from './routes/settings.js';
import offersRouter from './routes/offers.js';
import clientsRouter from './routes/clients.js';
import businessRouter from './routes/business.js';
import suerAdminRouter from './routes/super_admin_data.js';
import categoriesRouter from './routes/categories.js';
import connectPgSimple from 'connect-pg-simple';
import likesRouter from './routes/likes.js';
import commentsRouter from './routes/comments.js';
import LovedCategoriesRouter from './routes/lovedTopics.js';
import './config/googleAuth.js'
import adsRouter from './routes/ads.js';
import './config/facebookAuth.js'
import scansRouter from './routes/scans.js';
import sharedsession from 'express-socket.io-session';

const app = express()
const server = http.createServer(app);
const io = new Server(server , {
  cors: {
    origin:[process.env.frontendURL, "https://localhost", "http://192.168.1.5:5173"],
    credentials: true// Allow requests from this origin
  },
});

export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mydb',
    password: '12345',
    port: 5432,
});

app.set('io' , io)

app.use(cors({
    origin:[process.env.frontendURL, "https://localhost", "http://192.168.1.5:5173"],
    credentials: true
}))


// Make sure uploads directory exists - modern approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "uploads");

// Make uploads directory accessible
app.use('/uploads', express.static(uploadsDir));

app.use(express.json());

const PgSession = connectPgSimple(session);

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET_KEY,
  cookie: { 
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 30 * 12
  },
  store: new PgSession({
    pool,
    createTableIfMissing: true
  }),
  resave: false,
  saveUninitialized: false
});

app.use(sessionMiddleware)

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, {id:user.id , accountType: user.accountType}); // store only user ID in session
});

passport.deserializeUser(async (obj, done) => {
  try {
    const { id, accountType } = obj;

    if (accountType === "user" || accountType==='super_admin') {
      const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
      if (result.rows.length > 0) return done(null, { ...result.rows[0], accountType: accountType });
    } else if (accountType === "business") {
      const result = await pool.query("SELECT * FROM businesses WHERE id = $1", [id]);
      if (result.rows.length > 0) return done(null, { ...result.rows[0], accountType: accountType });
    }

    return done(null, false);
  } catch (err) {
    done(err, null);
  }
});

io.use(sharedsession(sessionMiddleware, {
  autoSave: true
}));

io.on("connection", (socket) => {
  // session info is available via socket.handshake.session
  const userSession = socket.handshake.session.passport?.user;

  if (userSession) {
    const { id, accountType } = userSession;
    const roomName = `${accountType}_${id}`;
    socket.join(roomName);
    console.log(`${roomName} connected and joined room ${roomName}`);
  } else {
    console.log("A user connected without a valid session");
  }

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
})


// Routers
app.use('/auth', authRouter)
app.use('/notifications', notificationsRouter)
app.use('/settings', settingsRouter)
app.use('/offers', offersRouter)
app.use('/clients', clientsRouter)
app.use('/businesses', businessRouter)
app.use('/super_admin', suerAdminRouter)
app.use('/categories', categoriesRouter)
app.use('/likes', likesRouter)
app.use('/comments', commentsRouter)
app.use('/lovedCategoies' , LovedCategoriesRouter)
app.use('/ads' , adsRouter)
app.use('/scans' , scansRouter)


async function createTables() {
  try {
    const sql = fs.readFileSync('./schema/tables.sql','utf8')
    // users table
    await pool.query(sql);

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