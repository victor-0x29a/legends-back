import request from 'supertest';
import WebCore from '../../src/web/core';
import express from 'express';
import { createEntity } from '../helpers';

const app = new WebCore(3000, express()).app;

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
