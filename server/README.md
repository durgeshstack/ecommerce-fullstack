# 🧠 Multi-Tenant AI E-commerce SaaS (Backend)

## 🚀 Overview

This is a **scalable multi-tenant e-commerce backend** built with Node.js, TypeScript, Prisma, and PostgreSQL.  
It supports:

- **Super Admin (platform owner)**
- **Tenant Admins (company owners)**
- **Employees** with **role-based access**
- **AI-ready architecture** for future enhancements

---

## 🧱 Tech Stack

- **Backend:** Node.js + TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL (Docker)
- **Authentication:** PASETO v3
- **Caching:** Redis (planned)
- **Search & AI:** Elasticsearch (planned)

---

## 🐳 Database Setup

PostgreSQL runs in Docker.

**Connection URL:**

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce"


# 🔐 Authentication System (Node.js + Prisma + Redis)

## 🚀 Overview

This project implements a **secure, scalable authentication system** for a multi-tenant SaaS application.

It includes:

* ✅ User Signup & Signin
* 🔐 Access Token & Refresh Token
* 🍪 HTTP-only Cookie-based Auth
* ⚡ Redis Session Management
* 🔄 Token Refresh Flow
* 🚪 Logout (Single & All Devices)
* 💣 Force Logout (Admin Control)
* 🔑 Forgot & Reset Password
* 🔒 Change Password

---

## 🧠 Architecture

```text
Client
  ↓
Access Token (short-lived)
  ↓
Auth Middleware
  ↓
Redis (Session Validation)
  ↓
API Access
```

---

## ⚙️ Tech Stack

* Node.js + Express
* TypeScript
* Prisma (PostgreSQL)
* Redis (Session Store)
* JWT / Paseto (Token-based Auth)

---

## 🔐 Authentication Flow

### 1. Sign In

```text
User → Login
↓
Create Redis Session (sessionId)
↓
Generate Access + Refresh Token
↓
Send via Cookies
```

---

### 2. Access Protected Routes

```text
Request → Access Token
↓
Verify Token
↓
Check Redis Session
↓
Allow / Reject
```

---

### 3. Refresh Token

```text
Access Token Expired
↓
Use Refresh Token
↓
Validate Session in Redis
↓
Issue New Access Token
```

---

### 4. Logout

```text
Delete Redis Session
↓
Clear Cookies
```

---

### 5. Force Logout (Admin)

```text
Delete all Redis sessions of user
↓
User logged out from all devices instantly
```

---

## 📦 API Endpoints

### 🔐 Auth Routes

| Method | Endpoint              | Description          |
| ------ | --------------------- | -------------------- |
| POST   | `/auth/sign-up`       | Register user        |
| POST   | `/auth/sign-in`       | Login user           |
| POST   | `/auth/refresh-token` | Get new access token |
| POST   | `/auth/sign-out`      | Logout user          |

---

### 🔑 Password Routes

| Method | Endpoint                      | Description     |
| ------ | ----------------------------- | --------------- |
| POST   | `/auth/forgot-password`       | Send reset link |
| POST   | `/auth/reset-password/:token` | Reset password  |
| POST   | `/auth/change-password`       | Change password |

---

## 🍪 Cookies Used

| Cookie       | Purpose            | Expiry |
| ------------ | ------------------ | ------ |
| accessToken  | API authentication | 15 min |
| refreshToken | Token renewal      | 7 days |

---

## 🧩 Redis Session Structure

```text
user:{userId}:sessions:{sessionId}
```

### Example:

```text
user:12:sessions:abc123
```

---

## 🔒 Security Features

* ✅ HTTP-only cookies (XSS protection)
* ✅ Secure cookies (HTTPS only)
* ✅ Token expiration strategy
* ✅ Redis-based session validation
* ✅ Token versioning (force logout)
* ✅ Password hashing (bcrypt)
* ✅ Reset token hashing (SHA-256)

---

## 💣 Force Logout

Admin can instantly logout user from all devices:

```ts
await forceLogoutUser(userId);
```

---

## 🔄 Token Structure

```ts
{
  userId,
  tenantId,
  roleType,
  tokenVersion,
  sessionId
}
```

---

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

---

### 2. Setup Environment Variables

```env
DATABASE_URL=postgresql://...
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
JWT_SECRET=your_secret
```

---

### 3. Run Prisma

```bash
npx prisma migrate dev
```

---

### 4. Start Server

```bash
npm run dev
```

---

## 📁 Project Structure

```text
src/
│
├── config/
│   └── redis.ts
│
├── controllers/
│   └── auth.controller.ts
│
├── middlewares/
│   └── auth.middleware.ts
│
├── routes/
│   └── auth.routes.ts
│
├── utils/
│   └── session.ts
│
└── server.ts
```

---

## 🚀 Best Practices Implemented

* 🔥 Stateless + Stateful hybrid auth
* ⚡ Redis for fast session validation
* 🔄 Token rotation ready
* 🧠 Multi-device session handling
* 🔐 Secure password reset flow

---

## 📌 Future Improvements

* 🔄 Refresh token rotation
* 📱 Device tracking (IP, browser)
* 🚫 Rate limiting (login protection)
* 📧 Email service integration
* 🔐 2FA (Two-Factor Authentication)

---

## 👨‍💻 Author

**Durgesh**

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!


npx prisma generate
npx prisma migrate dev --name your_migration_name
```
