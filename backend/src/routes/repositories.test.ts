import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';


describe('GET /api/repositories', () => {
    it('returns 200 and a data array', async () => {
        const res = await request(app).get('/api/repositories');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('respects the limit query param', async () => {
        const res = await request(app).get('/api/repositories?limit=2');
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeLessThanOrEqual(2);
    });


    it('each returned repository has the expected fields', async () => {
        const res = await request(app).get('/api/repositories?limit=1');
        if (res.body.data.length > 0) {
            const repo = res.body.data[0];
            expect(repo).toHaveProperty('owner');
            expect(repo).toHaveProperty('name');
            expect(repo).toHaveProperty('difficulty_level');
        }
    });
});


describe('GET /api/repositories/:id', () => {
  it('returns 404 for a repository that does not exist', async () => {
    const res = await request(app).get('/api/repositories/999999');
    expect(res.status).toBe(404);
  });

  it('returns 400 for an invalid id', async () => {
    const res = await request(app).get('/api/repositories/not-a-number');
    expect(res.status).toBe(400);
  });
});