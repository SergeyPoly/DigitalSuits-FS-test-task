import { Request, Response } from 'express';
import {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
} from '../../src/controllers/todo.controller';
import Todo from '../../src/models/Todo';

jest.mock('../../src/models/Todo');

describe('Todo Controller Unit Tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  describe('createTodo', () => {
    it('should create a new todo and return 201 status', async () => {
      const newTodoData = { title: 'Test Todo', description: 'This is a test description' };
      const createdTodo = { id: '1', ...newTodoData, completed: false, createdAt: new Date() };

      (Todo.create as jest.Mock).mockResolvedValue(createdTodo);

      mockRequest.body = newTodoData;

      await createTodo(mockRequest as Request, mockResponse as Response);

      expect(Todo.create).toHaveBeenCalledWith(newTodoData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdTodo);
    });

    it('should return 500 if there is a server error', async () => {
      (Todo.create as jest.Mock).mockRejectedValue(new Error('DB error'));

      mockRequest.body = { title: 'Fail Todo' };

      await createTodo(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('getAllTodos', () => {
    it('should return all todos with 200 status and pagination info', async () => {
      const todos = [
        { id: '1', title: 'Todo 1', completed: false, createdAt: new Date() },
        { id: '2', title: 'Todo 2', completed: true, createdAt: new Date() },
      ];
      const count = todos.length;
      const page = 1;
      const limit = 10;
      const offset = (page - 1) * limit;

      (Todo.findAndCountAll as jest.Mock).mockResolvedValue({ count, rows: todos });

      mockRequest = {
        // @ts-ignore
        pagination: {
          limit: limit,
          offset: offset,
        }
      };

      await getAllTodos(mockRequest as Request, mockResponse as Response);

      expect(Todo.findAndCountAll).toHaveBeenCalledWith({
        limit: limit,
        offset: offset,
        order: [['createdAt', 'DESC']],
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        total: count,
        data: todos,
      });
    });

    it('should return 500 if there is a server error', async () => {
      (Todo.findAndCountAll as jest.Mock).mockRejectedValue(new Error('DB error'));

      mockRequest = {
        // @ts-ignore
        pagination: {
          limit: 10,
          offset: 0,
        }
      };

      await getAllTodos(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('getTodoById', () => {
    it('should return a single todo by ID with 200 status', async () => {
      const todoId = 'some-uuid-123';
      const foundTodo = { id: todoId, title: 'Specific Todo', completed: false };

      (Todo.findByPk as jest.Mock).mockResolvedValue(foundTodo);

      mockRequest.params = { id: todoId };

      await getTodoById(mockRequest as Request, mockResponse as Response);

      expect(Todo.findByPk).toHaveBeenCalledWith(todoId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(foundTodo);
    });

    it('should return 404 if todo is not found', async () => {
      const todoId = 'non-existent-uuid';

      (Todo.findByPk as jest.Mock).mockResolvedValue(null);

      mockRequest.params = { id: todoId };

      await getTodoById(mockRequest as Request, mockResponse as Response);

      expect(Todo.findByPk).toHaveBeenCalledWith(todoId);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Todo not found' });
    });

    it('should return 500 if there is a server error', async () => {
      const todoId = 'error-uuid';

      (Todo.findByPk as jest.Mock).mockRejectedValue(new Error('DB error'));

      mockRequest.params = { id: todoId };

      await getTodoById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('updateTodo', () => {
    it('should update an existing todo and return 200 status', async () => {
      const todoId = 'update-uuid';
      const existingTodo = {
        id: todoId,
        title: 'Old Title',
        description: 'Old Desc',
        completed: false,
        save: jest.fn().mockResolvedValue(true), // Mock the save method
      };
      const updates = { title: 'New Title', completed: true };
      const updatedTodo = { ...existingTodo, ...updates };

      (Todo.findByPk as jest.Mock).mockResolvedValue(existingTodo);

      mockRequest.params = { id: todoId };
      mockRequest.body = updates;

      await updateTodo(mockRequest as Request, mockResponse as Response);

      expect(Todo.findByPk).toHaveBeenCalledWith(todoId);
      expect(existingTodo.title).toBe(updates.title);
      expect(existingTodo.completed).toBe(updates.completed);
      expect(existingTodo.save).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(existingTodo); // Will return the modified existingTodo object
    });

    it('should return 404 if todo to update is not found', async () => {
      const todoId = 'non-existent-update-uuid';

      // Mock findByPk to return null
      (Todo.findByPk as jest.Mock).mockResolvedValue(null);

      mockRequest.params = { id: todoId };
      mockRequest.body = { title: 'New Title' };

      await updateTodo(mockRequest as Request, mockResponse as Response);

      expect(Todo.findByPk).toHaveBeenCalledWith(todoId);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Todo not found' });
    });

    it('should return 500 if there is a server error during update', async () => {
      const todoId = 'error-update-uuid';
      const existingTodo = {
        id: todoId,
        title: 'Old Title',
        save: jest.fn().mockRejectedValue(new Error('DB save error')),
      };

      // Mock findByPk to return an existing todo
      (Todo.findByPk as jest.Mock).mockResolvedValue(existingTodo);

      mockRequest.params = { id: todoId };
      mockRequest.body = { title: 'New Title' };

      await updateTodo(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo and return 204 status', async () => {
      const todoId = 'delete-uuid';
      const existingTodo = {
        id: todoId,
        title: 'Todo to delete',
        destroy: jest.fn().mockResolvedValue(true), // Mock the destroy method
      };

      (Todo.findByPk as jest.Mock).mockResolvedValue(existingTodo);

      mockRequest.params = { id: todoId };

      await deleteTodo(mockRequest as Request, mockResponse as Response);

      expect(Todo.findByPk).toHaveBeenCalledWith(todoId);
      expect(existingTodo.destroy).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should return 404 if todo to delete is not found', async () => {
      const todoId = 'non-existent-delete-uuid';

      (Todo.findByPk as jest.Mock).mockResolvedValue(null);

      mockRequest.params = { id: todoId };

      await deleteTodo(mockRequest as Request, mockResponse as Response);

      expect(Todo.findByPk).toHaveBeenCalledWith(todoId);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Todo not found' });
    });

    it('should return 500 if there is a server error during delete', async () => {
      const todoId = 'error-delete-uuid';
      const existingTodo = {
        id: todoId,
        title: 'Todo to delete',
        destroy: jest.fn().mockRejectedValue(new Error('DB delete error')),
      };

      // Mock findByPk to return an existing todo
      (Todo.findByPk as jest.Mock).mockResolvedValue(existingTodo);

      mockRequest.params = { id: todoId };

      await deleteTodo(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });
});
