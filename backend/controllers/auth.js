import dotenv from 'dotenv' 
dotenv.config()
import { pool } from '../index.js';
import bcrypt from 'bcrypt'
import { generateVerificationToken , saveVerificationToken ,saveForgotPasswordToken } from '../utils/verification.js';
import { sendVerificationEmail , sendForgotPasswordEmail } from '../services/email.js';
import { OAuth2Client } from 'google-auth-library';
import Facebook from 'facebook-node-sdk'
import ERRORS from '../config/errors.js';
import registerDeviceToken from '../utils/device_tokens.js';


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
          [name, email, hashedPassword, 'male', 'Cairo', 'super_admin' , 'local']
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

    const checkEmail = await pool.query(`
      SELECT email FROM businesses WHERE email = $1
      ` , [email])

    const isExistedInOtherTable= checkEmail.rows.length>0
    if(isExistedInOtherTable){
      return res.status(400).json({
        error:true,
        message:ERRORS.EMAIL_ALREADY_EXISTED
      })
    }

    // Check if email already exists
    const exists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (exists.rows.length > 0) 
      return res.status(400).json({error:true, message:ERRORS.EMAIL_ALREADY_EXISTED  });

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

    const io = req.app.get('io');
    io.emit('newUser', newUser);

    const token = generateVerificationToken();
    await saveVerificationToken(newUser.id, "user", token);
    await sendVerificationEmail(newUser.email, token);

    // ✅ No req.login here
    return res.status(201).json({
      error:false,
      message: "Account created. Please verify your email."
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: ERRORS.SERVER_ERROR });
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

    const checkEmail = await pool.query(`
      SELECT email FROM users WHERE email = $1
      ` , [email])

    const isExistedInOtherTable= checkEmail.rows.length>0
    if(isExistedInOtherTable){
      return res.status(400).json({
        error:true,
        message:ERRORS.EMAIL_ALREADY_EXISTED
      })
    }

    // ✅ Multer provides the uploaded logo file here
    const logo = req.file
      ? `${process.env.backendURL}/${req.file.path.replace(/\\/g, '/')}`
      : null;


      let parsedLocations = []
      if(locations){
        try{
          parsedLocations= JSON.parse(locations)
        }catch(error){
          console.log(error);
          return res.status(500).json({error:true , message:ERRORS.SERVER_ERROR})
        }
      }

    // 1️⃣ Check if user already exists
    const existingUser = await pool.query(
      "SELECT * FROM businesses WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ 
        error:true,
        message: ERRORS.EMAIL_ALREADY_EXISTED 
      });
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

    const io = req.app.get('io')
    io.emit('newBusiness' , business)

    const token = generateVerificationToken();
    await saveVerificationToken(business.id, "business", token);
    await sendVerificationEmail(business.email, token);

    // ✅ No req.login here
    return res.status(201).json({
      error:false,
      message: "Account created. Please verify your email."
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: ERRORS.SERVER_ERROR });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password , deviceToken, deviceId } = req.body;

    let account;
    let accountType;

    // 1️⃣ Try users
    let result = await pool.query(
      `SELECT id, name, email, password, gender, governorate, user_type, is_verified
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
          b.is_verified,
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
        return res.status(400).json({ 
          error:true,
          message: ERRORS.INVALID_EMAIL_OR_PASSWORD 
        });
      }

      account = result.rows[0];
      accountType = "business";
    }

    // 3️⃣ Validate password
    const match = await bcrypt.compare(password, account.password);
    if (!match) {
      return res.status(400).json({ 
        error:true,
        message: ERRORS.INVALID_EMAIL_OR_PASSWORD 
      });
    }

    // 4️⃣ Check email verification
    if (!account.is_verified) {
      // Check if there is an existing token
      const tokenResult = await pool.query(
        `SELECT * FROM email_verification_tokens WHERE account_id=$1 AND account_type=$2`,
        [account.id, accountType]
      );
    
      let token;
      if (tokenResult.rows.length === 0 || new Date() > tokenResult.rows[0].expires_at) {
        // Token missing or expired → generate a new one
        token = generateVerificationToken();
        await saveVerificationToken(account.id, accountType, token);
      } else {
        token = tokenResult.rows[0].token;
      }
    
      // Send the verification email again
      await sendVerificationEmail(account.email, token);
    
      return res.status(403).json({
        error:true,
        message: ERRORS.ACCOUNT_NOT_VERIFIED
      });
    }

    // 5️⃣ Remove password before session
    delete account.password;

    const fullAccount = { ...account, accountType };

    const {error , message} = await registerDeviceToken(deviceToken , deviceId , fullAccount.id , fullAccount.accountType)
    if(error){
      return res.status(400).json({
        error:true,
        message
      })
    }

    // 6️⃣ Login / create session
    req.login(fullAccount, (err) => {
      if (err) return next(err);

      return res.status(200).json({
        error:false,
        message: "Login successful",
        account: fullAccount
      });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: ERRORS.SERVER_ERROR });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id, accountType } = req.user;

      if(!id || !accountType){
    return res.status(400).json({
      error:true,
      message:ERRORS.NOT_AUTHENTICATED
    })
  }

    const tokenResult = await pool.query(`SELECT id FROM device_tokens WHERE receiver_type=$1 AND receiver_id=$2` , [accountType , id])

      const hasToken = tokenResult.rows.length>0

    if (!id) {
      return res.status(401).json({error:true , message: ERRORS.NOT_AUTHENTICATED });
    }

    if (accountType === 'user' || accountType=== 'super_admin') {
      // Fetch user data
      const result = await pool.query(
        "SELECT id, name, email, gender, governorate, avatar , auth_provider , user_type, created_at FROM users WHERE id = $1",
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ 
          error:true,
          message: ERRORS.USER_NOT_FOUND
        });
      }
      return res.json({account:{ ...result.rows[0], accountType } , hasToken});

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
          b.active,
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
        return res.status(404).json({ 
          error:true,
          message: ERRORS.BUSINESS_NOT_FOUND
        });
      }

      const businessData = result.rows[0];
      // If no locations exist, json_agg returns [null], fix it
      businessData.locations = businessData.locations[0] === null ? [] : businessData.locations;

      return res.json({ 
        hasToken,
        account:{...businessData, accountType} });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: ERRORS.SERVER_ERROR });
  }
};

export const editAccount = async (req, res, next) => {
  const client = await pool.connect();
  const image = req.file? `${process.env.backendURL}/${req.file.path.replace(/\\/g, '/')}`: null;

  try {
    const { id, accountType } = req.user;
      if(!id , !accountType){
    return res.status(400).json({
      error:true,
      message:ERRORS.NOT_AUTHENTICATED
    })
  }
    await client.query("BEGIN");

    let accountPassword
    if(accountType==='user'){
      const result = await client.query(`SELECT password FROM users WHERE id = $1` , [id])
      accountPassword = result.rows[0].password
    }else if (accountType==='business'){
      const result = await client.query(`SELECT password FROM businesses WHERE id = $1` , [id])
      accountPassword = result.rows[0].password
    }

    let updatedAccount;

    /* ===================== USER ===================== */
    if (accountType === "user") {
      const {
        name,
        email,
        password,
        newPassword,
        gender,
        governorate,
        user_type
      } = req.body;

      if(password){
        const checkPassword = await bcrypt.compare(password , accountPassword)
        
        if(!checkPassword){
          return res.status(400).json({
            error:true,
            message:ERRORS.PASSWORD_IS_NOT_CORRECT
          })
        }
      }

      const hashedPassword = newPassword
        ? await bcrypt.hash(newPassword, 10)
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
          user_type = COALESCE($7, user_type)
        WHERE id = $8
        RETURNING id, name, email, avatar, gender, governorate, user_type
        `,
        [
          name,
          email,
          hashedPassword,
          image,
          gender,
          governorate,
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
        newPassword,
        category,
        description,
        number,
        locations
      } = req.body;

      if(password){
        const checkPassword = await bcrypt.compare(password , accountPassword)
        
        if(!checkPassword){
          return res.status(400).json({
            error:true,
            message:ERRORS.PASSWORD_IS_NOT_CORRECT
          })
        }
      }

      const hashedPassword = newPassword
        ? await bcrypt.hash(newPassword, 10)
        : null;

      let parsedLocations = [];
      if (locations) {
        try {
          parsedLocations = JSON.parse(locations);
        } catch (error){
          console.log(error);
          return res.status(500).json({error:true ,message:ERRORS.SERVER_ERROR})
        }
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
          number = COALESCE($7, number)
        WHERE id = $8
        `,
        [
          name,
          email,
          hashedPassword,
          category,
          image,
          description,
          number,
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
    console.log(err);
    return res.status(500).json({message: ERRORS.SERVER_ERROR})
  } finally {
    client.release();
  }
};

export const logout = (req, res) => {
  try{
    req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        error:true,
        message: ERRORS.FAILED_TO_LOGOUT,
      });
    }

    res.clearCookie("connect.sid"); // default session cookie name

    return res.status(200).json({
      errro:false,
      message: "Logged out successfully",
    });
  });
  }catch(error){
    console.log(error);
    return res.status(500).json({message:ERRORS.SERVER_ERROR})
  }
  
};

export const verifyEmail = async (req, res) => {
  const { token } = req.params;
  const { deviceToken, deviceId } = req.body
  console.log("token" , token);
  console.log("deviceId" , deviceId);
  console.log("deviceToken" , deviceToken);

  try {
    const result = await pool.query(
      "SELECT * FROM email_verification_tokens WHERE token=$1",
      [token]
    );

    if (result.rows.length === 0) 
      return res.status(400).json({
        error:true,
        message:ERRORS.INVALID_OR_EXPIRED_LINK
  });

    const record = result.rows[0];

    let account;

    if (record.account_type === "user") {
      // Mark user as verified
      await pool.query(
        "UPDATE users SET is_verified = true WHERE id=$1",
        [record.account_id]
      );

      // Get user data
      const userRes = await pool.query(
        "SELECT id, name, email, user_type,avatar , gender , auth_provider , governorate FROM users WHERE id=$1",
        [record.account_id]
      );
      account = userRes.rows[0];

    } else {
      // Mark business as verified
      await pool.query(
        "UPDATE businesses SET is_verified = true WHERE id=$1",
        [record.account_id]
      );

      // Get full business data with locations
      const businessRes = await pool.query(
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
        [record.account_id]
      );

      account = businessRes.rows[0];
    }

    const fullAccount = { ...account, accountType: record.account_type }

    const {error , message} = await registerDeviceToken(deviceToken , deviceId , fullAccount.id , fullAccount.accountType)
    if(error){
      return res.status(500).json({
        error:true,
        message
      })
    }

    console.log('logging successfully');


    // ⚡ Automatically login session
    req.login(fullAccount, (err) => {
      if (err) return res.status(500).json({
        error:true,
        message:ERRORS.SERVER_ERROR
      });

      // Delete token
      pool.query("DELETE FROM email_verification_tokens WHERE token=$1", [token]);
      console.log('logging successfully');

      // Redirect to dashboard or app
      return res.status(200).json({
        error:false,
        account:fullAccount
      })
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({message:ERRORS.SERVER_ERROR});
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email, accountType } = req.body; // accountType: 'user' or 'business'

    // 1️⃣ Get account
    let account;
    if (accountType === "user") {

      const result = await pool.query("SELECT id, is_verified FROM users WHERE email=$1", [email]);

      if (result.rows.length === 0) return res.status(400).json({ 
        error:true,
        message: ERRORS.ACCOUNT_NOT_FOUND 
      });

      account = result.rows[0];

    } else if (accountType === "business") {

      const result = await pool.query("SELECT id, is_verified FROM businesses WHERE email=$1", [email]);

      if (result.rows.length === 0) return res.status(400).json({ 
        error:true,
        message: ERRORS.ACCOUNT_NOT_FOUND 
      });
      
      account = result.rows[0];
    } else {
      return res.status(400).json({ error:true , message: ERRORS.INVALID_ACCOUNT_TYPE });
    }

    // 2️⃣ Already verified?
    if (account.is_verified) {
      return res.status(400).json({ error:true , message: ERRORS.ACCOUNT_ALREADY_VERIFIED });
    }

    // 3️⃣ Generate new token & save
    const token = generateVerificationToken();
    await saveVerificationToken(account.id, accountType, token);

    // 4️⃣ Send email
    await sendVerificationEmail(email, token);

    return res.status(200).json({ 
      error:false,
      message: "Verification email sent" 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: ERRORS.SERVER_ERROR });
  }
};

export const handleOuthAuth = async (req, res) => {
  const { deviceId, deviceToken , provider } = req.body;

  try {
    let name, email, avatar;

    if (provider === 'google') {
      const { idToken } = req.body;
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      name = payload?.name ?? 'Google User';
      email = payload?.email;
      avatar = payload?.picture ?? null;

      if (!email) {
        return res.status(500).json({
          error: true,
          message: ERRORS.NO_EMAIL_FROM_GOOGLE,
        });
      }
    } else if (provider === 'facebook') {
      const { accessToken } = req.body;
      console.log("FB token:", accessToken);
      const facebook = new Facebook({
        appId: process.env.FACEBOOK_CLIENT_ID,
        secret: process.env.FACEBOOK_CLIENT_SECRET,
        version: 'v17.0',
      });
      const payload = await new Promise((resolve, reject) => {
        facebook.api(
          '/me',
          {
            fields: 'id,name,email,picture',
            access_token: accessToken, // ⚠️ important name
          },
          (err, data) => {
            if (err) return reject(err);
            resolve(data);
          }
        );
      });
      name = payload?.name ?? 'Facebook User';
      email = payload?.email ?? null;
      avatar = payload?.picture?.data?.url ?? null;
    } else {
      return res.status(400).json({ error: true, message: "Invalid provider" });
    }

    let account;
    let accountType;

    // ✅ BUSINESS CHECK
    if (email) {
      const businessResult = await pool.query(
        `SELECT id FROM businesses WHERE email = $1`,
        [email]
      );

      if (businessResult.rows.length > 0) {
        const businessId = businessResult.rows[0].id;

        const businessData = await pool.query(`
          SELECT 
            b.id,
            b.name,
            b.email,
            b.category,
            b.logo,
            b.description,
            b.active,
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
          GROUP BY b.id
        `, [businessId]);

        account = businessData.rows[0];
        accountType = 'business';
      }
    }

    // ✅ USER LOGIC
    if (!account) {
      const userResult = email
        ? await pool.query(
            `SELECT id, name, email, gender, governorate, avatar, user_type 
             FROM users WHERE email = $1`,
            [email]
          )
        : { rows: [] };

      if (userResult.rows.length > 0) {
        account = userResult.rows[0];
      } else {
        const result = await pool.query(`
          INSERT INTO users (
            name,
            email,
            avatar,
            password,
            auth_provider,
            user_type,
            gender,
            governorate
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
          RETURNING id, name, email, gender, governorate, avatar, user_type
        `, [name, email, avatar, null, provider, 'user', 'male', 'Cairo']);

        account = result.rows[0];
      }

      accountType = 'user';
    }

    // ✅ REGISTER DEVICE
    const { error, message } = await registerDeviceToken(
      deviceToken,
      deviceId,
      account.id,
      accountType
    );

    if (error) {
      return res.status(500).json({ error: true, message });
    }

    const fullAccount = { ...account, accountType };

    req.login(fullAccount, (err) => {
      if (err) return res.status(500).json({
        error: true,
        message: ERRORS.SERVER_ERROR
      });

      res.status(200).json({
        error: false,
        account: fullAccount,
      });
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: ERRORS.SERVER_ERROR });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    let account;
    let accountType;

    // search in users table
    const userResult = await pool.query(
      "SELECT id, email FROM users WHERE email=$1",
      [email]
    );

    if (userResult.rows.length > 0) {
      account = userResult.rows[0];
      accountType = "user";
    } else {
      // search in businesses table
      const businessResult = await pool.query(
        "SELECT id, email FROM businesses WHERE email=$1",
        [email]
      );

      if (businessResult.rows.length > 0) {
        account = businessResult.rows[0];
        accountType = "business";
      }
    }

    // IMPORTANT security trick 🔒
    // never reveal if email exists or not
    if (!account)
      return res.status(400).json({ 
        error:true,
        message: ERRORS.NO_EMAIL_FROM_FACEBOOK 
      });

    // generate token
    const token = generateVerificationToken();

    // save token in DB
    await saveForgotPasswordToken(account.id, accountType, token);

    // send email
    await sendForgotPasswordEmail(email, token);

    res.json({
      error:false, 
      message: "If email exists, link sent , Check Your Inbox" 
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: ERRORS.SERVER_ERROR });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // 1️⃣ Find token
    const tokenResult = await pool.query(
      `SELECT * FROM password_reset_tokens WHERE token=$1`,
      [token]
    ); 

    if (tokenResult.rows.length === 0)
      return res.status(400).json({ error:true,message: ERRORS.INVALID_OR_EXPIRED_LINK });

    const resetToken = tokenResult.rows[0];

    // 2️⃣ Check expiration
    if (new Date(resetToken.expires_at) < new Date())
      return res.status(400).json({error:true , message: ERRORS.TOKEN_EXPIRED });

    // 3️⃣ Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Update correct table based on account type
    if (resetToken.account_type === "user") {
      await pool.query(
        `UPDATE users SET password=$1 WHERE id=$2`,
        [hashedPassword, resetToken.account_id]
      );
    } else {
      await pool.query(
        `UPDATE businesses SET password=$1 WHERE id=$2`,
        [hashedPassword, resetToken.account_id]
      );
    }

    // 5️⃣ Delete token after use
    await pool.query(
      `DELETE FROM password_reset_tokens 
       WHERE account_id=$1 AND account_type=$2`,
      [resetToken.account_id, resetToken.account_type]
    );

    res.json({
      error:false, 
      message: "Password reset successful" 
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: ERRORS.SERVER_ERROR });
  }
};

export const createToken = async (req, res) => {
  try {
    const { id, accountType } = req.user;
    const { token, deviceId } = req.body;

    if (!token || !deviceId) {
      return res.status(400).json({
        error: true,
        message: ERRORS.TOKEN_DEVICEID_REQUIRED
      });
    }

    if (!id || !accountType) {
      return res.status(401).json({
        error: true,
        message: ERRORS.NOT_AUTHENTICATED
      });
    }

    await pool.query(
      `
      INSERT INTO device_tokens (receiver_type, receiver_id, token, device_id)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (token)
      DO UPDATE SET
        receiver_type = EXCLUDED.receiver_type,
        receiver_id = EXCLUDED.receiver_id,
        device_id = EXCLUDED.device_id
      `,
      [accountType, id, token, deviceId]
    );

    return res.json({
      error: false,
      message: "Device token saved successfully"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({message: ERRORS.SERVER_ERROR});
  }
};