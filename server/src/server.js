import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from './db.js';
import upload from './services/uploadService.js';
import {
  createRegistration,
  checkDuplicates,
  validateEmail,
  validateMobileNumber
} from './services/registrationService.js';
import {
  sendRegistrationSubmittedEmail,
  sendRegistrationApprovedEmail,
  sendRegistrationRejectedEmail,
  sendContactEnquiryEmail
} from './services/emailService.js';
import { exportToCSV, exportToExcel } from './services/exportService.js';

import { execSync } from 'child_process';

dotenv.config();

// Strict security check for JWT_SECRET in production
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is missing in production!');
  process.exit(1);
}

// Run database migration push programmatically on startup (with try-catch to prevent exit crashes)
try {
  console.log('Running database migrations (prisma db push)...');
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
  console.log('Database migrations completed successfully!');
} catch (error) {
  console.error('Database migration failed, starting server anyway:', error);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Strict CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://asstg.in',
  'https://www.asstg.in',
  'https://asst.org.in',
  'https://www.asst.org.in'
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Serve static screenshots securely (only authenticated or via protected routes is preferred,
// but for standard rendering in portal we expose a protected download endpoint)
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ── JWT MIDDLEWARE ───────────────────────────────────────────────
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.split(' ')[1];

  // Fallback to query parameter if not present in headers (needed for direct image rendering in portal)
  if (!token && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ error: 'Access token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'asst_secret');
    req.admin = decoded;
    next();
  } catch {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// ── SEEDING DEFAULT ADMIN ─────────────────────────────────────────
const seedDefaultAdmin = async () => {
  try {
    const adminCount = await prisma.admin.count();
    if (adminCount === 0) {
      const passwordHash = await bcrypt.hash('password123', 10);
      await prisma.admin.create({
        data: {
          username: 'admin',
          passwordHash,
          role: 'Admin'
        }
      });
      console.log('Seeded default admin: username=admin, password=password123');
    }
  } catch (error) {
    console.error('Error seeding default admin:', error);
  }
};

// ── PUBLIC ENDPOINTS ─────────────────────────────────────────────

// Submit Registration Form
app.post('/api/registrations', upload.single('screenshot'), async (req, res) => {
  try {
    const data = req.body;
    
    // Server-side validation
    const requiredFields = [
      'name', 'email', 'phone', 'category', 'institution', 'referenceId',
      'title', 'gender', 'dob', 'qualification', 'address', 'city', 'state', 'pinCode'
    ];

    for (const field of requiredFields) {
      if (!data[field] || String(data[field]).trim() === '') {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: `Field '${field}' is required.` });
      }
    }

    if (!validateEmail(data.email)) {
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Invalid email address format.' });
    }

    if (!validateMobileNumber(data.phone)) {
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Invalid mobile number. Please enter a valid 10-digit number.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Payment transaction screenshot is required.' });
    }

    // Check duplicate email, mobile, or transaction ID
    const duplicate = await checkDuplicates(data.email, data.phone, data.referenceId);
    if (duplicate) {
      // Remove uploaded file to prevent leakage/orphans
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(409).json({
        error: 'A registration with this Email, Phone, or Transaction ID already exists.'
      });
    }

    // Convert uploaded file to base64 string and delete local file immediately
    let screenshotBase64 = null;
    if (req.file) {
      try {
        const fileBuffer = fs.readFileSync(req.file.path);
        const mimeType = req.file.mimetype;
        screenshotBase64 = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
        
        // Delete local temporary file immediately to keep disk clean
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error('Error converting file to base64:', err);
        screenshotBase64 = req.file.filename; // fallback
      }
    }

    // Create database record
    const reg = await createRegistration(data, screenshotBase64 || 'no-file');

    // Send confirmation email asynchronously (failure to send won't block registration success)
    sendRegistrationSubmittedEmail(reg).catch(err => console.error('Email send failed on submit:', err));

    return res.status(201).json({
      message: 'Registration submitted successfully!',
      registrationId: reg.registrationId,
      name: `${reg.title || ''} ${reg.firstName} ${reg.lastName || ''}`.trim(),
      category: reg.category,
      fee: reg.fee,
      transactionId: reg.transactionId
    });

  } catch (error) {
    console.error('Registration error:', error);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res.status(500).json({ error: 'A server error occurred. Please try again.' });
  }
});

// Submit Membership Request
app.post('/api/memberships', async (req, res) => {
  try {
    const { name, email, phone, specialty, hospital, message } = req.body;

    if (!name || !email || !phone || !specialty || !hospital) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address format.' });
    }

    if (!validateMobileNumber(phone)) {
      return res.status(400).json({ error: 'Invalid mobile number.' });
    }

    // Check duplicate membership request
    const duplicate = await prisma.membershipRequest.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase().trim() },
          { phone: phone.trim() }
        ]
      }
    });

    if (duplicate) {
      return res.status(409).json({
        error: 'You have already submitted a membership request. Please contact ASST if you need assistance.'
      });
    }

    const membership = await prisma.membershipRequest.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        specialty,
        hospital: hospital.trim(),
        message: message ? message.trim() : null
      }
    });

    return res.status(201).json(membership);
  } catch (error) {
    console.error('Membership submission error:', error);
    return res.status(500).json({ error: 'A server error occurred. Please try again.' });
  }
});

