import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'

const createTodoSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).required().messages({
    'string.base': 'Title should be a string',
    'string.empty': 'Title cannot be empty',
    'string.min': 'Title should have a minimum length of {#limit}',
    'string.max': 'Title should have a maximum length of {#limit}',
    'any.required': 'Title is required',
  }),
  description: Joi.string().trim().max(500).optional().allow('').messages({
    'string.base': 'Description should be a string',
    'string.max': 'Description should have a maximum length of {#limit}',
  }),
})

const updateTodoSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).optional().messages({
    'string.base': 'Title should be a string',
    'string.empty': 'Title cannot be empty',
    'string.min': 'Title should have a minimum length of {#limit}',
    'string.max': 'Title should have a maximum length of {#limit}',
  }),
  description: Joi.string().trim().max(500).optional().allow('').messages({
    'string.base': 'Description should be a string',
    'string.max': 'Description should have a maximum length of {#limit}',
  }),
  completed: Joi.boolean().optional().messages({
    'boolean.base': 'Completed status should be a boolean',
  }),
}).min(1)

export const validateTodo =
  (schema: Joi.ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false })
    if (error) {
      const errors = error.details.map((detail) => detail.message)
      res.status(400).json({ errors })
      return
    }
    next()
  }

export const validateCreateTodo = validateTodo(createTodoSchema)
export const validateUpdateTodo = validateTodo(updateTodoSchema)
