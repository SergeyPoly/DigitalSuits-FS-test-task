import { Todo, CreateTodoData, UpdateTodoData, PaginatedTodosResponse } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/todos'

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Something is not ok!')
  }

  if (response.status === 204) {
    return {} as T
  }
  return response.json()
}

export const getTodos = async (page: number = 1, limit: number = 10): Promise<PaginatedTodosResponse> => {
  const response = await fetch(`${API_BASE_URL}?page=${page}&limit=${limit}`)
  return handleResponse<PaginatedTodosResponse>(response)
}

export const getTodoById = async (id: string): Promise<Todo> => {
  const response = await fetch(`${API_BASE_URL}/${id}`)
  return handleResponse<Todo>(response)
}

export const createTodo = async (data: CreateTodoData): Promise<Todo> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return handleResponse<Todo>(response)
}

export const updateTodo = async (id: string, data: UpdateTodoData): Promise<Todo> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return handleResponse<Todo>(response)
}

export const deleteTodo = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  })
  return handleResponse<void>(response)
}
