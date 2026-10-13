import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.ts';
import { AuthRequest } from '../middleware/auth.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'resume_builder_secret_jwt_key_2026';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({ success: false, message: 'Full name is required.' });
      return;
    }

    if (!email || !emailRegex.test(email.trim())) {
      res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
      return;
    }

    if (!password || password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ success: false, message: 'Passwords do not match.' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await db.findUserByEmail(normalizedEmail);
    if (existingUser) {
      res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db.createUser({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profilePhoto: newUser.profilePhoto,
        createdAt: newUser.createdAt,
      },
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please enter both email and password.' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await db.findUserByEmail(normalizedEmail);

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    if (!user.password) {
      res.status(401).json({
        success: false,
        message: 'This account was registered with Google. Please click "Continue with Google" to sign in.',
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        createdAt: user.createdAt,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name, profilePhoto, googleId } = req.body;

    if (!email || !emailRegex.test(email.trim())) {
      res.status(400).json({ success: false, message: 'Valid email is required from Google.' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = await db.findUserByEmail(normalizedEmail);

    if (user) {
      // Existing user: link googleId and update photo if not set
      const updates: Partial<typeof user> = {};
      if (googleId && !user.googleId) updates.googleId = googleId;
      if (profilePhoto && !user.profilePhoto) updates.profilePhoto = profilePhoto;
      if (!user.authProvider) updates.authProvider = 'google';

      if (Object.keys(updates).length > 0) {
        user = (await db.updateUser(user._id, updates)) || user;
      }
    } else {
      // Create new user authenticated via Google
      user = await db.createUser({
        name: name ? name.trim() : normalizedEmail.split('@')[0],
        email: normalizedEmail,
        googleId,
        authProvider: 'google',
        profilePhoto: profilePhoto || undefined,
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Authenticated with Google successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        createdAt: user.createdAt,
      },
    });
  } catch (err: any) {
    console.error('Google auth error:', err);
    res.status(500).json({ success: false, message: 'Server error during Google authentication.' });
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated.' });
    return;
  }
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      profilePhoto: req.user.profilePhoto,
      createdAt: req.user.createdAt,
    },
  });
};
