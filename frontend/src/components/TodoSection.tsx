import React, { FC, useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import { getTodos, createTodo, updateTodo, deleteTodo } from '@/utils/api'
import { Todo, CreateTodoData, UpdateTodoData, PaginatedTodosResponse } from '@/types'
import AddTodoForm from './AddTodoForm'
import TodoList from '@/components/TodoList'

interface Props {
  initialTodos: PaginatedTodosResponse | undefined;
}

const TodoSection: FC<Props> = ({ initialTodos }) => {
  const { mutate } = useSWRConfig()
  const [currentPage, setCurrentPage] = useState(1)
  const [currentLimit] = useState(5)

  const swrKey = `/api/todos?page=${currentPage}&limit=${currentLimit}`

  const { data, error, isLoading } = useSWR<PaginatedTodosResponse>(
    swrKey,
    () => getTodos(currentPage, currentLimit),
    {
      fallbackData: initialTodos,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    },
  )

  const todos = data?.data || []
  const totalItems = data?.total || 0
  const totalPages = Math.ceil(totalItems / currentLimit)

  const [isAdding, setIsAdding] = useState(false)
  const [updatingTodoId, setUpdatingTodoId] = useState<string | null>(null)
  const [deletingTodoId, setDeletingTodoId] = useState<string | null>(null)

  const handleAddTodo = async (newTodoData: CreateTodoData) => {
    setIsAdding(true)
    try {
      const tempId = `temp-${Date.now()}`
      const tempTodo: Todo = {
        ...newTodoData,
        id: tempId,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      mutate(swrKey, async (currentData?: PaginatedTodosResponse) => {
        const updatedTodos = currentData ? [tempTodo, ...currentData.data] : [tempTodo]
        return {
          ...currentData,
          data: updatedTodos,
          total: (currentData?.total || 0) + 1,
        } as PaginatedTodosResponse
      }, {
        revalidate: false,
      })

      await createTodo(newTodoData)

      mutate(swrKey)
    } catch (err) {
      // TODO change console.logs to notification popups
      console.error('Error adding task:', err)
      mutate(swrKey)
      throw err
    } finally {
      setIsAdding(false)
    }
  }

  const handleUpdateTodo = async (id: string, updateData: UpdateTodoData) => {
    setUpdatingTodoId(id)
    try {
      mutate(swrKey, async (currentData?: PaginatedTodosResponse) => {
        if (!currentData) return currentData

        const updatedTodos = currentData.data.map((todo) =>
          todo.id === id ? { ...todo, ...updateData } : todo,
        )
        return { ...currentData, todos: updatedTodos }
      }, {
        revalidate: false,
      })

      await updateTodo(id, updateData)

      mutate(swrKey)
    } catch (err) {
      // TODO change console.logs to notification popups
      console.error('Error updating task:', err)
      mutate(swrKey)
      throw err
    } finally {
      setUpdatingTodoId(null)
    }
  }

  const handleDeleteTodo = async (id: string) => {
    setDeletingTodoId(id)
    try {
      mutate(swrKey, async (currentData?: PaginatedTodosResponse) => {
        if (!currentData) return currentData

        const filteredTodos = currentData.data.filter((todo) => todo.id !== id)
        return {
          ...currentData,
          data: filteredTodos,
          total: (currentData?.total || 0) - 1,
        } as PaginatedTodosResponse
      }, {
        revalidate: false,
      })

      await deleteTodo(id)

      mutate(swrKey)
    } catch (err) {
      // TODO change console.logs to notification popups
      console.error('Error deleting task:', err)
      mutate(swrKey)
      throw err
    } finally {
      setDeletingTodoId(null)
    }
  }

  if (error) return <div className="text-red-500 text-center mt-8">Failed to load tasks: {error.message}</div>

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
      <h1 className="text-4xl font-extrabold text-blue-400 mb-8 mt-4">Todo list</h1>

      <AddTodoForm onAdd={handleAddTodo} isAdding={isAdding} />

      {isLoading && todos.length === 0 ? (
        // TODO change current solution to loader
        <div className="text-blue-300 text-lg">Loading...</div>
      ) : (
        <TodoList
          onUpdate={handleUpdateTodo}
          onDelete={handleDeleteTodo}
          todos={todos}
          updatingTodoId={updatingTodoId}
          deletingTodoId={deletingTodoId}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          isLoading={isLoading} />
      )}
    </div>
  )
}

export default TodoSection
