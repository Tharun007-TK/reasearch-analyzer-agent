
import React, { useState } from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
  onLogin: (provider: string, email?: string) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const LoginPage: React.FC<Props> = ({ onNavigate, onLogin, toggleTheme, isDark }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [viewState, setViewState] = useState<'login' | 'forgot_password' | 'reset_sent'>('login');

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin(provider);
    }, 1000);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    setTimeout(() => {
      onLogin('email', email);
    }, 1000);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    // Simulate sending email
    setTimeout(() => {
      setIsLoading(false);
      setViewState('reset_sent');
    }, 1500);
  };

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
          
          <button 
              aria-label="Toggle Dark Mode" 
              onClick={toggleTheme}
              className="group flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-surface-landing-light text-slate-600 hover:bg-slate-100 hover:text-brand-blue dark:bg-surface-landing-dark dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-300 transition-all"
            >
              <span className="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col justify-center items-center px-4 z-10 py-12">
        <div className="w-full max-w-md bg-white dark:bg-surface-landing-dark p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
          
          {/* LOGIN VIEW */}
          {viewState === 'login' && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Sign in to continue your research</p>
              </div>

              <div className="space-y-3 mb-6">
                <button 
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                  className="w-full h-12 flex items-center justify-center gap-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 transition-all font-medium text-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>
                <button 
                  onClick={() => handleSocialLogin('github')}
                  disabled={isLoading}
                  className="w-full h-12 flex items-center justify-center gap-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 transition-all font-medium text-sm"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Continue with GitHub
                </button>
                <button 
                  onClick={() => handleSocialLogin('microsoft')}
                  disabled={isLoading}
                  className="w-full h-12 flex items-center justify-center gap-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 transition-all font-medium text-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 23 23">
                    <path fill="#f25022" d="M1 1h10v10H1z"/>
                    <path fill="#00a4ef" d="M12 1h10v10H12z"/>
                    <path fill="#7fba00" d="M1 12h10v10H1z"/>
                    <path fill="#ffb900" d="M12 12h10v10H12z"/>
                  </svg>
                  Continue with Microsoft
                </button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-surface-landing-dark text-slate-500">Or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Email Address</label>
                  <input 
                    type="email" 
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                    placeholder="name@research.edu"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="password" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">Password</label>
                    <button 
                      type="button" 
                      onClick={() => setViewState('forgot_password')}
                      className="text-xs font-semibold text-brand-blue hover:text-blue-600 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input 
                    type="password" 
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                    placeholder="••••••••"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading && <span className="material-symbols-outlined animate-spin text-lg">sync</span>}
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                Don't have an account? <button className="text-brand-blue font-semibold hover:underline">Sign up</button>
              </p>
            </>
          )}

          {/* FORGOT PASSWORD VIEW */}
          {viewState === 'forgot_password' && (
             <div className="animate-[fadeIn_0.3s_ease-out]">
                <div className="text-center mb-8">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-blue">
                    <span className="material-symbols-outlined text-2xl">lock_reset</span>
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Reset Password</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label htmlFor="reset-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Email Address</label>
                    <input 
                      type="email" 
                      id="reset-email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                      placeholder="name@research.edu"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                        <span>Sending...</span>
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setViewState('login')}
                    disabled={isLoading}
                    className="w-full h-12 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    Back to Sign In
                  </button>
                </form>
             </div>
          )}

          {/* RESET SUCCESS VIEW */}
          {viewState === 'reset_sent' && (
            <div className="animate-[fadeIn_0.3s_ease-out] text-center">
               <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 dark:text-green-400">
                  <span className="material-symbols-outlined text-3xl">mark_email_read</span>
               </div>
               <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Check your email</h1>
               <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
                  We've sent a password reset link to <br/>
                  <span className="font-semibold text-slate-900 dark:text-white">{email}</span>
               </p>
               
               <button 
                  onClick={() => setViewState('login')}
                  className="w-full h-12 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl transition-all"
                >
                  Back to Sign In
                </button>
                <p className="mt-6 text-xs text-slate-400">
                  Didn't receive the email? <button onClick={() => setViewState('forgot_password')} className="text-brand-blue hover:underline">Click to retry</button>
                </p>
            </div>
          )}

        </div>
      </main>

       <footer className="w-full py-8 mt-auto">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-6 px-6 md:px-12 lg:px-20">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-sm font-medium text-slate-400">© 2023 Research Analyzer. All rights reserved.</p>
             <div className="flex gap-6">
              <a className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" href="#">Privacy Policy</a>
              <a className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" href="#">Terms of Service</a>
              <a className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" href="#">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
