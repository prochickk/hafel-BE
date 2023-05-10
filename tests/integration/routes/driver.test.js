const request = require('supertest');
const Address = require('../../../module/Address');
const User = require('../../../module/User');
const Driver = require('../../../module/Driver');
let server;

describe("/api/driver", () => {
  beforeEach(() => { server = require('../../../index');})
  afterEach(() => {server.close();})

  // GET
  describe('GET /', () => {
    let token;
    let input;
    
    const exec = async () => {
      return await request(server).get(`/api/driver/${input}`).set('x-auth-token', token);
    }

    beforeEach(() => {
      token = new User().generateAuthToken()
      input = 559
    });

    it('should return 401 if driver is not logged in', async () => {
      token = ''
      
      const res = await exec();
      
      expect(res.status).toBe(401);
    }, 15000);
    
    
    it('should return 404 if driver not registered', async () => {
      input = 1111111111
      const res = await exec();
      
      expect(res.status).toBe(404);
    }, 15000);
    
    
    it('should return 200 if valid driver', async () => {
        const newDriver = new Driver({
            id:889,
            email: 'Driver@gmail.com',
            password:'12345',
            name:'Driver',
            mobileNumber:'1234567890'})
        await newDriver.save();

        input = newDriver.id

        const res = await exec();

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('id', newDriver.id);
        expect(res.body).toHaveProperty('name', newDriver.name);
        expect(res.body).toHaveProperty('mobileNumber', newDriver.mobileNumber);

        await Driver.deleteOne({email: newDriver.email})
    }, 15000);
  });
});