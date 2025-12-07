
import React from 'react';
import { AppView, User } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
  toggleTheme: () => void;
  isDark: boolean;
  user: User | null;
  onLogout: () => void;
}

const DocsView: React.FC<Props> = ({ onNavigate, toggleTheme, isDark, user, onLogout }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMobileNavChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      scrollToSection(e.target.value);
  };

  return (
    <div className="bg-canvas-landing-light dark:bg-canvas-landing-dark font-display text-slate-900 dark:text-white antialiased transition-colors duration-300 min-h-screen flex flex-col">
      <header className="w-full px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#101622]/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate(AppView.LANDING)}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 dark:bg-white">
              <span className="material-symbols-outlined text-xl text-white dark:text-slate-900">auto_awesome</span>
            </div>
            <h2 className="text-lg font-bold tracking-wide text-slate-900 dark:text-white">Research<span className="font-light text-slate-500 dark:text-slate-400">Analyzer</span></h2>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => onNavigate(AppView.LANDING)} className="text-sm font-medium text-slate-500 hover:text-brand-blue dark:text-slate-400 dark:hover:text-white transition-colors">Home</button>
            <button onClick={() => onNavigate(user ? AppView.DASHBOARD : AppView.LOGIN)} className="text-sm font-medium text-slate-500 hover:text-brand-blue dark:text-slate-400 dark:hover:text-white transition-colors">Analyze</button>
            <button className="text-sm font-medium text-brand-blue dark:text-white relative after:content-[''] after:absolute after:-bottom-5 after:left-0 after:w-full after:h-0.5 after:bg-brand-blue after:rounded-full">Docs</button>
          </nav>

          <div className="flex items-center gap-4">
            <button aria-label="Toggle Dark Mode" onClick={toggleTheme} className="group flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-surface-landing-light text-slate-600 hover:bg-slate-100 hover:text-brand-blue dark:bg-surface-landing-dark dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-300 transition-all">
              <span className="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            
            {user ? (
              <div className="relative group cursor-pointer">
                <div className="size-9 rounded-full bg-gradient-to-tr from-brand-blue to-blue-400 p-[2px]">
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
            ) : (
               <button onClick={() => onNavigate(AppView.LOGIN)} className="text-sm font-bold text-slate-900 hover:text-brand-blue dark:text-white dark:hover:text-blue-300">Log In</button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow flex justify-center py-8 lg:py-12 px-6">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8 lg:gap-12">
            
            {/* Mobile Navigation Dropdown */}
            <div className="md:hidden">
                 <label htmlFor="docs-nav" className="text-sm font-bold text-slate-900 dark:text-white mb-2 block">Jump to section</label>
                 <select 
                    id="docs-nav" 
                    onChange={handleMobileNavChange}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue"
                 >
                     <option value="getting-started">Getting Started</option>
                     <option value="uploading">Uploading Documents</option>
                     <option value="analysis">Generating Analysis</option>
                     <option value="qna">Using Q&A</option>
                     <option value="account">Account Settings</option>
                 </select>
            </div>

            {/* Sidebar Navigation */}
            <aside className="hidden md:block sticky top-28 h-[calc(100vh-8rem)] overflow-y-auto space-y-2 pr-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 px-2">Documentation</h3>
                <button onClick={() => scrollToSection('getting-started')} className="w-full text-left px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-blue hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 rounded-lg transition-colors">Getting Started</button>
                <button onClick={() => scrollToSection('uploading')} className="w-full text-left px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-blue hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 rounded-lg transition-colors">Uploading Documents</button>
                <button onClick={() => scrollToSection('analysis')} className="w-full text-left px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-blue hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 rounded-lg transition-colors">Generating Analysis</button>
                <button onClick={() => scrollToSection('qna')} className="w-full text-left px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-blue hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 rounded-lg transition-colors">Using Q&A</button>
                <button onClick={() => scrollToSection('account')} className="w-full text-left px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-blue hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 rounded-lg transition-colors">Account Settings</button>
            </aside>

            {/* Content */}
            <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-32 prose-headings:font-display">
                <div id="getting-started" className="mb-16 scroll-mt-32">
                    <h1 className="text-2xl lg:text-3xl font-bold font-display text-slate-900 dark:text-white mb-6">Getting Started with ResearchAnalyzer</h1>
                    <p className="text-base lg:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                        ResearchAnalyzer is an advanced AI-powered tool designed to help researchers, students, and professionals distill complex documents into actionable insights. This guide will walk you through the core features of the platform.
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-6 mt-6 not-prose">
                        <h4 className="text-brand-blue font-bold flex items-center gap-2 m-0 mb-2">
                            <span className="material-symbols-outlined">info</span>
                            Prerequisites
                        </h4>
                        <p className="m-0 text-sm text-slate-600 dark:text-slate-300">You need an active account to access the analysis features. You can sign up using your Email, Google, GitHub, or Microsoft account.</p>
                    </div>
                </div>

                <div id="uploading" className="mb-16 scroll-mt-32">
                    <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-4">Uploading Documents</h2>
                    <p>To begin your analysis, navigate to the <strong>Dashboard</strong>. On the left sidebar, you will find the "Upload Materials" section.</p>
                    <ol className="space-y-2 list-decimal pl-5">
                        <li>Click on the dashed upload area or drag and drop your files.</li>
                        <li>We support <strong>PDF</strong>, <strong>DOCX</strong>, and <strong>TXT</strong> formats.</li>
                        <li>File size limit is currently <strong>10MB</strong> per document.</li>
                        <li>Once uploaded, your file will appear in the "Uploaded Files" list with a "Ready" status.</li>
                    </ol>
                </div>

                <div id="analysis" className="mb-16 scroll-mt-32">
                    <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-4">Generating Analysis</h2>
                    <p>Once your files are uploaded, you can generate comprehensive insights.</p>
                    <ul className="space-y-2 list-disc pl-5">
                        <li><strong>Configuration:</strong> Use the right-hand panel on the Dashboard to select your desired <em>Output Depth</em> (Brief, Standard, Deep).</li>
                        <li><strong>Focus Areas:</strong> Toggle specific areas like Key Insights, Visual Diagrams, or Math Formulas based on your needs.</li>
                        <li><strong>Process:</strong> Click the large <strong>Generate Insights</strong> button. The AI will process the document (approx. 30-60 seconds).</li>
                    </ul>
                    <p>The results will populate in the main view, offering a high-level summary, key findings, and interactive charts.</p>
                </div>

                <div id="qna" className="mb-16 scroll-mt-32">
                    <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-4">Interactive Q&A</h2>
                    <p>Need specific details? Switch to the <strong>Q&A</strong> view using the tab menu.</p>
                    <p>The Q&A Assistant allows you to chat directly with your documents. You can ask questions like:</p>
                    <blockquote className="border-l-4 border-brand-blue pl-4 italic text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 py-2 rounded-r">
                        "What is the methodology used in the second experiment?"<br/>
                        "Summarize the limitations mentioned in the conclusion."
                    </blockquote>
                    <p>The AI will provide answers with citations linking back to the specific section in the document.</p>
                </div>

                <div id="account" className="mb-16 scroll-mt-32">
                    <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-4">Account Management</h2>
                    <p>You can manage your personal details by clicking your avatar in the top right corner and selecting <strong>Edit Profile</strong>.</p>
                    <p>Here you can update your:</p>
                    <ul className="space-y-1 list-disc pl-5">
                        <li>Display Name</li>
                        <li>Profile Avatar URL</li>
                        <li>Bio and Institution details</li>
                    </ul>
                </div>

            </article>
        </div>
      </main>

      <footer className="w-full py-8 mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622]">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6">
          <p className="text-sm font-medium text-slate-400">© 2023 Research Analyzer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default DocsView;
