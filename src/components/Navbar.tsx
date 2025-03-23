
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Menu, X, ChevronDown, Moon, Sun, Github, 
  Cloud, Home, Edit3, Users, Settings, Download, LogIn, LogOut, User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Editor', href: '/editor', icon: Edit3, requiresAuth: true },
    { name: 'Multiplayer', href: '/multiplayer', icon: Users, requiresAuth: true },
    { name: 'Export', href: '/export', icon: Download, requiresAuth: true },
    { name: 'Settings', href: '/settings', icon: Settings, requiresAuth: true },
  ];

  // Filter navigation items based on authentication
  const filteredNavigation = navigation.filter(item => 
    !item.requiresAuth || (item.requiresAuth && isAuthenticated)
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Check for dark mode preference
    if (typeof window !== 'undefined') {
      const isDark = localStorage.getItem('darkMode') === 'true' || 
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${
      isScrolled ? 'glass shadow-sm backdrop-blur-lg' : 'bg-transparent'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <Cloud className="h-7 w-7 text-primary group-hover:animate-float transition-all" />
              <span className="font-semibold text-xl tracking-tight">
                Cloudcraft
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`navigation-link ${isActive(item.href) ? 'navigation-link-active' : ''}`}
              >
                <span className="flex items-center">
                  {React.createElement(item.icon, { 
                    className: "mr-1 h-4 w-4",
                    "aria-hidden": "true",
                  })}
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDarkMode}
              className="rounded-full"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <div className="hidden md:block text-sm font-medium">
                  {user?.username}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="hidden md:flex items-center"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={handleLogin}
                className="hidden md:flex items-center"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}

            <Button
              className="hidden md:flex"
              variant="outline"
              size="sm"
              asChild
            >
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                <span>GitHub</span>
              </a>
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden ${
          mobileMenuOpen ? 'block animate-fade-in' : 'hidden'
        }`}
      >
        <div className="glass mx-4 my-2 p-4 rounded-xl shadow-glass">
          <nav className="flex flex-col space-y-3">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center p-2 rounded-lg ${
                  isActive(item.href)
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-background/50'
                }`}
              >
                {React.createElement(item.icon, { className: "mr-3 h-5 w-5" })}
                {item.name}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <Button
                className="w-full mt-2 justify-start"
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </Button>
            ) : (
              <Button
                className="w-full mt-2 justify-start"
                variant="default"
                size="sm"
                onClick={handleLogin}
              >
                <LogIn className="mr-2 h-4 w-4" />
                <span>Sign In</span>
              </Button>
            )}
            
            <Button
              className="w-full mt-2 justify-start"
              variant="outline"
              size="sm"
              asChild
            >
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                <span>GitHub</span>
              </a>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
