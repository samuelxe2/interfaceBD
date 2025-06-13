import React from 'react';
import RegistrationForm from './components/RegistrationForm';
import { Database } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Database className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Database Interface 2025</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Register a new user account by filling out the form below. All fields are required and your email will be validated before registration.
          </p>
        </header>
        
        <main className="mb-12">
          <RegistrationForm />
        </main>
        
        <footer className="text-center text-gray-500 text-sm pb-8">
          <p>© 2025 Database Interface System. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;