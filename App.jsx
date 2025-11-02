import React, { useState } from 'react';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import Header from './components/Header.jsx';
import { useAuth } from './hooks/useAuth.js';
import { Spinner } from './components/icons/Spinner.jsx';

const App = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Login />;
  }

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

