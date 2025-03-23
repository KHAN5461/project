
import React from 'react';
import { Link } from 'react-router-dom';
import { Cloud, Github, Twitter, Facebook, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-12 bg-card border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 group mb-4">
              <Cloud className="h-6 w-6 text-primary group-hover:animate-float transition-all" />
              <span className="font-semibold text-lg tracking-tight">
                Cloudcraft
              </span>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-md">
              Cloudcraft is an intuitive game development platform that lets you create,
              collaborate, and publish games right from your browser.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation links */}
          <div>
            <h3 className="font-medium text-sm tracking-wider uppercase text-muted-foreground mb-4">
              Product
            </h3>
            <ul className="space-y-2">
              {['Features', 'Pricing', 'Examples', 'Documentation', 'Tutorials'].map(item => (
                <li key={item}>
                  <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-sm tracking-wider uppercase text-muted-foreground mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              {['About', 'Blog', 'Careers', 'Contact', 'Terms', 'Privacy'].map(item => (
                <li key={item}>
                  <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} Cloudcraft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
