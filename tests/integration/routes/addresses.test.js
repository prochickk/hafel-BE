const request = require('supertest');
const Address = require('../../../module/Address');
const User = require('../../../module/User');
let server;

describe("/api/addresses", () => {
  beforeEach(() => { server = require('../../../index');})
  afterEach(() => {server.close();})

  // GET
  describe('GET /', () => {
    let token;
    let input;
    
    const exec = async () => {
      return await request(server).get(`/api/addresses?${input}`).set('x-auth-token', token);
    }

    beforeEach(() => {
      token = new User().generateAuthToken()
      input = 'userId=5'
    });

    it('should return 401 if client is not logged in', async () => {
      token = ''
      
      const res = await exec();
      
      expect(res.status).toBe(401);
    }, 15000);
    
    it('should return 200 if valid user', async () => {

      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty('_id');
      expect(res.body[0]).toHaveProperty('useId');

    }, 15000);
  });
  
  // DELEET
  describe('DELETE /', () => {
    let token;
    let input;
    
    const exec = () => {
      return  request(server).delete(`/api/addresses?${input}`).set('x-auth-token', token).send();
    }

    beforeEach(() => {
      token = new User().generateAuthToken()
      input = 'addressId=999'
    });

    it('should return 401 if client is not logged in', async () => {
      token = ''
      
      const res = await exec();
      
      expect(res.status).toBe(401);
    }, 15000);
    
    it('should return 201 if address deleted', async () => {
      const testAddress = new Address({name: "testAddressDel", region: "Integration", idAddress: 999});
      await testAddress.save();
      input = `addressId=${testAddress.idAddress}`;

      const res = await exec();

      const check = Address.findOne({idAddress: testAddress.idAddress})

      expect(res.status).toBe(201);
      expect(check[0]).toBeUndefined();
    }, 15000);
  });

// POST
  describe('POST /', () => {
    let token;
    let input;
    
    const exec = async () => {
      return await request(server).post('/api/addresses').set('x-auth-token', token).send(input);
    }

    beforeEach(() => {
      token = new User().generateAuthToken()
      input = { 
        name: 'shamekh',
        useId: 123,
        nearLocCateLabel: 'shmaikhah',
        location: JSON.stringify({
          longitude: 49.58798440173268,
          latitude: 25.330102514529933
        }),
      }
    })


    it('should return 401 if client is not logged in', async () => {
      token = ''
      
      const res = await exec();

      expect(res.status).toBe(401);
    }, 15000);
  
    it('should return 201 when posting New Address', async () => {
      input.name= 'ahmed'
      const res = await exec();

      const address = await Address.findOne({_id: res.body._id})

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'ahmed');
      expect(res.body).toHaveProperty('location');
      
      expect(address).toHaveProperty('_id');
      expect(address).not.toBeNull();

      await Address.deleteOne({_id: res.body._id});

    }, 15000);

  });
  
});

