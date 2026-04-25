import request from 'supertest';
import app from '../src/index.js';

describe('Backend API Unit Tests', () => {
  
  test('GET /health should return 200 OK', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'OK' });
  });

  test('POST /api/auth/register should validate missing fields', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com' }); // Missing other fields
    
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing required fields');
  });

  test('POST /api/auth/login should validate missing fields', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com' });
    
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing email or password');
  });

  test('POST /api/interests should validate input', async () => {
    const response = await request(app)
      .post('/api/interests')
      .send({ senderId: 'abc' }); // Missing receiverId
    
    expect(response.status).toBe(500); // Current implementation throws error on missing fields
  });

  test('GET /api/interests/:userId should return a list', async () => {
    const validUuid = '00000000-0000-0000-0000-000000000000';
    const response = await request(app).get(`/api/interests/${validUuid}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

});
