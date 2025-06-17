// test/roles.test.js
const request = require('supertest');
const { expect } = require('chai');
const app = require('../app'); // теперь HTTP-сервер

describe('Role-based access control', () => {
    const buyer  = { username: 'buyer1',  password: 'pass', role: 'buyer'  };
    const seller = { username: 'seller1', password: 'pass', role: 'seller' };
    const admin  = { username: 'admin1',  password: 'pass', role: 'admin'  };

    const buyerAgent  = request.agent(app);
    const sellerAgent = request.agent(app);
    const adminAgent  = request.agent(app);

    before(async () => {
        // Регистрируем всех трёх
        await request(app).post('/register').type('form').send(buyer);
        await request(app).post('/register').type('form').send(seller);
        await request(app).post('/register').type('form').send(admin);

        // Логиним
        await buyerAgent.post('/login').type('form').send(buyer);
        await sellerAgent.post('/login').type('form').send(seller);
        await adminAgent.post('/login').type('form').send(admin);
    });

    describe('Buyer', () => {
        it('не может зайти в /orders/manage (403)', async () => {
            await buyerAgent.get('/orders/manage').expect(403);
        });
        it('не может зайти в /orders/all (403)', async () => {
            await buyerAgent.get('/orders/all').expect(403);
        });
        it('не может зайти в /orders/revenue (403)', async () => {
            await buyerAgent.get('/orders/revenue').expect(403);
        });
        it('не может зайти в /users/all (403)', async () => {
            await buyerAgent.get('/users/all').expect(403);
        });
    });

    describe('Seller', () => {
        it('может зайти в /orders/manage (200)', async () => {
            const res = await sellerAgent.get('/orders/manage').expect(200);
            expect(res.text).to.match(/Управление заказами/);
        });
        it('не может зайти в /orders/all (403)', async () => {
            await sellerAgent.get('/orders/all').expect(403);
        });
        it('может зайти в /orders/revenue (200)', async () => {
            const res = await sellerAgent.get('/orders/revenue').expect(200);
            expect(res.text).to.match(/Текущая выручка/);
        });
        it('не может зайти в /users/all (403)', async () => {
            await sellerAgent.get('/users/all').expect(403);
        });
    });

    describe('Admin', () => {
        it('не может зайти в /orders/manage (403)', async () => {
            await adminAgent.get('/orders/manage').expect(403);
        });
        it('может зайти в /orders/all (200)', async () => {
            const res = await adminAgent.get('/orders/all').expect(200);
            expect(res.text).to.match(/Все заказы/);
        });
        it('не может зайти в /orders/revenue (403)', async () => {
            await adminAgent.get('/orders/revenue').expect(403);
        });
        it('может зайти в /users/all (200)', async () => {
            const res = await adminAgent.get('/users/all').expect(200);
            expect(res.text).to.match(/Управление пользователями/);
        });
    });
});
