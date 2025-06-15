import React from 'react';
import { Header } from '@/components/Header';
import { useAuth } from '@/components/auth/AuthProvider';
import { AuthForm } from '@/components/auth/AuthForm';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Upload, FileText, BarChart3 } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {user ? (
        <div className="flex items-center justify-center py-12">
          <div className="max-w-4xl w-full mx-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to PO-Quote Validator</h1>
              <p className="text-xl text-gray-600 mb-8">Choose an action to get started with document analysis</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Link to="/app">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-6 mx-auto">
                    <Upload className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Upload & Analyze</h3>
                  <p className="text-gray-600 text-center mb-6">Upload PO and Quote documents for automated comparison and validation</p>
                  <Button className="w-full">
                    Get Started
                  </Button>
                </div>
              </Link>
              
              <Link to="/processed-pos">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-lg mb-6 mx-auto">
                    <FileText className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Processed POs</h3>
                  <p className="text-gray-600 text-center mb-6">View and manage previously processed purchase orders and their analysis results</p>
                  <Button variant="outline" className="w-full">
                    View History
                  </Button>
                </div>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-8 px-4">
          <div className="w-full max-w-md">
            <AuthForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
