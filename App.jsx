import React, { useState } from 'react';
// Use the '@' alias for imports, as defined in vite.config.js
import Login from '@/components/Login.jsx';
import Dashboard from '@/components/Dashboard.jsx';
import AdminPanel from '@/components/AdminPanel.jsx';
import Header from '@/components/Header.jsx';
import { useAuth } from '@/hooks/useAuth.js';
import { Spinner } from '@/components/icons/Spinner.jsx';

const App = () => {
  // We still get isLoading, but we no longer use it to unmount the <Login /> component.
  const { user, isAuthenticated, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  // The global isLoading check has been removed from here.
  // The AuthProvider no longer sets isLoading to true during login,
  // so this check was only preventing the login page from showing its own errors.

  if (!isAuthenticated || !user) {
    // We now render <Login /> directly.
    // The <Login /> component itself has an internal "isSubmitting"
    // state to show a spinner on the button, which is better UX.
    return <Login />;
  }

  // This part remains the same, for when the user is authenticated.
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'admin' && <AdminPanel />}
      </main>
    </div>
  );
};

export default App;

