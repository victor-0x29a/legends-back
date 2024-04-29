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
