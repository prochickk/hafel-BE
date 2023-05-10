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
      return await request(server).get(`/api/drivers`).set('x-auth-token', token);
    }

    beforeEach(() => {
      token = new User().generateAuthToken()
      input = 559
    });    

    it('should return 401 if client is not logged in', async () => {
        token = ''
        
        const res = await exec();
        
        expect(res.status).toBe(401);
      }, 15000);
  
    it('should return 200 if valid and a list of all drivers', async () => {
        const res = await exec();

        expect(res.status).toBe(201);
        expect(res.body[0]).toHaveProperty('_id');
        expect(res.body[0]).toHaveProperty('name');
        expect(res.body[0]).toHaveProperty('mobileNumber');

    }, 15000);
  });

  // POST
  describe('POST /', () => {
    let input;
    
    const exec = async () => {
      return await request(server).post('/api/drivers').send(input);
    }

    beforeEach(() => {
      input = {
        name: '42',
        email: '42@gmail.com',
        mobileNumber: 1234321456,
        }
    });
      
    
    it('should return 400 if email or mobileNuber already used', async () => {
      
      const res = await exec();

      expect(res.status).toBe(400);
    }, 15000);
    
    
    it('should return 404 if invalid email or mobileNumber posted', async () => {
      input = undefined
      const res = await exec();

      expect(res.status).toBe(404);
    }, 20000);
  
    it('should return 201 when posting New Driver', async () => {
        await Driver.deleteOne({email: 'bashaDriver@gmail.com',});

        input = {
            name: 'bashaDriver',
            password: '12345',
            email: 'bashaDriver@gmail.com',
            mobileNumber: 1233321956,
            groupCateLabel: 'bashaDriver',
            }
     
        const res = await exec();

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('name', 'bashaDriver');
        expect(res.body).toHaveProperty('group', 'bashaDriver');
        
        expect(res.body).not.toBeNull();

        await Driver.deleteOne({_id: res.body._id});

    }, 15000);

  });
});
