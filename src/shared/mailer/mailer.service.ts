import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;
  private senderEmail: string;

  constructor() {
    if (!process.env.GOOGLE_EMAIL || !process.env.GOOGLE_PASSWORD) {
      throw new Error(
        'Missing email credentials. Set GOOGLE_EMAIL and GOOGLE_PASSWORD in the environment variables.',
      );
    }

    this.senderEmail = process.env.GOOGLE_EMAIL;

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.senderEmail,
        pass: process.env.GOOGLE_PASSWORD,
      },
    });
  }

  async sendOtpMail(to: string, otpCode: string) {
    try {
      const subject = '🔐 Your Secure OTP Code';
      const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
          <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333;">🔑 Your OTP Code</h2>
            <p style="font-size: 16px; color: #555;">Hello,</p>
            <p style="font-size: 16px; color: #555;">Please use the OTP code below to proceed with your request:</p>
            <div style="margin: 20px 0;">
              <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #ffffff; background: #4CAF50; padding: 10px 20px; border-radius: 5px;">
                ${otpCode}
              </span>
            </div>
            <p style="font-size: 14px; color: #777;">This OTP is valid for a limited time only.</p>
            <p style="font-size: 14px; color: #777;">If you did not request this, please ignore this email.</p>
            <p style="font-size: 14px; color: #777;">For security reasons, never share your OTP with anyone.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 14px; color: #555;">Best regards,</p>
            <p style="font-size: 14px; font-weight: bold; color: #333;">NodeJS App Team</p>
          </div>
        </body>
      </html>`;

      const mailOptions = {
        from: `"NodeJS App" <${this.senderEmail}>`,
        to,
        subject,
        html: htmlContent,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ OTP email sent successfully to ${to}. OTP: ${otpCode}`);
      return info;
    } catch (error) {
      console.error(`❌ Error sending OTP email to ${to}:`, error.message);
      throw new InternalServerErrorException(
        'Failed to send OTP email. Please try again later.',
      );
    }
  }

  async sendResetOtp(to: string, otpCode: string) {
    try {
      const subject = '🔐 Reset Your Password - OTP Code';
      const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; padding: 20px;">
          <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333; text-align: center;">🔑 Your OTP Code</h2>
            <p>Hello,</p>
            <p>We received a request to reset your password. Please use the OTP code below to proceed:</p>
            <div style="text-align: center; margin: 20px 0;">
              <span style="display: inline-block; font-size: 22px; font-weight: bold; color: #4CAF50; background: #e8f5e9; padding: 10px 20px; border-radius: 5px;">
                ${otpCode}
              </span>
            </div>
            <p>If you did not request this, please ignore this email.</p>
            <p>For security reasons, do not share your OTP with anyone.</p>
            <br />
            <p>Best regards,</p>
            <p><strong>NodeJS App Team</strong></p>
          </div>
        </body>
      </html>`;

      const mailOptions = {
        from: `"NodeJS App" <${this.senderEmail}>`,
        to,
        subject,
        html: htmlContent,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ OTP email sent successfully to ${to}. OTP: ${otpCode}`);
      return info;
    } catch (error) {
      console.error(`❌ Error sending OTP email to ${to}:`, error.message);
      throw new InternalServerErrorException(
        'Failed to send OTP email. Please try again later.',
      );
    }
  }
}
