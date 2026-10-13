import React from 'react';
import { ResumeData } from '../../types/resume.ts';
import { getTemplateById, TemplateDefinition } from '../../data/templatesData.ts';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  ExternalLink,
  Award,
  Terminal,
  Calendar,
} from 'lucide-react';

interface UniversalTemplateRendererProps {
  data: ResumeData;
  templateOverride?: string;
  containerId?: string;
  className?: string;
}

export const UniversalTemplateRenderer: React.FC<UniversalTemplateRendererProps> = ({
  data,
  templateOverride,
  containerId = 'resume-printable-area',
  className = '',
}) => {
  const templateId = templateOverride || data.selectedTemplate || 'classic-black';
  const templateDef: TemplateDefinition = getTemplateById(templateId);

  const {
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
  } = data;

  // Font family utility
  const getFontClass = () => {
    switch (templateDef.fontTheme) {
      case 'serif':
        return 'font-serif';
      case 'mono':
        return 'font-mono';
      case 'editorial':
        return 'font-serif';
      case 'sans':
      default:
        return 'font-sans';
    }
  };

  // Heading decorator
  const renderSectionHeader = (title: string) => {
    switch (templateDef.headingDecoration) {
      case 'left-bar':
        return (
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-1.5 h-4.5 rounded-xs shrink-0"
              style={{ backgroundColor: templateDef.colors.primary }}
            />
            <h2
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: templateDef.colors.primary }}
            >
              {title}
            </h2>
          </div>
        );
      case 'pill':
        return (
          <div className="mb-3">
            <span
              className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider text-white"
              style={{ backgroundColor: templateDef.colors.primary }}
            >
              {title}
            </span>
          </div>
        );
      case 'double-line':
        return (
          <div className="mb-3 border-y-2 py-1 text-center" style={{ borderColor: templateDef.colors.primary }}>
            <h2
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: templateDef.colors.primary }}
            >
              {title}
            </h2>
          </div>
        );
      case 'boxed':
        return (
          <div
            className="mb-3 px-2 py-1 border rounded text-center"
            style={{
              borderColor: templateDef.colors.primary,
              backgroundColor: `${templateDef.colors.primary}0D`,
            }}
          >
            <h2
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: templateDef.colors.primary }}
            >
              {title}
            </h2>
          </div>
        );
      case 'brackets':
        return (
          <div className="mb-3 flex items-center gap-1 font-mono">
            <span style={{ color: templateDef.colors.accent }}>[</span>
            <h2
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: templateDef.colors.primary }}
            >
              {title}
            </h2>
            <span style={{ color: templateDef.colors.accent }}>]</span>
          </div>
        );
      case 'none':
        return (
          <h2
            className="text-xs font-medium uppercase tracking-widest mb-2"
            style={{ color: templateDef.colors.secondary }}
          >
            {title}
          </h2>
        );
      case 'bottom-line':
      default:
        return (
          <div className="mb-3 border-b pb-1" style={{ borderColor: `${templateDef.colors.primary}40` }}>
            <h2
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: templateDef.colors.primary }}
            >
              {title}
            </h2>
          </div>
        );
    }
  };

  // Skills renderer
  const renderSkills = () => {
    if (!skills || skills.length === 0) return null;

    switch (templateDef.skillStyle) {
      case 'bars':
        return (
          <div className="space-y-2">
            {skills.map((s) => {
              const pct = s.level === 'Advanced' ? '95%' : s.level === 'Intermediate' ? '70%' : '45%';
              return (
                <div key={s.id} className="text-xs">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-medium text-slate-800">{s.name}</span>
                    <span className="text-[10px] text-slate-500">{s.level}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: pct, backgroundColor: templateDef.colors.accent }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'dots':
        return (
          <div className="space-y-1.5">
            {skills.map((s) => {
              const dotsCount = s.level === 'Advanced' ? 5 : s.level === 'Intermediate' ? 3 : 2;
              return (
                <div key={s.id} className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-800">{s.name}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((d) => (
                      <span
                        key={d}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor:
                            d <= dotsCount ? templateDef.colors.primary : '#e2e8f0',
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'chips':
        return (
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span
                key={s.id}
                className="px-2.5 py-1 rounded-md text-[11px] font-medium border"
                style={{
                  backgroundColor: `${templateDef.colors.primary}0D`,
                  borderColor: `${templateDef.colors.primary}30`,
                  color: templateDef.colors.primary,
                }}
              >
                {s.name} <span className="opacity-60 text-[9.5px]">({s.level})</span>
              </span>
            ))}
          </div>
        );

      case 'badges':
        return (
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span
                key={s.id}
                className="px-2 py-0.5 rounded text-[10.5px] font-mono border"
                style={{
                  borderColor: templateDef.colors.primary,
                  color: templateDef.colors.primary,
                }}
              >
                {s.name}
              </span>
            ))}
          </div>
        );

      case 'matrix':
        return (
          <div className="grid grid-cols-2 gap-2 text-xs">
            {skills.map((s) => (
              <div
                key={s.id}
                className="p-1.5 rounded bg-slate-50 border border-slate-200 flex justify-between items-center"
              >
                <span className="font-medium text-slate-800">{s.name}</span>
                <span
                  className="text-[10px] px-1 rounded font-mono"
                  style={{
                    backgroundColor: `${templateDef.colors.primary}15`,
                    color: templateDef.colors.primary,
                  }}
                >
                  {s.level}
                </span>
              </div>
            ))}
          </div>
        );

      case 'inline-bullets':
      default:
        return (
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-slate-700">
            {skills.map((s, idx) => (
              <span key={s.id}>
                <span className="font-medium text-slate-900">{s.name}</span>{' '}
                <span className="text-slate-500">({s.level})</span>
                {idx < skills.length - 1 && <span className="text-slate-400 ml-2">·</span>}
              </span>
            ))}
          </div>
        );
    }
  };

  // Summary section
  const renderSummaryBlock = () => {
    if (!summary) return null;
    return (
      <section className="space-y-1">
        {renderSectionHeader('Professional Summary')}
        <p className="text-slate-700 text-xs leading-relaxed text-justify">{summary}</p>
      </section>
    );
  };

  // Experience section
  const renderExperienceBlock = () => {
    if (isFresher || !experience || experience.length === 0) return null;
    return (
      <section className="space-y-3">
        {renderSectionHeader('Work Experience')}
        <div className="space-y-3.5">
          {experience.map((exp) => (
            <div key={exp.id} className="space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-slate-900 text-xs">{exp.jobTitle}</span>
                <span className="text-[10.5px] text-slate-500 font-mono">
                  {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="flex justify-between text-[11px]" style={{ color: templateDef.colors.primary }}>
                <span className="font-semibold">{exp.company}</span>
                {exp.location && <span className="text-slate-500 italic">{exp.location}</span>}
              </div>
              {exp.description && (
                <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-line">
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Education section
  const renderEducationBlock = () => {
    if (!education || education.length === 0) return null;
    return (
      <section className="space-y-3">
        {renderSectionHeader('Education')}
        <div className="space-y-3">
          {education.map((edu) => (
            <div key={edu.id} className="space-y-0.5">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-slate-900 text-xs">{edu.degree}</span>
                <span className="text-[10.5px] text-slate-500 font-mono">
                  {edu.startYear} – {edu.endYear || 'Present'}
                </span>
              </div>
              <div className="text-[11px] font-medium" style={{ color: templateDef.colors.primary }}>
                {edu.institution} {edu.university ? `(${edu.university})` : ''}
              </div>
              <div className="flex justify-between text-[10.5px] text-slate-500">
                {edu.location && <span>{edu.location}</span>}
                {edu.grade && (
                  <span className="font-semibold" style={{ color: templateDef.colors.accent }}>
                    GPA/Score: {edu.grade}
                  </span>
                )}
              </div>
              {edu.description && (
                <p className="text-slate-600 text-[11px] mt-1">{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Projects section
  const renderProjectsBlock = () => {
    if (!projects || projects.length === 0) return null;
    return (
      <section className="space-y-3">
        {renderSectionHeader('Key Projects')}
        <div className="space-y-3">
          {projects.map((proj) => (
            <div key={proj.id} className="space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-slate-900 text-xs">{proj.title}</span>
                <div className="flex gap-2 text-[10px]" style={{ color: templateDef.colors.accent }}>
                  {proj.projectUrl && <span>Demo: {proj.projectUrl}</span>}
                  {proj.githubUrl && <span>Code: {proj.githubUrl}</span>}
                </div>
              </div>
              {proj.technologies && (
                <p className="text-[10.5px] text-slate-500 font-mono">
                  Stack: {proj.technologies}
                </p>
              )}
              {proj.description && (
                <p className="text-slate-700 text-xs leading-relaxed">{proj.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Certifications section
  const renderCertificationsBlock = () => {
    if (!certifications || certifications.length === 0) return null;
    return (
      <section className="space-y-2">
        {renderSectionHeader('Certifications')}
        <div className="space-y-1.5 text-xs">
          {certifications.map((c) => (
            <div key={c.id} className="flex justify-between items-baseline">
              <span className="font-semibold text-slate-900">
                {c.name} <span className="text-slate-500 font-normal">· {c.issuer}</span>
              </span>
              {c.issueDate && <span className="text-[10px] text-slate-500 font-mono">{c.issueDate}</span>}
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Achievements section
  const renderAchievementsBlock = () => {
    if (!achievements || achievements.length === 0) return null;
    return (
      <section className="space-y-2">
        {renderSectionHeader('Achievements & Awards')}
        <div className="space-y-1.5 text-xs">
          {achievements.map((a) => (
            <div key={a.id} className="flex items-start gap-1.5">
              <span className="font-bold text-xs" style={{ color: templateDef.colors.accent }}>
                ★
              </span>
              <div>
                <span className="font-semibold text-slate-900">{a.title}</span>
                {a.description && <span className="text-slate-600"> — {a.description}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Languages & Hobbies
  const renderLanguagesAndHobbies = () => {
    const hasLang = languages && languages.length > 0;
    const hasHob = hobbies && hobbies.length > 0;
    if (!hasLang && !hasHob) return null;

    return (
      <section className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-4 text-xs">
        {hasLang && (
          <div>
            <h3 className="font-bold uppercase tracking-wider text-[10.5px] text-slate-900 mb-1">
              Languages
            </h3>
            <p className="text-slate-700">
              {languages.map((l) => `${l.name} (${l.proficiency})`).join(' · ')}
            </p>
          </div>
        )}
        {hasHob && (
          <div>
            <h3 className="font-bold uppercase tracking-wider text-[10.5px] text-slate-900 mb-1">
              Interests
            </h3>
            <p className="text-slate-700">{hobbies.map((h) => h.name).join(' · ')}</p>
          </div>
        )}
      </section>
    );
  };

  // Prioritize sections based on template category
  const renderOrderedMainSections = () => {
    if (templateDef.sectionPriority === 'education-first') {
      return (
        <>
          {renderSummaryBlock()}
          {renderEducationBlock()}
          {renderProjectsBlock()}
          {renderExperienceBlock()}
          <section className="space-y-2">
            {renderSectionHeader('Skills & Proficiencies')}
            {renderSkills()}
          </section>
          {renderAchievementsBlock()}
          {renderCertificationsBlock()}
          {renderLanguagesAndHobbies()}
        </>
      );
    }

    if (templateDef.sectionPriority === 'projects-first') {
      return (
        <>
          {renderSummaryBlock()}
          <section className="space-y-2">
            {renderSectionHeader('Technical Skills')}
            {renderSkills()}
          </section>
          {renderProjectsBlock()}
          {renderExperienceBlock()}
          {renderEducationBlock()}
          {renderAchievementsBlock()}
          {renderCertificationsBlock()}
          {renderLanguagesAndHobbies()}
        </>
      );
    }

    if (templateDef.sectionPriority === 'skills-first') {
      return (
        <>
          {renderSummaryBlock()}
          <section className="space-y-2">
            {renderSectionHeader('Core Competencies & Skills')}
            {renderSkills()}
          </section>
          {renderExperienceBlock()}
          {renderProjectsBlock()}
          {renderEducationBlock()}
          {renderCertificationsBlock()}
          {renderAchievementsBlock()}
          {renderLanguagesAndHobbies()}
        </>
      );
    }

    // Standard ordering
    return (
      <>
        {renderSummaryBlock()}
        {renderExperienceBlock()}
        {renderEducationBlock()}
        {renderProjectsBlock()}
        <section className="space-y-2">
          {renderSectionHeader('Skills & Competencies')}
          {renderSkills()}
        </section>
        {renderCertificationsBlock()}
        {renderAchievementsBlock()}
        {renderLanguagesAndHobbies()}
      </>
    );
  };

  // Profile Photo helper
  const renderPhoto = () => {
    if (templateDef.photoPlacement === 'none' || !personalInfo.profilePhoto) return null;

    const roundClass =
      templateDef.photoPlacement === 'square-border' ? 'rounded-lg' : 'rounded-full';

    return (
      <img
        src={personalInfo.profilePhoto}
        alt={personalInfo.fullName}
        className={`w-20 h-20 object-cover ${roundClass} border-2 shadow-xs shrink-0`}
        style={{ borderColor: templateDef.colors.accent }}
      />
    );
  };

  // Contact items row
  const renderContactRow = () => {
    const items = [
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
      personalInfo.linkedIn,
      personalInfo.github,
      personalInfo.portfolio,
    ].filter(Boolean);

    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
        {items.map((it, idx) => (
          <React.Fragment key={idx}>
            <span>{it}</span>
            {idx < items.length - 1 && <span className="text-slate-300">·</span>}
          </React.Fragment>
        ))}
      </div>
    );
  };

  /* -------------------------------------------------------------
     LAYOUT ARCHETYPE 1: SIDEBAR LEFT (DARK or LIGHT)
  -------------------------------------------------------------- */
  if (templateDef.layout === 'sidebar-left-dark' || templateDef.layout === 'sidebar-left-light') {
    const isDark = templateDef.layout === 'sidebar-left-dark';
    const sidebarBg = templateDef.colors.sidebarBg || (isDark ? '#0f172a' : '#f8fafc');
    const sidebarTextColor = templateDef.colors.sidebarText || (isDark ? '#f8fafc' : '#334155');

    return (
      <div
        id={containerId}
        className={`bg-white shadow-xl rounded-sm print:shadow-none print:m-0 print:p-0 flex w-full max-w-[210mm] min-h-[297mm] mx-auto text-xs ${getFontClass()} ${className}`}
      >
        {/* Left Sidebar (33% width) */}
        <div
          className="w-[33%] p-7 space-y-6 shrink-0 flex flex-col justify-between"
          style={{ backgroundColor: sidebarBg, color: sidebarTextColor }}
        >
          <div className="space-y-6">
            {/* Sidebar Photo & Name */}
            <div className="space-y-3">
              {personalInfo.profilePhoto && (
                <div className="flex justify-center">
                  <img
                    src={personalInfo.profilePhoto}
                    alt={personalInfo.fullName}
                    className="w-24 h-24 rounded-2xl object-cover border-2 shadow"
                    style={{ borderColor: templateDef.colors.accent }}
                  />
                </div>
              )}
              <div className="text-center">
                <h1 className="text-xl font-bold uppercase tracking-tight">
                  {personalInfo.fullName || 'Your Name'}
                </h1>
                {personalInfo.jobTitle && (
                  <p
                    className="text-xs font-medium mt-1"
                    style={{ color: templateDef.colors.accent }}
                  >
                    {personalInfo.jobTitle}
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar Contact Info */}
            <div className="space-y-2 text-[11px] border-t border-b py-3 border-slate-700/30">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-70">Contact</h3>
              {personalInfo.email && <div className="truncate">{personalInfo.email}</div>}
              {personalInfo.phone && <div>{personalInfo.phone}</div>}
              {personalInfo.location && <div>{personalInfo.location}</div>}
              {personalInfo.linkedIn && <div className="truncate">{personalInfo.linkedIn}</div>}
              {personalInfo.github && <div className="truncate">{personalInfo.github}</div>}
              {personalInfo.portfolio && <div className="truncate">{personalInfo.portfolio}</div>}
            </div>

            {/* Sidebar Skills */}
            {skills && skills.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                  Skills & Tools
                </h3>
                {renderSkills()}
              </div>
            )}

            {/* Sidebar Education if standard order */}
            {templateDef.sectionPriority !== 'education-first' && education && education.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-70">Education</h3>
                <div className="space-y-2 text-[11px]">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <p className="font-semibold">{edu.degree}</p>
                      <p className="opacity-80 text-[10px]">{edu.institution}</p>
                      <p className="opacity-60 text-[9.5px]">
                        {edu.startYear} – {edu.endYear || 'Present'}
                      </p>
                      {edu.grade && <p className="text-[10px] font-mono">GPA: {edu.grade}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sidebar Languages */}
            {languages && languages.length > 0 && (
              <div className="space-y-1 text-[11px]">
                <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-70">Languages</h3>
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between">
                    <span>{l.name}</span>
                    <span className="opacity-70 text-[10px]">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {hobbies && hobbies.length > 0 && (
            <div className="text-[10px] opacity-70 pt-3 border-t border-slate-700/30">
              Interests: {hobbies.map((h) => h.name).join(' · ')}
            </div>
          )}
        </div>

        {/* Right Main Content Area */}
        <div className="flex-1 p-8 space-y-6">
          {renderSummaryBlock()}
          {renderExperienceBlock()}
          {templateDef.sectionPriority === 'education-first' && renderEducationBlock()}
          {renderProjectsBlock()}
          {renderAchievementsBlock()}
          {renderCertificationsBlock()}
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     LAYOUT ARCHETYPE 2: TOP BANNER BOLD
  -------------------------------------------------------------- */
  if (templateDef.layout === 'top-banner-bold') {
    const bannerBg = templateDef.colors.headerBg || templateDef.colors.primary;
    return (
      <div
        id={containerId}
        className={`bg-white shadow-xl rounded-sm print:shadow-none print:m-0 print:p-0 w-full max-w-[210mm] min-h-[297mm] mx-auto text-xs ${getFontClass()} ${className}`}
      >
        {/* Bold Full-Width Top Header */}
        <div className="p-8 px-10 text-white" style={{ backgroundColor: bannerBg }}>
          <div className="flex items-center justify-between gap-6">
            <div className="space-y-1 flex-1">
              <h1 className="text-3xl font-extrabold uppercase tracking-tight">
                {personalInfo.fullName || 'Your Name'}
              </h1>
              {personalInfo.jobTitle && (
                <p className="text-sm font-semibold opacity-90" style={{ color: templateDef.colors.accent }}>
                  {personalInfo.jobTitle}
                </p>
              )}
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] opacity-80 pt-2">
                {personalInfo.email && <span>{personalInfo.email}</span>}
                {personalInfo.phone && <span>· {personalInfo.phone}</span>}
                {personalInfo.location && <span>· {personalInfo.location}</span>}
                {personalInfo.linkedIn && <span>· {personalInfo.linkedIn}</span>}
                {personalInfo.github && <span>· {personalInfo.github}</span>}
              </div>
            </div>
            {personalInfo.profilePhoto && renderPhoto()}
          </div>
        </div>

        {/* Body 2-Column Content */}
        <div className="p-8 px-10 grid grid-cols-12 gap-8">
          <div className="col-span-8 space-y-6">
            {renderSummaryBlock()}
            {renderExperienceBlock()}
            {renderProjectsBlock()}
          </div>
          <div className="col-span-4 space-y-6 border-l pl-6 border-slate-100">
            <section className="space-y-2">
              {renderSectionHeader('Key Skills')}
              {renderSkills()}
            </section>
            {renderEducationBlock()}
            {renderCertificationsBlock()}
            {renderAchievementsBlock()}
            {renderLanguagesAndHobbies()}
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     LAYOUT ARCHETYPE 3: MINIMAL RAIL
  -------------------------------------------------------------- */
  if (templateDef.layout === 'minimal-rail') {
    return (
      <div
        id={containerId}
        className={`bg-white text-slate-800 p-10 sm:p-14 w-full max-w-[210mm] min-h-[297mm] mx-auto shadow-xl rounded-sm print:shadow-none print:m-0 print:p-0 text-xs ${getFontClass()} ${className}`}
      >
        {/* Minimal Header */}
        <div className="flex justify-between items-start border-b pb-6 mb-6" style={{ borderColor: `${templateDef.colors.primary}30` }}>
          <div>
            <h1 className="text-3xl font-light tracking-tight text-slate-950">
              {personalInfo.fullName || 'Your Name'}
            </h1>
            {personalInfo.jobTitle && (
              <p className="text-sm font-normal text-slate-500 mt-1">
                {personalInfo.jobTitle}
              </p>
            )}
          </div>
          <div className="text-right text-[11px] text-slate-500 space-y-0.5">
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.location && <p>{personalInfo.location}</p>}
            {personalInfo.linkedIn && <p>{personalInfo.linkedIn}</p>}
          </div>
        </div>

        {/* Rail Layout: 3 cols label, 9 cols content */}
        <div className="space-y-6">
          {summary && (
            <div className="grid grid-cols-12 gap-6 py-2 border-b border-slate-100">
              <div className="col-span-3 text-[10.5px] uppercase tracking-widest font-semibold text-slate-400">
                PROFILE
              </div>
              <div className="col-span-9 text-slate-700 leading-relaxed text-justify">{summary}</div>
            </div>
          )}

          {!isFresher && experience && experience.length > 0 && (
            <div className="grid grid-cols-12 gap-6 py-2 border-b border-slate-100">
              <div className="col-span-3 text-[10.5px] uppercase tracking-widest font-semibold text-slate-400">
                EXPERIENCE
              </div>
              <div className="col-span-9 space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold text-slate-900">{exp.jobTitle}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 mb-1">{exp.company}</div>
                    {exp.description && (
                      <p className="text-slate-600 leading-relaxed whitespace-pre-line text-xs">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {education && education.length > 0 && (
            <div className="grid grid-cols-12 gap-6 py-2 border-b border-slate-100">
              <div className="col-span-3 text-[10.5px] uppercase tracking-widest font-semibold text-slate-400">
                EDUCATION
              </div>
              <div className="col-span-9 space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold text-slate-900">{edu.degree}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {edu.startYear} – {edu.endYear || 'Present'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600">{edu.institution}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {skills && skills.length > 0 && (
            <div className="grid grid-cols-12 gap-6 py-2 border-b border-slate-100">
              <div className="col-span-3 text-[10.5px] uppercase tracking-widest font-semibold text-slate-400">
                SKILLS
              </div>
              <div className="col-span-9">{renderSkills()}</div>
            </div>
          )}

          {projects && projects.length > 0 && (
            <div className="grid grid-cols-12 gap-6 py-2 border-b border-slate-100">
              <div className="col-span-3 text-[10.5px] uppercase tracking-widest font-semibold text-slate-400">
                PROJECTS
              </div>
              <div className="col-span-9 space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold text-slate-900">{proj.title}</span>
                      <span className="text-[10px] text-slate-400">{proj.projectUrl}</span>
                    </div>
                    {proj.description && <p className="text-slate-600 text-xs mt-0.5">{proj.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {renderLanguagesAndHobbies()}
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     LAYOUT ARCHETYPE 4: DEVELOPER TERMINAL
  -------------------------------------------------------------- */
  if (templateDef.layout === 'developer-terminal') {
    return (
      <div
        id={containerId}
        className={`bg-white text-slate-900 p-8 sm:p-10 w-full max-w-[210mm] min-h-[297mm] mx-auto shadow-xl rounded-sm print:shadow-none print:m-0 print:p-0 text-xs font-mono ${className}`}
      >
        {/* Terminal Header Prompt */}
        <div className="bg-slate-950 text-slate-200 p-4 rounded-lg mb-6 border border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 pb-2 border-b border-slate-800 text-[10px] text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span className="ml-2">bash — 80x24</span>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-emerald-400 text-xs">
                root@developer:~$ whoami
              </p>
              <h1 className="text-xl font-bold text-white uppercase mt-0.5">
                {personalInfo.fullName || 'developer'}
              </h1>
              {personalInfo.jobTitle && (
                <p className="text-cyan-400 text-xs mt-0.5">
                  &gt; {personalInfo.jobTitle}
                </p>
              )}
            </div>
            {personalInfo.profilePhoto && (
              <img
                src={personalInfo.profilePhoto}
                alt={personalInfo.fullName}
                className="w-16 h-16 rounded-md object-cover border border-emerald-400"
              />
            )}
          </div>
          <div className="text-[10px] text-slate-400 flex flex-wrap gap-x-3 gap-y-0.5 pt-1">
            {personalInfo.email && <span>email: {personalInfo.email}</span>}
            {personalInfo.github && <span>github: {personalInfo.github}</span>}
            {personalInfo.location && <span>loc: {personalInfo.location}</span>}
          </div>
        </div>

        {/* Content sections */}
        <div className="space-y-6">
          {summary && (
            <div>
              <div className="text-emerald-700 font-bold mb-1">// BIO & SUMMARY</div>
              <p className="text-slate-800 leading-relaxed pl-3 border-l-2 border-slate-300">
                {summary}
              </p>
            </div>
          )}

          {skills && skills.length > 0 && (
            <div>
              <div className="text-emerald-700 font-bold mb-2">// TECH STACK & TOOLS</div>
              {renderSkills()}
            </div>
          )}

          {projects && projects.length > 0 && (
            <div>
              <div className="text-emerald-700 font-bold mb-2">// FEATURED REPOSITORIES</div>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <div className="flex justify-between items-baseline font-bold text-slate-900">
                      <span>./{proj.title.toLowerCase().replace(/\s+/g, '-')}</span>
                      {proj.githubUrl && (
                        <span className="text-emerald-600 text-[10px]">{proj.githubUrl}</span>
                      )}
                    </div>
                    {proj.technologies && (
                      <p className="text-[10.5px] text-slate-500 mt-0.5">
                        deps: [{proj.technologies}]
                      </p>
                    )}
                    {proj.description && (
                      <p className="text-slate-700 text-xs mt-1 leading-relaxed">{proj.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isFresher && experience && experience.length > 0 && (
            <div>
              <div className="text-emerald-700 font-bold mb-2">// EMPLOYMENT LOGS</div>
              <div className="space-y-3">
                {experience.map((exp) => (
                  <div key={exp.id} className="pl-3 border-l-2 border-emerald-500">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{exp.jobTitle} @ {exp.company}</span>
                      <span className="text-[10px] text-slate-500">
                        {exp.startDate} - {exp.isCurrent ? 'now' : exp.endDate}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-slate-700 text-xs mt-1 whitespace-pre-line leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {education && education.length > 0 && (
            <div>
              <div className="text-emerald-700 font-bold mb-1">// CREDENTIALS</div>
              <div className="space-y-1.5">
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between text-xs">
                    <span>
                      <strong>{edu.degree}</strong>, {edu.institution}
                    </span>
                    <span className="text-slate-500 font-mono">
                      {edu.startYear}-{edu.endYear || 'present'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     LAYOUT ARCHETYPE 5: DEFAULT / TWO-COLUMN / SINGLE-COLUMN
  -------------------------------------------------------------- */
  return (
    <div
      id={containerId}
      className={`bg-white text-slate-900 p-8 sm:p-11 w-full max-w-[210mm] min-h-[297mm] mx-auto shadow-xl rounded-sm print:shadow-none print:m-0 print:p-0 text-xs ${getFontClass()} ${className}`}
    >
      {/* Header with customization based on archetype */}
      <div
        className={`pb-5 mb-5 border-b-2 ${
          templateDef.layout === 'single-col-centered' ? 'text-center' : 'text-left'
        }`}
        style={{ borderColor: templateDef.colors.primary }}
      >
        <div
          className={`flex items-center gap-5 ${
            templateDef.layout === 'single-col-centered'
              ? 'justify-center flex-col'
              : 'justify-between flex-row'
          }`}
        >
          <div className="space-y-1">
            <h1
              className="text-3xl font-extrabold uppercase tracking-tight"
              style={{ color: templateDef.colors.primary }}
            >
              {personalInfo.fullName || 'Your Full Name'}
            </h1>
            {personalInfo.jobTitle && (
              <p
                className="text-sm font-semibold tracking-wide"
                style={{ color: templateDef.colors.secondary }}
              >
                {personalInfo.jobTitle}
              </p>
            )}
            <div className="pt-2">{renderContactRow()}</div>
          </div>
          {renderPhoto()}
        </div>
      </div>

      {/* Main Body */}
      {templateDef.layout === 'two-col-equal' ? (
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-7 space-y-6">
            {renderSummaryBlock()}
            {renderExperienceBlock()}
            {renderProjectsBlock()}
          </div>
          <div className="col-span-5 space-y-6 border-l pl-6 border-slate-100">
            <section className="space-y-2">
              {renderSectionHeader('Core Skills')}
              {renderSkills()}
            </section>
            {renderEducationBlock()}
            {renderCertificationsBlock()}
            {renderAchievementsBlock()}
            {renderLanguagesAndHobbies()}
          </div>
        </div>
      ) : (
        <div className="space-y-6">{renderOrderedMainSections()}</div>
      )}
    </div>
  );
};
