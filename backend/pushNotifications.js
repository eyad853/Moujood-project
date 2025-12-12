import { initializeApp } from 'firebase-admin/app';
import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json" with { type: "json" };

initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function sendNotification(title, body, tokens) {
    const message = {
      notification: {
        title: title,
        body: body,
      },
      tokens: tokens,
    };

    admin.messaging().sendEachForMulticast(message)
      .then((response) => {
        if (response.failureCount > 0) {
          const failedTokens = [];
          response.responses.forEach((resp, idx) => {
            if (!resp.success) {
              failedTokens.push(registrationTokens[idx]);
            }
          });
          console.log('List of tokens that caused failures: ' + failedTokens);
        }
    });
}
