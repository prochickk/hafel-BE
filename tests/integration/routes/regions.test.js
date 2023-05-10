const request = require('supertest');
const Address = require('../../../module/Address');
const User = require('../../../module/User');
const Regions = require('../../../module/Regions');
let server;

describe("/api/addresses", () => {
  beforeEach(() => { server = require('../../../index');})
  afterEach(() => {server.close();})

  // GET
  describe('GET /', () => {
    let token;
    let input;
    
    const exec = async () => {
      return await request(server).get(`/api/regions?driverGroup=${input}`).set('x-auth-token', token);
    }

    beforeEach(() => {
      token = new User().generateAuthToken()
      input = 'New'
    });

    it('should return 401 if client is not logged in', async () => {
      token = ''
      
      const res = await exec();
      
      expect(res.status).toBe(401);
    }, 15000);
    
    it('should return 404 if invalid GroupName', async () => {
      input = 'NoGroup'
      const res = await exec();
      
      expect(res.status).toBe(404);
    }, 15000);
    
    it('should return 200 and list of all groups for New', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).not.toBeNull();
      
    }, 15000);
    
    it('should return 200 and list of all Regions for specific group', async () => {
      const content = {
        group: 'abuAhmed',
        name: 'AA',
        id: 99,
      }
      input = content.group
      const newGroupR1 = new Regions(content)
      await newGroupR1.save();
      
      const newGroupR2 = new Regions(content)
      newGroupR2.name = 'BB'
      newGroupR2.id = 98
      await newGroupR2.save();


      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).not.toBeNull();

      await Regions.deleteMany({ group: content.group })
      
    }, 15000);
  });
});