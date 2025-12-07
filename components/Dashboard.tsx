
import React, { useState } from 'react';
import { AppView, User, DocumentFile } from '../types';
import { BarChart, Bar, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
  onNavigate: (view: AppView) => void;
  toggleTheme: () => void;
  isDark: boolean;
  user: User;
  onLogout: () => void;
  files: DocumentFile[];
  onUpload: (file: DocumentFile) => void;
  onSelectFile: (file: DocumentFile) => void;
}

const chartData = [
  { name: 'A', value: 40 },
  { name: 'B', value: 30 },
  { name: 'C', value: 55 },
  { name: 'D', value: 20 },
  { name: 'E', value: 45 },
];

const mockAnalysisResults = {
    title: 'Primary Discovery: Wave-Particle Duality',
    confidence: '98%',
    summary: 'The uploaded documents strongly suggest a correlation between observed particle behavior and the interference patterns typically associated with wave dynamics. The data indicates that under specific observation conditions, the probability distribution collapses into a localized state.',
    variance: 'Statistical anomalies were detected in the third quadrant of the dataset, suggesting a standard deviation of 0.05% higher than the control group.',
    limitations: 'The sample size (n=45) may be insufficient for generalizing these findings to the broader population without further longitudinal studies.'
};

const Dashboard: React.FC<Props> = ({ onNavigate, toggleTheme, isDark, user, onLogout, files, onUpload, onSelectFile }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [resultsReady, setResultsReady] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const handleGenerate = () => {
    if (files.length === 0) {
        alert("Please upload a file first.");
        return;
    }
    setAnalyzing(true);
    // On mobile, close config panel when generating to show progress
    if (window.innerWidth < 1024) setShowConfig(false);
    
    setTimeout(() => {
      setAnalyzing(false);
      setResultsReady(true);
    }, 2000);
  };

  const simulateUpload = () => {
      const newFile: DocumentFile = {
          id: Date.now().toString(),
          name: `Research_Paper_v${files.length + 1}.pdf`,
          size: '1.2 MB',
          status: 'Ready',
          type: 'pdf',
          uploadDate: new Date().toLocaleDateString()
      };
      onUpload(newFile);
      // On mobile, close sidebar after upload to show it in the list (or keep open? let's keep open for now so they see it)
  };

  return (
    <div className="bg-canvas-dash-light dark:bg-canvas-dash-dark text-slate-800 dark:text-slate-100 font-display transition-colors duration-300 h-screen overflow-hidden flex flex-col">
      <header className="h-16 flex items-center justify-between px-4 lg:px-8 bg-surface-dash-light/80 dark:bg-canvas-dash-dark/80 backdrop-blur-md border-b border-border-dash-light dark:border-border-dash-dark shrink-0 z-20">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setShowSidebar(!showSidebar)}
            className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate(AppView.LANDING)}>
            <div className="flex h-8 w-8 lg:h-9 lg:w-9 items-center justify-center rounded-lg bg-slate-900 dark:bg-white">
              <span className="material-symbols-outlined text-lg lg:text-xl text-white dark:text-slate-900">auto_awesome</span>
            </div>
            <h2 className="text-base lg:text-lg font-bold tracking-wide text-slate-900 dark:text-white hidden sm:block">Research<span className="font-light text-slate-500 dark:text-slate-400">Analyzer</span></h2>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <button onClick={() => onNavigate(AppView.LANDING)} className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-brand-indigo dark:hover:text-brand-indigo transition-colors">Home</button>
          <button className="text-sm font-medium text-brand-indigo font-semibold">Analyze</button>
          <button onClick={() => onNavigate(AppView.DOCS)} className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-brand-indigo dark:hover:text-brand-indigo transition-colors">Docs</button>
        </nav>

        <div className="flex items-center gap-2 lg:gap-4">
          <button 
             onClick={() => setShowConfig(!showConfig)}
             className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
             <span className="material-symbols-outlined">tune</span>
          </button>
          
          <button aria-label="Toggle Dark Mode" onClick={toggleTheme} className="size-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-[20px]">{isDark ? 'light_mode' : 'dark_mode'}</span>
          </button>
          <div className="relative group cursor-pointer">
              <div className="size-9 rounded-full bg-gradient-to-tr from-brand-indigo to-purple-400 p-[2px]">
                <img src={user.avatar} alt={user.name} className="rounded-full w-full h-full object-cover border-2 border-white dark:border-[#101622]" />
              </div>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-dash-dark rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-1 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all z-50">
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

      <main className="flex-1 flex overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {(showSidebar || showConfig) && (
            <div 
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
                onClick={() => { setShowSidebar(false); setShowConfig(false); }}
            />
        )}

        {/* Sidebar */}
        <aside className={`
            fixed inset-y-0 left-0 z-40 w-[280px] lg:w-[320px] bg-surface-dash-light dark:bg-canvas-dash-dark border-r border-border-dash-light dark:border-border-dash-dark flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0
            ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6 lg:p-8 flex flex-col h-full overflow-y-auto">
             <div className="flex items-center justify-between lg:hidden mb-6">
                 <h2 className="text-lg font-bold">Menu</h2>
                 <button onClick={() => setShowSidebar(false)}><span className="material-symbols-outlined">close</span></button>
             </div>

            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Upload Materials</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">PDF, DOCX, TXT supported</p>
            </div>
            
            <div onClick={simulateUpload} className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-brand-indigo/50 hover:bg-brand-indigo/5 transition-all cursor-pointer py-10 px-4 mb-8">
              <div className="size-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
                <span className="material-symbols-outlined text-brand-indigo text-2xl">cloud_upload</span>
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 text-center">Click to browse</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-1">or drag files here</p>
            </div>

            <div className="flex-1 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <span>Uploaded Files</span>
                <span>{files.length}</span>
              </div>
              
              {files.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-4 italic">No files uploaded yet.</p>
              )}

              {files.map(file => (
                  <div key={file.id} onClick={() => { onSelectFile(file); if(window.innerWidth < 1024) setShowSidebar(false); }} className="group cursor-pointer flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-surface-dash-dark border border-border-dash-light dark:border-border-dash-dark hover:border-brand-indigo/30 hover:shadow-sm transition-all">
                    <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${file.type === 'pdf' ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-500'}`}>
                      <span className="material-symbols-outlined text-[20px]">{file.type === 'pdf' ? 'picture_as_pdf' : 'description'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{file.name}</p>
                      <p className="text-[10px] text-slate-400">{file.size} • {file.status}</p>
                    </div>
                  </div>
              ))}
            </div>
            
            {/* Mobile Navigation Links inside Sidebar */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 lg:hidden flex flex-col gap-4">
                 <button onClick={() => onNavigate(AppView.LANDING)} className="text-left text-sm font-medium text-slate-600 dark:text-slate-400">Home</button>
                 <button onClick={() => onNavigate(AppView.DOCS)} className="text-left text-sm font-medium text-slate-600 dark:text-slate-400">Docs</button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="flex-1 bg-surface-dash-light dark:bg-canvas-dash-dark flex flex-col min-w-0 w-full">
          {/* Sub-header tabs */}
          <div className="h-14 border-b border-border-dash-light dark:border-border-dash-dark flex items-center px-4 lg:px-8 bg-white/50 dark:bg-surface-dash-dark/50 backdrop-blur-sm sticky top-0 z-10 overflow-x-auto no-scrollbar">
            <div className="flex gap-6 lg:gap-8 h-full whitespace-nowrap">
               <button 
                 onClick={() => { if(files.length > 0) onSelectFile(files[0]) }}
                 disabled={files.length === 0}
                 className="relative h-full flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors disabled:opacity-50"
              >
                Summary
              </button>
              <button className="relative h-full flex items-center gap-2 text-sm font-bold text-brand-indigo">
                Key Insights
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-indigo rounded-t-full"></div>
              </button>
              <button disabled className="relative h-full flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 opacity-50 cursor-not-allowed">
                Diagrams
                <span className="flex size-1.5 rounded-full bg-brand-indigo/40"></span>
              </button>
              <button 
                onClick={() => onNavigate(AppView.QNA)}
                className="relative h-full flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
              >
                Q&A
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 lg:p-12 relative">
            {!resultsReady ? (
               <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-500">
                    <div className="relative w-64 h-64 mb-8">
                        {/* Background blobs */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl animate-pulse"></div>
                        
                        {/* Main Illustration Container */}
                        <div className="relative z-10 w-full h-full flex items-center justify-center">
                            {/* Central Icon */}
                            <div className="bg-white dark:bg-surface-dash-dark p-6 rounded-3xl shadow-xl shadow-indigo-100 dark:shadow-none border border-slate-100 dark:border-slate-700 relative z-20">
                                <span className="material-symbols-outlined text-6xl text-brand-indigo">
                                    {files.length === 0 ? 'upload_file' : 'query_stats'}
                                </span>
                            </div>

                            {/* Floating Elements (Decorative) */}
                            <div className="absolute top-10 left-10 p-3 bg-white dark:bg-surface-dash-dark rounded-2xl shadow-lg border border-slate-50 dark:border-slate-700 animate-[bounce_3s_infinite]">
                                <span className="material-symbols-outlined text-2xl text-emerald-500">bar_chart</span>
                            </div>
                            <div className="absolute bottom-12 right-12 p-3 bg-white dark:bg-surface-dash-dark rounded-2xl shadow-lg border border-slate-50 dark:border-slate-700 animate-[bounce_4s_infinite_delay-1000]">
                                <span className="material-symbols-outlined text-2xl text-purple-500">pie_chart</span>
                            </div>
                            <div className="absolute top-12 right-8 p-2 bg-white dark:bg-surface-dash-dark rounded-xl shadow-md border border-slate-50 dark:border-slate-700 animate-[bounce_5s_infinite_delay-500]">
                                <span className="material-symbols-outlined text-xl text-amber-500">lightbulb</span>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
                        {files.length === 0 ? "Start your research journey" : "Ready to generate insights"}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed mb-8">
                        {files.length === 0 
                            ? "Upload a document from the sidebar to begin analyzing data, extracting summaries, and generating charts." 
                            : "Your document is staged. Customize your analysis depth in the configuration panel and click 'Generate' to proceed."}
                    </p>
                    
                    {files.length === 0 && (
                        <button 
                            onClick={simulateUpload}
                            className="lg:hidden flex items-center gap-2 px-6 py-3 bg-brand-indigo text-white rounded-full font-bold shadow-lg shadow-indigo-500/25 active:scale-95 transition-transform"
                        >
                            <span className="material-symbols-outlined">upload_file</span>
                            Upload Demo File
                        </button>
                    )}
                    
                    {files.length > 0 && (
                        <button onClick={() => setShowConfig(true)} className="lg:hidden flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 rounded-full font-bold shadow-sm active:scale-95 transition-transform">
                            <span className="material-symbols-outlined">tune</span>
                            Configure Analysis
                        </button>
                    )}
               </div>
            ) : (
            <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8 animate-[fadeIn_0.5s_ease-out]">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <h2 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white">Analysis Results</h2>
                <span className="text-xs lg:text-sm text-slate-500 dark:text-slate-400">Generated just now</span>
              </div>
              
              <div className="bg-white dark:bg-surface-dash-dark rounded-2xl p-6 lg:p-8 shadow-soft border border-slate-100 dark:border-slate-700/50">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-brand-indigo shrink-0">
                    <span className="material-symbols-outlined">lightbulb</span>
                  </div>
                  <div>
                    <h3 className="text-base lg:text-lg font-bold text-slate-900 dark:text-white leading-tight">{mockAnalysisResults.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">Confidence Score: {mockAnalysisResults.confidence}</p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm lg:text-base">
                  {mockAnalysisResults.summary}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-surface-dash-dark rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50">
                  <div className="flex items-center gap-2 mb-3 text-slate-800 dark:text-slate-200 font-semibold">
                    <span className="material-symbols-outlined text-brand-indigo text-[20px]">functions</span>
                    Mathematical Variance
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {mockAnalysisResults.variance}
                  </p>
                </div>
                <div className="bg-white dark:bg-surface-dash-dark rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50">
                  <div className="flex items-center gap-2 mb-3 text-slate-800 dark:text-slate-200 font-semibold">
                    <span className="material-symbols-outlined text-orange-500 text-[20px]">warning</span>
                    Methodology Limitation
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {mockAnalysisResults.limitations}
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-surface-dash-dark rounded-2xl p-6 lg:p-8 shadow-soft border border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Correlation Matrix</h3>
                  <button className="text-sm text-brand-indigo font-medium hover:underline">Expand View</button>
                </div>
                <div className="aspect-video w-full rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-700 relative overflow-hidden p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <Tooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={40} fillOpacity={0.6} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            )}
          </div>
        </section>

         {/* Configuration Panel (Right Sidebar) */}
        <div className={`
             fixed inset-y-0 right-0 z-40 w-[280px] lg:w-[300px] bg-canvas-dash-light dark:bg-[#0b1121] border-l border-border-dash-light dark:border-border-dash-dark flex flex-col items-center justify-center p-6 transition-transform duration-300 lg:relative lg:translate-x-0
             ${showConfig ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <div className="w-full lg:hidden flex justify-end mb-4">
               <button onClick={() => setShowConfig(false)}><span className="material-symbols-outlined">close</span></button>
          </div>

          <div className="w-full max-w-[240px] flex flex-col gap-8">
            <div className="flex flex-col items-center gap-4">
              <button 
                onClick={handleGenerate}
                disabled={analyzing || files.length === 0}
                className="group relative w-full h-14 bg-brand-indigo hover:bg-brand-indigo-hover disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-2xl font-bold shadow-glow hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span className={`material-symbols-outlined ${analyzing ? 'animate-spin' : ''}`}>
                    {analyzing ? 'sync' : 'auto_awesome'}
                  </span>
                  {analyzing ? 'Analyzing...' : 'Generate Insights'}
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
              <div className="text-xs text-slate-400 text-center">Estimated time: ~45s</div>
            </div>
            <div className="w-full h-px bg-slate-200 dark:bg-slate-700"></div>
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Configuration</h3>
                <span className="material-symbols-outlined text-slate-400 text-sm cursor-help" title="Adjust analysis parameters">info</span>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Output Depth</label>
                <div className="bg-white dark:bg-surface-dash-dark p-1 rounded-lg border border-border-dash-light dark:border-border-dash-dark flex shadow-sm">
                  <button className="flex-1 py-1.5 text-xs font-medium rounded text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Brief</button>
                  <button className="flex-1 py-1.5 text-xs font-medium rounded bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm">Standard</button>
                  <button className="flex-1 py-1.5 text-xs font-medium rounded text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Deep</button>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Focus Areas</label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input defaultChecked className="peer h-4 w-4 rounded border-slate-300 text-brand-indigo focus:ring-brand-indigo/20 dark:border-slate-600 dark:bg-slate-700" type="checkbox" />
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-brand-indigo transition-colors">Key Insights</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input defaultChecked className="peer h-4 w-4 rounded border-slate-300 text-brand-indigo focus:ring-brand-indigo/20 dark:border-slate-600 dark:bg-slate-700" type="checkbox" />
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-brand-indigo transition-colors">Visual Diagrams</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input className="peer h-4 w-4 rounded border-slate-300 text-brand-indigo focus:ring-brand-indigo/20 dark:border-slate-600 dark:bg-slate-700" type="checkbox" />
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-brand-indigo transition-colors">Math Formulas</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="h-8 bg-surface-dash-light dark:bg-canvas-dash-dark flex items-center justify-end px-4 border-t border-border-dash-light dark:border-border-dash-dark shrink-0">
        <p className="text-[10px] text-slate-400">Research Analyzer v2.0 • © 2023 Inc.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
