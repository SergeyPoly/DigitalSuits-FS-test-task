import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'

const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'Page must be a number',
    'number.integer': 'Page must be an integer',
    'number.min': 'Page must be at least 1',
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    'number.base': 'Limit must be a number',
    'number.integer': 'Limit must be an integer',
    'number.min': 'Limit must be at least 1',
    'number.max': 'Limit cannot exceed 100',
  }),
})

export const validatePagination = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error, value } = paginationSchema.validate(req.query, {
    abortEarly: false,
  })

  if (error) {
    const errors = error.details.map((detail) => detail.message)
    res.status(400).json({ errors })
    return
  }

  ;(req as any).pagination = {
    limit: value.limit,
    offset: (value.page - 1) * value.limit,
  }
  next()
}
