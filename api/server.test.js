const request = require('supertest');
const server = require('../api/server'); // Assuming you have an Express server setup
const db = require('../data/dbConfig');

beforeEach(async () => {
  // Reset database to a clean state before each test
  await db('users').truncate();
});

describe('Auth Endpoints', () => {
  describe('[POST] /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send({ username: 'john', password: '1234' });

      expect(res.status).toBe(201);
      expect(res.body.username).toBe('john');
    });

    it('should fail if username or password is missing', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send({ username: 'john' });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/username and password required/i);
    });
  });

  describe('[POST] /api/auth/login', () => {
    beforeEach(async () => {
      // Ensure there's a user to login
      await request(server)
        .post('/api/auth/register')
        .send({ username: 'john', password: '1234' });
    });

    it('should login an existing user and return a token', async () => {
      const res = await request(server)
        .post('/api/auth/login')
        .send({ username: 'john', password: '1234' });

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/welcome, john/i);
      expect(res.body.token).toBeDefined(); // Ensure a token is returned
    });

    it('should fail to login with incorrect credentials', async () => {
      const res = await request(server)
        .post('/api/auth/login')
        .send({ username: 'john', password: 'wrongpassword' });

      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/invalid credentials/i);
    });
  });
});
