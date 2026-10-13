import { Router, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import { optionalAuthToken, AuthRequest } from '../middleware/auth.ts';

const router = Router();

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function withTimeout<T>(promise: Promise<T>, ms: number, errorMessage = 'AI request timed out'): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(errorMessage)), ms)),
  ]);
}

/**
 * Fast Complete Resume Generation with Gemini 3.8 Flash
 * Generates an ATS-optimized, professionally structured resume in seconds.
 */
router.post('/generate-resume', optionalAuthToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const {
    jobTitle = 'Software Engineer',
    experienceLevel = 'mid',
    industry = 'Technology',
    skills = '',
    notes = '',
    userFullName,
    userEmail,
    userPhone,
    userLocation,
    template = 'modern-blue',
  } = req.body;

  const targetName = userFullName || req.user?.name || 'Jordan Lee';
  const targetEmail = userEmail || req.user?.email || 'jordan.lee@example.com';
  const targetPhone = userPhone || '+1 (555) 234-5678';
  const targetLocation = userLocation || 'San Francisco, CA';

  const ai = getAiClient();

  if (ai) {
    try {
      const prompt = `You are a world-class executive resume writer and ATS optimization specialist.
Generate a complete, realistic, impressive, and ATS-tailored professional resume for the following candidate:
- Candidate Name: ${targetName}
- Target Job Title / Role: ${jobTitle}
- Experience Level: ${experienceLevel} (${experienceLevel === 'fresher' ? '0 years / recent graduate' : experienceLevel === 'entry' ? '1-2 years' : experienceLevel === 'mid' ? '3-5 years' : experienceLevel === 'senior' ? '6-9 years' : '10+ years leadership'})
- Industry / Domain: ${industry}
- Key Skills to emphasize: ${Array.isArray(skills) ? skills.join(', ') : skills || 'Industry standard core skills'}
- Additional Notes / Achievements: ${notes || 'Standard high-performing trajectory'}

CRITICAL GUIDELINES:
1. Executive Summary: 3-4 powerful sentences highlighting core expertise, notable impact, and career value proposition.
2. Experience: 2 to 3 realistic job positions matching the experience level. Each position MUST contain 3 to 4 bullet points in description (separated by newlines or markdown bullets) starting with strong action verbs (e.g., "Spearheaded", "Architected", "Accelerated", "Optimized") and quantifiable metrics (e.g. "% increase in performance", "$ savings", "reduced latency by 40%").
3. Education: 1-2 realistic degrees (e.g., BS / MS / BA) with degree, institution, location, relevant coursework or honors, and graduation year.
4. Skills: 8-14 categorized skills (relevant technical skills, tools, frameworks, and methodologies) with level ("Beginner", "Intermediate", or "Advanced").
5. Projects: 2 realistic, impressive portfolio or work projects with title, tech stack used, and impactful 2-sentence description.
6. Certifications: 1-2 industry-recognized certifications with name and issuer.
7. Achievements: 1-2 notable awards or professional milestones.
8. Languages: English (Native or Fluent) and optionally another language.`;

      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                resumeName: { type: Type.STRING },
                personalInfo: {
                  type: Type.OBJECT,
                  properties: {
                    fullName: { type: Type.STRING },
                    jobTitle: { type: Type.STRING },
                    email: { type: Type.STRING },
                    phone: { type: Type.STRING },
                    location: { type: Type.STRING },
                    linkedIn: { type: Type.STRING },
                    github: { type: Type.STRING },
                    portfolio: { type: Type.STRING },
                  },
                  required: ['fullName', 'jobTitle', 'email'],
                },
                summary: { type: Type.STRING },
                experience: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      jobTitle: { type: Type.STRING },
                      company: { type: Type.STRING },
                      location: { type: Type.STRING },
                      startDate: { type: Type.STRING },
                      endDate: { type: Type.STRING },
                      isCurrent: { type: Type.BOOLEAN },
                      description: { type: Type.STRING },
                    },
                    required: ['jobTitle', 'company', 'startDate', 'endDate', 'description'],
                  },
                },
                education: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      degree: { type: Type.STRING },
                      institution: { type: Type.STRING },
                      location: { type: Type.STRING },
                      startYear: { type: Type.STRING },
                      endYear: { type: Type.STRING },
                      grade: { type: Type.STRING },
                      description: { type: Type.STRING },
                    },
                    required: ['degree', 'institution', 'startYear', 'endYear'],
                  },
                },
                skills: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      level: { type: Type.STRING },
                    },
                    required: ['name', 'level'],
                  },
                },
                projects: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      technologies: { type: Type.STRING },
                      projectUrl: { type: Type.STRING },
                      githubUrl: { type: Type.STRING },
                    },
                    required: ['title', 'description', 'technologies'],
                  },
                },
                certifications: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      issuer: { type: Type.STRING },
                      issueDate: { type: Type.STRING },
                    },
                    required: ['name', 'issuer'],
                  },
                },
                achievements: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                    },
                    required: ['title'],
                  },
                },
                languages: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      proficiency: { type: Type.STRING },
                    },
                    required: ['name', 'proficiency'],
                  },
                },
              },
              required: ['resumeName', 'personalInfo', 'summary', 'experience', 'education', 'skills'],
            },
          },
        }),
        18000,
        'Gemini generateContent timed out'
      );

      const text = response.text?.trim();
      if (text) {
        const parsed = JSON.parse(text);

        // Sanitize & ensure valid structure with unique IDs
        const generatedResume = {
          resumeName: parsed.resumeName || `${jobTitle} Resume`,
          selectedTemplate: template || 'modern-blue',
          personalInfo: {
            fullName: parsed.personalInfo?.fullName || targetName,
            jobTitle: parsed.personalInfo?.jobTitle || jobTitle,
            email: parsed.personalInfo?.email || targetEmail,
            phone: parsed.personalInfo?.phone || targetPhone,
            location: parsed.personalInfo?.location || targetLocation,
            linkedIn: parsed.personalInfo?.linkedIn || `linkedin.com/in/${targetName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
            github: parsed.personalInfo?.github || `github.com/${targetName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
            portfolio: parsed.personalInfo?.portfolio || `${targetName.toLowerCase().replace(/[^a-z0-9]/g, '')}.dev`,
            profilePhoto: '',
          },
          summary: parsed.summary || '',
          experience: (parsed.experience || []).map((exp: any, idx: number) => ({
            id: `exp_${Date.now()}_${idx}`,
            jobTitle: exp.jobTitle || 'Role',
            company: exp.company || 'Company',
            location: exp.location || targetLocation,
            startDate: exp.startDate || '2022',
            endDate: exp.endDate || 'Present',
            isCurrent: exp.isCurrent ?? (exp.endDate === 'Present'),
            description: exp.description || '',
          })),
          education: (parsed.education || []).map((edu: any, idx: number) => ({
            id: `edu_${Date.now()}_${idx}`,
            degree: edu.degree || 'Bachelor of Science',
            institution: edu.institution || 'University',
            location: edu.location || '',
            startYear: edu.startYear || '2018',
            endYear: edu.endYear || '2022',
            grade: edu.grade || 'GPA: 3.8/4.0',
            description: edu.description || '',
          })),
          skills: (parsed.skills || []).map((sk: any, idx: number) => ({
            id: `skill_${Date.now()}_${idx}`,
            name: sk.name || 'Skill',
            level: (['Beginner', 'Intermediate', 'Advanced'].includes(sk.level) ? sk.level : 'Advanced') as 'Beginner' | 'Intermediate' | 'Advanced',
          })),
          projects: (parsed.projects || []).map((proj: any, idx: number) => ({
            id: `proj_${Date.now()}_${idx}`,
            title: proj.title || 'Project',
            description: proj.description || '',
            technologies: proj.technologies || 'Modern Tech',
            projectUrl: proj.projectUrl || '',
            githubUrl: proj.githubUrl || '',
          })),
          certifications: (parsed.certifications || []).map((cert: any, idx: number) => ({
            id: `cert_${Date.now()}_${idx}`,
            name: cert.name || 'Certification',
            issuer: cert.issuer || 'Credential Issuer',
            issueDate: cert.issueDate || '2023',
          })),
          achievements: (parsed.achievements || []).map((ach: any, idx: number) => ({
            id: `ach_${Date.now()}_${idx}`,
            title: ach.title || 'Achievement',
            description: ach.description || '',
          })),
          languages: (parsed.languages || [
            { name: 'English', proficiency: 'Fluent' },
          ]).map((lang: any, idx: number) => ({
            id: `lang_${Date.now()}_${idx}`,
            name: lang.name || 'English',
            proficiency: (['Basic', 'Conversational', 'Fluent', 'Native'].includes(lang.proficiency) ? lang.proficiency : 'Fluent') as 'Basic' | 'Conversational' | 'Fluent' | 'Native',
          })),
          hobbies: [
            { id: `hobby_${Date.now()}_1`, name: 'Technical Writing' },
            { id: `hobby_${Date.now()}_2`, name: 'Open Source Mentorship' },
          ],
          isFresher: experienceLevel === 'fresher',
        };

        res.status(200).json({ success: true, resume: generatedResume, aiGenerated: true });
        return;
      }
    } catch (err) {
      console.warn('Gemini AI resume generation encountered an issue, generating high-fidelity fallback:', err);
    }
  }

  // High-fidelity curated fallback generator
  const fallbackResume = createSmartFallbackResume({
    targetName,
    targetEmail,
    targetPhone,
    targetLocation,
    jobTitle,
    experienceLevel,
    skills,
    template,
  });

  res.status(200).json({ success: true, resume: fallbackResume, aiGenerated: false });
});

