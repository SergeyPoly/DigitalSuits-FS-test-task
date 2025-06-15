import request from 'supertest';
import app from '../../src/app';
import sequelize from '../../src/config/config';
import Todo from '../../src/models/Todo';

process.env.NODE_ENV = 'test';
const nonExistentId = '41a7c8bf-555a-4a36-a4f8-e25fdd5162c1';

describe('Todo API Integration Tests', () => {
  beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await Todo.destroy({ truncate: true, cascade: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create a new todo', async () => {
    const newTodo = {
      title: 'Integration Test Todo',
      description: 'This is a todo for integration testing',
    };

    const response = await request(app)
      .post('/api/todos')
      .send(newTodo)
      .expect(201); // Expect HTTP 201 Created

    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(newTodo.title);
    expect(response.body.description).toBe(newTodo.description);
    expect(response.body.completed).toBe(false); // Default value
  });

  it('should return 400 for invalid todo creation input', async () => {
    const invalidTodo = {
      title: '',
      description: 'Test desc',
    };

    const response = await request(app)
      .post('/api/todos')
      .send(invalidTodo)
      .expect(400); // Expect HTTP 400 Bad Request

    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toContain('Title cannot be empty');
  });

  it('should get all todos', async () => {
    await Todo.create({ title: 'Todo 1' });
    await Todo.create({ title: 'Todo 2' });

    const response = await request(app)
      .get('/api/todos')
      .expect(200); // Expect HTTP 200 OK

    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.total).toBe(2);
    expect(response.body.data[0].title).toBe('Todo 2');
    expect(response.body.data[1].title).toBe('Todo 1');
  });

  it('should get a single todo by ID', async () => {
    const todo = await Todo.create({ title: 'Specific Todo' });

    const response = await request(app)
      .get(`/api/todos/${todo.id}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', todo.id);
    expect(response.body.title).toBe(todo.title);
  });

  it('should return 404 if todo ID is not found', async () => {
    const response = await request(app)
      .get(`/api/todos/${nonExistentId}`)
      .expect(404);

    expect(response.body).toHaveProperty('message', 'Todo not found');
  });

  it('should update an existing todo', async () => {
    const todo = await Todo.create({ title: 'Original Todo', completed: false });
    const updates = { title: 'Updated Todo', completed: true };

    const response = await request(app)
      .put(`/api/todos/${todo.id}`)
      .send(updates)
      .expect(200); // Expect HTTP 200 OK

    expect(response.body).toHaveProperty('id', todo.id);
    expect(response.body.title).toBe(updates.title);
    expect(response.body.completed).toBe(updates.completed);

    const updatedInDb = await Todo.findByPk(todo.id);
    expect(updatedInDb?.title).toBe(updates.title);
    expect(updatedInDb?.completed).toBe(updates.completed);
  });

  it('should return 400 for invalid todo update input', async () => {
    const todo = await Todo.create({ title: 'Valid Todo' });
    const invalidUpdates = {
      title: '', // Empty title
    };

    const response = await request(app)
      .put(`/api/todos/${todo.id}`)
      .send(invalidUpdates)
      .expect(400); // Expect HTTP 400 Bad Request

    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toContain('Title cannot be empty');
  });

  it('should delete a todo', async () => {
    const todo = await Todo.create({ title: 'Todo to be deleted' });

    await request(app)
      .delete(`/api/todos/${todo.id}`)
      .expect(204);

    const deletedTodo = await Todo.findByPk(todo.id);
    expect(deletedTodo).toBeNull();
  });

  it('should return 404 if todo to delete is not found', async () => {
    const response = await request(app)
      .delete(`/api/todos/${nonExistentId}`)
      .expect(404);

    expect(response.body).toHaveProperty('message', 'Todo not found');
  });
});
