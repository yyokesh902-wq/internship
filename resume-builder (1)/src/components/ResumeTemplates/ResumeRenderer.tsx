import React from 'react';
import { ResumeData } from '../../types/resume.ts';
import { UniversalTemplateRenderer } from './UniversalTemplateRenderer.tsx';

interface ResumeRendererProps {
  data: ResumeData;
  templateOverride?: string;
  containerId?: string;
  className?: string;
}

export const ResumeRenderer: React.FC<ResumeRendererProps> = ({
  data,
  templateOverride,
  containerId = 'resume-printable-area',
  className = '',
}) => {
  return (
    <UniversalTemplateRenderer
      data={data}
      templateOverride={templateOverride}
      containerId={containerId}
      className={className}
    />
  );
};