/**
 * AI Resume Chatbot Endpoint
 * Conversational multi-turn interactive assistant powered by Gemini 3.8 Flash.
 * Chat with the AI to build, iterate, and customize resumes in real-time.
 */
router.post('/chat-resume', optionalAuthToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const {
    messages = [],
    currentResume = null,
    userProfile = {},
  } = req.body;

  const targetName = userProfile.name || req.user?.name || currentResume?.personalInfo?.fullName || 'Jordan Lee';
  const targetEmail = userProfile.email || req.user?.email || currentResume?.personalInfo?.email || 'jordan.lee@example.com';
  const targetPhone = userProfile.phone || currentResume?.personalInfo?.phone || '+1 (555) 234-5678';
  const targetLocation = userProfile.location || currentResume?.personalInfo?.location || 'San Francisco, CA';

  const lastUserMessage = [...messages].reverse().find((m: any) => m.role === 'user')?.content || '';

  const ai = getAiClient();

  if (ai) {
    try {
      // Build conversational context for Gemini 3.8 Flash
      const conversationHistoryText = (messages || [])
        .slice(-10) // Keep last 10 messages for rich context
        .map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n\n');

      const currentResumeSummary = currentResume
        ? JSON.stringify({
            resumeName: currentResume.resumeName,
            selectedTemplate: currentResume.selectedTemplate || 'modern-blue',
            personalInfo: currentResume.personalInfo,
            summary: currentResume.summary,
            experience: currentResume.experience,
            education: currentResume.education,
            skills: currentResume.skills,
            projects: currentResume.projects,
            certifications: currentResume.certifications,
            achievements: currentResume.achievements,
            languages: currentResume.languages,
          }, null, 2)
        : 'None yet (Need to create from scratch)';

      const systemPrompt = `You are "ResumeCraft AI", an elite AI Executive Career Coach and Resume Architect.
You help users build, refine, transform, and optimize professional resumes conversationally.

CANDIDATE INFO:
- Name: ${targetName}
- Email: ${targetEmail}
- Phone: ${targetPhone}
- Location: ${targetLocation}

CURRENT RESUME STATE:
${currentResumeSummary}

CONVERSATION HISTORY:
${conversationHistoryText}

LATEST USER MESSAGE:
"${lastUserMessage}"

INSTRUCTIONS:
1. Provide an engaging, encouraging, professional conversational reply to the user.
   - Congratulate or acknowledge their career direction.
   - Briefly explain what was created, enhanced, or changed (e.g. highlighted metrics, ATS keywords, action verbs).
   - If they asked general career questions or resume tips, provide top-tier actionable advice.
   - Ask a helpful follow-up question (e.g. "Would you like to tailor this for a specific company?" or "Shall we add any certifications?").

2. CRITICAL: If the user is asking to build a resume, update a resume, change a role, add experience/skills/projects, or if there is no current resume and they specified a role/background:
   You MUST include the full updated resume in a valid JSON block at the very end of your response, formatted EXACTLY as:
   \`\`\`resume_data
   {
     "resumeName": "Title of Resume",
     "selectedTemplate": "modern-blue",
     "personalInfo": {
       "fullName": "${targetName}",
       "jobTitle": "Target Job Title",
       "email": "${targetEmail}",
       "phone": "${targetPhone}",
       "location": "${targetLocation}",
       "linkedIn": "linkedin.com/in/username",
       "github": "github.com/username",
       "portfolio": "portfolio.dev"
     },
     "summary": "3-4 impactful sentences...",
     "experience": [
       {
         "jobTitle": "Role Title",
         "company": "Company Name",
         "location": "City, ST",
         "startDate": "Year/Month",
         "endDate": "Present",
         "isCurrent": true,
         "description": "• Spearheaded... with 35% increase...\n• Architected..."
       }
     ],
     "education": [
       {
         "degree": "Degree Name",
         "institution": "University / College",
         "location": "City, ST",
         "startYear": "2018",
         "endYear": "2022",
         "grade": "GPA or Honors",
         "description": "Relevant Coursework..."
       }
     ],
     "skills": [
       { "name": "Skill Name", "level": "Advanced" }
     ],
     "projects": [
       { "title": "Project Name", "description": "High impact summary", "technologies": "React, Node, etc." }
     ],
     "certifications": [
       { "name": "Cert Name", "issuer": "Issuer", "issueDate": "2023" }
     ],
     "achievements": [
       { "title": "Achievement", "description": "Impact description" }
     ],
     "languages": [
       { "name": "English", "proficiency": "Fluent" }
     ]
   }
   \`\`\`

3. Guidelines for the resume data:
   - Every bullet in experience MUST begin with strong action verbs (Spearheaded, Directed, Engineered, Orchestrated, Scaled) and include quantifiable metrics (%, $, scale, users).
   - Ensure skill levels are "Beginner", "Intermediate", or "Advanced".
   - Keep the candidate's existing real details if present in the CURRENT RESUME STATE.
   - Do NOT output extra text after the \`\`\`resume_data ... \`\`\` block.`;

      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: systemPrompt,
        }),
        18000,
        'Gemini chat request timed out'
      );

      const fullText = response.text || '';

      // Check for ```resume_data ... ``` block
      const resumeDataMatch = fullText.match(/```resume_data\s*([\s\S]*?)\s*```/);
      let parsedResume: any = null;
      let cleanReply = fullText;

      if (resumeDataMatch && resumeDataMatch[1]) {
        try {
          const rawJson = resumeDataMatch[1].trim();
          const parsed = JSON.parse(rawJson);

          // Strip the code block from the conversational reply
          cleanReply = fullText.replace(/```resume_data\s*[\s\S]*?\s*```/, '').trim();

          const now = Date.now();
          parsedResume = {
            _id: currentResume?._id,
            userId: currentResume?.userId,
            resumeName: parsed.resumeName || `${parsed.personalInfo?.jobTitle || 'Professional'} Resume`,
            selectedTemplate: parsed.selectedTemplate || currentResume?.selectedTemplate || 'modern-blue',
            personalInfo: {
              fullName: parsed.personalInfo?.fullName || targetName,
              jobTitle: parsed.personalInfo?.jobTitle || currentResume?.personalInfo?.jobTitle || 'Professional',
              email: parsed.personalInfo?.email || targetEmail,
              phone: parsed.personalInfo?.phone || targetPhone,
              location: parsed.personalInfo?.location || targetLocation,
              linkedIn: parsed.personalInfo?.linkedIn || currentResume?.personalInfo?.linkedIn || `linkedin.com/in/${targetName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
              github: parsed.personalInfo?.github || currentResume?.personalInfo?.github || `github.com/${targetName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
              portfolio: parsed.personalInfo?.portfolio || currentResume?.personalInfo?.portfolio || `${targetName.toLowerCase().replace(/[^a-z0-9]/g, '')}.dev`,
              profilePhoto: currentResume?.personalInfo?.profilePhoto || '',
            },
            summary: parsed.summary || currentResume?.summary || '',
            experience: (parsed.experience || currentResume?.experience || []).map((exp: any, idx: number) => ({
              id: exp.id || `exp_${now}_${idx}`,
              jobTitle: exp.jobTitle || 'Role',
              company: exp.company || 'Company',
              location: exp.location || targetLocation,
              startDate: exp.startDate || '2022',
              endDate: exp.endDate || 'Present',
              isCurrent: exp.isCurrent ?? (exp.endDate === 'Present'),
              description: exp.description || '',
            })),
            education: (parsed.education || currentResume?.education || []).map((edu: any, idx: number) => ({
              id: edu.id || `edu_${now}_${idx}`,
              degree: edu.degree || 'Degree',
              institution: edu.institution || 'University',
              location: edu.location || '',
              startYear: edu.startYear || '2018',
              endYear: edu.endYear || '2022',
              grade: edu.grade || '',
              description: edu.description || '',
            })),
            skills: (parsed.skills || currentResume?.skills || []).map((sk: any, idx: number) => ({
              id: sk.id || `sk_${now}_${idx}`,
              name: typeof sk === 'string' ? sk : sk.name || 'Skill',
              level: (['Beginner', 'Intermediate', 'Advanced'].includes(sk.level) ? sk.level : 'Advanced') as any,
            })),
            projects: (parsed.projects || currentResume?.projects || []).map((proj: any, idx: number) => ({
              id: proj.id || `proj_${now}_${idx}`,
              title: proj.title || 'Project',
              description: proj.description || '',
              technologies: proj.technologies || '',
              projectUrl: proj.projectUrl || '',
              githubUrl: proj.githubUrl || '',
            })),
            certifications: (parsed.certifications || currentResume?.certifications || []).map((cert: any, idx: number) => ({
              id: cert.id || `cert_${now}_${idx}`,
              name: cert.name || 'Certification',
              issuer: cert.issuer || 'Issuing Authority',
              issueDate: cert.issueDate || '2023',
            })),
            achievements: (parsed.achievements || currentResume?.achievements || []).map((ach: any, idx: number) => ({
              id: ach.id || `ach_${now}_${idx}`,
              title: ach.title || 'Achievement',
              description: ach.description || '',
            })),
            languages: (parsed.languages || currentResume?.languages || [
              { name: 'English', proficiency: 'Fluent' },
            ]).map((l: any, idx: number) => ({
              id: l.id || `lang_${now}_${idx}`,
              name: l.name || 'Language',
              proficiency: l.proficiency || 'Fluent',
            })),
            hobbies: currentResume?.hobbies || [],
            isFresher: currentResume?.isFresher || false,
          };
        } catch (jsonErr) {
          console.warn('Failed to parse resume JSON from chatbot reply:', jsonErr);
        }
      }

      res.status(200).json({
        success: true,
        reply: cleanReply || "I've reviewed your request and updated your resume!",
        resume: parsedResume || currentResume || null,
        updatedResume: Boolean(parsedResume),
        aiGenerated: true,
      });
      return;
    } catch (err) {
      console.warn('Gemini chat error, falling back to smart dialogue assistant:', err);
    }
  }

  // Conversational smart fallback
  const userText = lastUserMessage.toLowerCase();
  let detectedTitle = currentResume?.personalInfo?.jobTitle || 'Full Stack Software Engineer';

  if (userText.includes('full stack') || userText.includes('software engineer') || userText.includes('developer')) {
    detectedTitle = 'Full Stack Software Engineer';
  } else if (userText.includes('product manager') || userText.includes('pm')) {
    detectedTitle = 'Product Manager';
  } else if (userText.includes('data scientist') || userText.includes('data analyst') || userText.includes('machine learning')) {
    detectedTitle = 'Data Scientist & ML Engineer';
  } else if (userText.includes('devops') || userText.includes('cloud') || userText.includes('sre')) {
    detectedTitle = 'Senior DevOps & Cloud Architect';
  } else if (userText.includes('ui/ux') || userText.includes('designer') || userText.includes('product designer')) {
    detectedTitle = 'Senior UI/UX Product Designer';
  } else if (userText.includes('marketing') || userText.includes('growth')) {
    detectedTitle = 'Growth & Digital Marketing Lead';
  } else if (userText.includes('sales') || userText.includes('account executive')) {
    detectedTitle = 'Enterprise Account Executive';
  }

  const generatedResume = createSmartFallbackResume({
    targetName,
    targetEmail,
    targetPhone,
    targetLocation,
    jobTitle: detectedTitle,
    experienceLevel: userText.includes('fresher') || userText.includes('entry') ? 'entry' : 'mid',
    skills: '',
    template: currentResume?.selectedTemplate || 'modern-blue',
  });

  const reply = `I've created a custom, ATS-tailored resume for **${detectedTitle}**! 

Here is what I've optimized for you:
• **Executive Summary**: Highlighting core domain competencies and strategic delivery.
• **Quantified Impact**: Experience bullet points with measurable metrics (latency reduction, cost savings, user scale).
• **Targeted Skills**: Essential technical and leadership competencies categorized for ATS scanning.

You can preview the resume on the right, open it directly in the editor, or tell me what else you'd like to refine (e.g. *"make it more senior"*, *"add cloud skills"*, or *"focus on startup experience"*).`;

  res.status(200).json({
    success: true,
    reply,
    resume: generatedResume,
    updatedResume: true,
    aiGenerated: false,
  });
});

