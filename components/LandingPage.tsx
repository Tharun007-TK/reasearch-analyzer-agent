
import React, { useState } from 'react';
import { AppView, User } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
  toggleTheme: () => void;
  isDark: boolean;
  user: User | null;
  onLogout: () => void;
}

const LandingPage: React.FC<Props> = ({ onNavigate, toggleTheme, isDark, user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-canvas-landing-light dark:bg-canvas-landing-dark font-display text-slate-900 dark:text-white antialiased transition-colors duration-300 min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px] dark:opacity-0"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-slate-100/60 rounded-full blur-[120px] dark:opacity-0"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[100px] opacity-0 dark:opacity-100"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[120px] opacity-0 dark:opacity-100"></div>
      </div>

      <header className="w-full px-6 py-6 md:px-12 lg:px-20 z-20">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate(AppView.LANDING)}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 dark:bg-white">
              <span className="material-symbols-outlined text-xl text-white dark:text-slate-900">auto_awesome</span>
            </div>
            <h2 className="text-lg font-bold tracking-wide text-slate-900 dark:text-white">Research<span className="font-light text-slate-500 dark:text-slate-400">Analyzer</span></h2>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-8">
              <button onClick={() => onNavigate(AppView.LANDING)} className="text-sm font-medium text-slate-600 hover:text-brand-blue transition-colors dark:text-slate-300 dark:hover:text-blue-400">Home</button>
              <button onClick={() => onNavigate(user ? AppView.DASHBOARD : AppView.LOGIN)} className="text-sm font-medium text-slate-600 hover:text-brand-blue transition-colors dark:text-slate-300 dark:hover:text-blue-400">Analyze</button>
              <button onClick={() => onNavigate(AppView.DOCS)} className="text-sm font-medium text-slate-600 hover:text-brand-blue transition-colors dark:text-slate-300 dark:hover:text-blue-400">Docs</button>
            </nav>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
            <button 
              aria-label="Toggle Dark Mode" 
              onClick={toggleTheme}
              className="group flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-surface-landing-light text-slate-600 hover:bg-slate-100 hover:text-brand-blue dark:bg-surface-landing-dark dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-300 transition-all"
            >
              <span className="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            {user ? (
               <div className="relative group cursor-pointer">
                  <div className="size-9 rounded-full bg-gradient-to-tr from-brand-blue to-blue-400 p-[2px]">
                    <img src={user.avatar} alt={user.name} className="rounded-full w-full h-full object-cover border-2 border-white dark:border-[#101622]" />
                  </div>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-landing-dark rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-1 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all z-50">
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

          {/* Mobile Menu Button */}
          <button 
            className="flex h-10 w-10 md:hidden cursor-pointer items-center justify-center rounded-lg text-slate-900 dark:text-white z-50 relative"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white dark:bg-canvas-landing-dark flex flex-col items-center justify-center p-8 md:hidden animate-in slide-in-from-top-10 duration-200">
           <nav className="flex flex-col items-center gap-8 text-lg">
              <button onClick={() => { setIsMobileMenuOpen(false); onNavigate(AppView.LANDING); }} className="font-medium text-slate-900 dark:text-white">Home</button>
              <button onClick={() => { setIsMobileMenuOpen(false); onNavigate(user ? AppView.DASHBOARD : AppView.LOGIN); }} className="font-medium text-slate-900 dark:text-white">Analyze</button>
              <button onClick={() => { setIsMobileMenuOpen(false); onNavigate(AppView.DOCS); }} className="font-medium text-slate-900 dark:text-white">Docs</button>
              <div className="w-12 h-px bg-slate-200 dark:bg-slate-700 my-2"></div>
              <button onClick={() => { toggleTheme(); }} className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-400">
                 <span className="material-symbols-outlined">{isDark ? 'light_mode' : 'dark_mode'}</span>
                 {isDark ? 'Light Mode' : 'Dark Mode'}
              </button>
              {user ? (
                 <>
                   <button onClick={() => { setIsMobileMenuOpen(false); onNavigate(AppView.EDIT_PROFILE); }} className="font-medium text-slate-900 dark:text-white">Edit Profile</button>
                   <button onClick={() => { setIsMobileMenuOpen(false); onLogout(); }} className="font-medium text-red-500">Sign Out</button>
                 </>
              ) : (
                 <button onClick={() => { setIsMobileMenuOpen(false); onNavigate(AppView.LOGIN); }} className="font-bold text-brand-blue">Log In</button>
              )}
           </nav>
        </div>
      )}

      <main className="flex-grow flex flex-col">
        {/* Hero Section */}
        <section className="px-6 md:px-12 lg:px-20 py-10 lg:py-20 z-10">
            <div className="mx-auto w-full max-w-[1280px]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left pt-10 lg:pt-0">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/50 px-3 py-1 text-xs font-semibold text-slate-600 backdrop-blur-sm dark:border-slate-700 dark:bg-white/5 dark:text-slate-300">
                    <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                    <span>v2.0 Now Available</span>
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-semibold tracking-tighter text-slate-900 dark:text-white leading-[1.1] mb-6">
                    Multi-Format <br />
                    <span className="text-brand-blue">Research Analyzer</span>
                </h1>
                <p className="max-w-xl text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-10">
                    Stop drowning in data. Upload PDFs, documents, or datasets and let our AI generate structured, citation-backed insights instantly.
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 w-full">
                    <button 
                    onClick={() => onNavigate(user ? AppView.DASHBOARD : AppView.LOGIN)}
                    className="flex min-w-[140px] items-center justify-center gap-2 rounded-full bg-brand-blue px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:translate-y-[-2px] hover:shadow-xl hover:bg-blue-600 active:translate-y-[0px]"
                    >
                    <span>Start Analyzing</span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </button>
                    <button 
                    onClick={() => onNavigate(user ? AppView.DASHBOARD : AppView.LOGIN)}
                    className="flex min-w-[140px] items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:bg-surface-landing-dark dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                    <span className="material-symbols-outlined text-lg">upload_file</span>
                    <span>Upload File</span>
                    </button>
                </div>
                <div className="mt-10 flex items-center gap-4 text-sm text-slate-400 dark:text-slate-500">
                    <div className="flex -space-x-2">
                    <div className="h-8 w-8 rounded-full border-2 border-white bg-slate-200 dark:border-canvas-landing-dark bg-[url('https://api.dicebear.com/9.x/avataaars/svg?seed=Felix')] bg-cover"></div>
                    <div className="h-8 w-8 rounded-full border-2 border-white bg-slate-200 dark:border-canvas-landing-dark bg-[url('https://api.dicebear.com/9.x/avataaars/svg?seed=Aneka')] bg-cover"></div>
                    <div className="h-8 w-8 rounded-full border-2 border-white bg-slate-200 dark:border-canvas-landing-dark bg-[url('https://api.dicebear.com/9.x/avataaars/svg?seed=Jude')] bg-cover"></div>
                    </div>
                    <p>Trusted by 10,000+ researchers</p>
                </div>
                </div>
                
                {/* Hero Image Illustration */}
                <div className="lg:col-span-5 relative hidden lg:flex items-center justify-center h-full min-h-[500px]">
                <div className="relative w-full aspect-square max-w-[500px]">
                    <div className="absolute inset-0 m-auto h-[80%] w-[80%] rounded-2xl bg-white shadow-2xl shadow-slate-200/50 dark:bg-surface-landing-dark dark:shadow-black/50 overflow-hidden border border-slate-100 dark:border-slate-700 z-10">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="text-xs text-slate-400 font-mono">analysis_result.pdf</div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="h-4 w-3/4 rounded bg-slate-100 dark:bg-slate-700 animate-pulse"></div>
                        <div className="h-4 w-1/2 rounded bg-slate-100 dark:bg-slate-700 animate-pulse"></div>
                        <div className="h-32 w-full rounded-lg bg-blue-50/50 dark:bg-blue-900/10 p-4 border border-blue-100 dark:border-blue-900/30">
                        <div className="flex gap-3 mb-2">
                            <span className="material-symbols-outlined text-brand-blue text-sm">auto_awesome</span>
                            <span className="text-xs font-bold text-brand-blue uppercase tracking-wide">AI Summary</span>
                        </div>
                        <div className="space-y-2">
                            <div className="h-2 w-full rounded bg-blue-200/50 dark:bg-blue-800/50"></div>
                            <div className="h-2 w-full rounded bg-blue-200/50 dark:bg-blue-800/50"></div>
                            <div className="h-2 w-2/3 rounded bg-blue-200/50 dark:bg-blue-800/50"></div>
                        </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="h-20 rounded bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700"></div>
                        <div className="h-20 rounded bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700"></div>
                        </div>
                    </div>
                    </div>
                    {/* Floating Badges */}
                    <div className="absolute top-[5%] right-[0%] z-20 animate-[bounce_3s_infinite]">
                    <div className="flex items-center gap-2 rounded-lg bg-white p-3 shadow-xl dark:bg-surface-landing-dark border border-slate-50 dark:border-slate-700">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                        </div>
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        Format Verified
                        </div>
                    </div>
                    </div>
                    <div className="absolute bottom-[10%] left-[-5%] z-20 animate-[bounce_4s_infinite]">
                    <div className="flex items-center gap-2 rounded-lg bg-white p-3 shadow-xl dark:bg-surface-landing-dark border border-slate-50 dark:border-slate-700">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/30">
                        <span className="material-symbols-outlined text-lg">insights</span>
                        </div>
                        <div>
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-200">98% Accuracy</div>
                        <div className="text-[10px] text-slate-400">Based on 50 sources</div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </section>

        {/* Features Section */}
        <section className="bg-surface-landing-light dark:bg-surface-landing-dark/50 py-24 px-6 md:px-12 lg:px-20 border-t border-slate-100 dark:border-slate-800">
             <div className="mx-auto max-w-[1280px]">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Everything you need to <br/>research faster</h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
                        From automated summaries to interactive Q&A, our platform is designed to cut down your reading time by 70%.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white dark:bg-canvas-landing-dark p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-brand-blue mb-6">
                            <span className="material-symbols-outlined text-2xl">library_books</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Instant Summaries</h3>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                            Upload any PDF and get a comprehensive breakdown of key findings, methodologies, and conclusions in seconds.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-canvas-landing-dark p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                            <span className="material-symbols-outlined text-2xl">forum</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Interactive Q&A</h3>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                            Chat with your documents. Ask complex questions and get citation-backed answers directly from the source text.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-canvas-landing-dark p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-green-600 mb-6">
                            <span className="material-symbols-outlined text-2xl">bookmark_added</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Smart Citations</h3>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                            Automatically extract and format citations in APA, MLA, or Chicago styles. Never miss a reference again.
                        </p>
                    </div>
                </div>
             </div>
        </section>

        {/* How it Works Section */}
        <section className="py-24 px-6 md:px-12 lg:px-20 bg-white dark:bg-canvas-landing-dark">
            <div className="mx-auto max-w-[1280px]">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 space-y-8">
                         <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Workflow designed for <br/>modern academics</h2>
                         <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold">1</div>
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">Upload Materials</h4>
                                    <p className="text-slate-500 dark:text-slate-400 mt-1">Drag and drop your research papers. We handle OCR and text extraction securely.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold">2</div>
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">AI Analysis</h4>
                                    <p className="text-slate-500 dark:text-slate-400 mt-1">Our models analyze the context, identifying core arguments and statistical data.</p>
                                </div>
                            </div>
                             <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold">3</div>
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">Synthesize & Export</h4>
                                    <p className="text-slate-500 dark:text-slate-400 mt-1">Generate reports, copy citations, and export your findings to your favorite tools.</p>
                                </div>
                            </div>
                         </div>
                         <button 
                            onClick={() => onNavigate(user ? AppView.DASHBOARD : AppView.LOGIN)}
                            className="mt-4 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-full hover:opacity-90 transition-opacity"
                        >
                            Get Started for Free
                         </button>
                    </div>
                    <div className="flex-1 w-full relative">
                        <div className="aspect-[4/3] bg-slate-100 dark:bg-surface-landing-dark rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 p-4">
                             {/* Mock UI for "How it works" visual */}
                             <div className="w-full h-full bg-white dark:bg-canvas-landing-dark rounded-xl flex flex-col">
                                 <div className="h-8 border-b border-slate-100 dark:border-slate-800 flex items-center px-4 gap-2">
                                     <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                     <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                 </div>
                                 <div className="flex-1 p-6 flex gap-4">
                                     <div className="w-1/3 space-y-3">
                                         <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-3/4"></div>
                                         <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-1/2"></div>
                                         <div className="h-32 bg-slate-50 dark:bg-slate-800/50 rounded-lg mt-4 border border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-slate-300">upload_file</span>
                                         </div>
                                     </div>
                                     <div className="flex-1 space-y-4">
                                         <div className="h-4 bg-blue-100 dark:bg-blue-900/30 rounded w-1/3"></div>
                                         <div className="space-y-2">
                                             <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
                                             <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
                                             <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-5/6"></div>
                                         </div>
                                          <div className="h-24 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-100 dark:border-slate-800 p-3">
                                              <div className="flex gap-2 mb-2">
                                                  <div className="w-6 h-6 rounded-full bg-brand-blue/20"></div>
                                                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-20 mt-2"></div>
                                              </div>
                                              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-full mb-1"></div>
                                              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-2/3"></div>
                                          </div>
                                     </div>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
      </main>

      {/* Expanded Footer */}
      <footer className="w-full bg-slate-50 dark:bg-[#0b1121] pt-16 pb-8 border-t border-slate-200 dark:border-slate-800 mt-auto">
        <div className="mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
                <div className="col-span-2 lg:col-span-2">
                     <div className="flex items-center gap-2 mb-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 dark:bg-white">
                        <span className="material-symbols-outlined text-lg text-white dark:text-slate-900">auto_awesome</span>
                        </div>
                        <h2 className="text-lg font-bold tracking-wide text-slate-900 dark:text-white">Research<span className="font-light text-slate-500 dark:text-slate-400">Analyzer</span></h2>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs mb-6">
                        Empowering researchers with AI-driven insights to accelerate discovery and innovation.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-brand-blue transition-colors">
                            <span className="text-xs font-bold">X</span>
                        </a>
                         <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-brand-blue transition-colors">
                            <span className="text-xs font-bold">in</span>
                        </a>
                         <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-brand-blue transition-colors">
                            <span className="text-xs font-bold">gh</span>
                        </a>
                    </div>
                </div>
                
                <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-4">Product</h4>
                    <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                        <li><a href="#" className="hover:text-brand-blue transition-colors">Features</a></li>
                        <li><a href="#" className="hover:text-brand-blue transition-colors">Pricing</a></li>
                        <li><a href="#" className="hover:text-brand-blue transition-colors">API</a></li>
                        <li><a href="#" className="hover:text-brand-blue transition-colors">Integrations</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-4">Resources</h4>
                    <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                        <li><button onClick={() => onNavigate(AppView.DOCS)} className="hover:text-brand-blue transition-colors text-left">Documentation</button></li>
                        <li><a href="#" className="hover:text-brand-blue transition-colors">Blog</a></li>
                        <li><a href="#" className="hover:text-brand-blue transition-colors">Community</a></li>
                        <li><a href="#" className="hover:text-brand-blue transition-colors">Help Center</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                        <li><a href="#" className="hover:text-brand-blue transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-brand-blue transition-colors">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-brand-blue transition-colors">Security</a></li>
                    </ul>
                </div>
            </div>

            <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-slate-400">© 2023 Research Analyzer Inc. All rights reserved.</p>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Systems Operational
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
