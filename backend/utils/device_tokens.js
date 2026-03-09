import ERRORS from '../config/errors.js';
import {pool} from '../index.js'

const registerDeviceToken = async (token  , deviceId , receiver_id , receiver_type) => {
  try {

    console.log(token);
    console.log(deviceId);
    console.log(receiver_id);
    console.log(receiver_type);
    // 2️⃣ validate input
    // if (!token) {
    //   return {
    //     error: true,
    //     message: ERRORS.SERVER_ERROR,
    //   };
    // }

    // 3️⃣ UPSERT token
    await pool.query(
      `
      INSERT INTO device_tokens
      (receiver_type, receiver_id, token, device_id)
      VALUES ($1, $2, $3, $4)

      ON CONFLICT (token)
      DO UPDATE SET
        receiver_type = EXCLUDED.receiver_type,
        receiver_id   = EXCLUDED.receiver_id,
        device_id     = EXCLUDED.device_id
      `,
      [receiver_type, receiver_id, token, deviceId]
    );

    console.log('the device token is created successfully');

    return { 
        error:false,
        message: "Device registered successfully" 
    }
  } catch (err) {
    console.log(err);
    return {
        error:true,
        message:ERRORS.SERVER_ERROR
    }
  }
};

export default registerDeviceToken