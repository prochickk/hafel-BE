const request = require('supertest');
const User = require('../../../module/User');
let server;

describe("/api/driver", () => {
  beforeEach(() => { server = require('../../../index');})
  afterEach(() => {server.close();})

  // GET
  describe('GET /', () => {
    let token;
    let input;
    
    const exec = async () => {
      return await request(server).get(`/api/users`).set('x-auth-token', token);
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
  
    it('should return 200 if valid and a list of all users', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('_id');
        expect(res.body[0]).toHaveProperty('name');
        expect(res.body[0]).toHaveProperty('mobileNumber');

    }, 15000);
  });

  // POST
  describe('POST /', () => {
    let input;
    
    const exec = async () => {
      return await request(server).post('/api/users').send(input);
    }

    beforeEach(() => {
        input = {
        name: '42',
        email: 'FakeUser23@gmail.com',
        mobileNumber: 1685755456,
        groupCateLabel: 'FakeGroup',
        password: '12345'
        }       });
      
    it('should return 400 if email or mobileNumber already used', async () => {
      await User.deleteMany({email: input.email});

      const fakeUserpost = new User({
        name: '42',
        email: 'FakeUser23@gmail.com',
        mobileNumber: 1685755456,
        groupCateLabel: 'FakeGroup',
        password: '12345'
      })

      await fakeUserpost.save();

      const res = await exec();

      expect(res.status).toBe(400);

      await User.deleteOne({email: input.email});
    }, 15000);
    
    
    it('should return 404 if invalid email or mobileNumber posted', async () => {
      input = undefined
      const res = await exec();

      expect(res.status).toBe(404);
    }, 20000);
  
    it('should return 201 when posting New User', async () => {
        await User.deleteOne({email: 'bashaUser@gmail.com',});

        input = {
            name: 'bashaUser',
            password: '12345',
            email: 'Userfakeone@gmail.com',
            mobileNumber: 1323321956,
            groupCateLabel: 'bashaUser',
            }
     
        const res = await exec();

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('name', 'bashaUser');
        expect(res.body).toHaveProperty('group', 'bashaUser');
        
        expect(res.body).not.toBeNull();

        await User.deleteOne({_id: res.body._id});

    }, 15000);

  });
});