// Admin Authentication Login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET || 'asst_secret',
      { expiresIn: '8h' }
    );

    return res.json({ token, username: admin.username, role: admin.role });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ error: 'A server error occurred.' });
  }
});

// Submit Contact Us Form (Public Endpoint)
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  try {
    if (!name || String(name).trim() === '') {
      return res.status(400).json({ error: "Name is required." });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "A valid email address is required." });
    }
    if (!message || String(message).trim() === '') {
      return res.status(400).json({ error: "Message content is required." });
    }

    await sendContactEnquiryEmail({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      subject: subject ? subject.trim() : '',
      message: message.trim()
    });

    return res.status(200).json({ message: "Enquiry submitted and emailed successfully!" });
  } catch (error) {
    console.error('Contact form submission error:', error);
    return res.status(500).json({ error: "An error occurred while processing your message." });
  }
});

// ── PROTECTED ADMIN ENDPOINTS ────────────────────────────────────

// Get Dashboard Analytics Counters
app.get('/api/admin/stats', authenticateAdmin, async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const total = await prisma.registration.count();
    const pendingVerification = await prisma.registration.count({
      where: {
        OR: [
          { registrationStatus: 'Pending Verification' },
          { paymentStatus: 'Verification Pending' }
        ]
      }
    });
    const approved = await prisma.registration.count({ where: { registrationStatus: 'Approved' } });
    const rejected = await prisma.registration.count({ where: { registrationStatus: 'Rejected' } });
    const today = await prisma.registration.count({
      where: {
        createdAt: {
          gte: startOfToday
        }
      }
    });

    // Recent 5 registrations (exclude base64 paymentScreenshot for performance)
    const recent = await prisma.registration.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        registrationId: true,
        title: true,
        firstName: true,
        lastName: true,
        category: true,
        fee: true,
        registrationStatus: true,
        paymentStatus: true,
        createdAt: true
      }
    });

    return res.json({
      total,
      pendingVerification,
      approved,
      rejected,
      today,
      recent
    });
  } catch (error) {
    console.error('Stats query error:', error);
    return res.status(500).json({ error: 'Error loading dashboard statistics.' });
  }
});

// List Membership Requests
app.get('/api/admin/memberships', authenticateAdmin, async (req, res) => {
  const { search } = req.query;
  try {
    const where = {};
    if (search) {
      const searchStr = search.trim();
      where.OR = [
        { name: { contains: searchStr } },
        { email: { contains: searchStr } },
        { phone: { contains: searchStr } },
        { hospital: { contains: searchStr } }
      ];
    }
    const list = await prisma.membershipRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    return res.json(list);
  } catch (error) {
    console.error('List memberships error:', error);
    return res.status(500).json({ error: 'Error loading membership requests.' });
  }
});

// List Registrations with Filter & Search
app.get('/api/admin/registrations', authenticateAdmin, async (req, res) => {
  const { search, category, regStatus, payStatus, dateFrom, dateTo } = req.query;

  try {
    const where = {};

    // Category filter
    if (category) {
      where.category = category;
    }

    // Status filters
    if (regStatus) {
      where.registrationStatus = regStatus;
    }
    if (payStatus) {
      where.paymentStatus = payStatus;
    }

    // Search query mapping (Reg ID, Name, Hospital, Email, Phone)
    if (search) {
      const searchStr = search.trim();
      where.OR = [
        { registrationId: { contains: searchStr } },
        { firstName: { contains: searchStr } },
        { lastName: { contains: searchStr } },
        { hospital: { contains: searchStr } },
        { email: { contains: searchStr } },
        { mobile: { contains: searchStr } }
      ];
    }

    // Date range filter
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        // Include the entire end day
        const endDay = new Date(dateTo);
        endDay.setHours(23, 59, 59, 999);
        where.createdAt.lte = endDay;
      }
    }

    const list = await prisma.registration.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        registrationId: true,
        title: true,
        firstName: true,
        lastName: true,
        gender: true,
        dob: true,
        qualification: true,
        hospital: true,
        address: true,
        city: true,
        state: true,
        pinCode: true,
        email: true,
        mobile: true,
        category: true,
        fee: true,
        transactionId: true,
        registrationStatus: true,
        paymentStatus: true,
        exportStatus: true,
        adminNotes: true,
        verifiedAt: true,
        verifiedBy: true,
        rejectionReason: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return res.json(list);
  } catch (error) {
    console.error('Registrations listing error:', error);
    return res.status(500).json({ error: 'Error loading registrations.' });
  }
});

