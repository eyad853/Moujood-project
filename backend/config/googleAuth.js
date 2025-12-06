import dotenv from 'dotenv' 
dotenv.config()
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { pool } from '../index.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const name = profile.displayName;
        const email = profile.emails[0].value;

        // 1️⃣ Search in USERS table
        let userResult = await pool.query(
          "SELECT *, 'user' AS account_type FROM users WHERE email = $1",
          [email]
        );

        // 2️⃣ Search in BUSINESSES table if not found in users
        let businessResult = null;
        if (userResult.rows.length === 0) {
          businessResult = await pool.query(
            "SELECT *, 'business' AS account_type FROM businesses WHERE email = $1",
            [email]
          );
        }

        // 3️⃣ If email exists in USERS
        if (userResult.rows.length > 0) {
          const user = userResult.rows[0];

          if (user.user_type === "super_admin") {
            return done(null, { ...user, accountType: "super_admin" });
          }

          return done(null, { ...user, accountType: "user" });
        }

        // 4️⃣ If email exists in BUSINESSES
        if (businessResult && businessResult.rows.length > 0) {
          const business = businessResult.rows[0];
          return done(null, { ...business, accountType: "business" });
        }

        const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN; // CHANGE THIS

        const newUserType =
          email === SUPER_ADMIN_EMAIL ? "super_admin" : "client";

        const insert = await pool.query(
          `
          INSERT INTO users (name, email, password, user_type, gender, governorate)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *, 'user' AS account_type
        `,
          [
            name,
            email,
            "GOOGLE_AUTH",
            newUserType,
            "male",        // default gender
            "Cairo"        // default governorate
          ]
        );

        if (newUserType === "super_admin") {
          return done(null, { ...insert.rows[0], accountType: "super_admin" });
        }

        return done(null, { ...insert.rows[0], accountType: "user" });

      } catch (error) {
        return done(error, null);
      }
    }
  )
);