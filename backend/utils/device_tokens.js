import pool from '../index.js'

export const registerDeviceToken = async (token , platform='android' , deviceId , receiver_id , receiver_type) => {
  try {

    // 2️⃣ validate input
    if (!token || !platform || !deviceId) {
      return res.status(400).json({
        error: "token, platform and deviceId are required",
      });
    }

    if (!["android", "ios"].includes(platform)) {
      return res.status(400).json({
        error: "Invalid platform",
      });
    }

    // 3️⃣ UPSERT token
    await pool.query(
      `
      INSERT INTO device_tokens
      (receiver_type, receiver_id, token, platform, device_id, is_active)
      VALUES ($1, $2, $3, $4, $5, true)

      ON CONFLICT (token)
      DO UPDATE SET
        receiver_type = EXCLUDED.receiver_type,
        receiver_id   = EXCLUDED.receiver_id,
        platform      = EXCLUDED.platform,
        device_id     = EXCLUDED.device_id,
        is_active     = true
      `,
      [receiver_type, receiver_id, token, platform, deviceId]
    );

    return { 
        error:false,
        message: "Device registered successfully" 
    }
  } catch (err) {
    console.error("Register device error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
