const request = require('supertest');
const User = require('../../../module/User');
const Schedule = require('../../../module/Schedule');
let server;

describe("/api/driverSchedules", () => {
  beforeEach(() => { server = require('../../../index');})
  afterEach(() => {server.close();})

  // GET
  describe('GET /', () => {
    let token;
    let input;
    
    const exec = async () => {
      return await request(server).get(`/api/driverSchedules?driverGroup=${input}`).set('x-auth-token', token);
    }

    beforeEach(() => {
      token = new User().generateAuthToken()
      input = 'basha4'
    });

    it('should return 401 if client is not logged in', async () => {
      token = ''
      
      const res = await exec();
      
      expect(res.status).toBe(401);
    }, 15000);
    
    it('should return 200 if and one item list if no Schedule items added', async () => {
      await Schedule.deleteMany({group: input})

      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty('tripDay', 'لا يوجد أي عنصر');
      expect(res.body[0]).toHaveProperty('idSchedule', 0);

    }, 15000);
    
    it('should return 200 if and multiple items list when there are items', async () => {
        let content = {
            tripType: "ذهاب لـلـجامـعـة",
            tripTime: "1000:0000-1000:5000",
            tripDay: "الثلاثاء",
            address: 0,
            addressRegion:"noWahre",
            group: input,
            useId: 0,
            idSchedule: 0
        }

        const item1 = new Schedule(content)
        await item1.save();

        const item2 = new Schedule(content);
        item2.addressRegion = 'BeCare'
        await item2.save();

        const res = await exec();
        
        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('_id');
        expect(res.body[1]).toHaveProperty('_id');
        expect(res.body[0]).toHaveProperty('address', 0);
        expect(res.body[1]).toHaveProperty('address', 0);
        
        await Schedule.deleteMany({group: input})
    }, 15000);
  });


  // DELEET
  describe('DELETE /', () => {
    let token;
    let input;
    
    const exec = () => {
      return  request(server).delete(`/api/driverSchedules?scheduleId=${input}`).set('x-auth-token', token).send();
    }

    beforeEach(() => {
      token = new User().generateAuthToken()
      input = '999'
    });

    it('should return 401 if client is not logged in', async () => {
      token = ''
      
      const res = await exec();
      
      expect(res.status).toBe(401);
    }, 15000);
    
    it('should return 404 if item ID is invalid', async () => {
      input = -1
      
      const res = await exec();
      
      expect(res.status).toBe(404);
    }, 15000);
    
    it('should return 201 if the Schedule deleted', async () => {
      const testSchedule = new Schedule({name: "testScheduleDel", region: "Integration", idSchedule: 9999});
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
      return await request(server).post('/api/driverSchedules').set('x-auth-token', token).send(input);
    }

    beforeEach(() => {
      token = new User().generateAuthToken()
      input = { 
        typeCateLabel: "driverSchedules",
        timeCateLabel: 'driverSchedules',
        dayCateLabel: "driverSchedules",
        description: null,
        group: 'basha4',
        useId: 40000,
        addressCateId: 15015
        };
    })


    it('should return 401 if client is not logged in', async () => {
      token = ''
      
      const res = await exec();

      expect(res.status).toBe(401);
    }, 15000);
  
    it('should return 201 when posting New Address', async () => {

      const res = await exec();

      const schedule = await Schedule.findOne({_id: res.body._id})

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('address');
      expect(res.body).toHaveProperty('group');
      
      expect(schedule).toHaveProperty('_id');
      expect(schedule).not.toBeNull();

      await Schedule.deleteMany({group: input.group});

    }, 15000);

  });
});