import ERRORS from '../config/errors.js';
import admin from '../config/firebase.js';
import {pool} from '../index.js'

console.log(typeof admin.messaging().sendMulticast);
console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(admin.messaging())));
export async function sendNotification(title, body, tokens) {
  try {
    if(tokens.length===0)return

    const message = {
      tokens,
      notification: {
        title,
        body,
      },
    };

    const response = await admin.messaging().sendMulticast(message)
    console.log("FCM RESPONSE:", JSON.stringify(response, null, 2));

    if (response.failureCount > 0) {
      const failedTokens = [];

      response.responses.forEach((resp, index) => {
        if (!resp.success) {
          const errorCode = resp.error?.code;

          if (
            errorCode === "messaging/registration-token-not-registered" ||
            errorCode === "messaging/invalid-registration-token"
          ) {
            failedTokens.push(tokens[index]);
          }
        }
      });

      if (failedTokens.length > 0) {
        await pool.query(
          "DELETE FROM device_tokens WHERE token = ANY($1)",
          [failedTokens]
        );
      }
    }

    return {
      error: false,
      message: "Notifications processed",
    };

  } catch (error) {
    console.error("FCM Error:", error);

    return {
      error: true,
      message: ERRORS.SERVER_ERROR,
    };
  }
}