import React from 'react';
import { ResumeData } from '../../types/resume.ts';

interface TemplateProps {
  data: ResumeData;
}

export const ClassicTemplate: React.FC<TemplateProps> = ({ data }) => {
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
    <div className="bg-white text-slate-900 p-8 sm:p-12 w-full max-w-[210mm] min-h-[297mm] mx-auto shadow-sm print:shadow-none font-serif text-[13px] leading-relaxed">
      {/* Header */}
      <div className="border-b-2 border-slate-900 pb-5 text-center">
        {personalInfo.profilePhoto && (
          <div className="mb-4 flex justify-center">
            <img
              src={personalInfo.profilePhoto}
              alt={personalInfo.fullName}
              className="w-24 h-24 rounded-full object-cover border-2 border-slate-300"
            />
          </div>
        )}
        <h1 className="text-3xl font-bold uppercase tracking-wider text-slate-950 font-serif">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.jobTitle && (
          <p className="text-base text-slate-700 font-sans font-medium mt-1 tracking-wide">
            {personalInfo.jobTitle}
          </p>
        )}
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs text-slate-700 font-sans mt-3">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && (
            <>
              <span aria-hidden="true">·</span>
              <span>{personalInfo.phone}</span>
            </>
          )}
          {personalInfo.location && (
            <>
              <span aria-hidden="true">·</span>
              <span>{personalInfo.location}</span>
            </>
          )}
          {personalInfo.linkedIn && (
            <>
              <span aria-hidden="true">·</span>
              <span>{personalInfo.linkedIn}</span>
            </>
          )}
          {personalInfo.github && (
            <>
              <span aria-hidden="true">·</span>
              <span>{personalInfo.github}</span>
            </>
          )}
          {personalInfo.portfolio && (
            <>
              <span aria-hidden="true">·</span>
              <span>{personalInfo.portfolio}</span>
            </>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <section className="mt-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2 font-sans">
            Professional Summary
          </h2>
          <p className="text-slate-800 text-justify">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {!isFresher && experience && experience.length > 0 && (
        <section className="mt-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-3 font-sans">
            Work Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline font-sans">
                  <span className="font-bold text-slate-950 text-sm">{exp.jobTitle}</span>
                  <span className="text-xs text-slate-600">
                    {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-700 italic font-sans mb-1">
                  <span>{exp.company}</span>
                  {exp.location && <span>{exp.location}</span>}
                </div>
                {exp.description && <p className="text-slate-800 whitespace-pre-line">{exp.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mt-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-3 font-sans">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline font-sans">
                  <span className="font-bold text-slate-950 text-sm">{edu.degree}</span>
                  <span className="text-xs text-slate-600">
                    {edu.startYear} – {edu.endYear || 'Present'}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-700 font-sans mb-1">
                  <span>
                    {edu.institution} {edu.university ? `(${edu.university})` : ''}
                  </span>
                  {edu.location && <span>{edu.location}</span>}
                </div>
                {edu.grade && <p className="text-xs font-sans text-slate-700">Grade / CGPA: {edu.grade}</p>}
                {edu.description && <p className="text-slate-800 text-xs mt-1">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mt-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-3 font-sans">
            Key Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline font-sans">
                  <span className="font-bold text-slate-950 text-sm">{proj.title}</span>
                  <div className="text-xs text-slate-600 space-x-2">
                    {proj.projectUrl && <span>{proj.projectUrl}</span>}
                    {proj.githubUrl && <span>GitHub: {proj.githubUrl}</span>}
                  </div>
                </div>
                {proj.technologies && (
                  <p className="text-xs font-sans text-slate-700 italic">
                    Technologies: {proj.technologies}
                  </p>
                )}
                {proj.description && <p className="text-slate-800 text-xs mt-1">{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="mt-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2 font-sans">
            Technical & Professional Skills
          </h2>
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs font-sans text-slate-800">
            {skills.map((skill, idx) => (
              <span key={skill.id}>
                {skill.name} <span className="text-slate-500">({skill.level})</span>
                {idx < skills.length - 1 && <span className="ml-2 text-slate-400">·</span>}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <section className="mt-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2 font-sans">
            Certifications
          </h2>
          <div className="space-y-1.5 font-sans text-xs">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between">
                <div>
                  <span className="font-semibold text-slate-900">{cert.name}</span>
                  <span className="text-slate-600"> — {cert.issuer}</span>
                </div>
                {cert.issueDate && <span className="text-slate-500">{cert.issueDate}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      {achievements && achievements.length > 0 && (
        <section className="mt-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2 font-sans">
            Honors & Achievements
          </h2>
          <div className="space-y-1.5 font-sans text-xs">
            {achievements.map((ach) => (
              <div key={ach.id}>
                <span className="font-semibold text-slate-900">{ach.title}</span>
                {ach.description && <span className="text-slate-700"> — {ach.description}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages & Hobbies */}
      {((languages && languages.length > 0) || (hobbies && hobbies.length > 0)) && (
        <section className="mt-5 pt-3 border-t border-slate-200 grid grid-cols-2 gap-4 font-sans text-xs">
          {languages && languages.length > 0 && (
            <div>
              <h3 className="font-bold uppercase tracking-wider text-slate-900 mb-1">Languages</h3>
              <p className="text-slate-700">
                {languages.map((l) => `${l.name} (${l.proficiency})`).join(' · ')}
              </p>
            </div>
          )}
          {hobbies && hobbies.length > 0 && (
            <div>
              <h3 className="font-bold uppercase tracking-wider text-slate-900 mb-1">Hobbies & Interests</h3>
              <p className="text-slate-700">{hobbies.map((h) => h.name).join(' · ')}</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
