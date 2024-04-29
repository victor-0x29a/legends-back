import request from 'supertest';
import WebCore from '../src/web/core';
import express from 'express';
import { createEntity } from './helpers';

const app = new WebCore(3000, express()).app;

test('GET /entity', async () => {
    await request(app)
    .get('/entity?page=1&perPage=10')
    .expect(200)
    .expect([])
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

describe('POST /entity', () => {
    test('should create', async () => {
        const entity = {
            "title": "foo",
          "properties": {
                "strength": 10
            },
          "description": "Lorem lorem lorem",
          "author": "John Doe",
          "image": {
                "src": "url",
                "alt": "alt"
             },
           "sections": "markdown content",
           "type": "item"
        }
    const response = await request(app)
        .post('/entity')
        .send(entity)

        expect(response.statusCode).toEqual(201)
        expect(response.body).toEqual(entity)
    })
    test('should reject invalid entity', async () => {
        await request(app)
        .post('/entity')
        .send({})
        .expect(400)
    })
    test('should reject entity with invalid properties', async () => {
        await request(app)
        .post('/entity')
        .send({
            "title": 1,
            "properties": "invalid",
            "description": "Lorem lorem lorem",
            "author": "John Doe",
            "image": {
                "src": "url",
                "alt": "alt"
            },
            "sections": "markdown content",
            "type": "item"
        })
        .expect(400)
    })
})

describe('DELETE /entity/:id', () => {
    test('should delete', async () => {
        const entity = await createEntity()
        await request(app)
        .delete(`/entity/${entity.id}`)
        .expect(204)
    })
    test('should reject invalid id', async () => {
        await request(app)
        .delete('/entity/invalid')
        .expect(400)
    })
    test('should reject non existent id', async () => {
        await request(app)
        .delete('/entity/999999')
        .expect(404)
    })
})

describe('PUT /entity/:id', () => {
    test('should update', async () => {
        const entity = await createEntity()
        const update = {
            "title": "foo 777"
        }

        const updateResponse = await request(app)
        .put(`/entity/${entity.id}`)
        .send(update)

        expect(updateResponse.status).toEqual(204)

        const entityUpdated = await request(app).get(`/entity/${entity.id}`)

        expect(entityUpdated.body.title).toEqual("foo 777")
    })
    test('should reject invalid id', async () => {
        await request(app)
        .put('/entity/invalid')
        .expect(400)
    })
    test('should reject non existent id', async () => {
        await request(app)
        .put('/entity/999999')
        .expect(404)
    })
})
