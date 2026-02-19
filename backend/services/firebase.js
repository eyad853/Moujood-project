import admin from '../config/firebase.js';
import {pool} from '../index.js'

export async function sendNotification(title, body, tokens) {
  try {
    const message = {
      notification: { title, body },
      tokens,
    };

    const response = await admin.messaging().sendEachForMulticast(message);

    let deletedTokens = [];

    if (response.failureCount > 0) {
      const failedTokens = [];

      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const errorCode = resp.error.code;

          if (
            errorCode === 'messaging/registration-token-not-registered' ||
            errorCode === 'messaging/invalid-registration-token'
          ) {
            failedTokens.push(tokens[idx]);
          }
        }
      });

      if (failedTokens.length > 0) {
        await pool.query(
          'DELETE FROM device_tokens WHERE token = ANY($1)',
          [failedTokens]
        );

        deletedTokens = failedTokens;
      }
    }

    return {
      error: false,
      message:'Notifications sent successfully'
    };

  } catch (error) {
    return {
      error: true,
      message: error.message,
    };
  }
}