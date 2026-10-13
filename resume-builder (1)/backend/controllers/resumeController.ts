import { Response } from 'express';
import { db, ResumeDoc } from '../config/db.ts';
import { AuthRequest } from '../middleware/auth.ts';

export const getResumes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }
    const resumes = await db.findResumesByUserId(req.user._id);
    res.status(200).json({ success: true, resumes });
  } catch (err) {
    console.error('Error fetching resumes:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch resumes' });
  }
};

export const getResumeById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }
    const { id } = req.params;
    const resume = await db.findResumeById(id, req.user._id);

    if (!resume) {
      res.status(404).json({ success: false, message: 'Resume not found or access denied' });
      return;
    }

    res.status(200).json({ success: true, resume });
  } catch (err) {
    console.error('Error fetching resume:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch resume' });
  }
};

export const createResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const {
      resumeName,
      personalInfo,
      summary,
      education,
      skills,
      projects,
      experience,
      isFresher,
      certifications,
      achievements,
      languages,
      hobbies,
      selectedTemplate,
    } = req.body;

    if (!resumeName || !resumeName.trim()) {
      res.status(400).json({ success: false, message: 'Resume name is required.' });
      return;
    }

    if (!personalInfo || !personalInfo.fullName || !personalInfo.fullName.trim()) {
      res.status(400).json({ success: false, message: 'Personal information with full name is required.' });
      return;
    }

    const newResume = await db.createResume({
      userId: req.user._id,
      resumeName: resumeName.trim(),
      personalInfo: {
        fullName: personalInfo.fullName.trim(),
        jobTitle: personalInfo.jobTitle || '',
        email: personalInfo.email || req.user.email,
        phone: personalInfo.phone || '',
        location: personalInfo.location || '',
        linkedIn: personalInfo.linkedIn || '',
        github: personalInfo.github || '',
        portfolio: personalInfo.portfolio || '',
        profilePhoto: personalInfo.profilePhoto || '',
      },
      summary: summary || '',
      education: Array.isArray(education) ? education : [],
      skills: Array.isArray(skills) ? skills : [],
      projects: Array.isArray(projects) ? projects : [],
      experience: Array.isArray(experience) ? experience : [],
      isFresher: Boolean(isFresher),
      certifications: Array.isArray(certifications) ? certifications : [],
      achievements: Array.isArray(achievements) ? achievements : [],
      languages: Array.isArray(languages) ? languages : [],
      hobbies: Array.isArray(hobbies) ? hobbies : [],
      selectedTemplate: ['classic', 'modern', 'minimal', 'creative'].includes(selectedTemplate)
        ? selectedTemplate
        : 'modern',
    });

    res.status(201).json({
      success: true,
      message: 'Resume created successfully.',
      resume: newResume,
    });
  } catch (err) {
    console.error('Error creating resume:', err);
    res.status(500).json({ success: false, message: 'Failed to create resume' });
  }
};

export const updateResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const existing = await db.findResumeById(id, req.user._id);

    if (!existing) {
      res.status(404).json({ success: false, message: 'Resume not found or access denied.' });
      return;
    }

    const {
      resumeName,
      personalInfo,
      summary,
      education,
      skills,
      projects,
      experience,
      isFresher,
      certifications,
      achievements,
      languages,
      hobbies,
      selectedTemplate,
    } = req.body;

    const updates: Partial<ResumeDoc> = {};
    if (resumeName !== undefined) updates.resumeName = resumeName.trim();
    if (personalInfo !== undefined) updates.personalInfo = personalInfo;
    if (summary !== undefined) updates.summary = summary;
    if (education !== undefined) updates.education = education;
    if (skills !== undefined) updates.skills = skills;
    if (projects !== undefined) updates.projects = projects;
    if (experience !== undefined) updates.experience = experience;
    if (isFresher !== undefined) updates.isFresher = isFresher;
    if (certifications !== undefined) updates.certifications = certifications;
    if (achievements !== undefined) updates.achievements = achievements;
    if (languages !== undefined) updates.languages = languages;
    if (hobbies !== undefined) updates.hobbies = hobbies;
    if (selectedTemplate !== undefined) updates.selectedTemplate = selectedTemplate;

    const updated = await db.updateResume(id, req.user._id, updates);

    res.status(200).json({
      success: true,
      message: 'Resume updated successfully.',
      resume: updated,
    });
  } catch (err) {
    console.error('Error updating resume:', err);
    res.status(500).json({ success: false, message: 'Failed to update resume' });
  }
};

export const deleteResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const deleted = await db.deleteResume(id, req.user._id);

    if (!deleted) {
      res.status(404).json({ success: false, message: 'Resume not found or access denied.' });
      return;
    }

    res.status(200).json({ success: true, message: 'Resume deleted successfully.' });
  } catch (err) {
    console.error('Error deleting resume:', err);
    res.status(500).json({ success: false, message: 'Failed to delete resume' });
  }
};
