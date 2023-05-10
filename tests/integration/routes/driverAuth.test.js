const request = require('supertest');
const User = require('../../../module/User');
const Driver = require('../../../module/Driver');
let server;

describe("/api/driverauth", () => {
    beforeEach(() => { server = require('../../../index');})
    afterEach(() => {server.close();})

    describe('POST /', () => {
        let input;

        const exec = async () => {
            return await request(server).post("/api/driverauth").send(input);
        }

        beforeEach(() => {
            input = { 
                email: "sar@gmail.com",
                password: '12345',
            }
        })

        it('should return 400 if email invalid', async () => {
            input.email = "ssar@gmail.com"
            const res = await exec();
        
            expect(res.status).toBe(400);
          }, 15000);
        
          it('should return 400 if Password invalid', async () => {
            input.password = '1234'
            const res = await exec();
        
            expect(res.status).toBe(400);
          }, 15000);


        it('should return 200 if token is valid', async () => {
            const testdriver = new Driver({email: "testdriver@gmail.com", password: '12345', name: 'driverTest'})
            await testdriver.save()
            input.email = testdriver.email 
            input.password = testdriver.password 
            
            const res = await exec();

            expect(res.status).toBe(200);
            // expect(res.body[0]).toHaveProperty('name', testdriver.name)
            await Driver.deleteOne({_id: testdriver._id});

          }, 15000);

    });
});