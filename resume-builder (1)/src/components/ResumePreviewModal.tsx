import React, { useState } from 'react';
import { ResumeData, TemplateType } from '../types/resume.ts';
import { ResumeRenderer } from './ResumeTemplates/ResumeRenderer.tsx';
import { exportResumeToPDF, triggerPrintResume } from '../utils/pdfExport.ts';
import { getTemplateById, TEMPLATES_DATA } from '../data/templatesData.ts';
import { TemplateBrowser } from './Templates/TemplateBrowser.tsx';
import { X, Download, Printer, Edit, LayoutTemplate, Layers } from 'lucide-react';

interface ResumePreviewModalProps {
  resume: ResumeData;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (resume: ResumeData) => void;
  onUpdateTemplate?: (template: TemplateType) => void;
}

export const ResumePreviewModal: React.FC<ResumePreviewModalProps> = ({
  resume,
  isOpen,
  onClose,
  onEdit,
  onUpdateTemplate,
}) => {
  const [currentResume, setCurrentResume] = useState<ResumeData>(resume);
  const [isExporting, setIsExporting] = useState(false);
  const [showTemplateBrowser, setShowTemplateBrowser] = useState(false);

  if (!isOpen) return null;

  const handleTemplateChange = (templateId: string) => {
    const updated = { ...currentResume, selectedTemplate: templateId };
    setCurrentResume(updated);
    if (onUpdateTemplate) onUpdateTemplate(templateId);
    setShowTemplateBrowser(false);
  };

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    const filename = `${currentResume.personalInfo.fullName || currentResume.resumeName || 'Resume'}.pdf`
      .replace(/\s+/g, '_')
      .toLowerCase();

    await exportResumeToPDF('resume-preview-modal-area', filename);
    setIsExporting(false);
  };

  const activeTemplate = getTemplateById(currentResume.selectedTemplate);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-start p-2 sm:p-6 print:p-0 print:bg-white animate-in fade-in">
      {/* Top Floating Controls Bar (Hidden during print) */}
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg border border-slate-200 px-4 py-3 mb-4 flex flex-wrap items-center justify-between gap-3 sticky top-2 z-20 print:hidden">
        {/* Active Template Info & Switcher Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <LayoutTemplate className="w-4 h-4 text-indigo-600" />
            <div className="text-left leading-tight">
              <div className="text-[10px] text-slate-400 font-mono">Template #{activeTemplate.number}</div>
              <div className="text-xs font-bold text-slate-800">{activeTemplate.name}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowTemplateBrowser(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Change Template (102)</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(currentResume)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>

          <button
            onClick={triggerPrintResume}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-xs disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generating PDF...' : 'Download PDF'}</span>
          </button>

          <div className="h-5 w-px bg-slate-200 mx-1" />

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition"
            title="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Template Browser Modal Over Preview */}
      {showTemplateBrowser ? (
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative mb-12">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <span className="font-bold text-sm">Select from 102 Resume Templates</span>
            </div>
            <button
              onClick={() => setShowTemplateBrowser(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <TemplateBrowser
            currentResume={currentResume}
            onSelectTemplate={handleTemplateChange}
            onBack={() => setShowTemplateBrowser(false)}
          />
        </div>
      ) : (
        /* Printable / Render Container */
        <div className="w-full flex justify-center pb-12 print:pb-0">
          <div className="bg-slate-200 p-2 sm:p-6 rounded-lg print:p-0 print:bg-white shadow-2xl">
            <ResumeRenderer data={currentResume} containerId="resume-preview-modal-area" />
          </div>
        </div>
      )}
    </div>
  );
};
