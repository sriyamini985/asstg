import prisma from '../db.js';

export const generateRegistrationId = async () => {
  const count = await prisma.registration.count();
  const nextId = count + 1;
  const paddedId = String(nextId).padStart(5, '0');
  return `ASST2026${paddedId}`;
};

export const validateMobileNumber = (mobile) => {
  // Simple validation for Indian numbers (10 digits, optionally starting with +91 or 91)
  const regex = /^(?:\+91|91)?[6789]\d{9}$/;
  return regex.test(mobile.replace(/\s+/g, ''));
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const checkDuplicates = async (email, mobile, transactionId) => {
  const duplicate = await prisma.registration.findFirst({
    where: {
      OR: [
        { email: email.toLowerCase().trim() },
        { mobile: mobile.trim() },
        { transactionId: transactionId.trim() }
      ]
    }
  });
  return duplicate;
};

export const createRegistration = async (data, filename) => {
  const registrationId = await generateRegistrationId();
  
  // Parse full name into First & Last Name
  const nameParts = data.name.trim().split(/\s+/);
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ') || null;

  // Determine correct registration fee based on category
  const fee = data.category === 'Postgraduate Student' ? 1000.0 : 3000.0;

  const registration = await prisma.registration.create({
    data: {
      registrationId,
      title: data.title || null,
      firstName,
      lastName,
      gender: data.gender || null,
      dob: data.dob ? new Date(data.dob) : null,
      qualification: data.qualification || null,
      hospital: data.institution.trim(),
      address: data.address || null,
      city: data.city || null,
      state: data.state || null,
      pinCode: data.pinCode || null,
      email: data.email.toLowerCase().trim(),
      mobile: data.phone.trim(),
      category: data.category,
      fee,
      transactionId: data.referenceId.trim(),
      paymentScreenshot: filename,
      registrationStatus: 'Pending Verification',
      paymentStatus: 'Verification Pending',
      exportStatus: 'Pending'
    }
  });

  return registration;
};
