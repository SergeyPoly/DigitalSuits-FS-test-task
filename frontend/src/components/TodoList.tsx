import React, { Dispatch, FC, SetStateAction } from 'react'
import { Todo, UpdateTodoData } from '@/types'
import TodoItem from './TodoItem'
import Pagination from '@/components/Pagination'

interface Props {
  onUpdate: (id: string, updateData: UpdateTodoData) => Promise<void>
  onDelete: (id: string) => Promise<void>
  todos: Todo[]
  updatingTodoId: string | null
  deletingTodoId: string | null
  totalPages: number
  setCurrentPage: Dispatch<SetStateAction<number>>
  currentPage: number
  isLoading: boolean
}

const TodoList: FC<Props> = ({
                               onUpdate,
                               onDelete,
                               todos,
                               updatingTodoId,
                               deletingTodoId,
                               totalPages,
                               setCurrentPage,
                               currentPage,
                               isLoading,
                             }) => {
  return (
    <div className="w-full max-w-lg">
      {todos.length === 0 ? (
        <p className="text-gray-400 text-lg text-center mt-8">There are no tasks yet. Try to add the first one!</p>
      ) : (
        <>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onUpdate={onUpdate}
              onDelete={onDelete}
              isUpdating={updatingTodoId === todo.id}
              isDeleting={deletingTodoId === todo.id}
            />
          ))}
          {totalPages > 1 && (
            <Pagination
              isLoading={isLoading}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              currentPage={currentPage}
            />
          )}
        </>
      )}
    </div>
  )
}

export default TodoList
