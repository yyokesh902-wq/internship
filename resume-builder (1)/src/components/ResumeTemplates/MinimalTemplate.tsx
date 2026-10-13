import React from 'react';
import { ResumeData } from '../../types/resume.ts';

interface TemplateProps {
  data: ResumeData;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ data }) => {
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

  return (
    <div className="bg-white text-neutral-800 p-10 sm:p-14 w-full max-w-[210mm] min-h-[297mm] mx-auto shadow-sm print:shadow-none font-sans text-xs leading-relaxed">
      {/* Minimal Header */}
      <div className="flex justify-between items-start border-b border-neutral-200 pb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-neutral-900">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.jobTitle && (
            <p className="text-sm text-neutral-500 font-normal tracking-wide mt-1">
              {personalInfo.jobTitle}
            </p>
          )}
        </div>
        <div className="text-right text-[11px] text-neutral-500 space-y-0.5">
          {personalInfo.email && <p>{personalInfo.email}</p>}
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
          {personalInfo.location && <p>{personalInfo.location}</p>}
          {personalInfo.portfolio && <p className="text-neutral-900">{personalInfo.portfolio}</p>}
          {personalInfo.linkedIn && <p>{personalInfo.linkedIn}</p>}
          {personalInfo.github && <p>{personalInfo.github}</p>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-12 gap-6 py-6 border-b border-neutral-100">
          <div className="col-span-3 text-[11px] uppercase tracking-widest text-neutral-400 font-medium">
            Profile
          </div>
          <div className="col-span-9 text-neutral-700 leading-relaxed text-[12px]">{summary}</div>
        </div>
      )}

      {/* Experience */}
      {!isFresher && experience && experience.length > 0 && (
        <div className="grid grid-cols-12 gap-6 py-6 border-b border-neutral-100">
          <div className="col-span-3 text-[11px] uppercase tracking-widest text-neutral-400 font-medium">
            Experience
          </div>
          <div className="col-span-9 space-y-5">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-neutral-900 text-[12.5px]">{exp.jobTitle}</span>
                  <span className="text-[10.5px] text-neutral-400 font-mono">
                    {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-600 mb-1.5">
                  {exp.company} {exp.location ? `· ${exp.location}` : ''}
                </div>
                {exp.description && (
                  <p className="text-neutral-600 text-[11px] whitespace-pre-line leading-relaxed">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="grid grid-cols-12 gap-6 py-6 border-b border-neutral-100">
          <div className="col-span-3 text-[11px] uppercase tracking-widest text-neutral-400 font-medium">
            Education
          </div>
          <div className="col-span-9 space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-neutral-900 text-[12px]">{edu.degree}</span>
                  <span className="text-[10.5px] text-neutral-400 font-mono">
                    {edu.startYear} – {edu.endYear || 'Present'}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-600">
                  {edu.institution} {edu.university ? `(${edu.university})` : ''}
                </div>
                {edu.grade && <p className="text-[10.5px] text-neutral-500 mt-0.5">GPA: {edu.grade}</p>}
                {edu.description && <p className="text-[11px] text-neutral-500 mt-1">{edu.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="grid grid-cols-12 gap-6 py-6 border-b border-neutral-100">
          <div className="col-span-3 text-[11px] uppercase tracking-widest text-neutral-400 font-medium">
            Projects
          </div>
          <div className="col-span-9 space-y-4">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-neutral-900 text-[12px]">{proj.title}</span>
                  {proj.projectUrl && (
                    <span className="text-[10.5px] text-neutral-500">{proj.projectUrl}</span>
                  )}
                </div>
                {proj.technologies && (
                  <p className="text-[10.5px] text-neutral-500 font-mono mb-1">{proj.technologies}</p>
                )}
                {proj.description && (
                  <p className="text-neutral-600 text-[11px] leading-relaxed">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="grid grid-cols-12 gap-6 py-6 border-b border-neutral-100">
          <div className="col-span-3 text-[11px] uppercase tracking-widest text-neutral-400 font-medium">
            Expertise
          </div>
          <div className="col-span-9">
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[11.5px] text-neutral-700">
              {skills.map((s, idx) => (
                <span key={s.id}>
                  {s.name}
                  {idx < skills.length - 1 && <span className="text-neutral-300 ml-3">/</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Certifications & Achievements */}
      {((certifications && certifications.length > 0) || (achievements && achievements.length > 0)) && (
        <div className="grid grid-cols-12 gap-6 py-6 border-b border-neutral-100">
          <div className="col-span-3 text-[11px] uppercase tracking-widest text-neutral-400 font-medium">
            Honors
          </div>
          <div className="col-span-9 space-y-3">
            {certifications &&
              certifications.map((c) => (
                <div key={c.id} className="flex justify-between text-[11px]">
                  <span>
                    <strong className="text-neutral-900 font-medium">{c.name}</strong> · {c.issuer}
                  </span>
                  {c.issueDate && <span className="text-neutral-400 font-mono">{c.issueDate}</span>}
                </div>
              ))}
            {achievements &&
              achievements.map((a) => (
                <div key={a.id} className="text-[11px]">
                  <strong className="text-neutral-900 font-medium">{a.title}</strong>
                  {a.description && <span className="text-neutral-600"> — {a.description}</span>}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Languages & Hobbies */}
      {((languages && languages.length > 0) || (hobbies && hobbies.length > 0)) && (
        <div className="grid grid-cols-12 gap-6 pt-6">
          <div className="col-span-3 text-[11px] uppercase tracking-widest text-neutral-400 font-medium">
            Personal
          </div>
          <div className="col-span-9 grid grid-cols-2 gap-4 text-[11px] text-neutral-600">
            {languages && languages.length > 0 && (
              <div>
                <span className="font-medium text-neutral-800">Languages: </span>
                {languages.map((l) => `${l.name} (${l.proficiency})`).join(', ')}
              </div>
            )}
            {hobbies && hobbies.length > 0 && (
              <div>
                <span className="font-medium text-neutral-800">Interests: </span>
                {hobbies.map((h) => h.name).join(', ')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
