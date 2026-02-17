import {pool} from '../index.js'

const registerDeviceToken = async (token  , deviceId , receiver_id , receiver_type) => {
  try {

    // 2️⃣ validate input
    if (!token || !deviceId) {
      return {
        error: true,
        message: "token and deviceId are required",
      };
    }

    // 3️⃣ UPSERT token
    await pool.query(
      `
      INSERT INTO device_tokens
      (receiver_type, receiver_id, token, device_id, is_active)
      VALUES ($1, $2, $3, $4, $5, true)

      ON CONFLICT (token)
      DO UPDATE SET
        receiver_type = EXCLUDED.receiver_type,
        receiver_id   = EXCLUDED.receiver_id,
        device_id     = EXCLUDED.device_id,
        is_active     = true
      `,
      [receiver_type, receiver_id, token, deviceId]
    );

    console.log('the device token is created successfully');

    return { 
        error:false,
        message: "Device registered successfully" 
    }
  } catch (err) {
    return {
        error:true,
        message:err.message
    }
  }
};

export default registerDeviceToken