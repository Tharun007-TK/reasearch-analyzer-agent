
import React, { useState, useRef, useEffect } from 'react';
import { AppView, ChatMessage, User, DocumentFile } from '../types';
import { getChatResponse } from '../services/geminiService';

interface Props {
  onNavigate: (view: AppView) => void;
  toggleTheme: () => void;
  isDark: boolean;
  user: User;
  onLogout: () => void;
  files: DocumentFile[];
  onUpload: (file: DocumentFile) => void;
}

const QnAView: React.FC<Props> = ({ onNavigate, toggleTheme, isDark, user, onLogout, files, onUpload }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeFileId, setActiveFileId] = useState<string | null>(files.length > 0 ? files[0].id : null);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // Mobile responsive states
  const [mobileTab, setMobileTab] = useState<'document' | 'chat'>('chat');
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (files.length > 0 && messages.length === 0) {
       setMessages([{
          id: '1',
          role: 'model',
          text: `Hello! I've analyzed **${files[0].name}**. I can help you summarize findings, explain methodologies, or extract data points. What would you like to know?`,
          timestamp: new Date()
       }]);
    } else if (files.length === 0 && messages.length === 0) {
        setMessages([{
            id: '1',
            role: 'model',
            text: "Hello! Please upload a document to begin our Q&A session.",
            timestamp: new Date()
        }]);
    }
  }, [files]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await getChatResponse(history, userMsg.text);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const simulateUpload = () => {
      const newFile: DocumentFile = {
          id: Date.now().toString(),
          name: `Research_Paper_v${files.length + 1}.pdf`,
          size: '1.2 MB',
          status: 'Ready',
          type: 'pdf',
          uploadDate: 'Just now'
      };
      onUpload(newFile);
      setActiveFileId(newFile.id);
  };

  return (
    <div className="bg-surface-landing-light dark:bg-canvas-landing-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-300 h-screen overflow-hidden flex flex-col">
      <header className="h-16 px-4 lg:px-8 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#101622]/90 backdrop-blur-sm z-50 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
             className="lg:hidden text-slate-500"
             onClick={() => setShowSidebar(!showSidebar)}
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

        {/* Mobile Tab Switcher - Centered */}
        <div className="lg:hidden flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
           <button 
             onClick={() => setMobileTab('document')} 
             className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${mobileTab === 'document' ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-blue' : 'text-slate-500'}`}
           >
             Doc
           </button>
           <button 
             onClick={() => setMobileTab('chat')} 
             className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${mobileTab === 'chat' ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-blue' : 'text-slate-500'}`}
           >
             Chat
           </button>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <button onClick={() => onNavigate(AppView.LANDING)} className="text-sm font-medium text-slate-500 hover:text-brand-blue dark:text-slate-400 dark:hover:text-white transition-colors">Home</button>
          <button onClick={() => onNavigate(AppView.DASHBOARD)} className="text-sm font-medium text-brand-blue dark:text-white relative after:content-[''] after:absolute after:-bottom-5 after:left-0 after:w-full after:h-0.5 after:bg-brand-blue after:rounded-full">Analyze</button>
          <button onClick={() => onNavigate(AppView.DOCS)} className="text-sm font-medium text-slate-500 hover:text-brand-blue dark:text-slate-400 dark:hover:text-white transition-colors">Docs</button>
        </nav>
        <div className="flex items-center gap-4">
          <button aria-label="Toggle dark mode" onClick={toggleTheme} className="size-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-xl">{isDark ? 'light_mode' : 'dark_mode'}</span>
          </button>
          <div className="relative group cursor-pointer">
              <div className="size-9 rounded-full bg-gradient-to-tr from-brand-blue to-blue-400 p-[2px]">
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
        {showSidebar && (
            <div 
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
                onClick={() => setShowSidebar(false)}
            />
        )}

        {/* Sidebar Source List */}
        <aside className={`
            fixed inset-y-0 left-0 z-40 w-[260px] lg:w-64 bg-slate-50 dark:bg-[#0d121c] border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 transition-transform duration-300 lg:relative lg:translate-x-0
            ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-4 lg:p-6 pb-2">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:block mb-4">Sources</h2>
            <button onClick={simulateUpload} className="w-full flex items-center justify-center lg:justify-start gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-brand-blue mb-6">
              <span className="material-symbols-outlined">add_circle</span>
              <span className="hidden lg:block font-medium text-sm">Upload New</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-2 lg:px-4 space-y-1">
            {files.map((file, index) => (
                <div 
                    key={file.id} 
                    onClick={() => { setActiveFileId(file.id); if(window.innerWidth < 1024) setShowSidebar(false); }}
                    className={`group flex items-center gap-3 p-2 lg:px-3 lg:py-2.5 rounded-lg cursor-pointer ${activeFileId === file.id ? 'bg-brand-blue/10' : 'hover:bg-slate-100 dark:hover:bg-slate-800/50 opacity-60 hover:opacity-100 transition-colors'}`}
                >
                    <span className={`material-symbols-outlined text-xl ${activeFileId === file.id ? 'text-brand-blue' : 'text-slate-400'}`}>
                        {file.type === 'pdf' ? 'picture_as_pdf' : 'description'}
                    </span>
                    <div className="hidden lg:flex flex-col min-w-0">
                        <span className={`text-sm font-medium truncate ${activeFileId === file.id ? 'text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'}`}>{file.name}</span>
                        <span className="text-[10px] text-slate-500">{file.uploadDate}</span>
                    </div>
                </div>
            ))}
            {files.length === 0 && (
                <p className="hidden lg:block text-xs text-slate-400 text-center mt-4">No documents</p>
            )}
            
            <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-700 lg:hidden px-2">
                <button onClick={() => onNavigate(AppView.DASHBOARD)} className="w-full text-left p-2 text-sm text-slate-600 dark:text-slate-400">Back to Dashboard</button>
            </div>
          </div>
        </aside>

        {/* Document Viewer (Mock) */}
        <section className={`
            flex-1 bg-slate-100/50 dark:bg-[#0b0f17] relative overflow-hidden flex-col
            ${mobileTab === 'document' ? 'flex' : 'hidden lg:flex'}
        `}>
          {files.length > 0 ? (
            <>
            <div className="h-12 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 bg-white/50 dark:bg-[#101622]/50">
                <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-sm">zoom_in</span>
                <span className="text-xs font-medium text-slate-500">100%</span>
                </div>
                <div className="text-xs font-medium text-slate-400">Page 1 of 12</div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 lg:p-8 flex justify-center">
                <div className="w-full max-w-3xl bg-white dark:bg-slate-900 shadow-soft rounded-sm min-h-[1000px] p-6 lg:p-12 opacity-90 transition-opacity hover:opacity-100">
                <div className="w-3/4 h-8 bg-slate-100 dark:bg-slate-800 mb-8 rounded"></div>
                <div className="space-y-3 mb-10">
                    <div className="w-full h-3 bg-slate-50 dark:bg-slate-800/50 rounded"></div>
                    <div className="w-full h-3 bg-slate-50 dark:bg-slate-800/50 rounded"></div>
                    <div className="w-5/6 h-3 bg-slate-50 dark:bg-slate-800/50 rounded"></div>
                </div>
                <div className="flex flex-col sm:flex-row gap-6 mb-10">
                    <div className="flex-1 h-32 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800"></div>
                    <div className="flex-1 h-32 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800"></div>
                </div>
                <div className="space-y-3">
                    <div className="w-full h-3 bg-slate-50 dark:bg-slate-800/50 rounded"></div>
                    <div className="w-full h-3 bg-yellow-100/50 dark:bg-yellow-900/20 rounded relative"></div>
                    <div className="w-4/5 h-3 bg-slate-50 dark:bg-slate-800/50 rounded"></div>
                    <div className="w-full h-3 bg-slate-50 dark:bg-slate-800/50 rounded"></div>
                </div>
                </div>
            </div>
            </>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                 <span className="material-symbols-outlined text-4xl mb-2">description</span>
                 <p>No document selected</p>
             </div>
          )}
        </section>

        {/* Chat Interface */}
        <section className={`
            w-full lg:w-[420px] bg-white dark:bg-[#101622] border-l border-slate-200 dark:border-slate-800 flex-col shadow-2xl shadow-slate-200/50 dark:shadow-none z-20
            ${mobileTab === 'chat' ? 'flex' : 'hidden lg:flex'}
        `}>
          <div className="px-6 py-4 border-b border-slate-50 dark:border-slate-800/50 flex flex-col gap-2 bg-white/95 dark:bg-[#101622]/95 backdrop-blur z-10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-brand-blue">smart_toy</span>
                Q&A Assistant
              </h3>
              <button 
                className="text-slate-400 hover:text-brand-blue transition-colors" 
                title="Reset Chat"
                onClick={() => setMessages([])}
              >
                <span className="material-symbols-outlined text-[20px]">restart_alt</span>
              </button>
            </div>
            {files.length > 0 && (
                <div className="self-start inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="material-symbols-outlined text-[14px] text-slate-500">link</span>
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Context: {files.find(f => f.id === activeFileId)?.name || 'Selected Document'}</span>
                </div>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-8 bg-white dark:bg-[#101622]" ref={scrollRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-4 items-start ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-[fadeIn_0.3s_ease-out]`}>
                {msg.role === 'model' ? (
                  <div className="size-8 rounded-full bg-gradient-to-br from-indigo-500 to-brand-blue flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                    <span className="material-symbols-outlined text-white text-sm">smart_toy</span>
                  </div>
                ) : (
                  <div className="size-8 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                    <img alt="User" className="w-full h-full object-cover" src={user.avatar} />
                  </div>
                )}
                
                <div className={`flex flex-col gap-1 max-w-[85%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                  {msg.role === 'model' && <span className="text-xs font-semibold text-slate-500 mb-1 ml-1">AI Assistant</span>}
                  <div className={`
                    p-4 rounded-2xl text-sm leading-relaxed shadow-sm
                    ${msg.role === 'model' 
                      ? 'bg-slate-50 dark:bg-slate-800/80 rounded-tl-none text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700/50' 
                      : 'bg-brand-blue text-white rounded-tr-none shadow-md shadow-brand-blue/20'
                    }
                  `}>
                    <div dangerouslySetInnerHTML={{ 
                      __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                    }} />
                  </div>
                  {msg.role === 'user' && (
                     <span className="text-[10px] text-slate-400 mr-1">{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
               <div className="flex gap-4 items-start">
                  <div className="size-8 rounded-full bg-gradient-to-br from-indigo-500 to-brand-blue flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                    <span className="material-symbols-outlined text-white text-sm">smart_toy</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700/50">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                    </div>
                  </div>
               </div>
            )}
          </div>

          <div className="p-4 lg:p-6 pt-2 bg-white dark:bg-[#101622] relative">
            <div className="relative flex items-end gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-none p-2 focus-within:ring-2 focus-within:ring-brand-blue/20 focus-within:border-brand-blue transition-all">
              <button className="p-2 text-slate-400 hover:text-brand-blue hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors shrink-0" title="Attach file">
                <span className="material-symbols-outlined">attach_file</span>
              </button>
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={files.length === 0}
                className="w-full bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 text-sm resize-none focus:ring-0 py-2.5 max-h-32 disabled:opacity-50 disabled:cursor-not-allowed" 
                placeholder={files.length > 0 ? "Ask a question..." : "Upload a paper..."} 
                rows={1} 
                style={{minHeight: '44px'}}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping || files.length === 0}
                className="p-2 bg-brand-blue text-white rounded-xl shadow-md shadow-brand-blue/30 hover:bg-blue-600 transition-colors shrink-0 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
              </button>
            </div>
            <div className="mt-3 text-center">
              <p className="text-[10px] text-slate-400">AI can make mistakes.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default QnAView;
