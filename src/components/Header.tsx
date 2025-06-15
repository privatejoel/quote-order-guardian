
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User, FileText, Upload } from 'lucide-react';
import { useAuth } from './auth/AuthProvider';
import { Link, useLocation } from 'react-router-dom';

export const Header = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/">
          <div className="cursor-pointer">
            <h1 className="text-2xl font-bold text-gray-900">PO-Quote Validator</h1>
            <p className="text-sm text-gray-600">Document Analysis Tool</p>
          </div>
        </Link>
        
        {user && (
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-2">
              <Link to="/app">
                <Button 
                  variant={location.pathname === '/app' ? 'default' : 'ghost'} 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload & Analyze
                </Button>
              </Link>
              <Link to="/processed-pos">
                <Button 
                  variant={location.pathname === '/processed-pos' ? 'default' : 'ghost'} 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Processed POs
                </Button>
              </Link>
            </nav>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              {user.email}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
