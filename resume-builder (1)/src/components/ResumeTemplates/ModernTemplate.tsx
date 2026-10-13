import React from 'react';
import { ResumeData } from '../../types/resume.ts';

interface TemplateProps {
  data: ResumeData;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ data }) => {
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
    <div className="bg-white text-slate-800 w-full max-w-[210mm] min-h-[297mm] mx-auto shadow-sm print:shadow-none font-sans text-xs leading-normal">
      {/* Top Banner Header */}
      <div className="bg-slate-900 text-white p-8 px-10">
        <div className="flex items-center gap-6">
          {personalInfo.profilePhoto && (
            <img
              src={personalInfo.profilePhoto}
              alt={personalInfo.fullName}
              className="w-24 h-24 rounded-lg object-cover border-2 border-indigo-400 shrink-0 shadow"
            />
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-white uppercase">
              {personalInfo.fullName || 'Your Full Name'}
            </h1>
            {personalInfo.jobTitle && (
              <p className="text-indigo-300 font-medium text-sm mt-0.5 tracking-wide">
                {personalInfo.jobTitle}
              </p>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-300 mt-2.5">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>· {personalInfo.phone}</span>}
              {personalInfo.location && <span>· {personalInfo.location}</span>}
              {personalInfo.linkedIn && <span>· {personalInfo.linkedIn}</span>}
              {personalInfo.github && <span>· {personalInfo.github}</span>}
              {personalInfo.portfolio && <span>· {personalInfo.portfolio}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-12 gap-8 p-8 px-10">
        {/* Left Column (4 cols) */}
        <div className="col-span-4 space-y-6 border-r border-slate-100 pr-4">
          {/* Skills */}
          {skills && skills.length > 0 && (
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 border-b border-indigo-100 pb-1 mb-2.5">
                Skills & Tech
              </h2>
              <div className="space-y-1.5">
                {skills.map((s) => (
                  <div key={s.id} className="flex justify-between items-center text-[11px]">
                    <span className="font-medium text-slate-800">{s.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{s.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 border-b border-indigo-100 pb-1 mb-2.5">
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="text-[11px]">
                    <p className="font-bold text-slate-900">{edu.degree}</p>
                    <p className="text-slate-700">{edu.institution}</p>
                    <p className="text-slate-500 text-[10px]">
                      {edu.startYear} – {edu.endYear || 'Present'}
                    </p>
                    {edu.grade && <p className="text-[10px] text-indigo-600 font-medium">GPA: {edu.grade}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 border-b border-indigo-100 pb-1 mb-2.5">
                Certifications
              </h2>
              <div className="space-y-2 text-[11px]">
                {certifications.map((c) => (
                  <div key={c.id}>
                    <p className="font-semibold text-slate-900">{c.name}</p>
                    <p className="text-[10px] text-slate-600">
                      {c.issuer} {c.issueDate ? `· ${c.issueDate}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 border-b border-indigo-100 pb-1 mb-2.5">
                Languages
              </h2>
              <div className="space-y-1 text-[11px]">
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between">
                    <span className="text-slate-800">{l.name}</span>
                    <span className="text-slate-500 text-[10px]">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hobbies */}
          {hobbies && hobbies.length > 0 && (
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 border-b border-indigo-100 pb-1 mb-2">
                Interests
              </h2>
              <p className="text-[11px] text-slate-600 leading-snug">
                {hobbies.map((h) => h.name).join(' · ')}
              </p>
            </div>
          )}
        </div>

        {/* Right Column (8 cols) */}
        <div className="col-span-8 space-y-6">
          {/* Summary */}
          {summary && (
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 border-b border-indigo-100 pb-1 mb-2">
                Professional Profile
              </h2>
              <p className="text-slate-700 leading-relaxed text-[11.5px]">{summary}</p>
            </div>
          )}

          {/* Experience */}
          {!isFresher && experience && experience.length > 0 && (
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 border-b border-indigo-100 pb-1 mb-3">
                Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative pl-3 border-l-2 border-indigo-200">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-slate-900 text-xs">{exp.jobTitle}</h3>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-[11px] text-indigo-800 font-medium mb-1">
                      {exp.company} {exp.location ? `· ${exp.location}` : ''}
                    </div>
                    {exp.description && (
                      <p className="text-slate-600 text-[11px] leading-relaxed whitespace-pre-line">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 border-b border-indigo-100 pb-1 mb-3">
                Featured Projects
              </h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="relative pl-3 border-l-2 border-slate-200">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-slate-900 text-xs">{proj.title}</h3>
                      {proj.projectUrl && (
                        <span className="text-[10px] text-indigo-600 truncate max-w-[150px]">
                          {proj.projectUrl}
                        </span>
                      )}
                    </div>
                    {proj.technologies && (
                      <p className="text-[10.5px] text-slate-500 font-mono mb-1">
                        Tech: {proj.technologies}
                      </p>
                    )}
                    {proj.description && (
                      <p className="text-slate-600 text-[11px] leading-relaxed">{proj.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {achievements && achievements.length > 0 && (
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 border-b border-indigo-100 pb-1 mb-2">
                Key Achievements
              </h2>
              <div className="space-y-1.5 text-[11px]">
                {achievements.map((ach) => (
                  <div key={ach.id} className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">›</span>
                    <div>
                      <span className="font-semibold text-slate-900">{ach.title}</span>
                      {ach.description && <span className="text-slate-600"> — {ach.description}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
