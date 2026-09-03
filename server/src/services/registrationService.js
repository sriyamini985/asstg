import prisma from '../db.js';

export const generateRegistrationId = async () => {
  const count = await prisma.registration.count();
  const nextId = count + 1;
  const paddedId = String(nextId).padStart(3, '0');
  return `ASSTG${paddedId}`;
};

export const migrateRegistrationIds = async () => {
  try {
    const allRegs = await prisma.registration.findMany({
      orderBy: { id: 'asc' }
    });
    
    let updatedCount = 0;
    for (let i = 0; i < allRegs.length; i++) {
      const reg = allRegs[i];
      const newId = `ASSTG${String(i + 1).padStart(3, '0')}`;
      if (reg.registrationId !== newId) {
        await prisma.registration.update({
          where: { id: reg.id },
          data: { registrationId: newId }
        });
        updatedCount++;
      }
    }
    if (updatedCount > 0) {
      console.log(`✅ Successfully migrated ${updatedCount} existing registration IDs to 3-digit format (ASSTG000).`);
    }
  } catch (err) {
    console.error('Error migrating registration IDs:', err);
  }
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
  // Parse full name into First & Last Name
  const nameParts = data.name.trim().split(/\s+/);
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ') || null;

  // Determine correct registration fee based on category
  const fee = (data.category === 'Postgraduate Student' || data.category === 'PG Student') ? 1000.0 : 3000.0;

  let attempts = 0;
  const maxAttempts = 10;
  let registration = null;

  while (attempts < maxAttempts) {
    try {
      // Find the highest existing registration by ID to get the next sequential number
      const lastReg = await prisma.registration.findFirst({
        orderBy: { id: 'desc' }
      });
      
      let nextId = 1;
      if (lastReg && lastReg.registrationId) {
        const numMatch = lastReg.registrationId.match(/\d+/);
        if (numMatch) {
          nextId = parseInt(numMatch[0], 10) + 1;
        }
      }
      
      const paddedId = String(nextId + attempts).padStart(3, '0');
      const registrationId = `ASSTG${paddedId}`;

      registration = await prisma.registration.create({
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
      break;
    } catch (error) {
      const isIdViolation = error.code === 'P2002' && 
        (error.message.includes('registrationId') || 
         (error.meta && JSON.stringify(error.meta).includes('registrationId')));
         
      if (isIdViolation) {
        attempts++;
        console.warn(`Registration ID collision detected (ASSTG suffix conflict). Retrying transaction (${attempts}/${maxAttempts})...`);
        continue;
      }
      throw error;
    }
  }

  if (!registration) {
    throw new Error('Failed to generate a unique registration ID after maximum attempts.');
  }

  return registration;
};
