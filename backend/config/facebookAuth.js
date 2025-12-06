import dotenv from 'dotenv' 
dotenv.config()
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { pool } from '../index.js';

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK,
      profileFields: ['id', 'displayName', 'emails'] // ensure Facebook returns email
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const name = profile.displayName;
        const email = profile.emails?.[0]?.value; // Facebook may not always provide email

        if (!email) {
          return done(new Error("No email returned from Facebook"), null);
        }

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

        // 5️⃣ If not found → create NEW user
        const SUPER_ADMIN_EMAIL = "YOUR_REAL_EMAIL@gmail.com"; // CHANGE THIS

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
            "FACEBOOK_AUTH",
            newUserType,
            "male",     // default gender
            "Cairo"     // default governorate
          ]
        );

        if (newUserType === "super_admin") {
          return done(null, { ...insert.rows[0], accountType: "super_admin" });
        }

        return done(null, { ...insert.rows[0], accountType: "user" });

      } catch (err) {
        return done(err, null);
      }
    }
  )
);