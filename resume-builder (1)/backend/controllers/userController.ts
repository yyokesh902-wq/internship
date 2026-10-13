import { Response } from 'express';
import { db } from '../config/db.ts';
import { AuthRequest } from '../middleware/auth.ts';

export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }
    res.status(200).json({
      success: true,
      profile: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        profilePhoto: req.user.profilePhoto || '',
        createdAt: req.user.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving user profile' });
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { name, profilePhoto } = req.body;
    const updates: { name?: string; profilePhoto?: string } = {};

    if (name && name.trim()) {
      updates.name = name.trim();
    }
    if (profilePhoto !== undefined) {
      updates.profilePhoto = profilePhoto;
    }

    const updatedUser = await db.updateUser(req.user._id, updates);
    if (!updatedUser) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profilePhoto: updatedUser.profilePhoto || '',
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating user profile' });
  }
};
