import express from 'express';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'moodify_jwt_secret_2026';

// ========================
// SIGNUP
// ========================
router.post('/signup', async (req, res) => {
  try {
    const { email, mobile, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (await User.findOne({ email: email.toLowerCase() })) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const user = await User.create({
      email: email.toLowerCase(),
      mobile: mobile || '',
      password: hashedPassword,
    });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, email: user.email, mobile: user.mobile },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// ========================
// LOGIN
// ========================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const valid = await bcryptjs.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email, mobile: user.mobile },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// ========================
// GET PROFILE (protected)
// ========================
router.get('/profile', authenticateToken, async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({
    user: {
      id: user._id,
      email: user.email,
      mobile: user.mobile,
      createdAt: user.createdAt,
    },
  });
});

// ========================
// DELETE ACCOUNT
// ========================
router.post('/delete-account', async (req, res) => {
  try {
    const { contact } = req.body;
    if (!contact) {
      return res.status(400).json({ message: 'Please provide an email or mobile number' });
    }

    const isEmail = contact.includes('@');
    const field = isEmail ? 'email' : 'mobile';
    const result = await User.deleteOne({ [field]: isEmail ? contact.toLowerCase() : contact });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: `No account found with this ${isEmail ? 'email' : 'mobile number'}` });
    }

    console.log(`🗑️ Account deleted for ${contact}`);
    res.json({ message: 'Account deleted successfully! You can now create a new account.' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Error deleting account', error: error.message });
  }
});

// ========================
// JWT MIDDLEWARE
// ========================
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = decoded;
    next();
  });
}

export default router;
