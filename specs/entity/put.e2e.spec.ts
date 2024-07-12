import request from 'supertest';
import WebCore from '../../src/web/core';
import express from 'express';
import { createEntity } from '../helpers';

const app = new WebCore(3000, express()).app;

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
