import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Role } from '../types'; // Added Role import
import { EditIcon } from './icons/EditIcon';
import { DeleteIcon } from './icons/DeleteIcon';

const PostCard = ({ post, onEdit, onDelete }) => {
  const { user } = useAuth();

  if (!user) return null;

  const isOwner = post.authorId === user.id;
  // Corrected to use Role enum
  const isAdmin = user.role === Role.ADMIN;

  const canEdit = isOwner || isAdmin;
  const canDelete = isOwner || isAdmin;
  
  // Use post.id (which we mapped from _id) or fallback to _id
  const postId = post.id || post._id;

  return (
    <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg overflow-hidden flex flex-col transition-transform transform hover:scale-105">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{post.title}</h3>
          {(canEdit || canDelete) && (
            <div className="flex space-x-2 flex-shrink-0 ml-2">
              {canEdit && (
                <button
                  onClick={() => onEdit(post)}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                  title="Edit Post"
                >
                  <EditIcon />
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => onDelete(postId)}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                  title="Delete Post"
                >
                  <DeleteIcon />
                </button>
              )}
            </div>
          )}
        </div>
        {/* Use 'body' field to match server model */}
        <p className="text-gray-600 dark:text-gray-300">{post.body}</p>
      </div>
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Author:{' '}
          <span className="font-medium text-gray-700 dark:text-gray-200">
            {/* Use the authorUsername field we now provide */}
            {post.authorUsername || 'Unknown'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default PostCard;
