import request from 'supertest';
import { app } from '../e2e-config'

describe('POST /user', () => {
    test('should create', async () => {
        await request(app)
        .post('/user')
        .send({
            "username": "John Doe",
            "password": "password"
        })
        .expect(201)
    })
    test('should return 400 with invalid body', async () => {
        await request(app)
        .post('/user')
        .send({})
        .expect(400)
    })
    test('should return 400 with invalid username', async () => {
        await request(app)
        .post('/user')
        .send({
            "username": {},
            "password": "password"
        })
        .expect(400)
    })
    test('should return 400 with invalid password', async () => {
        await request(app)
        .post('/user')
        .send({
            "username": "John Doe",
            "password": {}
        })
        .expect(400)
    })
    test('should create an user with name', async () => {
        await request(app)
        .post('/user')
        .send({
            "username": "John Doe 2",
            "password": "password",
            "name": "John"
        })
        .expect(201)

        const users = await request(app).get('/user')

        const user = users.body.find((user) => user.username === 'John Doe 2')

        expect(user.name).toEqual('John')
    })
    test('should create an user with hashed password', async () => {
        await request(app)
        .post('/user')
        .send({
            "username": "John Doe 3",
            "password": "password"
        })
        .expect(201)

        const users = await request(app).get('/user')

        const user = users.body.find((user) => user.username === 'John Doe 3')

        expect(user.password).not.toEqual('password')
    })
    test('should not create an user with duplicated username', async () => {
        await request(app)
        .post('/user')
        .send({
            "username": "John Doe 4",
            "password": "password"
        })
        .expect(201)

        await request(app)
        .post('/user')
        .send({
            "username": "John Doe 4",
            "password": "password"
        })
        .expect(409)
    })
})

describe('POST /user/sign-in', () => {
    test('should sign-in', async () => {
        await request(app).post('/user').send({ username: 'foo-sigin', password: 'password' })
        await request(app)
        .post('/user/sign-in')
        .send({
            "username": "foo-sigin",
            "password": "password"
        })
        .expect(200)
        .expect((response) => response.body.token.length > 0)
    })
    test('should return 401 with invalid credentials', async () => {
        await request(app)
        .post('/user/sign-in')
        .send({
            "username": "foo-sigin",
            "password": "invalid"
        })
        .expect(401)
    })
    test('should return 400 with invalid body', async () => {
        await request(app)
        .post('/user/sign-in')
        .send({})
        .expect(400)
    })
    test('should return 400 with invalid username', async () => {
        await request(app)
        .post('/user/sign-in')
        .send({
            "username": {},
            "password": "password"
        })
        .expect(400)
    })
    test('should return 400 with invalid password', async () => {
        await request(app)
        .post('/user/sign-in')
        .send({
            "username": "John Doe",
            "password": {}
        })
        .expect(400)
    })
})
