
import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import QnAView from './components/QnAView';
import SummaryView from './components/SummaryView';
import DocsView from './components/DocsView';
import EditProfile from './components/EditProfile';
import { AppView, User, DocumentFile } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  
  // Shared State for Files
  const [files, setFiles] = useState<DocumentFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<DocumentFile | null>(null);

  // Initialize theme based on preference
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  // Update HTML class for Tailwind dark mode
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleLogin = (provider: string, email?: string) => {
    setUser({
      name: "Dr. Alex Researcher",
      email: email || "alex@research.edu",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuChrNx6kmDL3YNhqV8ZFLQWoDW8q7qBlIolUGdjt1dqUKlDvwz1rkyQO8IBlIi0LSPeaqW7qsef-lEYXlCAs1iBntlHD5mbNu8Eukj6cnYtrmMzSKlu0fVynNaeEKa8YD_Xy9AwmhTgA6eNBpWsTfahoBztgFJu1DdLibPw7ToSwXFLHYJaRto6NU9zrzt2Y7tlkXYjohkvQjhO8k_x2vGnEXf5AQI4KcYqgpXwg2seMNXcPM73Iey0ne5X3nNHqu4zETYwcvM1zg4d"
    });
    setCurrentView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView(AppView.LANDING);
    setFiles([]); // Clear user data on logout
    setSelectedFile(null);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleFileUpload = (newFile: DocumentFile) => {
    setFiles(prev => [newFile, ...prev]);
  };

  const handleFileSelect = (file: DocumentFile) => {
    setSelectedFile(file);
    setCurrentView(AppView.SUMMARY);
  };

  const renderView = () => {
    // Public Views
    if (currentView === AppView.LANDING) {
      return <LandingPage onNavigate={setCurrentView} toggleTheme={toggleTheme} isDark={darkMode} user={user} onLogout={handleLogout} />;
    }
    if (currentView === AppView.LOGIN) {
      return <LoginPage onNavigate={setCurrentView} onLogin={handleLogin} toggleTheme={toggleTheme} isDark={darkMode} />;
    }
    if (currentView === AppView.DOCS) {
       return <DocsView onNavigate={setCurrentView} toggleTheme={toggleTheme} isDark={darkMode} user={user} onLogout={handleLogout} />;
    }

    // Protected Views
    if (!user) {
      return <LoginPage onNavigate={setCurrentView} onLogin={handleLogin} toggleTheme={toggleTheme} isDark={darkMode} />;
    }

    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard 
                  onNavigate={setCurrentView} 
                  toggleTheme={toggleTheme} 
                  isDark={darkMode} 
                  user={user} 
                  onLogout={handleLogout} 
                  files={files}
                  onUpload={handleFileUpload}
                  onSelectFile={handleFileSelect}
               />;
      case AppView.QNA:
        return <QnAView 
                  onNavigate={setCurrentView} 
                  toggleTheme={toggleTheme} 
                  isDark={darkMode} 
                  user={user} 
                  onLogout={handleLogout}
                  files={files} 
                  onUpload={handleFileUpload}
               />;
      case AppView.SUMMARY:
        return <SummaryView 
                  onNavigate={setCurrentView} 
                  toggleTheme={toggleTheme} 
                  isDark={darkMode} 
                  user={user} 
                  onLogout={handleLogout}
                  selectedFile={selectedFile}
               />;
      case AppView.EDIT_PROFILE:
        return <EditProfile 
                  onNavigate={setCurrentView} 
                  toggleTheme={toggleTheme} 
                  isDark={darkMode} 
                  user={user} 
                  onUpdateUser={handleUpdateUser} 
                  onLogout={handleLogout}
                />;
      default:
        return <LandingPage onNavigate={setCurrentView} toggleTheme={toggleTheme} isDark={darkMode} user={user} onLogout={handleLogout} />;
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      {renderView()}
    </div>
  );
};

export default App;
