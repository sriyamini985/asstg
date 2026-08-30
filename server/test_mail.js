import dotenv from 'dotenv';
import { sendMembershipApprovedEmail } from './src/services/emailService.js';

dotenv.config();

async function testMail() {
  console.log('Testing sendEmail with SMTP fallback...');
  try {
    const res = await sendMembershipApprovedEmail({
      name: 'Test Doctor',
      email: 'sriyamini659@gmail.com',
      membershipType: 'Life Membership',
      hospital: 'Test Hospital',
      fee: 5000,
      transactionId: 'TEST-TXN-123'
    });
    console.log('Email send result:', res);
  } catch (error) {
    console.error('Email send failed with error:', error);
  }
  process.exit(0);
}

testMail();
