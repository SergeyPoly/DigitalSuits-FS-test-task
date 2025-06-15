import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'

const idSchema = Joi.string().uuid({ version: 'uuidv4' }).required().messages({
  'string.base': 'ID should be a string',
  'string.empty': 'ID cannot be empty',
  'string.guid': 'ID must be a valid UUID v4',
  'any.required': 'ID is required',
})

export const validateId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const { error } = idSchema.validate(id)
  if (error) {
    const errors = error.details.map((detail) => detail.message)
    res.status(400).json({ errors })
    return
  }
  next()
}
