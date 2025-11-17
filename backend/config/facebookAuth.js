import dotenv from 'dotenv' 
dotenv.config()
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { pool } from '../index.js';


passport.use(new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_CLIENT_ID , 
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET ,
            callbackURL: process.env.FACEBOOK_CALLBACK ,
        },
        async(accessToken, refreshToken, profile, done) => {
            try {
                // Extract basic profile info
                const name = profile.displayName;
                const email = profile.emails?.[0]?.value; // Facebook may not always provide email

                if (!email) {
                  return done(new Error('No email found from Facebook'), null);
                }
            
                // Check if user already exists
                const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            
                if (result.rows.length > 0) {
                  // User exists
                  return done(null, result.rows[0]);
                }
            
                // User does not exist, insert new user
                const insertResult = await pool.query(
                  `INSERT INTO users (name, email, password, confirm_password)
                   VALUES ($1, $2, $3, $4)
                   RETURNING *`,
                  [name, email, 'FACEBOOK_AUTH', 'FACEBOOK_AUTH'] // placeholder passwords
                );

                return done(null, insertResult.rows[0]);
                } catch (err) {
                    return done(err, null);
                }
        }
    )
);
