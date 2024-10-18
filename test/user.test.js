const supertest = require("supertest")
const { web } = require("../src/application/web")
const { prismaClient } = require("../src/application/database")
const { logger } = require("../src/application/logging")
const { removeTestUser } = require("./test-util")

describe('POST /api/register', function () {
    afterEach(async () => {
        await removeTestUser();
    });
    it('should can regis new user', async () => {
        const result = await supertest(web).post('/api/register').send({
            username: "test",
            password: "rahasia",
            name: "test"
        });
        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("test");
        expect(result.body.data.name).toBe("test");
        expect(result.body.data.password).toBeUndefined();
    });

    it('should reject if request is invalid', async () => {
        const result = await supertest(web).post('/api/register').send({
            username: "",
            password: "",
            name: ""
        });
        logger.info(result.body);
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();

    });

    it('should reject if username already registered', async () => {
        // First registration (successful)
        let result = await supertest(web)
            .post('/api/register')
            .send({
                username: 'test',
                password: 'rahasia',
                name: 'test'
            });

        logger.info(result.body);

        // Assert that the first registration is successful
        expect(result.status).toBe(200);
        expect(result.body.data).toBeDefined();
        expect(result.body.data.username).toBe("test");
        expect(result.body.data.name).toBe("test");
        expect(result.body.data.password).toBeUndefined();

        // Attempt to register the same username again (should fail)
        result = await supertest(web)
            .post('/api/register')
            .send({
                username: 'test',
                password: 'rahasia',
                name: 'test'
            });

        logger.info(result.body);

        // Assert that the second registration is rejected
        expect(result.status).toBe(500);
        expect(result.body.errors).toBeDefined();

    });
});