# ASST Registration System — Backend Setup Guide

## Prerequisites

Make sure you have the following installed:
- **Node.js** (v18 or higher)
- **MySQL** (v8.0 or higher)
- **npm**

---

## Step 1 — Create the MySQL Database

Open MySQL CLI or MySQL Workbench and run:

```sql
CREATE DATABASE asst_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## Step 2 — Configure Environment Variables

Open `server/.env` and update the values:

```env
PORT=5000
DATABASE_URL="mysql://root:YOUR_MYSQL_PASSWORD@localhost:3306/asst_db"
JWT_SECRET="asst_premium_jwt_secret_key_2026_xyz"

# SMTP (optional — leave blank to use log-only mode)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="no-reply@asst.org.in"
```

> Replace `YOUR_MYSQL_PASSWORD` with your actual MySQL root password.

---

## Step 3 — Install Backend Dependencies

```bash
cd server
npm install
```

---

## Step 4 — Run Prisma Migrations

This creates all tables in your MySQL database:

```bash
cd server
npx prisma migrate dev --name init
```

> If migration has already run, just run: `npx prisma generate`

---

## Step 5 — Start the Backend Server

```bash
cd server
npm start
```

The server starts at **http://localhost:5000**

On first boot, a default admin account is seeded automatically:
- **Username:** `admin`
- **Password:** `password123`

> ⚠️ Change these credentials after first login via the database.

---

## Step 6 — Start the Frontend Dev Server

In a separate terminal:

```bash
npm run dev
```

Frontend runs at **http://localhost:5173**

---

## Admin Portal Access

Navigate to: **http://localhost:5173/admin**

Login with:
- Username: `admin`
- Password: `password123`

---

## API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/registrations` | Public | Submit event registration |
| POST | `/api/memberships` | Public | Submit membership request |
| POST | `/api/admin/login` | Public | Admin JWT login |
| GET | `/api/admin/stats` | JWT | Dashboard counters |
| GET | `/api/admin/registrations` | JWT | List registrations (with search/filter) |
| GET | `/api/admin/registrations/:id` | JWT | Get single registration |
| PUT | `/api/admin/registrations/:id/status` | JWT | Update payment/registration status |
| GET | `/api/admin/registrations/:id/screenshot` | JWT | Download payment screenshot |
| GET | `/api/admin/memberships` | JWT | List membership requests |
| GET | `/api/admin/export` | JWT | Export CSV or Excel |

---

## File Upload Storage

Uploaded screenshots are saved to: `server/uploads/`

Files are named uniquely using `Date.now()` + random suffix to avoid collisions.

---

## Email Notifications

The server supports sending transactional emails using either **Resend API** (Recommended) or **Nodemailer SMTP**.

### Option A — Resend API (Recommended)
Add your API key to `server/.env`:
```env
RESEND_API_KEY="re_123456789..."
SMTP_FROM="no-reply@asst.org.in" # Use your Resend verified domain or registered domain
```

### Option B — SMTP Server Fallback
Configure the following in `server/.env`:
```env
SMTP_HOST="smtp.mailtrap.io"
SMTP_PORT=2525
SMTP_USER=""
SMTP_PASS=""
SMTP_FROM="no-reply@asst.org.in"
```

If neither is configured, emails are mocked and logged to the server console instead.
