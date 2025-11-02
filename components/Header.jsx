import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogoutIcon } from './icons/LogoutIcon';
import { AdminIcon } from './icons/AdminIcon';
import { Role } from '../types';

const Header = ({ currentPage, setCurrentPage }) => {
  const { user, logout } = useAuth();

  const navLinkClasses = (page) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      currentPage === page
        ? 'bg-gray-900 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <header className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-white font-bold text-xl">
              RBAC
            </div>
            <nav className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className={navLinkClasses('dashboard')}
                >
                  Dashboard
                </button>
                {user?.role === Role.ADMIN && (
                  <button
                    onClick={() => setCurrentPage('admin')}
                    className={navLinkClasses('admin')}
                  >
                    Admin Panel
                  </button>
                )}
              </div>
            </nav>
          </div>
          <div className="flex items-center">
            <div className="text-gray-300 mr-4">
              <span className="font-medium">{user?.username}</span>
              <span
                className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  user?.role === Role.ADMIN
                    ? 'bg-red-100 text-red-800'
                    : user?.role === Role.EDITOR
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {user?.role}
              </span>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              title="Logout"
            >
              <LogoutIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
