const request = require('supertest');
const User = require('../../../module/User');
const Listing = require('../../../module/Listing');
const moment = require('moment');
const Schedule = require('../../../module/Schedule');
const Address = require('../../../module/Address');
let day = moment().format('dddd');
if (day == "Friday" || day == "Saturday"){
  day = "Sunday"
}
let server;

describe("/api/schedules", () => {
  beforeEach(() => { server = require('../../../index');})
  afterEach(() => {server.close();})

  // GET
  describe('GET /', () => {
    let token;
    let input;
    
    const exec = async () => {
      return await request(server).get(`/api/schedules?userId=${input}`).set('x-auth-token', token);
    }

    beforeEach(() => {
      token = new User().generateAuthToken()
      input = 88888
    });

    it('should return 401 if client is not logged in', async () => {
      token = ''
      
      const res = await exec();
      
      expect(res.status).toBe(401);
    }, 15000);
    
    it('should return 200 and list of one item if no elemnts added', async () => {
      await Schedule.deleteMany({ userId: 88888 });

      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty('tripDay', 'لا يوجد أي عنصر');
      expect(res.body[0]).toHaveProperty('tripTime');

    }, 15000);

   
    it('should return 200 and list of items if related to the USERID', async () => {
      const content = {
        tripType:'newListing',
        tripTime:'newListing',
        tripDay:"الثلاثاء",
        group:'newListing',
        idSchedule: 8888888,
        useId:88888
      };

      input = content.useId

      let fakeSchedule1 = new Schedule(content);
      await fakeSchedule1.save();
      
      let fakeSchedule2 = new Schedule(content);
      fakeSchedule2.idSchedule = 7777777
      await fakeSchedule2.save();

      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty('_id');
      expect(res.body[0]).toHaveProperty('useId');

      expect(res.body[1]).toHaveProperty('_id');
      expect(res.body[1]).toHaveProperty('useId');

      expect(res.body[1].idSchedule).not.toBe(res.body[0].idSchedule);
    }, 15000);


  });


//   DELEET
  describe('DELETE /', () => {
    let token;
    let input;
    
    const exec = () => {
      return  request(server).delete(`/api/schedules?scheduleId=${input}`).set('x-auth-token', token).send();
    }

    beforeEach(() => {
      token = new User().generateAuthToken()
      input = 8888887
    });

    it('should return 401 if client is not logged in', async () => {
      token = ''
      
      const res = await exec();
      
      expect(res.status).toBe(401);
    }, 15000);
    
    
    it('should return 404 if invalid Schedule Id', async () => {
      input = 777775
      const res = await exec();
      
      expect(res.status).toBe(404);
    }, 15000);
    
    it('should return 201 if address deleted', async () => {
      const testSchedule = new Schedule({
        name: "testScheduleDel",
        region: "Integration",
        idSchedule: 8888888});
      await testSchedule.save();

      input = testSchedule.idSchedule

      const res = await exec();

      const check = Schedule.findOne({idSchedule: testSchedule.idSchedule})

      expect(res.status).toBe(201);
      expect(check[0]).toBeUndefined();
    }, 15000);
  });

  // POST
  describe('POST /', () => {
    let token;
    let input;
    
    const exec = async () => {
      return await request(server).post('/api/schedules').set('x-auth-token', token).send(input);
    }

    beforeEach(() => {
      token = new User().generateAuthToken()
      input = { 
        typeCateLabel: 'postingTest',
        timeCateLabel: 'postingTest',
        dayCateLabel: 'postingTest',
        addressCateId: "595599",
        group: 'abuAhmed',
        useId: 666,
      }
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''
      
      const res = await exec();

      expect(res.status).toBe(401);
    }, 15000);
    
    it('should return 404 if addressId is Invalid', async () => {
      
      const res = await exec();

      expect(res.status).toBe(404);
    }, 15000);
  
    it('should return 201 when posting New Schedule', async () => {
      const fakeAddress = new Address({
        idAddress: 888888,
        useId: 7777777,
        name: 'fakeName',
        region: 'fakeRegion',
      })
      await fakeAddress.save();
      input.addressCateId = fakeAddress.idAddress.toString()
      input.useId = fakeAddress.useId

      const res = await exec();
      const schedule = await Schedule.findOne({ addressRegion: fakeAddress.region})

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
         
      expect(schedule).toHaveProperty('_id');
      expect(schedule).not.toBeNull();
      expect(res.body.idSchedule).toBe(schedule.idSchedule);

      await Address.deleteOne({useId: fakeAddress.useId});

    }, 15000);

  });
});