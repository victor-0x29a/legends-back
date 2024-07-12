import request from 'supertest';
import WebCore from '../../src/web/core';
import express from 'express';

const app = new WebCore(3000, express()).app;

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
