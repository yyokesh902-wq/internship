import { ResumeData, UserProfile } from '../types/resume.ts';

const TOKEN_KEY = 'resume_builder_token';
const USER_KEY = 'resume_builder_user';

export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeStoredToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getStoredUser = (): UserProfile | null => {
  const data = localStorage.getItem(USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const setStoredUser = (user: UserProfile): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const getHeaders = (isJson = true): HeadersInit => {
  const headers: Record<string, string> = {};
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getStoredToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Authentication
  async register(name: string, email: string, password: string, confirmPassword: string) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    if (data.token) {
      setStoredToken(data.token);
      setStoredUser(data.user);
    }
    return data;
  },

  async login(email: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    if (data.token) {
      setStoredToken(data.token);
      setStoredUser(data.user);
    }
    return data;
  },

  async googleAuth(payload: { email: string; name?: string; profilePhoto?: string; googleId?: string }) {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Google authentication failed');
    if (data.token) {
      setStoredToken(data.token);
      setStoredUser(data.user);
    }
    return data;
  },

  async logout() {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: getHeaders(),
      });
    } catch (err) {
      console.warn('Logout notification error:', err);
    } finally {
      removeStoredToken();
    }
  },

  async getMe(): Promise<UserProfile> {
    const res = await fetch('/api/auth/me', {
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Session expired');
    setStoredUser(data.user);
    return data.user;
  },

  // User Profile
  async updateProfile(name: string, profilePhoto?: string): Promise<UserProfile> {
    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ name, profilePhoto }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update profile');
    setStoredUser(data.user);
    return data.user;
  },

  // Resumes
  async getResumes(): Promise<ResumeData[]> {
    const res = await fetch('/api/resumes', {
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to load resumes');
    return data.resumes || [];
  },

  async getResumeById(id: string): Promise<ResumeData> {
    const res = await fetch(`/api/resumes/${id}`, {
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to load resume');
    return data.resume;
  },

  async createResume(resume: Omit<ResumeData, '_id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<ResumeData> {
    const res = await fetch('/api/resumes', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(resume),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to save resume');
    return data.resume;
  },

  async updateResume(id: string, resume: Partial<ResumeData>): Promise<ResumeData> {
    const res = await fetch(`/api/resumes/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(resume),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update resume');
    return data.resume;
  },

  async deleteResume(id: string): Promise<void> {
    const res = await fetch(`/api/resumes/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete resume');
  },

  // Photo upload
  async uploadPhoto(file: File): Promise<{ fileUrl: string; dataUrl: string }> {
    const formData = new FormData();
    formData.append('photo', file);

    const token = getStoredToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers,
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Photo upload failed');
    return data;
  },

  // AI summary assistance
  async enhanceSummary(params: {
    jobTitle?: string;
    skills?: string[];
    experienceYears?: string;
    currentDraft?: string;
  }): Promise<string> {
    const res = await fetch('/api/ai/enhance-summary', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'AI generation failed');
    return data.summary;
  },

  // Fast Full Resume Generation with Gemini AI
  async generateResumeWithAI(params: {
    jobTitle: string;
    experienceLevel?: string;
    industry?: string;
    skills?: string;
    notes?: string;
    userFullName?: string;
    userEmail?: string;
    userPhone?: string;
    userLocation?: string;
    template?: string;
  }): Promise<{ resume: ResumeData; aiGenerated: boolean }> {
    const res = await fetch('/api/ai/generate-resume', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to generate resume with AI');
    return { resume: data.resume, aiGenerated: !!data.aiGenerated };
  },

  // Generate quantifiable achievement bullets
  async generateBulletsWithAI(params: {
    jobTitle?: string;
    company?: string;
    roleContext?: string;
    existingDescription?: string;
  }): Promise<string> {
    const res = await fetch('/api/ai/generate-bullets', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to generate bullets with AI');
    return data.bullets;
  },

  // Interactive AI Resume Chatbot
  async chatWithResumeBot(params: {
    messages: Array<{ role: 'user' | 'model'; content: string }>;
    currentResume?: ResumeData | null;
    userProfile?: {
      name?: string;
      email?: string;
      phone?: string;
      location?: string;
    };
  }): Promise<{
    reply: string;
    resume?: ResumeData | null;
    updatedResume: boolean;
    aiGenerated: boolean;
  }> {
    const res = await fetch('/api/ai/chat-resume', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'AI Chatbot error');
    return data;
  },
};
