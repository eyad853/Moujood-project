import dotenv from 'dotenv'
dotenv.config()
import { transporter } from "../config/mail.js";

export const sendVerificationEmail = async (email, token) => {
  const verificationLink = `${process.env.frontendURL}/verify_email?token=${token}`;

  const mailOptions = {
    to: email,
    subject: "Verify your email",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
            line-height: 1.6;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #009842 0%, #007a36 100%);
            padding: 40px 30px;
            text-align: center;
          }
          .logo {
            max-width: 150px;
            height: auto;
            margin-bottom: 20px;
          }
          .header h1 {
            color: #ffffff;
            font-size: 28px;
            font-weight: 600;
            margin: 0;
          }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 18px;
            color: #333333;
            margin-bottom: 20px;
            font-weight: 500;
          }
          .message {
            color: #666666;
            font-size: 16px;
            margin-bottom: 30px;
            line-height: 1.8;
          }
          .button-container {
            text-align: center;
            margin: 35px 0;
          }
          .verify-button {
            display: inline-block;
            background: linear-gradient(135deg, #009842 0%, #007a36 100%);
            color: #ffffff !important;
            text-decoration: none;
            padding: 16px 48px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(0, 152, 66, 0.3);
            transition: transform 0.2s;
          }
          .verify-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 152, 66, 0.4);
          }
          .alternative-link {
            margin-top: 30px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #009842;
          }
          .alternative-link p {
            color: #666666;
            font-size: 14px;
            margin-bottom: 10px;
          }
          .alternative-link a {
            color: #009842;
            word-break: break-all;
            font-size: 13px;
            text-decoration: none;
          }
          .footer {
            background-color: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
          }
          .footer p {
            color: #999999;
            font-size: 13px;
            margin-bottom: 8px;
          }
          .expiry-notice {
            display: inline-flex;
            align-items: center;
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 6px;
            padding: 12px 20px;
            margin: 20px 0;
            color: #856404;
            font-size: 14px;
          }
          .expiry-icon {
            margin-right: 10px;
            font-size: 18px;
          }
          @media only screen and (max-width: 600px) {
            .email-container {
              border-radius: 0;
            }
            .header {
              padding: 30px 20px;
            }
            .header h1 {
              font-size: 24px;
            }
            .content {
              padding: 30px 20px;
            }
            .verify-button {
              padding: 14px 36px;
              font-size: 15px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <!-- Header Section -->
          <div class="header">
            <h1>Welcome! </h1>
          </div>

          <!-- Content Section -->
          <div class="content">
            <p class="greeting">Hello there!</p>
            
            <p class="message">
              Thank you for signing up! We're excited to have you on board. To get started, 
              please verify your email address by clicking the button below.
            </p>

            <!-- Verify Button -->
            <div class="button-container">
              <a href="${verificationLink}" class="verify-button">
                Verify Email Address
              </a>
            </div>

            <!-- Expiry Notice -->
            <div style="text-align: center;">
              <div class="expiry-notice">
                <span class="expiry-icon">⏱️</span>
                <span>This link expires in 1 hour</span>
              </div>
            </div>
          </div>

          <!-- Footer Section -->
          <div class="footer">
            <p>If you didn't create an account, you can safely ignore this email.</p>
            <p style="margin-top: 15px;">© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendForgotPasswordEmail = async (email, token) => {
  const resetLink = `${process.env.frontendURL}/forgot-password?token=${token}`;

  const mailOptions = {
    to: email,
    subject: "Reset your password",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
            line-height: 1.6;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #009842 0%, #007a36 100%);
            padding: 40px 30px;
            text-align: center;
          }
          .logo {
            max-width: 150px;
            height: auto;
            margin-bottom: 20px;
          }
          .header h1 {
            color: #ffffff;
            font-size: 28px;
            font-weight: 600;
            margin: 0;
          }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 18px;
            color: #333333;
            margin-bottom: 20px;
            font-weight: 500;
          }
          .message {
            color: #666666;
            font-size: 16px;
            margin-bottom: 30px;
            line-height: 1.8;
          }
          .button-container {
            text-align: center;
            margin: 35px 0;
          }
          .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #009842 0%, #007a36 100%);
            color: #ffffff !important;
            text-decoration: none;
            padding: 16px 48px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(0, 152, 66, 0.3);
            transition: transform 0.2s;
          }
          .reset-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 152, 66, 0.4);
          }
          .alternative-link {
            margin-top: 30px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #009842;
          }
          .alternative-link p {
            color: #666666;
            font-size: 14px;
            margin-bottom: 10px;
          }
          .alternative-link a {
            color: #009842;
            word-break: break-all;
            font-size: 13px;
            text-decoration: none;
          }
          .footer {
            background-color: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
          }
          .footer p {
            color: #999999;
            font-size: 13px;
            margin-bottom: 8px;
          }
          .expiry-notice {
            display: inline-flex;
            align-items: center;
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 6px;
            padding: 12px 20px;
            margin: 20px 0;
            color: #856404;
            font-size: 14px;
          }
          .expiry-icon {
            margin-right: 10px;
            font-size: 18px;
          }
          .security-notice {
            display: flex;
            align-items: flex-start;
            background-color: #e8f5e9;
            border: 1px solid #4caf50;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            color: #2e7d32;
            font-size: 14px;
          }
          .security-icon {
            margin-right: 12px;
            font-size: 20px;
            flex-shrink: 0;
          }
          @media only screen and (max-width: 600px) {
            .email-container {
              border-radius: 0;
            }
            .header {
              padding: 30px 20px;
            }
            .header h1 {
              font-size: 24px;
            }
            .content {
              padding: 30px 20px;
            }
            .reset-button {
              padding: 14px 36px;
              font-size: 15px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <!-- Header Section -->
          <div class="header">
            <h1>Password Reset</h1>
          </div>

          <!-- Content Section -->
          <div class="content">
            <p class="greeting">Hello there!</p>
            
            <p class="message">
              We received a request to reset your password. If you made this request, 
              click the button below to create a new password.
            </p>

            <!-- Reset Button -->
            <div class="button-container">
              <a href="${resetLink}" class="reset-button">
                Reset Password
              </a>
            </div>

            <!-- Expiry Notice -->
            <div style="text-align: center;">
              <div class="expiry-notice">
                <span class="expiry-icon">⏱️</span>
                <span>This link expires in 1 hour</span>
              </div>
            </div>

            <!-- Security Notice -->
            <div class="security-notice">
              <span class="security-icon">🔒</span>
              <div>
                <strong>Security tip:</strong> If you didn't request a password reset, 
                please ignore this email. Your password will remain unchanged.
              </div>
            </div>
          </div>

          <!-- Footer Section -->
          <div class="footer">
            <p>If you're having trouble clicking the button, copy and paste the link below into your browser:</p>
            <p style="margin-top: 10px;"><a href="${resetLink}" style="color: #009842; text-decoration: none;">${resetLink}</a></p>
            <p style="margin-top: 20px;">© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};