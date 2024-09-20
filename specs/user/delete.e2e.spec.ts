import request from 'supertest';
import { app } from '../e2e-config'
import { createUser } from '../helpers';

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
