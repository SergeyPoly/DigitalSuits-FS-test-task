import React, { FC, useState } from 'react'
import { Todo, UpdateTodoData } from '@/types';

interface Props {
  todo: Todo;
  onUpdate: (id: string, data: UpdateTodoData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isUpdating: boolean;
  isDeleting: boolean;
}

const TodoItem: FC<Props> = ({ todo, onUpdate, onDelete, isUpdating, isDeleting }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(todo.description || '');
  const [error, setError] = useState<string | null>(null);

  const handleToggleComplete = async () => {
    setError(null);
    try {
      await onUpdate(todo.id, { completed: !todo.completed });
    } catch (err: any) {
      setError(err.message || 'Error changing status.');
    }
  };

  const handleDelete = async () => {
    setError(null);
    // TODO change this logic to modal window
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await onDelete(todo.id);
      } catch (err: any) {
        setError(err.message || 'Error deleting task.');
      }
    }
  };

  const handleEditSave = async () => {
    setError(null);
    if (!editedTitle.trim()) {
      setError('Task name cannot be empty.');
      return;
    }
    try {
      await onUpdate(todo.id, {
        title: editedTitle,
        description: editedDescription.trim() || undefined,
      });
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Error updating task.');
    }
  };

  const handleCancelEdit = () => {
    setEditedTitle(todo.title);
    setEditedDescription(todo.description || '');
    setIsEditing(false);
    setError(null);
  };

  const itemClassName = `
    bg-gray-700 p-4 rounded-lg shadow-md mb-4 flex flex-col transition duration-200 ease-in-out
    ${todo.completed ? 'opacity-70 border-l-4 border-green-500' : 'border-l-4 border-blue-500'}
  `;

  return (
    <div className={itemClassName}>
      {error && <p className="text-red-400 mb-2 text-sm">{error}</p>}
      {isEditing ? (
        <div className="flex-grow">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full bg-gray-600 text-white rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isUpdating}
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full bg-gray-600 text-white rounded px-3 py-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description"
            disabled={isUpdating}
          />
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={handleEditSave}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isUpdating}
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-full text-sm transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isUpdating}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-grow">
          <h3 className={`text-xl font-semibold text-white ${todo.completed ? 'line-through' : ''}`}>
            {todo.title}
          </h3>
          {todo.description && (
            <p className={`text-gray-300 mt-1 ${todo.completed ? 'line-through' : ''}`}>
              {todo.description}
            </p>
          )}
          <p className="text-gray-400 text-sm mt-2">
            Status: <span className={todo.completed ? 'text-green-400' : 'text-yellow-400'}>
              {todo.completed ? 'Complete' : 'In progress'}
            </span>
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleToggleComplete}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
                ${todo.completed ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}
              `}
              disabled={isUpdating || isDeleting}
            >
              {todo.completed ? 'Mark in progress' : 'Mark as completed'}
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isUpdating || isDeleting || todo.completed}
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isDeleting || isUpdating}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
