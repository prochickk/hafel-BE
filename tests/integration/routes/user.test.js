const request = require('supertest');
const Address = require('../../../module/Address');
const User = require('../../../module/User');
const Driver = require('../../../module/Driver');
let server;

describe("/api/user", () => {
  beforeEach(() => { server = require('../../../index');})
  afterEach(() => {server.close();})

  // GET
  describe('GET /', () => {
    let token;
    let input;
    
    const exec = async () => {
      return await request(server).get(`/api/user/${input}`).set('x-auth-token', token);
    }

    beforeEach(() => {
      token = new User().generateAuthToken()
      input = 559
    });

    it('should return 401 if user is not logged in', async () => {
      token = ''
      
      const res = await exec();
      
      expect(res.status).toBe(401);
    }, 15000);
    
    
    it('should return 404 if driver not registered', async () => {
      input = 1111111111
      const res = await exec();
      
      expect(res.status).toBe(404);
    }, 15000);
    
    
    it('should return 200 if valid user', async () => {
        const newUser = new User({
            id:576969765,
            email: 'FfakeuUserr@gmail.com',
            password:'12345',
            name:'User',
            gruop: 'fakeGroup',
            mobileNumber:'7869549657'
        })
        await newUser.save();

        input = newUser.id

        const res = await exec();

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('id', newUser.id);
        expect(res.body).toHaveProperty('name', newUser.name);
        expect(res.body).toHaveProperty('mobileNumber', newUser.mobileNumber);

        await User.deleteOne({email: newUser.email})
    }, 15000);
  });
});