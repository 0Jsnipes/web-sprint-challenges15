const request = require('supertest');
const server = require('./server'); // Adjust the path if necessary
const db = require('../data/dbConfig'); // Adjust the path if necessary

beforeEach(async () => {
  await db('users').truncate(); // Clear users table before each test
});

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'john', password: '1234' });

    expect(res.status).toBe(201);
    expect(res.body.username).toBe('john');
  });

  it('should return "username taken" if username exists', async () => {
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'john', password: '1234' });

    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'john', password: '5678' });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Username taken' });
  });

  it('should login an existing user', async () => {
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'john', password: '1234' });

    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'john', password: '1234' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should return "invalid credentials" for wrong password', async () => {
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'john', password: '1234' });

    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'john', password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/invalid credentials/i);
  });
});
