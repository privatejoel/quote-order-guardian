
import React from 'react';
import { Header } from '@/components/Header';
import { useAuth } from '@/components/auth/AuthProvider';
import { AuthForm } from '@/components/auth/AuthForm';
import { DataValidation } from '@/components/DataValidation';

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
        <DataValidation />
      ) : (
        <div className="flex items-center justify-center py-12">
          <div className="max-w-md w-full mx-4">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to access the document analysis tool</p>
            </div>
            <AuthForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
