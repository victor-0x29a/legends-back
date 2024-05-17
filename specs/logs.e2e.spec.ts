import request from 'supertest'
import express from 'express'
import WebCore from "../src/web/core";
import { createLog } from './helpers';


const app = new WebCore(3000, express()).app


test('GET /log', async () => {
    await request(app)
    .get('/log?page=1&perPage=10')
    .expect(200)
    .expect({
        page: 1,
        perPage: 10,
        totalPages: 1,
        entries: []
    })
})

test('GET /log with data', async () => {
    await createLog()
    const data = await request(app)
    .get('/log?page=1&perPage=10')

    expect(data.body.entries.length).toBe(1)
    const keys = Object.keys(data.body.entries[0])
    expect(keys).toContain('type')
    expect(keys).toContain('content')
    expect(keys).toContain('createdAt')
    expect(keys.length).toBe(3)
})

test('GET /log with type filter', async () => {
    await createLog('foo')
    const data = await request(app)
    .get('/log?page=1&perPage=10&type=foo')

    expect(data.body.entries.length).toBe(1)
    expect(data.body.entries[0].type).toBe('foo')
})
