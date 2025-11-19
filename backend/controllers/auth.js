import dotenv from 'dotenv' 
dotenv.config()
import { pool } from '../index.js';
import bcrypt from 'bcrypt'
import QRCode from 'qrcode'
import path from 'path'
import fs from 'fs'


// controllers/auth.js
export const localSignup = async (req, res, next) => {
  try {
    const { name, email, password, confirm_password ,gender , city} = req.body;
    if (password !== confirm_password) 
      return res.status(400).json({ message: 'Passwords do not match' });

    const exists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (exists.rows.length > 0) 
      return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password, confirm_password, gender , city) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [name, email, hashedPassword, hashedPassword, gender, city]
    );

    const newUser = result.rows[0];

    // ✅ Log the user in immediately (create session)
    req.login(newUser, (err) => {
      if (err) return next(err); // pass error to error handler
      return res.status(201).json({ message: 'User created and logged in', user: newUser });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const businessesSignup = async (req, res , next) => {
  try {
    const {
      name,
      email,
      password,
      confirm_password,
      category,
      description,
      addresses,
      locations,
      number,
    } = req.body;

    // ✅ Multer provides the uploaded logo file here
    const logo = req.file ? req.file.path : null;
    const logopath = `${process.env.backendURL}${logo}`


    // 1️⃣ Check if user already exists
    const existingUser = await pool.query("SELECT * FROM businesses WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 2️⃣ Validate passwords match
    if (password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Insert new business
    const newBusiness = await pool.query(
      `INSERT INTO businesses 
        (name, email, password, confirm_password, category, logo, description, addresses, locations, number)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        name,
        email,
        hashedPassword,
        hashedPassword, // use hashed for confirm_password as well
        category,
        logopath,
        description,
        addresses,
        locations,
        number,
      ]
    );
    const business = newBusiness.rows[0];

    // 3. Generate QR code (links to business page)
    const qrURL = `${process.env.backendURL}/business/scan?businessId=${business.id}`;

    // 4. Save QR path to DB
    await pool.query(
      "UPDATE businesses SET qr_code = $1 WHERE id = $2",
      [qrURL, business.id]
    );

    req.login(business, (err) => {
      if (err) if (err) return next(err);
    });

    res.status(201).json({
      message: "Business registered successfully",
      user: business,
    });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Login (for any user)
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let accountType = null;
    let result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length > 0) {
      accountType = result.rows[0].user_type;
    } else {
      result = await pool.query("SELECT * FROM businesses WHERE email = $1", [email]);
      if (result.rows.length === 0) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
      accountType = "business";
    }

    const account = result.rows[0];

    const match = await bcrypt.compare(password, account.password);
    if (!match) return res.status(400).json({ message: "Invalid email or password" });

    req.login(account, (err) => {
      if (err) return next(err);
      res.status(200).json({
        message: "Login successful",
        accountType,
        user: account
      });
    });


  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const oauthRedirect = (req, res) => {
    const user = req.user;

    if (user.accountType === "user") {
        // Now check internal user type  
        if (user.user_type === 'client') {
            return res.redirect(`${process.env.frontendURL}/client/feed`);
        }
        if (user.user_type === 'super_admin') {
            return res.redirect(`${process.env.frontendURL}/super_admin/dashboard`);
        }
    }

    if (user.accountType === "business") {
        return res.redirect(`${process.env.frontendURL}/Business/dashboard`);
    }

    // fallback
    res.redirect(`${process.env.frontendURL}/`);
};