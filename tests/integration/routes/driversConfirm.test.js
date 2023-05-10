const request = require('supertest');
const Address = require('../../../module/Address');
const User = require('../../../module/User');
const Driver = require('../../../module/Driver');
let server;

describe("/api/addresses", () => {
  beforeEach(() => { server = require('../../../index');})
  afterEach(() => {server.close();})

  // GET
  describe('GET /', () => {
    let token;
    let input;
    
    const exec = async () => {
      return await request(server).get(`/api/driversConfirm?driverGroup=${input}`).set('x-auth-token', token);
    }

    beforeEach(() => {
      token = new User().generateAuthToken()
      input = 'basha6'
    });

    it('should return 401 if client is not logged in', async () => {
      token = ''
      
      const res = await exec();
      
      expect(res.status).toBe(401);
    }, 15000);
    
    it('should return 201 if one list elemnt no Driver acount need confirmation for this Group', async () => {

      const res = await exec();

      expect(res.status).toBe(201);
      expect(res.body[0]).toHaveProperty('name', "لا يوجد أي طلبات للتوثيق",);
      expect(res.body[0]).toHaveProperty('group', '');

    }, 15000);
    
    it('should return 201 if and list of elemnts Acounts need confirmation for this Group', async () => {
      content = {     
        name:"1000",
        password:"12345",
        group: input,
        id:80000,
        email:"1000@gmail.com",
        mobileNumber:1000095214,
        groupConfirmation:false,
        groupAdmin:false
        }

      const fakeDriver1 = new Driver(content)

      const fakeDriver2 = new Driver(content)
      fakeDriver2.name = '2000'
      fakeDriver2.email = '2000@gmail.com'
      fakeDriver2.mobileNumber = 2000095214

      await fakeDriver1.save()
      await fakeDriver2.save()

      const res = await exec();

      expect(res.status).toBe(201);
      expect(res.body[0]).toHaveProperty('_id');
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('group');
      expect(res.body[0]).toHaveProperty('groupConfirmation', false);
      
      expect(res.body[1]).toHaveProperty('_id');
      expect(res.body[1]).toHaveProperty('groupConfirmation', false);

      await Driver.deleteMany({ group: input})

    }, 15000);
  });

  // POST
  describe('POST /', () => {
    let token;
    let input;
    
    const exec = async () => {
      return await request(server).post(`/api/driversConfirm?id=${input}`).set('x-auth-token', token).send();
    }

    beforeEach(() => {
      token = new User().generateAuthToken()
      input = '800000'
    })


    it('should return 401 if client is not logged in', async () => {
      token = ''
      
      const res = await exec();

      expect(res.status).toBe(401);
    }, 15000);
    
    
    it('should return 404 if invalid driver ID', async () => {
      input = '80001'
      
      const res = await exec();

      expect(res.status).toBe(404);
    }, 15000);
  
    it('should return 201 with GroupConfirmed Driver', async () => {
        const fakeDriver = new Driver({ 
            name:"fakeDriver",
            password:"fakeDriver",
            group: 'basha6',
            id: parseInt(input),
            email:"fakeDriver@gmail.com",
            mobileNumber:4400095214,
            groupConfirmation:false,
            groupAdmin:false
            });

        await fakeDriver.save();

        const res = await exec();

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('groupConfirmation', true);
        expect(res.body).toHaveProperty('groupAdmin');
     
        await Driver.deleteMany({id: parseInt(input)});

    }, 15000);

  });
  
  
  // PUT
  describe('POST /', () => {
    let token;
    let input;
    
    const exec = async () => {
      return await request(server).put(`/api/driversConfirm?id=${input}`).set('x-auth-token', token).send();
    }

    beforeEach(() => {
      token = new User().generateAuthToken()
      input = '800000'
    })


    it('should return 401 if client is not logged in', async () => {
      token = ''
      
      const res = await exec();

      expect(res.status).toBe(401);
    }, 15000);
    
    
    it('should return 404 if invalid driver ID', async () => {
      input = '80001'
      
      const res = await exec();

      expect(res.status).toBe(404);
    }, 15000);
  
    it('should return 201 with not GroupConfirmed Driver', async () => {
        const fakeDriver = new Driver({ 
            name:"fakeDriver",
            password:"fakeDriver",
            group: 'basha6',
            id: parseInt(input),
            email:"fakeDriver@gmail.com",
            mobileNumber:4400095214,
            groupConfirmation:false,
            groupAdmin:false
            });

        await fakeDriver.save();

        const res = await exec();

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('groupConfirmation', false);
        expect(res.body).toHaveProperty('groupAdmin');
     
        await Driver.deleteMany({id: parseInt(input)});

    }, 15000);

  });
});