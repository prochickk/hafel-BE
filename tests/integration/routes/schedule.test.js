const request = require('supertest');
const User = require('../../../module/User');
const Listing = require('../../../module/Listing');
const Schedule = require('../../../module/Schedule');
let server;

describe("/api/schedule", () => {
  beforeEach(() => { server = require('../../../index');})
  afterEach(() => {server.close();})

  // GET
  describe('GET /:id', () => {
    let token;
    let input;
    
    const exec = async () => {
      return await request(server).get(`/api/schedule/${input}`).set('x-auth-token', token);
    }

    beforeEach(() => {
      token = new User().generateAuthToken()
      input = 55000
    });

    it('should return 401 if client is not logged in', async () => {
      token = ''
      
      const res = await exec();
      
      expect(res.status).toBe(401);
    }, 15000);

    it('should return 404 if invalid schedule Id', async () => {
      input = 55001
      const res = await exec();
      
      expect(res.status).toBe(404);
    }, 15000);
    
    it('should return 200 if valid user', async () => {
      const newSchedule = new Schedule({
        tripType:'newSchedule',
        tripTime:'newSchedule',
        tripDay:"الأحد",
        groupL:'newSchedule',
        idSchedule: input,
        useId:8888
      });
      
      await newSchedule.save();

      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty('_id');
      expect(res.body[0]).toHaveProperty('idSchedule');

      await Schedule.deleteMany({ idSchedule: input })

    }, 15000);
  });
});