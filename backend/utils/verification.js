import crypto from "crypto";
import { pool } from "../index.js";

export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const saveVerificationToken = async (accountId, accountType, token) => {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  // delete old token if exists (because UNIQUE constraint)
  await pool.query(
    `DELETE FROM email_verification_tokens
     WHERE account_id = $1 AND account_type = $2`,
    [accountId, accountType]
  );

  await pool.query(
    `INSERT INTO email_verification_tokens (account_id, account_type, token, expires_at)
     VALUES ($1,$2,$3,$4)`,
    [accountId, accountType, token, expiresAt]
  );
};

export const saveForgotPasswordToken = async (accountId, accountType, token) => {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  // delete old token if exists (because UNIQUE constraint)
  await pool.query(
    `DELETE FROM password_reset_tokens
     WHERE account_id = $1 AND account_type = $2`,
    [accountId, accountType]
  );

  await pool.query(
    `INSERT INTO password_reset_tokens (account_id, account_type, token, expires_at)
     VALUES ($1,$2,$3,$4)`,
    [accountId, accountType, token, expiresAt]
  );
};
