#!/usr/bin/env node
// send_otp.js
// Usage: node send_otp.js recipient@example.com
// Requires a .env with EMAIL_USER and EMAIL_PASS (Gmail App Password)

require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const DEBUG = process.env.DEBUG === '1';

if (!EMAIL_USER || !EMAIL_PASS) {
  console.error('ERROR: Please set EMAIL_USER and EMAIL_PASS in your .env (Gmail + App Password).');
  process.exit(1);
}

const recipient = process.argv[2];
if (!recipient) {
  console.error('Usage: node send_otp.js recipient@example.com');
  process.exit(1);
}

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

const otp = generateOTP();
const expiryMs = 2 * 60 * 1000; // 2 minutes
const expiry = Date.now() + expiryMs;

// store OTPs in otps.json (simple persistent store)
const otpsFile = path.join(__dirname, 'otps.json');
let otps = {};
try {
  if (fs.existsSync(otpsFile)) {
    const raw = fs.readFileSync(otpsFile, 'utf8') || '{}';
    otps = JSON.parse(raw);
  }
} catch (err) {
  console.error('Warning: could not read otps.json:', err.message);
}

otps[recipient] = {
  otp,
  expiry,
  createdAt: Date.now()
};

try {
  fs.writeFileSync(otpsFile, JSON.stringify(otps, null, 2), 'utf8');
  console.log('Stored OTP for', recipient);
} catch (err) {
  console.error('ERROR: Failed to write otps.json:', err.message);
}

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

transporter.verify((err, success) => {
  if (err) {
    console.error('Nodemailer verify error:', err);
  } else {
    console.log('Nodemailer transporter ready');
  }
});

const html = `
  <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto;">
    <h2 style="color:#ff00ff;">Moodify - Password Reset OTP</h2>
    <p>Your one-time password (OTP) for resetting your Moodify password is:</p>
    <div style="font-size:28px; font-weight:bold; color:#000; background:#f3f3f3; padding:12px; display:inline-block;">${otp}</div>
    <p style="color:#666;">This OTP expires in 2 minutes.</p>
  </div>
`;

const mailOptions = {
  from: EMAIL_USER,
  to: recipient,
  subject: 'Moodify - Your Password Reset OTP',
  html
};

transporter.sendMail(mailOptions)
  .then(info => {
    console.log('OTP email sent, messageId=', info.messageId);
    if (DEBUG) console.log('DEBUG OTP for', recipient, otp);
    process.exit(0);
  })
  .catch(err => {
    console.error('Failed to send OTP email:', err);
    // keep the stored OTP so it can be retried or inspected
    process.exit(2);
  });
