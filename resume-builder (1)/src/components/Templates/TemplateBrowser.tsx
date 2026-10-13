import React, { useState, useMemo } from 'react';
import { ResumeData } from '../../types/resume.ts';
import {
  TEMPLATES_DATA,
  TEMPLATE_CATEGORIES,
  TemplateDefinition,
  TemplateCategory,
} from '../../data/templatesData.ts';
import { getSampleResume } from '../../utils/sampleData.ts';
import { UniversalTemplateRenderer } from '../ResumeTemplates/UniversalTemplateRenderer.tsx';
import {
  Search,
  Check,
  Eye,
  ArrowRight,
  Filter,
  Sparkles,
  SlidersHorizontal,
  X,
  Layers,
} from 'lucide-react';

interface TemplateBrowserProps {
  currentResume?: ResumeData | null;
  onSelectTemplate: (templateId: string) => void;
  onBack?: () => void;
  isInsideBuilder?: boolean;
}

export const TemplateBrowser: React.FC<TemplateBrowserProps> = ({
  currentResume,
  onSelectTemplate,
  onBack,
  isInsideBuilder = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'number' | 'name'>('number');
  const [previewTemplate, setPreviewTemplate] = useState<TemplateDefinition | null>(null);

  // Use current resume data or default sample resume for previews
  const sampleData = useMemo(() => getSampleResume(), []);
  const previewResumeData = useMemo(() => {
    return currentResume || sampleData;
  }, [currentResume, sampleData]);

  // Map category button labels to full category names
  const categoryFilters = [
    { label: 'All', value: 'All' },
    { label: 'Classic', value: 'Classic / Professional' },
    { label: 'Modern', value: 'Modern' },
    { label: 'Minimal', value: 'Minimal' },
    { label: 'ATS', value: 'ATS-Friendly' },
    { label: 'Student', value: 'Student / Fresher' },
    { label: 'Developer/IT', value: 'Developer / IT' },
    { label: 'Creative', value: 'Creative' },
    { label: 'Executive', value: 'Executive' },
    { label: 'Academic', value: 'Academic / Research' },
    { label: 'International', value: 'International / Standard CV' },
  ];

  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    return TEMPLATES_DATA.filter((tmpl) => {
      // Category match
      const matchCategory =
        selectedCategory === 'All' || tmpl.category === selectedCategory;

      // Search match
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        tmpl.name.toLowerCase().includes(q) ||
        tmpl.category.toLowerCase().includes(q) ||
        tmpl.shortDesc.toLowerCase().includes(q) ||
        String(tmpl.number).includes(q);

      return matchCategory && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return a.number - b.number;
    });
  }, [selectedCategory, searchQuery, sortBy]);

  const activeTemplateId = currentResume?.selectedTemplate || 'classic-black';

  return (
    <div className="min-h-screen bg-transparent py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="bg-white/85 dark:bg-slate-900/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-100 dark:border-indigo-800 mb-2">
                <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>102 Hand-Crafted Layouts</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Choose Your Resume Template
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Select from our complete catalog of 102 templates. Your resume details automatically adapt to every layout.
              </p>
            </div>

            {onBack && (
              <button
                onClick={onBack}
                className="self-start md:self-auto px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                ← Back
              </button>
            )}
          </div>

          {/* Search bar & Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
            <div className="sm:col-span-8 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by template name (e.g. Modern Tech, Classic Blue, ATS Developer)..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="sm:col-span-4 flex items-center gap-2">
              <div className="relative flex-1">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'number' | 'name')}
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none text-slate-700 font-medium"
                >
                  <option value="number">Order: Number (#1 to #102)</option>
                  <option value="name">Order: Alphabetical (A-Z)</option>
                </select>
              </div>

              <div className="text-xs text-slate-500 whitespace-nowrap px-2 font-mono">
                {filteredTemplates.length} / 102
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categoryFilters.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat.value
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <Filter className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">No templates found</h3>
            <p className="text-xs text-slate-500">
              No template matching "{searchQuery}" in this category.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 text-xs font-semibold text-indigo-600 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => {
              const isSelected =
                activeTemplateId === template.id ||
                (activeTemplateId === 'classic' && template.id === 'classic-black') ||
                (activeTemplateId === 'modern' && template.id === 'modern-blue') ||
                (activeTemplateId === 'minimal' && template.id === 'minimal') ||
                (activeTemplateId === 'creative' && template.id === 'creative');

              return (
                <div
                  key={template.id}
                  className={`bg-white rounded-2xl border transition flex flex-col justify-between overflow-hidden group hover:shadow-lg ${
                    isSelected
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Miniature Realistic Resume Preview */}
                  <div className="p-4 pb-2">
                    <div className="flex items-center justify-between text-[11px] mb-2 font-mono">
                      <span className="font-bold text-slate-400">#{template.number}</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {template.category}
                      </span>
                    </div>

                    {/* Miniature Preview Container */}
                    <div
                      onClick={() => setPreviewTemplate(template)}
                      className="h-56 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden cursor-pointer hover:opacity-95 transition relative shadow-2xs group/preview"
                    >
                      <div className="scale-25 origin-top-left w-[400%] pointer-events-none select-none">
                        <UniversalTemplateRenderer
                          data={previewResumeData}
                          templateOverride={template.id}
                          containerId={`browser-mini-${template.id}`}
                        />
                      </div>

                      {/* Hover Overlay with Preview Trigger */}
                      <div className="absolute inset-0 bg-slate-900/0 group-hover/preview:bg-slate-900/30 transition-all flex items-center justify-center opacity-0 group-hover/preview:opacity-100">
                        <span className="px-3 py-1.5 rounded-lg bg-white/95 text-slate-900 text-xs font-bold shadow-md flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-indigo-600" /> Full Preview
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Info and Buttons */}
                  <div className="p-4 pt-2 space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition">
                          {template.name}
                        </h3>
                        {isSelected && (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                            <Check className="w-3.5 h-3.5" /> Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {template.shortDesc}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setPreviewTemplate(template)}
                        className="py-1.5 px-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition text-center flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Preview</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onSelectTemplate(template.id)}
                        className={`py-1.5 px-2 text-xs font-semibold rounded-lg transition text-center flex items-center justify-center gap-1 ${
                          isSelected
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs'
                        }`}
                      >
                        <span>{isSelected ? 'Applied' : 'Use Template'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Full A4 Modal Preview */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-start p-2 sm:p-6 print:p-0 print:bg-white animate-in fade-in">
          {/* Top Bar with template name and action */}
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg border border-slate-200 px-5 py-3 mb-4 flex items-center justify-between gap-4 sticky top-2 z-10 print:hidden">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                #{previewTemplate.number}
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{previewTemplate.name}</h3>
                <span className="text-[11px] text-slate-500">{previewTemplate.category}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onSelectTemplate(previewTemplate.id);
                  setPreviewTemplate(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Use This Template</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Full A4 Render */}
          <div className="w-full flex justify-center pb-12 print:pb-0">
            <div className="bg-slate-200 p-2 sm:p-6 rounded-lg print:p-0 print:bg-white shadow-2xl">
              <UniversalTemplateRenderer
                data={previewResumeData}
                templateOverride={previewTemplate.id}
                containerId="template-modal-preview-area"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
