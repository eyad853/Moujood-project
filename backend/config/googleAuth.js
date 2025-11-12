import dotenv from 'dotenv' 
dotenv.config()
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { pool } from '../index.js';


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
}, async (accessToken, refreshToken, profile, done) => {
    try {
    // Extract basic profile info
    const name = profile.displayName;
    const email = profile.emails[0].value;

    // Check if user already exists
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length > 0) {
      // User exists, return it
      return done(null, result.rows[0]);
    }

    // User does not exist, insert new user
    const insertResult = await pool.query(
      `INSERT INTO users (name, email, password, confirm_password)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, email, 'GOOGLE_AUTH', 'GOOGLE_AUTH'] // passwords are placeholders since Google login
    );

    return done(null, insertResult.rows[0]);
  } catch (err) {
    return done(err, null);
  }
}));
