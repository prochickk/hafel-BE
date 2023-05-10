const request = require('supertest');
const Address = require('../../../module/Address');
const User = require('../../../module/User');
const Driver = require('../../../module/Driver');
let server;

describe("/api/usersConfirm", () => {
  beforeEach(() => { server = require('../../../index');})
  afterEach(() => {server.close();})

  // GET
  describe('GET /', () => {
    let token;
    let input;
    
    const exec = async () => {
      return await request(server).get(`/api/usersConfirm?driverGroup=${input}`).set('x-auth-token', token);
    }

    beforeEach(() => {
      token = new User().generateAuthToken()
      input = 'basha90'
    });

    it('should return 401 if client is not logged in', async () => {
      token = ''
      
      const res = await exec();
      
      expect(res.status).toBe(401);
    }, 15000);
    
    it('should return 201 and one elemnt list if no User account need confirmation for this Group', async () => {
      await User.deleteMany({ group: input})
      const res = await exec();

      expect(res.status).toBe(201);

      expect(res.body[0]).toHaveProperty('name', "لا يوجد أي طلبات للتوثيق",);
      expect(res.body[0]).toHaveProperty('group', '');

    }, 15000);
    
    it('should return 201 if and list of elemnts Acounts need confirmation for this Group', async () => {
      content = {     
        name:"1001",
        password:"12345",
        group: input,
        id:80000,
        email:"1001@gmail.com",
        mobileNumber:1000053214,
        groupConfirmation:false,
        }

      const fakeUser1 = new User(content)

      const fakeUser2 = new User(content)
      fakeUser2.name = '2001'
      fakeUser2.email = '2001@gmail.com'
      fakeUser2.mobileNumber = 2000023214

      await fakeUser1.save()
      await fakeUser2.save()

      const res = await exec();

      expect(res.status).toBe(201);
      expect(res.body[0]).toHaveProperty('_id');
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('group');
      expect(res.body[0]).toHaveProperty('groupConfirmation', false);
      
      expect(res.body[1]).toHaveProperty('_id');
      expect(res.body[1]).toHaveProperty('groupConfirmation', false);

      await User.deleteMany({ group: input})

    }, 15000);
  });

  // POST
  describe('POST /', () => {
    let token;
    let input;
    
    const exec = async () => {
      return await request(server).post(`/api/usersConfirm?id=${input}`).set('x-auth-token', token).send();
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
    
    
    it('should return 404 if invalid user ID', async () => {
      input = '80011'
      
      const res = await exec();

      expect(res.status).toBe(404);
    }, 15000);
  
    it('should return 201 with GroupConfirmed User', async () => {
        const fakeUser = new User({ 
            name:"fakeUser",
            password:"fakeUser",
            group: 'basha90',
            id: parseInt(input),
            email:"fakeUser2@gmail.com",
            mobileNumber:4400033214,
            groupConfirmation:false,
            
            });

        await fakeUser.save();

        const res = await exec();

        const checkUpdate = await User.findOne({ email: fakeUser.email })

        expect(res.status).toBe(201);
        expect(checkUpdate).toHaveProperty('_id');
        expect(checkUpdate).toHaveProperty('groupConfirmation', true);
     
        await User.deleteMany({id: parseInt(input)});

    }, 15000);

  });
  
  
  // PUT
  describe('POST /', () => {
    let token;
    let input;
    
    const exec = async () => {
      return await request(server).put(`/api/usersConfirm?id=${input}`).set('x-auth-token', token).send();
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
  
    it('should return 201 with not GroupConfirmed User', async () => {
        const fakeUser = new User({ 
            name:"fakeUser",
            password:"fakeUser",
            group: 'basha90',
            id: parseInt(input),
            email:"fakeUser22@gmail.com",
            mobileNumber:4400095214,
            groupConfirmation:true,
            });

        await fakeUser.save();

        const res = await exec();

        const CheckGroupDeactivation = await User.findOne({ id: parseInt(input)})

        expect(res.status).toBe(201);
        expect(CheckGroupDeactivation).toHaveProperty('_id');
        expect(CheckGroupDeactivation).toHaveProperty('groupConfirmation', false);
     
        await User.deleteMany({id: parseInt(input)});

    }, 15000);

  });
});