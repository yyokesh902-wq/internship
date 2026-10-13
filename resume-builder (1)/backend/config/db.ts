import fs from 'fs';
import path from 'path';

export interface UserDoc {
  _id: string;
  name: string;
  email: string;
  password?: string; // bcrypt hashed (optional for Google OAuth)
  googleId?: string;
  authProvider?: 'local' | 'google';
  profilePhoto?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  university?: string;
  location?: string;
  startYear: string;
  endYear: string;
  grade?: string;
  description?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string;
  projectUrl?: string;
  githubUrl?: string;
}

export interface ExperienceItem {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  description: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate?: string;
  credentialUrl?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  description?: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  proficiency: 'Basic' | 'Conversational' | 'Fluent' | 'Native';
}

export interface HobbyItem {
  id: string;
  name: string;
}

export interface PersonalInfo {
  fullName: string;
  jobTitle?: string;
  email: string;
  phone?: string;
  location?: string;
  linkedIn?: string;
  github?: string;
  portfolio?: string;
  profilePhoto?: string;
}

export interface ResumeDoc {
  _id: string;
  userId: string;
  resumeName: string;
  personalInfo: PersonalInfo;
  summary: string;
  education: EducationItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
  isFresher?: boolean;
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  languages: LanguageItem[];
  hobbies: HobbyItem[];
  selectedTemplate: 'classic' | 'modern' | 'minimal' | 'creative';
  createdAt: string;
  updatedAt: string;
}

interface DatabaseSchema {
  users: UserDoc[];
  resumes: ResumeDoc[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'mongodb_store.json');

class DatabaseService {
  private data: DatabaseSchema = { users: [], resumes: [] };
  private isLoaded = false;

  constructor() {
    this.ensureDataStore();
  }

  private ensureDataStore() {
    if (this.isLoaded) return;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        if (!Array.isArray(this.data.users)) this.data.users = [];
        if (!Array.isArray(this.data.resumes)) this.data.resumes = [];
      } else {
        this.data = { users: [], resumes: [] };
        this.save();
      }
      this.isLoaded = true;
    } catch (err) {
      console.error('Failed to initialize database store, using in-memory store:', err);
      this.data = { users: [], resumes: [] };
      this.isLoaded = true;
    }
  }

  private save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database to disk:', err);
    }
  }

  // Users collection methods
  public async findUserByEmail(email: string): Promise<UserDoc | null> {
    this.ensureDataStore();
    const found = this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    return found ? { ...found } : null;
  }

  public async findUserById(id: string): Promise<UserDoc | null> {
    this.ensureDataStore();
    const found = this.data.users.find(u => u._id === id);
    return found ? { ...found } : null;
  }

  public async createUser(user: Omit<UserDoc, '_id' | 'createdAt' | 'updatedAt'>): Promise<UserDoc> {
    this.ensureDataStore();
    const now = new Date().toISOString();
    const newDoc: UserDoc = {
      ...user,
      _id: 'usr_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
      createdAt: now,
      updatedAt: now,
    };
    this.data.users.push(newDoc);
    this.save();
    return { ...newDoc };
  }

  public async updateUser(id: string, updates: Partial<UserDoc>): Promise<UserDoc | null> {
    this.ensureDataStore();
    const idx = this.data.users.findIndex(u => u._id === id);
    if (idx === -1) return null;
    const now = new Date().toISOString();
    this.data.users[idx] = {
      ...this.data.users[idx],
      ...updates,
      updatedAt: now,
    };
    this.save();
    return { ...this.data.users[idx] };
  }

  // Resumes collection methods
  public async findResumesByUserId(userId: string): Promise<ResumeDoc[]> {
    this.ensureDataStore();
    return this.data.resumes
      .filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .map(r => ({ ...r }));
  }

  public async findResumeById(id: string, userId?: string): Promise<ResumeDoc | null> {
    this.ensureDataStore();
    const resume = this.data.resumes.find(r => r._id === id && (!userId || r.userId === userId));
    return resume ? { ...resume } : null;
  }

  public async createResume(resume: Omit<ResumeDoc, '_id' | 'createdAt' | 'updatedAt'>): Promise<ResumeDoc> {
    this.ensureDataStore();
    const now = new Date().toISOString();
    const newDoc: ResumeDoc = {
      ...resume,
      _id: 'res_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
      createdAt: now,
      updatedAt: now,
    };
    this.data.resumes.push(newDoc);
    this.save();
    return { ...newDoc };
  }

  public async updateResume(id: string, userId: string, updates: Partial<ResumeDoc>): Promise<ResumeDoc | null> {
    this.ensureDataStore();
    const idx = this.data.resumes.findIndex(r => r._id === id && r.userId === userId);
    if (idx === -1) return null;

    const now = new Date().toISOString();
    this.data.resumes[idx] = {
      ...this.data.resumes[idx],
      ...updates,
      _id: id,
      userId: userId,
      updatedAt: now,
    };
    this.save();
    return { ...this.data.resumes[idx] };
  }

  public async deleteResume(id: string, userId: string): Promise<boolean> {
    this.ensureDataStore();
    const initLen = this.data.resumes.length;
    this.data.resumes = this.data.resumes.filter(r => !(r._id === id && r.userId === userId));
    const deleted = this.data.resumes.length < initLen;
    if (deleted) this.save();
    return deleted;
  }
}

export const db = new DatabaseService();
