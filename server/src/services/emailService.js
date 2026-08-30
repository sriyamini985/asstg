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
  secure: parseInt(process.env.SMTP_PORT || '2525') === 465,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  }
});

const FROM_EMAIL = process.env.SMTP_FROM || 'info@asstg.in';

export const sendEmail = async ({ to, subject, html, replyTo }) => {
  const fromHeader = FROM_EMAIL.includes('<') ? FROM_EMAIL : `ASST Registration <${FROM_EMAIL}>`;

  // 1. Try Resend API if API Key is configured
  if (resendClient) {
    try {
      const response = await resendClient.emails.send({
        from: fromHeader,
        to: [to],
        subject,
        html,
        reply_to: replyTo
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
        from: fromHeader,
        to,
        subject,
        html,
        replyTo
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

export const sendContactEnquiryEmail = async (enquiry) => {
  const subject = `New Website Contact Enquiry: ${enquiry.subject || 'General Inquiry'}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #123E87; margin-top: 0;">New Website Enquiry</h2>
      <p>You have received a new message from the contact form on the ASST website.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #e2e8f0; width: 30%;">Name:</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${enquiry.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Email:</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
            <a href="mailto:${enquiry.email}">${enquiry.email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Phone:</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${enquiry.phone || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Subject:</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${enquiry.subject || 'N/A'}</td>
        </tr>
      </table>
      
      <div style="background-color: #f8fafc; border-left: 4px solid #123E87; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0; font-weight: bold; color: #475569; font-size: 13px;">Message:</p>
        <p style="margin: 10px 0 0 0; font-size: 14px; white-space: pre-line; line-height: 1.6; color: #1e293b;">${enquiry.message}</p>
      </div>
      
      <p style="font-size: 12px; color: #94a3b8; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 10px;">
        This email was sent automatically from the contact form on your website. You can reply directly to this email to reply to the visitor.
      </p>
    </div>
  `;
  return sendEmail({ 
    to: FROM_EMAIL, 
    subject, 
    html,
    replyTo: enquiry.email
  });
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

export const sendMembershipApprovedEmail = async (membership) => {
  const subject = `Payment Successful & Membership Approved - Association of Spine Surgeons of Telangana`;
  const membershipType = membership.membershipType || 'Life Membership';
  const feeAmount = membership.fee ? `₹${membership.fee.toLocaleString()}` : (membershipType === 'Associate Membership' ? '₹3,000' : '₹5,000');
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #0d2d6b 0%, #123E87 100%); color: #ffffff; padding: 28px 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; }
        .header p { margin: 6px 0 0 0; color: #A9C6EC; font-size: 13px; }
        .content { padding: 28px 24px; }
        .badge-success { display: inline-block; background-color: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 16px; }
        .info-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin: 20px 0; }
        .footer { background: #f1f5f9; padding: 18px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Association of Spine Surgeons of Telangana</h1>
          <p>Official Membership Confirmation & Payment Receipt</p>
        </div>
        <div class="content">
          <div class="badge-success">✓ Payment Verified & Membership Approved</div>
          <p style="font-size: 15px; margin-top: 0;">Dear <strong>${membership.name}</strong>,</p>
          <p>We are pleased to inform you that your payment and application for membership in the <strong>Association of Spine Surgeons of Telangana (ASST)</strong> have been successfully verified and approved.</p>
          
          <div class="info-box">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 7px 0; color: #64748b; font-size: 13px; border-bottom: 1px solid #e2e8f0;">Applicant Name:</td>
                <td style="padding: 7px 0; font-weight: bold; text-align: right; color: #0f172a; font-size: 13px; border-bottom: 1px solid #e2e8f0;">${membership.name}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; color: #64748b; font-size: 13px; border-bottom: 1px solid #e2e8f0;">Membership Category:</td>
                <td style="padding: 7px 0; font-weight: bold; text-align: right; color: #123E87; font-size: 13px; border-bottom: 1px solid #e2e8f0;">${membershipType}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; color: #64748b; font-size: 13px; border-bottom: 1px solid #e2e8f0;">Institution / Hospital:</td>
                <td style="padding: 7px 0; font-weight: bold; text-align: right; color: #0f172a; font-size: 13px; border-bottom: 1px solid #e2e8f0;">${membership.hospital}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; color: #64748b; font-size: 13px; border-bottom: 1px solid #e2e8f0;">Fee Paid:</td>
                <td style="padding: 7px 0; font-weight: bold; text-align: right; color: #059669; font-size: 14px; border-bottom: 1px solid #e2e8f0;">${feeAmount}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; color: #64748b; font-size: 13px; border-bottom: 1px solid #e2e8f0;">Transaction Reference ID:</td>
                <td style="padding: 7px 0; font-family: monospace; font-weight: bold; text-align: right; color: #334155; font-size: 13px; border-bottom: 1px solid #e2e8f0;">${membership.transactionId || 'Verified via UPI/Bank'}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; color: #64748b; font-size: 13px;">Payment Status:</td>
                <td style="padding: 7px 0; font-weight: bold; text-align: right; color: #059669; font-size: 13px;">Successful & Verified</td>
              </tr>
            </table>
          </div>

          <p>Welcome to our esteemed spine surgical community! You will receive further official communications and certificate details from our secretariat.</p>
          <p>If you have any questions, feel free to reach out to us at <a href="mailto:info@asstg.in" style="color: #123E87; font-weight: bold; text-decoration: none;">info@asstg.in</a> or WhatsApp at <strong>+91-9440602168</strong>.</p>
          
          <p style="margin-top: 25px;">Warm regards,<br/>
          <strong>Association of Spine Surgeons of Telangana (ASST)</strong><br/>
          <span style="font-size: 12px; color: #64748b;">Hyderabad, Telangana</span></p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Association of Spine Surgeons of Telangana. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
  return sendEmail({ to: membership.email, subject, html });
};

export const sendMembershipRejectedEmail = async (membership, remarks) => {
  const subject = `Membership Application Status Update - Association of Spine Surgeons of Telangana`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h3 style="color: #123E87; margin-top: 0;">Association of Spine Surgeons of Telangana</h3>
      <p>Dear ${membership.name},</p>
      <p>Regarding your membership application for <strong>${membership.membershipType || 'ASST Membership'}</strong>:</p>
      
      <div style="background-color: #fef2f2; border: 1px solid #fca5a5; padding: 15px; margin: 20px 0; border-radius: 6px;">
        <p style="margin: 0; font-size: 14px; color: #991b1b;"><strong>Status: Application Rejected / Clarification Required</strong></p>
        <p style="margin: 8px 0 0 0; font-size: 13.5px; color: #dc2626;"><strong>Admin Remarks:</strong> ${remarks || 'Payment or application details could not be verified.'}</p>
      </div>

      <p>If you believe this was an error or wish to provide additional verification documents, please contact us at <a href="mailto:info@asstg.in">info@asstg.in</a> or WhatsApp at <strong>+91-9440602168</strong>.</p>
      
export const sendMembershipSubmittedEmail = async (membership) => {
  const subject = `Membership Application Received - Association of Spine Surgeons of Telangana`;
  const membershipType = membership.membershipType || 'Life Membership';
  const feeAmount = membership.fee ? `₹${membership.fee.toLocaleString()}` : (membershipType === 'Associate Membership' ? '₹3,000' : '₹5,000');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #0d2d6b 0%, #123E87 100%); color: #ffffff; padding: 28px 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; }
        .header p { margin: 6px 0 0 0; color: #A9C6EC; font-size: 13px; }
        .content { padding: 28px 24px; }
        .badge-info { display: inline-block; background-color: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 16px; }
        .info-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin: 20px 0; }
        .footer { background: #f1f5f9; padding: 18px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Association of Spine Surgeons of Telangana</h1>
          <p>Membership Application Acknowledgement</p>
        </div>
        <div class="content">
          <div class="badge-info">✓ Application Submitted Successfully</div>
          <p style="font-size: 15px; margin-top: 0;">Dear <strong>${membership.name}</strong>,</p>
          <p>Thank you for applying for membership with the <strong>Association of Spine Surgeons of Telangana (ASST)</strong>.</p>
          <p>We have successfully received your membership application form and payment proof.</p>
          
          <div class="info-box">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 7px 0; color: #64748b; font-size: 13px; border-bottom: 1px solid #e2e8f0;">Applicant Name:</td>
                <td style="padding: 7px 0; font-weight: bold; text-align: right; color: #0f172a; font-size: 13px; border-bottom: 1px solid #e2e8f0;">${membership.name}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; color: #64748b; font-size: 13px; border-bottom: 1px solid #e2e8f0;">Membership Type:</td>
                <td style="padding: 7px 0; font-weight: bold; text-align: right; color: #123E87; font-size: 13px; border-bottom: 1px solid #e2e8f0;">${membershipType}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; color: #64748b; font-size: 13px; border-bottom: 1px solid #e2e8f0;">Institution / Hospital:</td>
                <td style="padding: 7px 0; font-weight: bold; text-align: right; color: #0f172a; font-size: 13px; border-bottom: 1px solid #e2e8f0;">${membership.hospital}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; color: #64748b; font-size: 13px; border-bottom: 1px solid #e2e8f0;">Fee Payable:</td>
                <td style="padding: 7px 0; font-weight: bold; text-align: right; color: #059669; font-size: 14px; border-bottom: 1px solid #e2e8f0;">${feeAmount}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; color: #64748b; font-size: 13px; border-bottom: 1px solid #e2e8f0;">Transaction Ref ID:</td>
                <td style="padding: 7px 0; font-family: monospace; font-weight: bold; text-align: right; color: #334155; font-size: 13px; border-bottom: 1px solid #e2e8f0;">${membership.transactionId || 'Submitted via QR/UPI'}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; color: #64748b; font-size: 13px;">Verification Status:</td>
                <td style="padding: 7px 0; font-weight: bold; text-align: right; color: #d97706; font-size: 13px;">Pending Verification</td>
              </tr>
            </table>
          </div>

          <p>Our executive committee and admin team will verify your details and payment proof within <strong>2 working days</strong>.</p>
          <p>You will receive an official payment confirmation and approval email once the verification is completed.</p>
          <p>If you have any questions, please contact us at <a href="mailto:info@asstg.in" style="color: #123E87; font-weight: bold; text-decoration: none;">info@asstg.in</a> or WhatsApp at <strong>+91-9440602168</strong>.</p>
          
          <p style="margin-top: 25px;">Regards,<br/>
          <strong>Association of Spine Surgeons of Telangana (ASST)</strong><br/>
          <span style="font-size: 12px; color: #64748b;">Hyderabad, Telangana</span></p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Association of Spine Surgeons of Telangana. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
  return sendEmail({ to: membership.email, subject, html });
};


