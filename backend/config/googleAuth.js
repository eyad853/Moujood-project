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

    // 1️⃣ Check if email exists in users table
        let result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        // 2️⃣ If not found, check in businesses table
        if (result.rows.length === 0) {
            result = await pool.query('SELECT * FROM businesses WHERE email = $1', [email]);
        }

        // 3️⃣ If exists in either table, return the user
        if (result.rows.length > 0) {
            const account = result.rows[0];

          // Detect users table
          if (account.user_type) {
            return done(null, { ...account, accountType: "user" });
          }
        
          // Detect businesses table
          return done(null, { ...account, accountType: "business" });
        }

        // 4️⃣ Otherwise, insert a new client user
        const insertResult = await pool.query(
            `INSERT INTO users (name, email, password, confirm_password,user_type)
              VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [name, email, 'GOOGLE_AUTH', 'GOOGLE_AUTH', 'client']
        );

        return done(null, { ...insertResult.rows[0], accountType: "user" });

    } catch (err) {
        return done(err, null);
    }
}));