/**
 * AI Enhance Professional Summary
 */
router.post('/enhance-summary', optionalAuthToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { jobTitle, skills, experienceYears, currentDraft } = req.body;

  const ai = getAiClient();
  if (ai) {
    try {
      const prompt = `You are an elite executive career coach and resume writer.
Write a compelling, high-impact 3-4 sentence professional summary for a resume.
Target Job Title: ${jobTitle || 'Professional'}
Key Skills: ${Array.isArray(skills) ? skills.join(', ') : skills || 'Core competencies'}
Experience Level: ${experienceYears || 'Experienced'}
Current Draft (if any): "${currentDraft || ''}"

Rules:
- Be concise, direct, and quantifiable.
- Avoid buzzwords, fluff, and emojis.
- Start with an impactful description of specialized expertise.
- Output ONLY the 3-4 sentence summary paragraph without greetings or markdown quotes.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const text = response.text?.trim();
      if (text) {
        res.status(200).json({ success: true, summary: text });
        return;
      }
    } catch (err) {
      console.warn('Gemini summary enhancement fallback:', err);
    }
  }

  // Smart fallback
  const title = (jobTitle || '').toLowerCase();
  let fallback = '';
  if (title.includes('develop') || title.includes('software') || title.includes('engineer') || title.includes('tech')) {
    fallback = `Results-driven ${jobTitle || 'Software Engineer'} with deep expertise in scalable architecture, clean code principles, and modern development stacks. Proven record of optimizing performance and delivering robust digital solutions across cross-functional engineering teams. Dedicated to writing maintainable systems and driving measurable technical innovation.`;
  } else if (title.includes('data') || title.includes('analyst') || title.includes('ai')) {
    fallback = `Analytical ${jobTitle || 'Data Specialist'} skilled in translating complex multidimensional datasets into actionable business intelligence. Experienced in predictive statistical modeling, data pipeline orchestration, and executive reporting. Recognized for improving decision accuracy and operational velocity through data-driven strategies.`;
  } else if (title.includes('design') || title.includes('product') || title.includes('ux') || title.includes('ui')) {
    fallback = `User-centered ${jobTitle || 'Product Designer'} dedicated to crafting intuitive, accessible, and high-conversion digital experiences. Adept at bridging customer research with cohesive design systems and modern interface patterns. Committed to harmonizing business objectives with elegant, human-first interaction design.`;
  } else {
    fallback = `Accomplished and proactive ${jobTitle || 'Professional'} with a demonstrated history of delivering high-priority initiatives and exceeding performance benchmarks. Recognized for structured communication, strategic problem-solving, and cross-functional leadership. Committed to continuous optimization and driving sustainable value.`;
  }

  res.status(200).json({ success: true, summary: fallback });
});

/**
 * Generate Bullet Points for Experience or Projects
 */
router.post('/generate-bullets', optionalAuthToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { jobTitle, company, roleContext, existingDescription } = req.body;

  const ai = getAiClient();
  if (ai) {
    try {
      const prompt = `You are a professional resume writer specializing in ATS bullet points.
Generate 4 quantifiable, high-impact resume achievement bullet points for:
Role: ${jobTitle || 'Professional'}
Company / Context: ${company || 'Organization'}
Notes or tasks: ${roleContext || existingDescription || 'Standard core responsibilities'}

Format:
- Each bullet point must begin with a strong past-tense action verb (e.g., "Spearheaded", "Engineered", "Optimized", "Revamped", "Orchestrated").
- Include realistic measurable impact (e.g. percentages, scale, latency reduction, cost savings, user growth).
- Keep each bullet between 15 and 25 words.
- Return ONLY the bullet points, one per line, with a bullet symbol "• ".`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const text = response.text?.trim();
      if (text) {
        res.status(200).json({ success: true, bullets: text });
        return;
      }
    } catch (err) {
      console.warn('Gemini bullets generation fallback:', err);
    }
  }

  const defaultBullets = [
    `• Spearheaded end-to-end delivery of high-impact ${jobTitle || 'technical'} initiatives, improving team delivery throughput by 28%.`,
    `• Engineered and deployed scalable solutions that enhanced operational reliability and reduced incident response time by 35%.`,
    `• Collaborated with cross-functional stakeholders to align architectural roadmaps with business KPIs, driving positive user retention.`,
    `• Mentored junior team members on engineering best practices, establishing automated quality checks and documentation standards.`,
  ].join('\n');

  res.status(200).json({ success: true, bullets: defaultBullets });
});

/**
 * Helper to build an instant structured fallback resume if AI service is offline
 */
function createSmartFallbackResume(params: {
  targetName: string;
  targetEmail: string;
  targetPhone: string;
  targetLocation: string;
  jobTitle: string;
  experienceLevel: string;
  skills: any;
  template: string;
}) {
  const { targetName, targetEmail, targetPhone, targetLocation, jobTitle, experienceLevel, template } = params;
  const isSenior = experienceLevel === 'senior' || experienceLevel === 'executive';

  const skillSet = [
    { id: 's_1', name: 'TypeScript & JavaScript', level: 'Advanced' as const },
    { id: 's_2', name: 'React & Next.js', level: 'Advanced' as const },
    { id: 's_3', name: 'Node.js & Express', level: 'Advanced' as const },
    { id: 's_4', name: 'System Architecture', level: 'Advanced' as const },
    { id: 's_5', name: 'REST & GraphQL APIs', level: 'Intermediate' as const },
    { id: 's_6', name: 'PostgreSQL & MongoDB', level: 'Advanced' as const },
    { id: 's_7', name: 'Docker & CI/CD Pipelines', level: 'Intermediate' as const },
    { id: 's_8', name: 'Agile & Cross-Team Leadership', level: 'Advanced' as const },
  ];

  return {
    resumeName: `${jobTitle} Resume`,
    selectedTemplate: template || 'modern-blue',
    personalInfo: {
      fullName: targetName,
      jobTitle: jobTitle,
      email: targetEmail,
      phone: targetPhone,
      location: targetLocation,
      linkedIn: `linkedin.com/in/${targetName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      github: `github.com/${targetName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      portfolio: `${targetName.toLowerCase().replace(/[^a-z0-9]/g, '')}.dev`,
      profilePhoto: '',
    },
    summary: `Results-driven and innovative ${jobTitle} with demonstrated track record of architecting scalable applications, leading high-performance delivery, and optimizing system velocity. Adept at bridging technical requirements with executive business objectives to deliver measurable results. Passionate about engineering excellence, clean code standards, and user-centric software design.`,
    experience: [
      {
        id: 'exp_1',
        jobTitle: isSenior ? `Lead ${jobTitle}` : `Senior ${jobTitle}`,
        company: 'Apex Cloud Innovations',
        location: targetLocation,
        startDate: 'Jan 2022',
        endDate: 'Present',
        isCurrent: true,
        description: `• Architected high-availability microservices serving 1.5M+ active users, cutting latency by 42%.\n• Spearheaded migration of core services to containerized infrastructure, saving $85K in annual hosting costs.\n• Mentored a 6-person engineering team, establishing automated testing workflows that raised test coverage to 92%.\n• Collaborated directly with product leadership to scope and execute on high-impact quarterly product milestones.`,
      },
      {
        id: 'exp_2',
        jobTitle: jobTitle,
        company: 'Vanguard Systems',
        location: 'Austin, TX',
        startDate: 'Jul 2019',
        endDate: 'Dec 2021',
        isCurrent: false,
        description: `• Developed responsive web applications and scalable RESTful backend services using modern full-stack frameworks.\n• Optimized database query execution plans, reducing peak load query processing time by 35%.\n• Integrated third-party authentication and payment gateway processing with strict compliance standards.\n• Partnered with UI/UX designers to translate Figma design systems into pixel-perfect accessible components.`,
      },
    ],
    education: [
      {
        id: 'edu_1',
        degree: 'Bachelor of Science in Computer Science',
        institution: 'State University of Technology',
        location: targetLocation,
        startYear: '2015',
        endYear: '2019',
        grade: 'GPA: 3.8 / 4.0 (Dean\'s Honor Roll)',
        description: 'Coursework: Data Structures & Algorithms, Distributed Systems, Database Management, Software Engineering.',
      },
    ],
    skills: skillSet,
    projects: [
      {
        id: 'proj_1',
        title: 'High-Concurrency Analytics Platform',
        description: 'Engineered a real-time metrics analytics dashboard processing over 50,000 telemetry events per second with sub-second visual refresh.',
        technologies: 'React, Node.js, Redis, WebSockets, Tailwind CSS',
        projectUrl: 'https://analytics-demo.io',
        githubUrl: 'https://github.com/candidate/analytics-engine',
      },
      {
        id: 'proj_2',
        title: 'Automated CI/CD Workflow Pipeline',
        description: 'Built an open-source orchestration tool that automates environment provisioning, linting, security audits, and zero-downtime deployment.',
        technologies: 'Docker, GitHub Actions, TypeScript, AWS',
        projectUrl: '',
        githubUrl: 'https://github.com/candidate/deploy-pipeline',
      },
    ],
    certifications: [
      {
        id: 'cert_1',
        name: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services',
        issueDate: '2023',
      },
      {
        id: 'cert_2',
        name: 'Professional Scrum Master (PSM I)',
        issuer: 'Scrum.org',
        issueDate: '2022',
      },
    ],
    achievements: [
      {
        id: 'ach_1',
        title: 'Top Engineering Contributor Award',
        description: 'Recognized among 150+ engineers for spearheading the company-wide core platform performance refactor.',
      },
    ],
    languages: [
      { id: 'lang_1', name: 'English', proficiency: 'Native' as const },
      { id: 'lang_2', name: 'Spanish', proficiency: 'Conversational' as const },
    ],
    hobbies: [
      { id: 'hob_1', name: 'Open Source Mentoring' },
      { id: 'hob_2', name: 'Competitive Coding & Tech Blogging' },
    ],
    isFresher: false,
  };
}

export default router;
