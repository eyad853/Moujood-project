import dotenv from 'dotenv' 
dotenv.config()
import { pool } from '../index.js';
import bcrypt from 'bcrypt'

export const localSignup = async (req, res, next) => {
  try {
    const { name, email, password, gender, governorate } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);


    // Check if this is the super admin login attempt
    if (
      email === process.env.SUPER_ADMIN &&
      password === process.env.SUPER_ADMIN_PASSWORD
    ) {
      // Check if super admin already exists
      const existingAdmin = await pool.query(
        `SELECT * FROM users WHERE email = $1 AND user_type = 'super_admin'`,
        [email]
      );

      let newUser;

      if (existingAdmin.rows.length > 0) {
        // Super admin exists → log in
        newUser = existingAdmin.rows[0];
      } else {
        // Super admin does not exist → create it
        const result = await pool.query(
          `INSERT INTO users (name, email, password, gender, governorate, user_type , auth_provider)
           VALUES ($1, $2, $3, $4, $5, $6 , $7) RETURNING id , name , email , user_type`,
          ['Super Admin', email, hashedPassword, 'male', 'Cairo', 'super_admin' , 'local']
        );
        newUser = result.rows[0];
      }

      const accountType = newUser.user_type;
      const userData = { ...newUser, accountType };

      // Log in
      req.login(userData, (err) => {
        if (err) return next(err);
        return res.status(200).json({ message: 'Super admin logged in', account:userData });
      });

      return; // Stop further execution
    }

    // ---------- Normal user signup ----------

    // Check if email already exists
    const exists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (exists.rows.length > 0) 
      return res.status(400).json({ message: 'Email already registered' });

    const insertData = {
      name,
      email,
      password: hashedPassword,
      gender: gender || 'male',
      governorate: governorate || 'Cairo',
      user_type: 'user'
    };

    const result = await pool.query(
      `INSERT INTO users (name, email, password, gender, governorate, user_type , auth_provider) 
       VALUES ($1, $2, $3, $4, $5, $6 , $7) RETURNING id , name , email , gender , governorate , user_type`,
      [
        insertData.name,
        insertData.email,
        insertData.password,
        insertData.gender,
        insertData.governorate,
        insertData.user_type,
        'local'
      ]
    );

    const newUser = result.rows[0];
    const accountType = newUser.user_type;
    const userData = { ...newUser, accountType };

    const io = req.app.get('io');
    io.emit('newUser', newUser);

    req.login(userData, (err) => {
      if (err) return next(err);
      return res.status(201).json({ message: 'User created and logged in', account:userData });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const businessesSignup = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      category,
      description,
      locations, // Array of { lat, lng }
      number,
    } = req.body;

    // ✅ Multer provides the uploaded logo file here
    const logo = req.file
      ? `${process.env.backendURL}/${req.file.path.replace(/\\/g, '/')}`
      : null;


      let parsedLocations = []
      if(locations){
        try{
          parsedLocations= JSON.parse(locations)
        }catch(error){
          console.log('failed to parse locations');
        }
      }

    // 1️⃣ Check if user already exists
    const existingUser = await pool.query(
      "SELECT * FROM businesses WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Insert new business
    const newBusiness = await pool.query(
      `INSERT INTO businesses 
        (name, email, password, category, logo, description, number , auth_provider)
        VALUES ($1, $2, $3, $4, $5, $6, $7 , $8)
       RETURNING id , name , email , category , logo , description , number`,
      [name, email, hashedPassword, category, logo, description, number , 'local']
    );

    let business = newBusiness.rows[0];

    // 4️⃣ Insert locations into business_locations table
    if (Array.isArray(parsedLocations)) {
      const insertLocationsQuery = `
        INSERT INTO business_locations (business_id, lat, lng)
        VALUES ($1, $2, $3)
      `;

      for (const loc of parsedLocations) {
        // Ensure loc has lat and lng
        if (loc.lat != null && loc.lng != null) {
          await pool.query(insertLocationsQuery, [business.id, loc.lat, loc.lng]);
        }
      }
    }

  const businessResult = await pool.query(
    `
    SELECT 
      b.id,
      b.name,
      b.email,
      b.category,
      b.logo,
      b.description,
      b.number,
      COALESCE(
        json_agg(
          json_build_object(
            'id', l.id,
            'lat', l.lat,
            'lng', l.lng
          )
        ) FILTER (WHERE l.id IS NOT NULL),
        '[]'
      ) AS locations
    FROM businesses b
    LEFT JOIN business_locations l ON b.id = l.business_id
    WHERE b.id = $1
    GROUP BY b.id;
    `,
    [business.id]
  );

    const fullBusiness = businessResult.rows[0];
    const businessData = { ...fullBusiness, accountType: 'business' };

    const io = req.app.get('io')
    io.emit('newBusiness' , business)

    // 7️⃣ Log in the user
    req.login(businessData, (err) => {
      if (err) return next(err);
      return res.status(201).json({ message: 'User created and logged in', account:businessData });
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

    let account;
    let accountType;

    // 1️⃣ Try users
    let result = await pool.query(
      `SELECT id, name, email, password, gender, governorate, user_type
       FROM users
       WHERE email = $1`,
      [email]
    );

    if (result.rows.length > 0) {
      account = result.rows[0];
      accountType = account.user_type;
    } else {
      // 2️⃣ Try businesses
      result = await pool.query(
        `
        SELECT 
          b.id,
          b.name,
          b.email,
          b.password,
          b.category,
          b.logo,
          b.description,
          b.number,
          COALESCE(
            json_agg(
              json_build_object(
                'id', l.id,
                'lat', l.lat,
                'lng', l.lng
              )
            ) FILTER (WHERE l.id IS NOT NULL),
            '[]'
          ) AS locations
        FROM businesses b
        LEFT JOIN business_locations l ON b.id = l.business_id
        WHERE b.email = $1
        GROUP BY b.id
        `,
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      account = result.rows[0];
      accountType = "business";
    }

    // 3️⃣ Validate password
    const match = await bcrypt.compare(password, account.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 4️⃣ Remove password before session
    delete account.password;

    const fullAccount = { ...account, accountType };

    // 5️⃣ Login
    req.login(fullAccount, (err) => {
      if (err) return next(err);

      return res.status(200).json({
        message: "Login successful",
        account: fullAccount
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

    if (user.accountType === 'super_admin') {
        return res.redirect(`${process.env.frontendURL}/super_admin/dashboard`);
    }

    if (user.accountType === "business") {
        return res.redirect(`${process.env.frontendURL}/business/dashboard`);
    }

    // fallback
    res.redirect(`${process.env.frontendURL}/`);
};

export const getUser = async (req, res) => {
  try {
    const { id, accountType } = req.user;

    if (!id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (accountType === 'user' || accountType=== 'super_admin') {
      // Fetch user data
      const result = await pool.query(
        "SELECT id, name, email, gender, governorate, user_type, created_at FROM users WHERE id = $1",
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json({ ...result.rows[0], accountType });

    } else if (accountType === 'business') {
      // Fetch business and its locations in a single query
      const result = await pool.query(
        `
        SELECT 
          b.id,
          b.name,
          b.email,
          b.category,
          b.logo,
          b.description,
          b.number,
          COALESCE(
            json_agg(
              json_build_object(
                'id', l.id,
                'lat', l.lat,
                'lng', l.lng
              )
            ) FILTER (WHERE l.id IS NOT NULL),
            '[]'
          ) AS locations
        FROM businesses b
        LEFT JOIN business_locations l ON b.id = l.business_id
        WHERE b.id = $1
        GROUP BY b.id;
        `,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Business not found" });
      }

      const businessData = result.rows[0];
      // If no locations exist, json_agg returns [null], fix it
      businessData.locations = businessData.locations[0] === null ? [] : businessData.locations;

      return res.json({ ...businessData, accountType });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const editAccount = async (req, res, next) => {
  const client = await pool.connect();
  const image = req.file
    ? `${process.env.backendURL}/${req.file.path.replace(/\\/g, '/')}`
    : null;

  try {
    const { id, accountType } = req.user;
    await client.query("BEGIN");

    let updatedAccount;

    /* ===================== USER ===================== */
    if (accountType === "user") {
      const {
        name,
        email,
        password,
        gender,
        governorate,
        is_verified,
        user_type
      } = req.body;

      const hashedPassword = password
        ? await bcrypt.hash(password, 10)
        : null;

      const { rows } = await client.query(
        `
        UPDATE users SET
          name = COALESCE($1, name),
          email = COALESCE($2, email),
          password = COALESCE($3, password),
          avatar = COALESCE($4, avatar),
          gender = COALESCE($5, gender),
          governorate = COALESCE($6, governorate),
          is_verified = COALESCE($7, is_verified),
          user_type = COALESCE($8, user_type)
        WHERE id = $9
        RETURNING id, name, email, avatar, gender, governorate, user_type
        `,
        [
          name,
          email,
          hashedPassword,
          image,
          gender,
          governorate,
          is_verified,
          user_type,
          id
        ]
      );

      updatedAccount = {
        ...rows[0],
        accountType: rows[0].user_type
      };
    }

    /* ===================== BUSINESS ===================== */
    if (accountType === "business") {
      const {
        name,
        email,
        password,
        category,
        description,
        number,
        is_verified,
        locations
      } = req.body;

      const hashedPassword = password
        ? await bcrypt.hash(password, 10)
        : null;

      let parsedLocations = [];
      if (locations) {
        try {
          parsedLocations = JSON.parse(locations);
        } catch {}
      }

      await client.query(
        `
        UPDATE businesses SET
          name = COALESCE($1, name),
          email = COALESCE($2, email),
          password = COALESCE($3, password),
          category = COALESCE($4, category),
          logo = COALESCE($5, logo),
          description = COALESCE($6, description),
          number = COALESCE($7, number),
          is_verified = COALESCE($8, is_verified)
        WHERE id = $9
        `,
        [
          name,
          email,
          hashedPassword,
          category,
          image,
          description,
          number,
          is_verified,
          id
        ]
      );

      await client.query(
        "DELETE FROM business_locations WHERE business_id = $1",
        [id]
      );

      for (const loc of parsedLocations) {
        await client.query(
          `INSERT INTO business_locations (business_id, lat, lng)
           VALUES ($1, $2, $3)`,
          [id, loc.lat, loc.lng]
        );
      }

      const { rows } = await client.query(
        `
        SELECT 
          b.id,
          b.name,
          b.email,
          b.category,
          b.logo,
          b.description,
          b.number,
          COALESCE(
            json_agg(
              json_build_object('id', l.id, 'lat', l.lat, 'lng', l.lng)
            ) FILTER (WHERE l.id IS NOT NULL),
            '[]'
          ) AS locations
        FROM businesses b
        LEFT JOIN business_locations l ON b.id = l.business_id
        WHERE b.id = $1
        GROUP BY b.id
        `,
        [id]
      );

      updatedAccount = {
        ...rows[0],
        accountType: "business"
      };

      req.app.get("io").emit("business_updated", updatedAccount);
    }

    await client.query("COMMIT");

    // 🔥 refresh session
    req.login(updatedAccount, (err) => {
      if (err) return next(err);
      res.status(200).json({
        error: false,
        message: "Account updated successfully",
        account: updatedAccount
      });
    });

  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
};


export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to logout",
      });
    }

    res.clearCookie("connect.sid"); // default session cookie name

    return res.status(200).json({
      message: "Logged out successfully",
    });
  });
};
