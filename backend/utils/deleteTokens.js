import { pool } from "../index.js";

export const deleteExpiredVerificationTokens = async () => {
  await pool.query(`
    DELETE FROM email_verification_tokens
    WHERE expires_at < NOW()
  `);
}

export const deleteExpiredResetTokens = async () => {
  await pool.query(`
    DELETE FROM password_reset_tokens
    WHERE expires_at < NOW()
  `);
}

