import request from 'supertest';
import { app } from '../global'
import { createUser, findUser } from '../helpers';
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
    test('should not update the password.', async () => {
        const user = await createUser()
        await request(app).put(`/user/${user.id}`).send({
            name: 'foo',
            password: 'bar'
        }).expect(204)
        const foundUser = await findUser(user.id)
        expect(foundUser!.password).not.toEqual('bar')
        expect(foundUser!.name).toEqual('foo')
    })
})
