import request from 'supertest';
import { app } from '../global'
import { createUser } from '../helpers';

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
