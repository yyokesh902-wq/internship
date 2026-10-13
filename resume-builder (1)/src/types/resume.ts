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

export type TemplateType = string;

export interface ResumeData {
  _id?: string;
  userId?: string;
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
  selectedTemplate: TemplateType;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  profilePhoto?: string;
  createdAt?: string;
}
