import { Router } from 'express'
import {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
} from '../controllers/todo.controller'
import {
  validateCreateTodo,
  validateUpdateTodo,
} from '../middlewares/validation/todo.validation'
import { validateId } from '../middlewares/validation/id.validation'
import { validatePagination } from '../middlewares/validation/pagination.validation'

const router = Router()

router.post('/', validateCreateTodo, createTodo)
router.get('/', validatePagination, getAllTodos)
router.get('/:id', validateId, getTodoById)
router.put('/:id', validateId, validateUpdateTodo, updateTodo)
router.delete('/:id', validateId, deleteTodo)

export default router
