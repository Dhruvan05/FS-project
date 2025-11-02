import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/mockApi'; // Corrected import
import { useAuth } from '../hooks/useAuth';
import { Role } from '../types'; // Added Role import
import { Spinner } from './icons/Spinner';

const AdminPanel = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Corrected to use api object
      const fetchedUsers = await api.get('/users'); 
      setUsers(fetchedUsers);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Corrected to use Role enum
    if (user?.role === Role.ADMIN) {
      fetchUsers();
    }
  }, [user, fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      // Corrected to use api object
      await api.put(`/users/${userId}`, { role: newRole });
      await fetchUsers(); // Refresh list after update
    } catch (e) {
      console.error(`Error updating role: ${e.message}`);
      alert(`Error updating role: ${e.message}`);
    }
  };

  // Corrected to use Role enum
  if (user?.role !== Role.ADMIN) {
    return <div className="text-center text-red-500 mt-10">Access Denied. You must be an administrator to view this page.</div>;
  }

  if (isLoading) {
    return <div className="flex justify-center mt-10"><Spinner className="w-12 h-12" /></div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">User Management</h1>
      <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Current Role
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Change Role
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-600 text-sm">
                    <p className="text-gray-900 dark:text-white whitespace-no-wrap">{u.name}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-600 text-sm">
                    <p className="text-gray-900 dark:text-white whitespace-no-wrap">{u.email}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-600 text-sm">
                    <span
                      className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full ${
                        // Corrected to use Role enum
                        u.role === Role.ADMIN
                          ? 'bg-red-200 text-red-900'
                          : u.role === Role.EDITOR
                          ? 'bg-yellow-200 text-yellow-900'
                          : 'bg-green-200 text-green-900'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-600 text-sm">
                    {u.id !== user.id ? (
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      >
                        {/* Corrected values to match server */}
                        <option value="Admin">Admin</option>
                        <option value="Editor">Editor</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">Cannot change own role</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
