import dotenv from 'dotenv' 
dotenv.config()
import { pool } from '../index.js';
import bcrypt from 'bcrypt'


// controllers/auth.js
export const localSignup = async (req, res, next) => {
  try {
    const { name, email, password ,gender , governorate} = req.body;

    const exists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (exists.rows.length > 0) 
      return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password, gender , cigovernoratety) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [name, email, hashedPassword, gender, governorate]
    );

    const newUser = result.rows[0];

    const userData = {...newUser , accountType:'user'}

    // ✅ Log the user in immediately (create session)
    req.login(userData, (err) => {
      if (err) return next(err); // pass error to error handler
      return res.status(201).json({ message: 'User created and logged in', user: userData });
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
      category,
      description,
      addresses,
      locations,
      number,
    } = req.body;

    // ✅ Multer provides the uploaded logo file here
    const logo = req.file ? `${process.env.backendURL}/${req.file.path.replace(/\\/g, '/')}`: null;


    // 1️⃣ Check if user already exists
    const existingUser = await pool.query("SELECT * FROM businesses WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Insert new business
    const newBusiness = await pool.query(
      `INSERT INTO businesses 
        (name, email, password, category, logo, description, addresses, locations, number)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        name,
        email,
        hashedPassword,
        category,
        logo,
        description,
        addresses,
        locations,
        number,
      ]
    );
    let business = newBusiness.rows[0];

    // 3. Generate QR code (links to business page)
    const qrURL = `${process.env.frontendURL}/client/scans/${business.id}`;

    // 4. Save QR path to DB
    const updatedBusiness =await pool.query(
      "UPDATE businesses SET qr_code = $1 WHERE id = $2 RETURNING *",
      [qrURL, business.id]
    );
    business = updatedBusiness.rows[0]

    const businessData = {...business , accountType:'business'}


    req.login(businessData, (err) => {
      if (err) return next(err);
      return res.status(201).json({ message: 'User created and logged in', businessData });
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

      return res.redirect(`${process.env.frontendURL}/client/feed`);
    }

    if (user.user_type === 'super_admin') {
        return res.redirect(`${process.env.frontendURL}/super_admin/dashboard`);
    }

    if (user.accountType === "business") {
        return res.redirect(`${process.env.frontendURL}/Business/dashboard`);
    }

    // fallback
    res.redirect(`${process.env.frontendURL}/`);
};

export const getUser = async (req , res)=>{
  try {
    const {id , accountType} = req.user;

    if (!id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    let result

    if(accountType==='user'){
        result = await pool.query(
        "SELECT id, name, email, gender, governorate, user_type, created_at FROM users WHERE id = $1",
        [id]
      );
    }else if (accountType==='business'){
        result = await pool.query(
        "SELECT id, name, email, category, logo, description, addresses , locations , number ,qr_code ,created_at FROM businesses WHERE id = $1",
        [id]
      );
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ ...result.rows[0], accountType });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

