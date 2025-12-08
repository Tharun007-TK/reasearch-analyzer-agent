import React, { useState, useRef } from 'react';
import { AppView, User, DocumentFile } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
  toggleTheme: () => void;
  isDark: boolean;
  user: User;
  onLogout: () => void;
  selectedFile: DocumentFile | null;
}

const getAnalysisForFile = (file: DocumentFile | null) => {
    if (!file) return null;

    return {
        title: `Analysis of ${file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ")}`,
        meta: {
            uploaded: file.uploadDate,
            version: "1.0",
            filename: file.name,
            size: file.size,
            pages: "12 Pages"
        },
        thesis: "The paper argues that emerging technologies, when integrated into existing frameworks, significantly enhance operational efficiency but require careful monitoring to prevent systemic dependencies. It suggests a hybrid model where automation serves as a support tool rather than a replacement.",
        findings: [
            { text: "Efficiency increased by 24% in the experimental group.", strong: "24%" },
            { text: "Manual intervention time was reduced by 15%, allowing for more strategic oversight." },
            { text: "System showed signs of 'latency dependency' after 4 weeks of high-load usage." }
        ],
        methodology: {
            text: "A longitudinal study involving multiple test subjects across diverse environments. The study utilized a control group (traditional methods) vs. an experimental group (enhanced methods).",
            tags: ["Quantitative", "12 Month Duration"]
        },
        implications: "Stakeholders should consider implementing these findings as a core strategy. Furthermore, providers must develop redundancy features that gradually support the system as load increases, mimicking natural scaling processes.",
        initialCitations: [
            { text: "Anderson, C., & Lee, M. (2023). Digital Scaffolding in Pre-K Environments. Journal of Educational Technology, 15(2), 112-128.", format: "APA" },
            { text: "Global EdTech Consortium. \"AI Literacy Standards for Primary Education.\" Future Learning Report, 2024.", format: "MLA" },
            { text: "Martinez, P. (2022). Synthetic Feedback Loops: A Cognitive Study. Oxford University Press.", format: "Chicago" }
        ]
    };
};

