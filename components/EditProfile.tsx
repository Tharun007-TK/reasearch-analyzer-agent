
import React, { useState, useRef, useEffect } from 'react';
import { AppView, User } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
  toggleTheme: () => void;
  isDark: boolean;
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
}

const EditProfile: React.FC<Props> = ({ onNavigate, toggleTheme, isDark, user, onUpdateUser, onLogout }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    institution: user.institution || '',
    bio: user.bio || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  
  // Camera State & Refs
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      onUpdateUser({
        ...user,
        name: formData.name,
        avatar: formData.avatar,
        institution: formData.institution,
        bio: formData.bio
      });
      setIsSaving(false);
      onNavigate(AppView.DASHBOARD);
    }, 1000);
  };

  // File Upload Logic
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData(prev => ({ ...prev, avatar: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Start Camera Logic
  useEffect(() => {
    const startCamera = async () => {
      if (showCamera) {
        try {
          if (!streamRef.current) {
             const stream = await navigator.mediaDevices.getUserMedia({ video: true });
             streamRef.current = stream;
          }
          
          // Re-attach stream to video element if it exists (e.g. after retaking)
          // We check !capturedImage to ensure we only try to play video when in capture mode
          if (videoRef.current && streamRef.current && !capturedImage) {
            videoRef.current.srcObject = streamRef.current;
            videoRef.current.play().catch(e => console.log("Video play error:", e));
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
          alert("Could not access camera. Please allow permissions.");
          setShowCamera(false);
        }
      }
    };

    if (showCamera) {
      startCamera();
    } else {
      // Cleanup when modal closes
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setCapturedImage(null); // Reset captured image
    }
  }, [showCamera, capturedImage]); // Re-run when switching back to video mode (capturedImage becomes null)

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        // Set canvas dimensions to match video
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        
        // Draw video frame to canvas
        context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
        
        // Convert to data URL
        const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.8);
        setCapturedImage(dataUrl);
      }
    }
  };

  const confirmPhoto = () => {
    if (capturedImage) {
        setFormData(prev => ({ ...prev, avatar: capturedImage }));
        setShowCamera(false);
        setCapturedImage(null);
    }
  };

  const retakePhoto = () => {
      setCapturedImage(null);
  };

  const closeCamera = () => {
    setShowCamera(false);
    setCapturedImage(null);
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
            <button onClick={() => onNavigate(AppView.DASHBOARD)} className="text-sm font-medium text-slate-500 hover:text-brand-blue dark:text-slate-400 dark:hover:text-white transition-colors">Analyze</button>
            <button onClick={() => onNavigate(AppView.DOCS)} className="text-sm font-medium text-slate-500 hover:text-brand-blue dark:text-slate-400 dark:hover:text-white transition-colors">Docs</button>
          </nav>

          <div className="flex items-center gap-4">
            <button aria-label="Toggle Dark Mode" onClick={toggleTheme} className="group flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-surface-landing-light text-slate-600 hover:bg-slate-100 hover:text-brand-blue dark:bg-surface-landing-dark dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-300 transition-all">
              <span className="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            
            <div className="relative group cursor-pointer">
              <div className="size-9 rounded-full bg-gradient-to-tr from-brand-blue to-blue-400 p-[2px]">
                <img src={user.avatar} alt={user.name} className="rounded-full w-full h-full object-cover border-2 border-white dark:border-[#101622]" />
              </div>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-dash-dark rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-1 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                </div>
                <button onClick={() => onNavigate(AppView.DASHBOARD)} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Back to Dashboard</button>
                <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50 dark:hover:bg-slate-800">Sign Out</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow flex justify-center py-12 px-6">
        <div className="w-full max-w-2xl bg-white dark:bg-surface-landing-dark rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full text-brand-blue">
                    <span className="material-symbols-outlined text-2xl">manage_accounts</span>
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Profile</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Update your personal information and preferences.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wide">Full Name</label>
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full h-11 px-4 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wide">Email</label>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            disabled
                            className="w-full h-11 px-4 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wide">Avatar URL</label>
                    <div className="flex gap-4">
                        <input 
                            type="text" 
                            name="avatar"
                            value={formData.avatar}
                            onChange={handleChange}
                            placeholder="https://..."
                            className="flex-1 h-11 px-4 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                        />
                         {/* Hidden File Input */}
                         <input 
                            type="file" 
                            ref={fileInputRef} 
                            accept="image/*" 
                            onChange={handleFileSelect} 
                            className="hidden" 
                         />
                         <button 
                            type="button" 
                            onClick={() => fileInputRef.current?.click()}
                            className="h-11 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-2"
                            title="Upload from Device"
                        >
                            <span className="material-symbols-outlined text-[20px]">upload_file</span>
                            <span className="hidden sm:inline text-sm font-medium">Upload</span>
                        </button>
                         <button 
                            type="button" 
                            onClick={() => setShowCamera(true)}
                            className="h-11 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-2"
                            title="Take Photo"
                        >
                            <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                            <span className="hidden sm:inline text-sm font-medium">Camera</span>
                        </button>
                        <div className="size-11 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                             <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://api.dicebear.com/9.x/avataaars/svg?seed=fallback')} />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wide">Institution / Organization</label>
                    <input 
                        type="text" 
                        name="institution"
                        value={formData.institution}
                        onChange={handleChange}
                        placeholder="e.g. Stanford University"
                        className="w-full h-11 px-4 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                    />
                </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wide">Bio</label>
                    <textarea 
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell us a bit about your research interests..."
                        className="w-full p-4 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all resize-none"
                    />
                </div>

                <div className="pt-4 flex gap-4">
                    <button 
                        type="button" 
                        onClick={() => onNavigate(AppView.DASHBOARD)}
                        className="flex-1 h-12 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-all"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={isSaving}
                        className="flex-1 h-12 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSaving ? <span className="material-symbols-outlined animate-spin">sync</span> : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
      </main>

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-surface-landing-dark rounded-2xl p-6 w-full max-w-md flex flex-col items-center shadow-2xl border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    {capturedImage ? "Review Photo" : "Take a Photo"}
                </h3>
                
                <div className="relative w-full aspect-square bg-black rounded-xl overflow-hidden mb-6 ring-4 ring-slate-100 dark:ring-slate-800">
                    {!capturedImage && (
                         <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
                    )}
                    {capturedImage && (
                         <img src={capturedImage} alt="Captured" className="w-full h-full object-cover transform scale-x-[-1]" />
                    )}
                    <canvas ref={canvasRef} className="hidden" />
                </div>
                
                <div className="flex gap-4 w-full">
                    {capturedImage ? (
                        <>
                            <button 
                                type="button" 
                                onClick={retakePhoto}
                                className="flex-1 h-11 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[18px]">replay</span>
                                Retake
                            </button>
                            <button 
                                type="button" 
                                onClick={confirmPhoto}
                                className="flex-1 h-11 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[18px]">check</span>
                                Confirm
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                type="button" 
                                onClick={closeCamera}
                                className="flex-1 h-11 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-semibold rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="button" 
                                onClick={capturePhoto}
                                className="flex-1 h-11 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[20px]">camera</span>
                                Capture
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
