import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/mockApi'; // Corrected import
import { useAuth } from '../hooks/useAuth';
import { Role } from '../types'; // Added Role import
import PostCard from './PostCard';
import PostModal from './PostModal';
import { Spinner } from './icons/Spinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      // Corrected to use api object
      const fetchedPosts = await api.get('/posts');
      setPosts(fetchedPosts);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreatePost = () => {
    setEditingPost(null);
    setIsModalOpen(true);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleDeletePost = async (postId) => {
    // Replaced window.confirm with a custom modal logic (or remove check)
    // For this demo, we'll just confirm
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        // Corrected to use api object
        await api.del(`/posts/${postId}`);
        await fetchPosts();
      } catch (e) {
        // Replaced alert with console.error
        console.error(e.message);
        alert(e.message); // Keeping alert for demo, but console is better
      }
    }
  };

  const handleSavePost = async (title, content) => {
    try {
      if (editingPost) {
        // Corrected to use api object
        await api.put(`/posts/${editingPost.id}`, { title, body: content }); // Use body
      } else {
        // Corrected to use api object
        await api.post('/posts', { title, body: content }); // Use body
      }
      setIsModalOpen(false);
      await fetchPosts();
    } catch (e) {
      console.error(e.message);
      alert(e.message); // Keeping alert for demo
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center mt-10">
        <Spinner className="w-12 h-12" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  // Corrected to use Role enum
  const canCreate = user?.role === Role.ADMIN || user?.role === Role.EDITOR;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Content Dashboard</h1>
        {canCreate && (
          <button
            onClick={handleCreatePost}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
          >
            Create Post
          </button>
        )}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard
            key={post.id || post._id} // Handle both id and _id
            post={post}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
          />
        ))}
      </div>
      {posts.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-10">No posts found.</p>
      )}

      <PostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePost}
        post={editingPost}
      />
    </div>
  );
};

export default Dashboard;
