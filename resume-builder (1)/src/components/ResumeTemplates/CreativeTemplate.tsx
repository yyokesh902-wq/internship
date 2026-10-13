import React from 'react';
import { ResumeData } from '../../types/resume.ts';

interface TemplateProps {
  data: ResumeData;
}

export const CreativeTemplate: React.FC<TemplateProps> = ({ data }) => {
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
    <div className="bg-white text-slate-800 w-full max-w-[210mm] min-h-[297mm] mx-auto shadow-sm print:shadow-none font-sans text-xs flex">
      {/* Left Accent Sidebar (32% width) */}
      <div className="w-[34%] bg-slate-900 text-slate-200 p-7 px-8 space-y-6 shrink-0 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Avatar & Name */}
          <div className="text-center pb-4 border-b border-slate-800">
            {personalInfo.profilePhoto && (
              <div className="mb-4 flex justify-center">
                <img
                  src={personalInfo.profilePhoto}
                  alt={personalInfo.fullName}
                  className="w-28 h-28 rounded-2xl object-cover ring-2 ring-emerald-400 shadow-md"
                />
              </div>
            )}
            <h1 className="text-xl font-bold tracking-tight text-white uppercase">
              {personalInfo.fullName || 'Your Name'}
            </h1>
            {personalInfo.jobTitle && (
              <p className="text-emerald-400 font-medium text-xs mt-1">{personalInfo.jobTitle}</p>
            )}
          </div>

          {/* Contact Details */}
          <div className="space-y-2 text-[11px]">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Contact</h2>
            {personalInfo.email && <div className="truncate text-slate-300">{personalInfo.email}</div>}
            {personalInfo.phone && <div className="text-slate-300">{personalInfo.phone}</div>}
            {personalInfo.location && <div className="text-slate-300">{personalInfo.location}</div>}
            {personalInfo.linkedIn && <div className="truncate text-slate-300">{personalInfo.linkedIn}</div>}
            {personalInfo.github && <div className="truncate text-slate-300">{personalInfo.github}</div>}
            {personalInfo.portfolio && <div className="truncate text-slate-300">{personalInfo.portfolio}</div>}
          </div>

          {/* Technical Skills */}
          {skills && skills.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Core Skills</h2>
              <div className="space-y-1.5">
                {skills.map((s) => (
                  <div key={s.id} className="text-[11px]">
                    <div className="flex justify-between text-slate-300 mb-0.5">
                      <span>{s.name}</span>
                      <span className="text-[9px] text-slate-400">{s.level}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full rounded-full"
                        style={{
                          width: s.level === 'Advanced' ? '100%' : s.level === 'Intermediate' ? '70%' : '40%',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education in sidebar */}
          {education && education.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Education</h2>
              <div className="space-y-2.5">
                {education.map((edu) => (
                  <div key={edu.id} className="text-[11px]">
                    <p className="font-semibold text-white">{edu.degree}</p>
                    <p className="text-slate-300 text-[10.5px]">{edu.institution}</p>
                    <p className="text-slate-400 text-[9.5px]">
                      {edu.startYear} – {edu.endYear || 'Present'}
                    </p>
                    {edu.grade && <p className="text-[10px] text-emerald-400">Grade: {edu.grade}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div className="space-y-1.5">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Languages</h2>
              <div className="space-y-1 text-[11px] text-slate-300">
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between">
                    <span>{l.name}</span>
                    <span className="text-slate-400 text-[10px]">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Hobbies at bottom of sidebar */}
        {hobbies && hobbies.length > 0 && (
          <div className="pt-4 border-t border-slate-800 text-[10.5px] text-slate-400">
            <span className="text-white font-medium">Interests: </span>
            {hobbies.map((h) => h.name).join(' · ')}
          </div>
        )}
      </div>

      {/* Main Content Area (66% width) */}
      <div className="flex-1 p-8 px-9 space-y-6">
        {/* Profile / Summary */}
        {summary && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Professional Bio
              </h2>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11.5px] pl-4 border-l-2 border-slate-100">
              {summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {!isFresher && experience && experience.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Career Experience
              </h2>
            </div>
            <div className="space-y-4 pl-4 border-l-2 border-slate-100">
              {experience.map((exp) => (
                <div key={exp.id} className="relative">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900 text-xs">{exp.jobTitle}</h3>
                    <span className="text-[10px] font-mono text-emerald-700 font-medium">
                      {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 mb-1">
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
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Selected Works & Projects
              </h2>
            </div>
            <div className="space-y-3.5 pl-4 border-l-2 border-slate-100">
              {projects.map((proj) => (
                <div key={proj.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200/70">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900 text-xs">{proj.title}</h3>
                    <div className="space-x-2 text-[10px]">
                      {proj.projectUrl && (
                        <span className="text-emerald-600 hover:underline">{proj.projectUrl}</span>
                      )}
                      {proj.githubUrl && <span className="text-slate-500">Code</span>}
                    </div>
                  </div>
                  {proj.technologies && (
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5 mb-1">
                      {proj.technologies}
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
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Recognitions & Awards
              </h2>
            </div>
            <div className="space-y-1.5 pl-4 border-l-2 border-slate-100 text-[11px]">
              {achievements.map((ach) => (
                <div key={ach.id} className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">★</span>
                  <div>
                    <span className="font-semibold text-slate-900">{ach.title}</span>
                    {ach.description && <span className="text-slate-600"> — {ach.description}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Certifications
              </h2>
            </div>
            <div className="space-y-1.5 pl-4 border-l-2 border-slate-100 text-[11px]">
              {certifications.map((c) => (
                <div key={c.id} className="flex justify-between">
                  <span className="text-slate-800">
                    <strong>{c.name}</strong> · {c.issuer}
                  </span>
                  {c.issueDate && <span className="text-slate-500 text-[10px]">{c.issueDate}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
