const request = require('supertest');
const app = require('../src/app');
const sequelize = require('../src/database');

describe('Auth Endpoints', () => {
    // Reset DB before each test (handled by setup.js but good to be sure or use transaction)
    // Actually setup.js does beforeAll sync(force: true), so DB is fresh. 
    // We might want to clear users between tests.

    beforeEach(async () => {
        // Clear Users table
        // We haven't imported the model yet, but we will. 
        // For now, let's just implement the test assuming endpoints exist.
    });

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'User registered successfully');
        expect(res.body).toHaveProperty('user');
        expect(res.body.user).toHaveProperty('username', 'testuser');
    });

    it('should login a user', async () => {
        // Register first
        await request(app).post('/api/auth/register').send({
            username: 'loginuser',
            password: 'password123'
        });

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                username: 'loginuser',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
});
