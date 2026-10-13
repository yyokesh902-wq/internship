import { ResumeData } from '../types/resume.ts';

export const getEmptyResume = (resumeName = 'My Resume'): ResumeData => ({
  resumeName,
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedIn: '',
    github: '',
    portfolio: '',
    profilePhoto: '',
  },
  summary: '',
  education: [],
  skills: [],
  projects: [],
  experience: [],
  isFresher: false,
  certifications: [],
  achievements: [],
  languages: [],
  hobbies: [],
  selectedTemplate: 'modern',
});

export const getSampleResume = (name = 'Alex Morgan', email = 'alex.morgan@example.com'): ResumeData => ({
  resumeName: 'Full-Stack Developer Resume',
  personalInfo: {
    fullName: name,
    jobTitle: 'Senior Full-Stack Engineer',
    email: email,
    phone: '+1 (555) 382-9102',
    location: 'San Francisco, CA',
    linkedIn: 'linkedin.com/in/alexmorgan-dev',
    github: 'github.com/alexmorgan',
    portfolio: 'alexmorgan.design',
    profilePhoto: '',
  },
  summary:
    'Dedicated and performance-driven Full-Stack Engineer with 5+ years of experience engineering high-throughput web applications and microservices. Expert in TypeScript, React, Node.js, and distributed database architectures. Proven track record of reducing latency by 35% and mentoring junior engineering teams.',
  education: [
    {
      id: 'edu-1',
      degree: 'B.S. in Computer Science',
      institution: 'University of California, Berkeley',
      university: 'UC Berkeley',
      location: 'Berkeley, CA',
      startYear: '2016',
      endYear: '2020',
      grade: '3.88 GPA',
      description: 'Graduated Magna Cum Laude. President of the Web Development Student Association.',
    },
  ],
  skills: [
    { id: 'sk-1', name: 'TypeScript', level: 'Advanced' },
    { id: 'sk-2', name: 'React 19', level: 'Advanced' },
    { id: 'sk-3', name: 'Node.js', level: 'Advanced' },
    { id: 'sk-4', name: 'Express', level: 'Advanced' },
    { id: 'sk-5', name: 'MongoDB', level: 'Intermediate' },
    { id: 'sk-6', name: 'PostgreSQL', level: 'Intermediate' },
    { id: 'sk-7', name: 'Tailwind CSS', level: 'Advanced' },
    { id: 'sk-8', name: 'Docker', level: 'Intermediate' },
    { id: 'sk-9', name: 'REST APIs', level: 'Advanced' },
    { id: 'sk-10', name: 'Git & CI/CD', level: 'Advanced' },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'CloudSync Distributed File Hub',
      technologies: 'React, Node.js, WebSocket, Redis',
      description:
        'Architected a real-time collaborative file synchronization engine handling 50k+ active connections with sub-80ms synchronization latency.',
      projectUrl: 'https://cloudsync-demo.app',
      githubUrl: 'https://github.com/alexmorgan/cloudsync',
    },
    {
      id: 'proj-2',
      title: 'MetricsPulse SaaS Analytics',
      technologies: 'TypeScript, Next.js, Tailwind, MongoDB',
      description:
        'Built an end-to-end analytical pipeline with interactive chart visualizations and automated scheduled PDF report exports.',
      projectUrl: 'https://metricspulse.io',
      githubUrl: 'https://github.com/alexmorgan/metricspulse',
    },
  ],
  experience: [
    {
      id: 'exp-1',
      jobTitle: 'Senior Full-Stack Engineer',
      company: 'TechMatrix Technologies',
      location: 'San Francisco, CA',
      startDate: 'Jan 2023',
      endDate: 'Present',
      isCurrent: true,
      description:
        'Led engineering for core customer onboarding flow, boosting sign-up conversion by 22%. Implemented automated unit and integration test suites achieving 92% code coverage.',
    },
    {
      id: 'exp-2',
      jobTitle: 'Software Engineer',
      company: 'Apex Systems',
      location: 'San Jose, CA',
      startDate: 'Aug 2020',
      endDate: 'Dec 2022',
      isCurrent: false,
      description:
        'Developed scalable RESTful APIs serving 2M daily requests. Optimized MongoDB queries reducing 95th percentile database response latency by 40%.',
    },
  ],
  isFresher: false,
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      issueDate: '2023',
      credentialUrl: 'https://aws.amazon.com/verification',
    },
    {
      id: 'cert-2',
      name: 'MongoDB Certified Developer Associate',
      issuer: 'MongoDB University',
      issueDate: '2022',
      credentialUrl: 'https://university.mongodb.com',
    },
  ],
  achievements: [
    {
      id: 'ach-1',
      title: '1st Place – Silicon Valley Hackathon 2023',
      description: 'Built an AI-assisted accessibility reader in 36 hours competing against 80 engineering teams.',
    },
    {
      id: 'ach-2',
      title: 'Engineering Innovation Award (TechMatrix)',
      description: 'Recognized for pioneering the internal micro-frontend architecture migration.',
    },
  ],
  languages: [
    { id: 'lang-1', name: 'English', proficiency: 'Native' },
    { id: 'lang-2', name: 'Spanish', proficiency: 'Conversational' },
    { id: 'lang-3', name: 'French', proficiency: 'Basic' },
  ],
  hobbies: [
    { id: 'hob-1', name: 'Open Source Contributing' },
    { id: 'hob-2', name: 'Competitive Chess' },
    { id: 'hob-3', name: 'Landscape Photography' },
  ],
  selectedTemplate: 'modern',
});
