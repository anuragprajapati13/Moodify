import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

import connectDB from './db/connection.js';
import authRoutes from './routes/auth.js';
import User from './models/User.js';

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ========================
// STATIC FILES
// ========================
// Serve the main website from root
app.use(express.static(__dirname));
// Serve the Login pages
app.use('/Login', express.static(path.join(__dirname, 'Login')));
// Serve the Avatar builder
app.use('/avatar', express.static(path.join(__dirname, 'avatar')));

// ========================
// API ROUTES
// ========================
app.use('/api/auth', authRoutes);

// Direct /api/signup route for frontend compatibility
app.post('/api/signup', async (req, res) => {
  try {
    const { email, mobile, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const bcryptjs = (await import('bcryptjs')).default;
    const jwt = (await import('jsonwebtoken')).default;

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

    const JWT_SECRET = process.env.JWT_SECRET || 'moodify_jwt_secret_2026';
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: { id: user._id, email: user.email, mobile: user.mobile },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating account', error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Serve main website at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// ========================
// CONNECT & START
// ========================
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
    console.log(`🌐 Website at http://localhost:${PORT}`);
    console.log(`🔐 Login at http://localhost:${PORT}/Login`);
    console.log(`💾 Connected to MongoDB\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ Port ${PORT} is already in use.`);
      console.error(`   Stop the other process first, or use a different port:`);
      console.error(`   PORT=3000 node server.js\n`);
    } else {
      console.error('Server error:', err);
    }
    process.exit(1);
  });
});