// Get Single Registration details
app.get('/api/admin/registrations/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const reg = await prisma.registration.findUnique({ where: { id: parseInt(id) } });
    if (!reg) {
      return res.status(404).json({ error: 'Registration not found.' });
    }
    return res.json(reg);
  } catch (error) {
    console.error('Single query error:', error);
    return res.status(500).json({ error: 'Error loading registration details.' });
  }
});

// Update Status (Verify Payments & Approvals)
app.put('/api/admin/registrations/:id/status', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { regStatus, payStatus, adminNotes } = req.body;

  try {
    const current = await prisma.registration.findUnique({ where: { id: parseInt(id) } });
    if (!current) {
      return res.status(404).json({ error: 'Registration not found.' });
    }

    const updateData = {
      registrationStatus: regStatus || current.registrationStatus,
      paymentStatus: payStatus || current.paymentStatus,
      adminNotes: adminNotes !== undefined ? adminNotes : current.adminNotes,
    };

    if (regStatus === 'Approved') {
      updateData.paymentStatus = 'Verified';
      updateData.verifiedAt = new Date();
      updateData.verifiedBy = req.admin.username || 'Admin';
    } else if (regStatus === 'Rejected') {
      updateData.paymentStatus = 'Rejected';
      updateData.rejectionReason = adminNotes || '';
    }

    const updated = await prisma.registration.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    // Send notifications on status transitions
    if (regStatus === 'Approved' && current.registrationStatus !== 'Approved') {
      sendRegistrationApprovedEmail(updated).catch(err => console.error('Approval email failed:', err));
    } else if (regStatus === 'Rejected' && current.registrationStatus !== 'Rejected') {
      sendRegistrationRejectedEmail(updated, updateData.rejectionReason).catch(err => console.error('Rejection email failed:', err));
    }

    return res.json(updated);
  } catch (error) {
    console.error('Status update error:', error);
    return res.status(500).json({ error: 'Error updating registration status.' });
  }
});

// Download/View Payment Screenshot (Protected Endpoint)
app.get('/api/admin/registrations/:id/screenshot', authenticateAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const reg = await prisma.registration.findUnique({ where: { id: parseInt(id) } });
    if (!reg || !reg.paymentScreenshot) {
      return res.status(404).json({ error: 'Screenshot not found.' });
    }

    // If screenshot is a base64 string, parse and send directly
    if (reg.paymentScreenshot.startsWith('data:')) {
      const matches = reg.paymentScreenshot.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        res.setHeader('Content-Type', mimeType);
        return res.send(buffer);
      }
    }

    // Fallback to disk if it's a filename (for old registrations)
    const filePath = path.resolve(uploadDir, reg.paymentScreenshot);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Screenshot file not found.' });
    }

    return res.sendFile(filePath);
  } catch (error) {
    console.error('Screenshot download error:', error);
    return res.status(500).json({ error: 'Error fetching screenshot file.' });
  }
});

// Export Center
app.get('/api/admin/export', authenticateAdmin, async (req, res) => {
  const { format, category, regStatus, payStatus, dateFrom, dateTo } = req.query;

  try {
    const where = {};

    if (category) where.category = category;
    if (regStatus) where.registrationStatus = regStatus;
    if (payStatus) where.paymentStatus = payStatus;
    
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) {
        const endDay = new Date(dateTo);
        endDay.setHours(23, 59, 59, 999);
        where.createdAt.lte = endDay;
      }
    }

    const list = await prisma.registration.findMany({
      where,
      orderBy: { createdAt: 'asc' }
    });

    if (format === 'csv') {
      const buffer = exportToCSV(list);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=asst-registrations-${Date.now()}.csv`);
      return res.send(buffer);
    } else {
      const buffer = exportToExcel(list);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=asst-registrations-${Date.now()}.xlsx`);
      return res.send(buffer);
    }
  } catch (error) {
    console.error('Export error:', error);
    return res.status(500).json({ error: 'Error generating export file.' });
  }
});

// Temporary Database Diagnostic Route
app.get('/api/debug-db', async (req, res) => {
  try {
    const adminCount = await prisma.admin.count();
    const admins = await prisma.admin.findMany({
      select: { username: true, role: true }
    });
    return res.json({ status: 'connected', adminCount, admins });
  } catch (error) {
    return res.status(500).json({ 
      status: 'error', 
      message: error.message, 
      code: error.code, 
      meta: error.meta 
    });
  }
});

// Start Server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await seedDefaultAdmin();
});
