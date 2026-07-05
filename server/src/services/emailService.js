import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create Resend client if key is configured
const resendClient = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Create SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: parseInt(process.env.SMTP_PORT || '2525'),
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  }
});

const FROM_EMAIL = process.env.SMTP_FROM || 'no-reply@asst.org.in';

export const sendEmail = async ({ to, subject, html }) => {
  // 1. Try Resend API if API Key is configured
  if (resendClient) {
    try {
      const response = await resendClient.emails.send({
        from: `ASST Registration <${FROM_EMAIL}>`,
        to: [to],
        subject,
        html
      });
      return response;
    } catch (error) {
      console.error('Error sending email via Resend API:', error);
      throw error;
    }
  }

  // 2. Try Nodemailer SMTP if SMTP details are configured
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const info = await transporter.sendMail({
        from: `"ASST Registration" <${FROM_EMAIL}>`,
        to,
        subject,
        html
      });
      return info;
    } catch (error) {
      console.error('Error sending email via SMTP:', error);
      throw error;
    }
  }

  // 3. Mock fallback logging
  console.log(`[Email Mock] To: ${to} | Subject: ${subject}`);
  return { mock: true, messageId: 'mock-id-' + Math.random().toString(36).substring(7) };
};

export const sendRegistrationSubmittedEmail = async (reg) => {
  const subject = `Registration Received - ASST Conference`;
  const fullName = `${reg.title || ''} ${reg.firstName} ${reg.lastName || ''}`.trim();
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <p>Dear ${fullName},</p>
      <p>Thank you for registering for the ASST Conference.</p>
      <p>We have successfully received your registration form and payment proof.</p>
      
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; margin: 20px 0; border-radius: 6px;">
        <p style="margin: 0; font-size: 14px; color: #475569;"><strong>Your Registration ID:</strong></p>
        <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold; color: #123E87;">${reg.registrationId}</p>
      </div>

      <p>Our team will verify your payment within 2 working days.</p>
      <p>You will receive another email once your payment has been verified.</p>
      
      <p>Regards,<br/><strong>Association of Spine Surgeons of Telangana</strong></p>
    </div>
  `;
  return sendEmail({ to: reg.email, subject, html });
};

export const sendRegistrationApprovedEmail = async (reg) => {
  const subject = `Registration Approved`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <p>Dear Participant,</p>
      <p>Your payment has been verified successfully.</p>
      <p>Your registration has been confirmed.</p>
      
      <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; padding: 15px; margin: 20px 0; border-radius: 6px;">
        <p style="margin: 0; font-size: 14px; color: #065f46;"><strong>Registration ID:</strong></p>
        <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold; color: #059669;">${reg.registrationId}</p>
      </div>

      <p>Thank you.</p>
      
      <p>Regards,<br/><strong>ASST</strong></p>
    </div>
  `;
  return sendEmail({ to: reg.email, subject, html });
};

export const sendRegistrationRejectedEmail = async (reg, remarks) => {
  const subject = `Registration Rejected`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <p>Dear Participant,</p>
      <p>Your registration has been rejected.</p>
      
      <div style="background-color: #fef2f2; border: 1px solid #fca5a5; padding: 15px; margin: 20px 0; border-radius: 6px;">
        <p style="margin: 0; font-size: 14px; color: #991b1b;"><strong>Admin Remarks:</strong></p>
        <p style="margin: 5px 0 0 0; font-size: 14px; color: #dc2626;">${remarks || 'Payment screenshot mismatch or transaction details could not be verified.'}</p>
      </div>

      <p>Please contact us if you need help.</p>
      
      <p>Regards,<br/><strong>ASST</strong></p>
    </div>
  `;
  return sendEmail({ to: reg.email, subject, html });
};
