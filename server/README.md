# Dashboard Server

This is the backend server for the Dashboard application with enhanced authentication features including email verification and password reset functionality.

## Features

- User registration with email verification
- User login with email verification requirement
- Password reset via email
- Email verification with resend functionality
- Secure token-based authentication
- MongoDB integration
- RESTful API endpoints

## Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Email service (Gmail, SendGrid, Mailgun, etc.)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the server directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/dashboard-app

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Client URL (for email links)
CLIENT_URL=http://localhost:3000

# Email Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Email Service Setup

#### Gmail Setup

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate a new app password for "Mail"
3. Use the generated password as `SMTP_PASS`

#### SendGrid Setup

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

#### Mailgun Setup

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
```

### Running the Server

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify-email/:token` - Verify email address
- `POST /api/auth/resend-verification` - Resend verification email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/verify-reset-token/:token` - Verify reset token

### User Management

- `GET /api/dashboard/profile` - Get user profile
- `PUT /api/dashboard/profile` - Update user profile

## Email Templates

The application includes HTML email templates for:

- Email verification
- Password reset
- Welcome email

Templates are located in `utils/emailService.js` and can be customized as needed.

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Email verification requirement
- Secure password reset tokens
- Token expiration (24 hours for email verification, 1 hour for password reset)
- Input validation and sanitization

## Database Schema

The User model includes:

- Basic user information (name, email, password)
- Email verification status and tokens
- Password reset tokens
- User preferences and settings
- Timestamps for audit trail

## Error Handling

The application includes comprehensive error handling for:

- Invalid credentials
- Expired tokens
- Email sending failures
- Database errors
- Validation errors

## Development Notes

- All email operations are asynchronous and won't block the main application
- Failed email sends are logged but don't prevent user registration
- Tokens are cryptographically secure random strings
- Environment variables are validated on startup
- RESTful API design for easy integration






# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Gmail SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=hassanrashid0018@gmail.com
SMTP_PASS=opsk tfeg wkle nrpo

# Client URL (for email links)
CLIENT_URL=http://localhost:3000

# MongoDB Connection (if you're using MongoDB)
MONGODB_URI=mongodb://localhost:27017/dashboard-app