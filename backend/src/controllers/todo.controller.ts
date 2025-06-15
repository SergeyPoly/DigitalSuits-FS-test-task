import { Request, Response } from 'express'
import Todo from '../models/Todo'

export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body
    const newTodo = await Todo.create({ title, description })
    res.status(201).json(newTodo)
  } catch (error) {
    console.error('Error creating todo:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getAllTodos = async (req: Request, res: Response) => {
  try {
    const { limit, offset } = (req as any).pagination;

    const { count, rows } = await Todo.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    })

    res.status(200).json({
      total: count,
      data: rows,
    })
  } catch (error) {
    console.error('Error fetching todos:', error)
    res.status(500).json({ message: 'Internal server error' })
    return
  }
}

export const getTodoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const todo = await Todo.findByPk(id)

    if (!todo) {
      res.status(404).json({ message: 'Todo not found' })
      return
    }
    res.status(200).json(todo)
  } catch (error) {
    console.error('Error fetching todo by ID:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const updateTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { title, description, completed } = req.body

    const todo = await Todo.findByPk(id)

    if (!todo) {
      res.status(404).json({ message: 'Todo not found' })
      return
    }

    if (title !== undefined) todo.title = title
    if (description !== undefined) todo.description = description
    if (completed !== undefined) todo.completed = completed

    await todo.save()
    res.status(200).json(todo)
  } catch (error) {
    console.error('Error updating todo:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const todo = await Todo.findByPk(id)

    if (!todo) {
      res.status(404).json({ message: 'Todo not found' })
      return
    }

    await todo.destroy()
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting todo:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
