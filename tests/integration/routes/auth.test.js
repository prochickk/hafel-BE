const request = require('supertest');
const User = require('../../../module/User');
let server;

describe("/api/auth", () => {
    beforeEach(() => { server = require('../../../index');})
    afterEach(() => {server.close();})

    describe('POST /', () => {
        let input;

        const exec = async () => {
            return await request(server).post('/api/auth').send(input);
        }

        beforeEach(() => {
            input = { 
                email: 'user@gmail.com',
                password: '12345',
                mobileNumber: 97542746476
            }
        })

        it('should return 400 if email invalid', async () => {
            input.email = 'uuser@gmail.com'
            const res = await exec();
        
            expect(res.status).toBe(400);
          }, 15000);
        
          it('should return 400 if Password invalid', async () => {
            input.password = '1234'
            const res = await exec();
        
            expect(res.status).toBe(400);
          }, 15000);


        it('should return 200 if token is valid', async () => {
            const testuser = new User({
                email: "testussser@gmail.com",
                password: '12345',
                name: 'userTest',
                mobileNumber: 97542746476
            })
            await testuser.save()
            input.email = testuser.email 
            input.password = testuser.password 
            
            const res = await exec();
            
            expect(res.status).toBe(200);
            // expect(res.body[0]).toHaveProperty('name', testuser.name)
            await User.deleteOne({_id: testuser._id});
          }, 15000);

    });
});