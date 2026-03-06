# Moodify Backend

This repository provides a simple Node.js/Express backend implementing OTP-based password reset via email or SMS.

## Features

- MongoDB user storage with Mongoose
- Signup route (`/api/signup`)
- Forgot password flow (`/api/forgot-password`, `/api/verify-otp`, `/api/reset-password`)
- OTP generation (4-digit), 2-minute expiry, 20-second resend limit
- Email sending via Nodemailer and Gmail App Password
- SMS sending via Twilio
- Password hashing with bcrypt
- Environment configuration with dotenv
- Frontend stub integration in `script.js`

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment variables**
   Create a `.env` file at the project root with values:
   ```ini
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/moodify
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=your_app_password
   TWILIO_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE=+1234567890
   OTP_EXPIRY_MINUTES=2
   OTP_RESEND_DELAY_SECONDS=20
   ```

3. **Start MongoDB** (ensure local MongoDB server running)

4. **Run server**
   ```bash
   npm run dev
   ```

5. **Test endpoints**
   - Signup a user via frontend form or direct POST to `/api/signup`.
   - Use the forgot-password flow via the page or POST requests; OTP will be sent to email or SMS.

## Notes

- OTP values are never returned in API responses.
- Password resets require prior OTP verification.
- Console logs provide debug information when email/SMS sending fails.
- Only one resend is allowed every 20 seconds.

## Frontend

The existing `index.html`, `signup.html`, and `reset.html` pages include JavaScript handlers that call the backend routes using `fetch`.

---

Make sure you fill in the `.env` values correctly and have network access to Gmail/Twilio. The code should work in a VS Code environment as requested.