const SummaryView: React.FC<Props> = ({ onNavigate, toggleTheme, isDark, user, onLogout, selectedFile }) => {
  const documentData = getAnalysisForFile(selectedFile);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [citations, setCitations] = useState(documentData ? documentData.initialCitations : []);
  
  // Reference for the content to export
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
    // Close mobile menu on select
    if (window.innerWidth < 1024) setIsTocOpen(false);
  };

  const handleRegenerateCitations = () => {
      setIsRegenerating(true);
      // Simulate API delay
      setTimeout(() => {
          setIsRegenerating(false);
          // For demo purposes, we shuffle or slightly modify the list to show "generation"
          setCitations([
              { text: "Anderson, C., & Lee, M. (2023). Digital Scaffolding in Pre-K Environments. Journal of Educational Technology, 15(2), 112-128.", format: "APA" },
              { text: "Smith, J. (2024). The Impact of AI on Modern Curriculum. Harvard Educational Review.", format: "APA" },
              { text: "Global EdTech Consortium. \"AI Literacy Standards for Primary Education.\" Future Learning Report, 2024.", format: "MLA" },
              { text: "Martinez, P. (2022). Synthetic Feedback Loops: A Cognitive Study. Oxford University Press.", format: "Chicago" }
          ]);
      }, 1500);
  };

  const handleExportPDF = () => {
    if (!contentRef.current || !documentData) return;
    setIsExporting(true);

    const element = contentRef.current;
    
    // Options for html2pdf
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5], // top, left, bottom, right in inches
      filename: `${documentData.meta.filename.replace(/\.[^/.]+$/, "")}_Summary.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // Use the window.html2pdf library loaded from CDN
    // @ts-ignore
    if (window.html2pdf) {
        // @ts-ignore
        window.html2pdf().set(opt).from(element).save().then(() => {
            setIsExporting(false);
        }).catch((err: any) => {
            console.error("PDF Export failed", err);
            setIsExporting(false);
            alert("Failed to generate PDF. Please try again.");
        });
    } else {
        alert("PDF generator is initializing. Please try again in a moment.");
        setIsExporting(false);
    }
  };

  if (!documentData) {
      return (
        <div className="bg-canvas-dash-light dark:bg-canvas-dash-dark text-slate-800 dark:text-gray-100 min-h-screen flex flex-col items-center justify-center font-display transition-colors duration-300">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">description</span>
            <p className="text-xl text-slate-500 mb-4">No document selected for summary.</p>
            <button onClick={() => onNavigate(AppView.DASHBOARD)} className="text-brand-indigo font-bold hover:underline">Go to Dashboard</button>
        </div>
      );
  }

  return (
    <div className="bg-canvas-dash-light dark:bg-canvas-dash-dark text-slate-800 dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-300 font-display">
      <header className="h-16 flex items-center justify-between px-4 lg:px-8 bg-surface-dash-light/80 dark:bg-canvas-dash-dark/80 backdrop-blur-md border-b border-border-dash-light dark:border-border-dash-dark shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate(AppView.LANDING)}>
          <div className="flex h-8 w-8 lg:h-9 lg:w-9 items-center justify-center rounded-lg bg-slate-900 dark:bg-white">
            <span className="material-symbols-outlined text-lg lg:text-xl text-white dark:text-slate-900">auto_awesome</span>
          </div>
          <h2 className="text-base lg:text-lg font-bold tracking-wide text-slate-900 dark:text-white hidden sm:block">Research<span className="font-light text-slate-500 dark:text-slate-400">Analyzer</span></h2>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <button onClick={() => onNavigate(AppView.DASHBOARD)} className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-brand-indigo dark:hover:text-brand-indigo transition-colors">Home</button>
          <button onClick={() => onNavigate(AppView.DASHBOARD)} className="text-sm font-medium text-brand-indigo font-semibold">Analyze</button>
          <button onClick={() => onNavigate(AppView.DOCS)} className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-brand-indigo dark:hover:text-brand-indigo transition-colors">Docs</button>
        </nav>
        <div className="flex items-center gap-4">
          <button aria-label="Toggle Dark Mode" onClick={toggleTheme} className="size-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-[20px]">{isDark ? 'light_mode' : 'dark_mode'}</span>
          </button>
          <div className="relative group cursor-pointer">
              <div className="size-9 rounded-full bg-gradient-to-tr from-brand-indigo to-purple-400 p-[2px]">
                <img src={user.avatar} alt={user.name} className="rounded-full w-full h-full object-cover border-2 border-white dark:border-[#101622]" />
              </div>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-dash-dark rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-1 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                </div>
                <button onClick={() => onNavigate(AppView.EDIT_PROFILE)} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Edit Profile</button>
                <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50 dark:hover:bg-slate-800">Sign Out</button>
              </div>
          </div>
        </div>
      </header>

      <main className="flex-grow flex justify-center py-8 px-4 sm:px-6">
        <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8">
          
          {/* Mobile TOC Toggle */}
          <div className="lg:hidden w-full">
               <button 
                  onClick={() => setIsTocOpen(!isTocOpen)}
                  className="w-full flex items-center justify-between p-4 bg-white dark:bg-surface-dash-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
               >
                   <span className="font-bold text-slate-900 dark:text-white">Table of Contents</span>
                   <span className={`material-symbols-outlined transition-transform ${isTocOpen ? 'rotate-180' : ''}`}>expand_more</span>
               </button>
          </div>

          <aside className={`
            w-full lg:w-64 flex-shrink-0 transition-all duration-300 ease-in-out
            ${isTocOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 lg:max-h-none opacity-0 lg:opacity-100 overflow-hidden lg:overflow-visible'}
          `}>
            <div className="lg:sticky lg:top-24 space-y-8">
              <nav className="flex flex-col gap-2">
                <button onClick={() => scrollToSection('summary')} className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-surface-dash-dark shadow-soft border border-slate-100 dark:border-slate-700 w-full text-left">
                  <span className="material-symbols-outlined filled text-brand-indigo dark:text-brand-indigo">summarize</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Summary</span>
                </button>
                <button onClick={() => scrollToSection('findings')} className="group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-full text-left">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-brand-indigo dark:group-hover:text-white">lightbulb</span>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200">Key Concepts</span>
                </button>
                <button onClick={() => scrollToSection('methodology')} className="group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-full text-left">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-brand-indigo dark:group-hover:text-white">analytics</span>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200">Methodology</span>
                </button>
                <button onClick={() => scrollToSection('citations')} className="group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-full text-left">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-brand-indigo dark:group-hover:text-white">format_quote</span>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200">Citations</span>
                </button>
              </nav>

              <div className="px-4 py-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Source Document</p>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white dark:bg-surface-dash-dark rounded-lg shadow-sm">
                    <span className="material-symbols-outlined text-red-400">picture_as_pdf</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">{documentData.meta.filename}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{documentData.meta.size} • {documentData.meta.pages}</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Wrapper for the content that will be exported */}
          <div className="flex-1 min-w-0 space-y-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 max-w-3xl">
                  {/* Content Header (Included in Export via ref) */}
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">{documentData.title}</h2>
                  <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">schedule</span> Uploaded {documentData.meta.uploaded}</span>
                    <span className="size-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                    <span>Analysis v{documentData.meta.version}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start no-print">
                  <button className="group flex items-center justify-center size-10 rounded-full bg-white dark:bg-surface-dash-dark hover:bg-slate-50 dark:hover:bg-slate-800 shadow-soft border border-slate-100 dark:border-slate-700 transition-all" title="Copy Summary">
                    <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 text-[20px] group-hover:scale-110 transition-transform">content_copy</span>
                  </button>
                  <button 
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="group flex items-center justify-center size-10 rounded-full bg-white dark:bg-surface-dash-dark hover:bg-slate-50 dark:hover:bg-slate-800 shadow-soft border border-slate-100 dark:border-slate-700 transition-all" 
                    title="Export PDF"
                  >
                    <span className={`material-symbols-outlined text-slate-600 dark:text-slate-300 text-[20px] group-hover:scale-110 transition-transform ${isExporting ? 'animate-spin' : ''}`}>
                        {isExporting ? 'sync' : 'ios_share'}
                    </span>
                  </button>
                  <button 
                    onClick={() => onNavigate(AppView.QNA)}
                    className="px-6 h-11 rounded-full bg-gradient-to-r from-brand-indigo to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                    <span>Ask AI</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Content to be exported to PDF */}
            <div ref={contentRef} className="grid grid-cols-1 gap-6">
                {/* For PDF export purposes, we duplicate the header inside the ref but hide it on screen so the PDF gets a title */}
                <div className="hidden pdf-only mb-6">
                    <h1 className="text-3xl font-bold mb-2">{documentData.title}</h1>
                    <p className="text-gray-500 text-sm">Generated by ResearchAnalyzer</p>
                    <hr className="my-4"/>
                </div>

              <article id="summary" className="group bg-white dark:bg-surface-dash-dark p-6 lg:p-8 rounded-2xl shadow-soft hover:shadow-lg transition-all duration-300 border border-slate-100 dark:border-slate-700/50 break-inside-avoid">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                    <span className="material-symbols-outlined text-[20px]">psychology</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">The Core Thesis</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base lg:text-lg">
                  {documentData.thesis}
                </p>
              </article>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <article id="findings" className="bg-white dark:bg-surface-dash-dark p-6 rounded-2xl shadow-soft border border-slate-100 dark:border-slate-700/50 break-inside-avoid">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300">
                      <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Key Findings</h3>
                  </div>
                  <ul className="space-y-3">
                    {documentData.findings.map((finding, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                        <span className="mt-2 size-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                        <span className="leading-relaxed">
                            {finding.strong ? (
                                <>
                                {finding.text.split(finding.strong)[0]}
                                <strong className="text-slate-900 dark:text-slate-200">{finding.strong}</strong>
                                {finding.text.split(finding.strong)[1]}
                                </>
                            ) : finding.text}
                        </span>
                        </li>
                    ))}
                  </ul>
                </article>

                <article id="methodology" className="bg-white dark:bg-surface-dash-dark p-6 rounded-2xl shadow-soft border border-slate-100 dark:border-slate-700/50 break-inside-avoid">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-1.5 rounded-md bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300">
                      <span className="material-symbols-outlined text-[20px]">science</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Methodology Snippet</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {documentData.methodology.text}
                  </p>
                  <div className="flex gap-2">
                    {documentData.methodology.tags.map((tag, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400">{tag}</span>
                    ))}
                  </div>
                </article>
              </div>

              <article className="bg-white dark:bg-surface-dash-dark p-6 lg:p-8 rounded-2xl shadow-soft border border-slate-100 dark:border-slate-700/50 break-inside-avoid">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300">
                      <span className="material-symbols-outlined text-[20px]">lightbulb</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Strategic Implications</h3>
                  </div>
                  <button className="text-xs font-medium text-brand-indigo hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors no-print">View Full Text</button>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-slate-600 dark:text-slate-300 leading-loose">
                    {documentData.implications}
                  </p>
                </div>
              </article>

              <article id="citations" className="bg-white dark:bg-surface-dash-dark p-6 lg:p-8 rounded-2xl shadow-soft border border-slate-100 dark:border-slate-700/50 break-inside-avoid">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            <span className="material-symbols-outlined text-[20px]">format_quote</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Citations</h3>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto no-print">
                         <button 
                            onClick={handleRegenerateCitations}
                            disabled={isRegenerating}
                            className="flex-1 sm:flex-none justify-center text-xs font-medium text-slate-500 hover:text-brand-indigo dark:text-slate-400 dark:hover:text-white transition-colors bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1"
                        >
                            <span className={`material-symbols-outlined text-[14px] ${isRegenerating ? 'animate-spin' : ''}`}>
                                {isRegenerating ? 'sync' : 'autorenew'}
                            </span>
                            {isRegenerating ? 'Generating...' : 'Regenerate'}
                        </button>
                        <button className="flex-1 sm:flex-none justify-center text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">content_copy</span>
                            Copy All
                        </button>
                        <button 
                            onClick={handleExportPDF}
                            className="flex-1 sm:flex-none justify-center text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-[14px]">download</span>
                            {isExporting ? 'Exporting...' : 'Export'}
                        </button>
                    </div>
                </div>
                
                {isRegenerating ? (
                   <div className="space-y-4 animate-pulse">
                      <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                      <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                      <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                   </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {citations.map((citation, idx) => (
                            <div key={idx} className="group relative p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-700/50 hover:border-brand-indigo/30 transition-all break-inside-avoid">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4">
                                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium pl-2 border-l-2 border-brand-indigo/20">
                                        {citation.text}
                                    </p>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-100 dark:border-slate-700 shrink-0 self-start">
                                        {citation.format}
                                    </span>
                                </div>
                                <button 
                                    onClick={() => navigator.clipboard.writeText(citation.text)}
                                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-brand-indigo bg-white dark:bg-slate-800 rounded-md shadow-sm border border-slate-100 dark:border-slate-700 transition-all no-print" 
                                    title="Copy Citation"
                                >
                                    <span className="material-symbols-outlined text-[14px]">content_copy</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
              </article>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-6 mt-12 border-t border-slate-200 dark:border-slate-800 bg-surface-dash-light dark:bg-canvas-dash-dark no-print">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400 dark:text-slate-500">© 2024 Research Analyzer Inc. v1.0.2</p>
          <div className="flex gap-6">
            <a className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <a className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a>
            <a className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" href="#" onClick={(e) => e.preventDefault()}>Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SummaryView;