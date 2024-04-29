import request from 'supertest';
import WebCore from '../src/web/core';
import express from 'express';
import { createUser } from './helpers';

const app = new WebCore(3000, express()).app;

test('GET /user', async () => {
    await request(app)
    .get('/user?page=1&perPage=10')
    .expect(200)
    .expect([])
})

test('GET /user/:id', async () => {
    const user = await createUser()
    const response = await request(app)
    .get(`/user/${user.id}`)

    expect(response.status).toEqual(200)
    expect(response.body.username).toEqual(user.username)
})

test('GET /user/:id with invalid id', async () => {
    await request(app)
    .get('/user/invalid')
    .expect(400)
})

test('GET /user/:id with non existent id', async () => {
    await request(app)
    .get('/user/999999')
    .expect(404)
})

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

describe('DELETE /user/:id', () => {
    test('should delete', async () => {
        const user = await createUser()
        await request(app)
        .delete(`/user/${user.id}`)
        .expect(204)
    })
    test('should return 400 with invalid id', async () => {
        await request(app)
        .delete('/user/invalid')
        .expect(400)
    })
    test('should return 404 with non existent id', async () => {
        await request(app)
        .delete('/user/999999')
        .expect(404)
    })
})

describe('PUT /user/:id', () => {
    test('should update', async () => {
        const user = await createUser()
        await request(app)
        .put(`/user/${user.id}`)
        .send({
            "username": "John Doe 23"
        })
        .expect(204)

        const updatedUser = await request(app).get(`/user/${user.id}`)

        expect(updatedUser.body.username).toEqual('John Doe 23')
    })
    test('should return 400 with invalid id', async () => {
        await request(app)
        .put('/user/invalid')
        .expect(400)
    })
    test('should return 404 with non existent id', async () => {
        await request(app)
        .put('/user/999999')
        .expect(404)
    })
    test('should not update an user with an username that already exists', async () => {
        const user = await createUser()
        const user2 = await createUser()

        await request(app)
        .put(`/user/${user.id}`)
        .send({
            "username": user2.username
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
