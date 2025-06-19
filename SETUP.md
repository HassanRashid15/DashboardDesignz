# Dashboard Authentication Setup Guide

This guide will help you set up the enhanced authentication system with email verification and password reset functionality.

## 🚀 Quick Start

### 1. Server Setup

1. Navigate to the server directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the server directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/dashboard-app

# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Client URL (for email links)
CLIENT_URL=http://localhost:3000

# Email Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

4. Start the server:

```bash
npm run dev
```

### 2. Client Setup

1. Navigate to the client directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Start the client:

```bash
npm start
```

## 📧 Email Service Configuration

### Gmail Setup (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and generate a password
3. **Use the generated password** as `SMTP_PASS` in your `.env` file

### Alternative Email Services

#### SendGrid

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

#### Mailgun

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
```

## 🔧 Testing the Setup

### 1. Test Email Service

```bash
cd server
node test-email.js
```

### 2. Test User Registration

1. Go to `http://localhost:3000/signup`
2. Create a new account
3. Check your email for verification link
4. Click the verification link
5. Try logging in

### 3. Test Password Reset

1. Go to `http://localhost:3000/forgot-password`
2. Enter your email
3. Check your email for reset link
4. Click the reset link and set a new password

## 🔐 Security Features

### Email Verification

- ✅ Required before login
- ✅ 24-hour token expiration
- ✅ Resend functionality
- ✅ Secure token generation

### Password Reset

- ✅ Email-based reset
- ✅ 1-hour token expiration
- ✅ Token validation
- ✅ Secure password requirements

### Authentication

- ✅ JWT token-based
- ✅ Password hashing with bcrypt
- ✅ Protected routes
- ✅ Session management

## 📁 File Structure

```
server/
├── models/
│   └── User.js              # Enhanced user model with email verification
├── routes/
│   └── auth.js              # Complete auth routes with email functionality
├── utils/
│   └── emailService.js      # Email service with templates
├── middleware/
│   └── auth.js              # JWT authentication middleware
└── test-email.js            # Email service test script

client/src/
├── pages/auth/
│   ├── Login.js             # Enhanced login with verification handling
│   ├── Signup.js            # Enhanced signup with success message
│   ├── ForgotPassword.js    # Password reset request
│   ├── ResetPassword.js     # Password reset with token validation
│   └── VerifyEmail.js       # Email verification page
├── context/
│   └── AuthContext.js       # Enhanced auth context with new methods
└── App.js                   # Updated routing
```

## 🛠️ API Endpoints

### Authentication

- `POST /api/auth/signup` - Register with email verification
- `POST /api/auth/login` - Login (requires email verification)
- `GET /api/auth/verify-email/:token` - Verify email address
- `POST /api/auth/resend-verification` - Resend verification email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/verify-reset-token/:token` - Verify reset token

## 🎨 User Experience Features

### Signup Flow

1. User fills out registration form
2. Account created with verification token
3. Verification email sent automatically
4. Success page with instructions
5. User clicks email link to verify
6. Welcome email sent upon verification

### Login Flow

1. User enters credentials
2. System checks email verification status
3. If not verified, shows verification message with resend option
4. If verified, logs in successfully

### Password Reset Flow

1. User requests password reset
2. Reset email sent with secure token
3. User clicks link and enters new password
4. Password updated and user redirected to login

## 🚨 Troubleshooting

### Email Not Sending

1. Check SMTP credentials in `.env`
2. Verify email service settings
3. Check server logs for errors
4. Test with `node test-email.js`

### Verification Link Not Working

1. Check `CLIENT_URL` in `.env`
2. Verify token expiration (24 hours)
3. Check MongoDB connection
4. Review server logs

### Password Reset Issues

1. Verify token expiration (1 hour)
2. Check email configuration
3. Ensure password meets requirements (6+ characters)
4. Review server logs

## 🔄 Environment Variables

| Variable      | Description                  | Example                                   |
| ------------- | ---------------------------- | ----------------------------------------- |
| `PORT`        | Server port                  | `5000`                                    |
| `MONGODB_URI` | MongoDB connection string    | `mongodb://localhost:27017/dashboard-app` |
| `JWT_SECRET`  | JWT signing secret           | `your-secret-key`                         |
| `CLIENT_URL`  | Frontend URL for email links | `http://localhost:3000`                   |
| `SMTP_HOST`   | SMTP server host             | `smtp.gmail.com`                          |
| `SMTP_PORT`   | SMTP server port             | `587`                                     |
| `SMTP_USER`   | SMTP username                | `your-email@gmail.com`                    |
| `SMTP_PASS`   | SMTP password/app password   | `your-app-password`                       |

## 🎯 Next Steps

1. **Production Deployment**:

   - Use environment-specific configurations
   - Set up proper SSL certificates
   - Configure production email service
   - Update `CLIENT_URL` for production

2. **Additional Features**:

   - Add rate limiting for auth endpoints
   - Implement account lockout after failed attempts
   - Add two-factor authentication
   - Create admin user management

3. **Monitoring**:
   - Set up email delivery monitoring
   - Add authentication analytics
   - Monitor failed login attempts
   - Track email verification rates

## 📞 Support

If you encounter any issues:

1. Check the server logs for error messages
2. Verify all environment variables are set correctly
3. Test the email service with the provided test script
4. Ensure MongoDB is running and accessible
