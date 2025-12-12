const request = require('supertest');
const app = require('../src/app');
const sequelize = require('../src/database');

describe('Sweets Endpoints', () => {
    let adminToken;
    let userToken;
    let sweetId;

    beforeAll(async () => {
        // Create Admin and User
        await request(app).post('/api/auth/register').send({
            username: 'admin',
            password: 'adminpassword'
        });
        // Manually set role to admin (hacky for test but needed since register defaults to customer)
        // We need to access DB directly to upgrade user to admin
        const User = require('../src/models/User');
        await User.update({ role: 'admin' }, { where: { username: 'admin' } });

        const adminLogin = await request(app).post('/api/auth/login').send({
            username: 'admin',
            password: 'adminpassword'
        });
        adminToken = adminLogin.body.token;

        await request(app).post('/api/auth/register').send({
            username: 'customer',
            password: 'userpassword'
        });
        const userLogin = await request(app).post('/api/auth/login').send({
            username: 'customer',
            password: 'userpassword'
        });
        userToken = userLogin.body.token;
    });

    it('should allow admin to create a sweet', async () => {
        const res = await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Chocolate Bar',
                category: 'Chocolates',
                price: 2.5,
                quantity: 10
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('name', 'Chocolate Bar');
        sweetId = res.body.id;
    });

    it('should not allow customer to create a sweet', async () => {
        const res = await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                name: 'Candy Cane',
                category: 'Hard Candy',
                price: 1.0,
                quantity: 50
            });
        expect(res.statusCode).toEqual(403);
    });

    it('should allow searching sweets', async () => {
        const res = await request(app)
            .get('/api/sweets/search?q=Choco')
            .set('Authorization', `Bearer ${userToken}`); // Protected route
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].name).toContain('Chocolate');
    });

    it('should allow purchasing a sweet', async () => {
        const res = await request(app)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set('Authorization', `Bearer ${userToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.sweet.quantity).toEqual(9);
    });

    it('should allow admin to restock a sweet', async () => {
        const res = await request(app)
            .post(`/api/sweets/${sweetId}/restock`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ quantity: 5 });
        expect(res.statusCode).toEqual(200);
        expect(res.body.quantity).toEqual(14); // 9 + 5
    });

    it('should delete a sweet (admin)', async () => {
        const res = await request(app)
            .delete(`/api/sweets/${sweetId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(204);
    });
});
