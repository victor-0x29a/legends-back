import request from 'supertest';
import { app } from '../e2e-config'
import { createEntity } from '../helpers';

test('GET /entity', async () => {
    await request(app)
    .get('/entity?page=1&perPage=10')
    .expect(200)
    .expect({
        page: 1,
        perPage: 10,
        totalPages: 1,
        entries: []
    })
})

test('GET /entity with data', async () => {
    await Promise.all(Array.from({ length: 20 }, createEntity))
    const response = await request(app)
    .get('/entity?page=1&perPage=10')
    expect(response.status).toEqual(200)
    expect(response.body.page).toEqual(1)
    expect(response.body.perPage).toEqual(10)
    expect(response.body.totalPages).toEqual(2)

    const response2 = await request(app)
    .get('/entity?page=1&perPage=20')
    expect(response2.status).toEqual(200)
    expect(response2.body.page).toEqual(1)
    expect(response2.body.perPage).toEqual(20)
})

test('GET /entity without page and perPage', async () => {
    await request(app)
    .get('/entity')
    .expect(400)
})

test('GET /entity with invalid page and perPage', async () => {
    await request(app)
    .get('/entity?page=invalid&perPage=invalid')
    .expect(400)
})

test('GET /entity/:id', async () => {
    const entity = await createEntity()
    const response = await request(app)
    .get(`/entity/${entity.id}`)

    expect(response.status).toEqual(200)
    expect(response.body.title).toEqual(entity.title)
})

test('GET /entity/:id with invalid id', async () => {
    await request(app)
    .get('/entity/invalid')
    .expect(400)
})

test('GET /entity/:id with non existent id', async () => {
    await request(app)
    .get('/entity/999999')
    .expect(404)
})
