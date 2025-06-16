import React, { FC, FormEvent, useState } from 'react'
import { CreateTodoData } from '@/types'

interface AddTodoFormProps {
  onAdd: (todo: CreateTodoData) => Promise<void>;
  isAdding: boolean;
}

const AddTodoForm: FC<AddTodoFormProps> = ({ onAdd, isAdding }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError('Task name cannot be empty.')
      return
    }

    try {
      await onAdd({ title, description: description.trim() || undefined })
      setTitle('')
      setDescription('')
    } catch (err: any) {
      setError(err.message || 'Error adding task.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-xl mb-8 w-full max-w-lg">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Add a new task</h2>
      {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-300 text-sm font-bold mb-2">
          Task name:
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
          placeholder="Task name (required)"
          disabled={isAdding}
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="description" className="block text-gray-300 text-sm font-bold mb-2">
          Description (optional):
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 placeholder-gray-400 text-white h-24 resize-none"
          placeholder="Task description"
          disabled={isAdding}
        ></textarea>
      </div>
      <div className="flex items-center justify-center">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isAdding}
        >
          {isAdding ? 'Addition...' : 'Add task'}
        </button>
      </div>
    </form>
  )
}

export default AddTodoForm
