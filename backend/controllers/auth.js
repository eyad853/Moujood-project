import dotenv from 'dotenv' 
dotenv.config()
import { pool } from '../index.js';
import bcrypt from 'bcrypt'

// controllers/auth.js
export const localSignup = async (req, res, next) => {
  try {
    const { name, email, password, confirm_password } = req.body;
    if (password !== confirm_password) 
      return res.status(400).json({ message: 'Passwords do not match' });

    const exists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (exists.rows.length > 0) 
      return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password, confirm_password, user_type) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [name, email, hashedPassword, hashedPassword,'client']
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

    // 1️⃣ Check if user already exists
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
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
      `INSERT INTO users 
        (name, email, password, confirm_password, category, logo, description, addresses, locations, number, user_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'business')
       RETURNING *`,
      [
        name,
        email,
        hashedPassword,
        hashedPassword, // use hashed for confirm_password as well
        category,
        logo,
        description,
        addresses,
        locations,
        number,
      ]
    );

    req.login(user, (err) => {
      if (err) if (err) return next(err);
    });

    res.status(201).json({
      message: "Business registered successfully",
      user: newBusiness.rows[0],
    });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Login (for any user)
export const login = async (req, res , next) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) return res.status(400).json({ message: "Invalid email or password" });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid email or password" });

    // Optionally, if you use express-session:
    req.login(user, (err) => {
      if (err) if (err) return next(err);
    });

    // ✅ Successful login response
    res.status(200).json({ 
      message: "Login successful",
      user: user 
    });


  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const oauthRedirect=(req, res)=>{
    const user = req.user;

    // ✅ Redirect based on user_type from database
    if (user.user_type === 'client') {
        res.redirect(`${process.env.frontendURL}/client-dashboard`);
    } else if (user.user_type === 'business') {
        res.redirect(`${process.env.frontendURL}/business-dashboard`);
    } else if (user.user_type === 'superadmin') {
        res.redirect(`${process.env.frontendURL}/admin-panel`);
    } else {
        res.redirect(`${process.env.frontendURL}/`);
    }
}