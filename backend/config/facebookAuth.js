import dotenv from 'dotenv';
dotenv.config();

import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { pool } from '../index.js';

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK,
      profileFields: ['id', 'displayName', 'emails'],
      enableProof: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const name = profile.displayName;
        const email = profile.emails?.[0]?.value;

        if (!email) return done(new Error('No email from Facebook'), null);

        /* ===================== USERS ===================== */
        const userResult = await pool.query(
          `SELECT * FROM users WHERE email = $1`,
          [email]
        );

        if (userResult.rows.length > 0) {
          const user = userResult.rows[0];
          return done(null, {
            ...user,
            accountType: user.user_type === 'super_admin' ? 'super_admin' : 'user',
          });
        }

        /* ===================== BUSINESSES ===================== */
        const businessResult = await pool.query(
          `SELECT * FROM businesses WHERE email = $1`,
          [email]
        );

        if (businessResult.rows.length > 0) {
          const business = businessResult.rows[0];
          return done(null, { ...business, accountType: 'business' });
        }

        /* ===================== CREATE NEW USER ===================== */
        const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN;
        const userType = email === SUPER_ADMIN_EMAIL ? 'super_admin' : 'user';

        const insert = await pool.query(
          `
          INSERT INTO users (
            name,
            email,
            password,
            auth_provider,
            user_type,
            gender,
            governorate
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7)
          RETURNING id ,*
          `,
          [name, email, null, 'facebook', userType, 'male', 'Cairo']
        );

        return done(null, {
          ...insert.rows[0],
          accountType: userType === 'super_admin' ? 'super_admin' : 'user',
        });

      } catch (err) {
        return done(err, null);
      }
    }
  )
);
