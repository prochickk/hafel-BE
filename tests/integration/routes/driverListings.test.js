const request = require('supertest');
const moment = require('moment');
const Address = require('../../../module/Address');
const User = require('../../../module/User');
const Listing = require('../../../module/Listing');
let day = moment().format('dddd');
if (day == "Friday" || day == "Saturday"){
  day = "Sunday"
}
let server;

describe("/api/driverListings", () => {
  beforeEach(() => { server = require('../../../index');})
  afterEach(() => {server.close();})

  // GET
  describe('GET /', () => {
    let token;
    let input;
    
    const exec = async () => {
      return await request(server).get(`/api/driverListings?${input}`).set('x-auth-token', token);
    }

    beforeEach(() => {
      token = new User().generateAuthToken()
      input = 'driverGroup=basha&dayFilter=currentDay&hourFilter=allHours&regionFilter=allRegions&goBackFilter=allGoBack'
    });

    it('should return 401 if client is not logged in', async () => {
      token = ''
      
      const res = await exec();
      
      expect(res.status).toBe(401);
    }, 15000);
    
    it('should return 200 and a no weeks trips', async () => {
      await Listing.deleteMany({groupL: 'basha'})

      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty('tripTypeL');
      expect(res.body[0]).toHaveProperty('addressL', 0);
      expect(res.body[0]).toHaveProperty('idListing', 0);
    }, 15000);

    //////////////////////////////////////
    it('should test all trip filters to return 200 and a list of one element of this week trips', async () => {
      const newDlisting = new Listing({
        tripTypeL: 'String',
        tripTimeL: 'String',
        tripDayL: 'String', 
        tripDayEng: day, 
        descriptionL: 'String',
        groupL: 'basha',
        idListing: 90000000,
        useId: 900000000,
        addressL: {lat: 0},
        addressRegionL: 'String',
      });
      await newDlisting.save();
      input = 'driverGroup=basha&dayFilter=currentDay&hourFilter=allHours&regionFilter=allRegions&goBackFilter=allGoBack'
      
      // testing goBackFilter Filter
      input = 'driverGroup=basha&dayFilter=currentDay&hourFilter=allHours&regionFilter=allRegions&goBackFilter=Gooooes'
      let newDlistingtripType = new Listing(newDlisting);
      newDlistingtripType.tripTypeL =  'Gooooes'
      await newDlistingtripType.save();
      
      let res = await exec();
      expect(res.body[0]).toHaveProperty('tripTypeL', newDlistingtripType.tripTypeL);
      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty('groupL', newDlisting.groupL);
      expect(res.body[1]).toBeUndefined();
      

      // testing TripTime Filter
      input = 'driverGroup=basha&dayFilter=currentDay&hourFilter=5:00->6:00&regionFilter=allRegions&goBackFilter=allGoBack'
      let newDlistingtripTimeL = new Listing(newDlisting);
      newDlistingtripTimeL.tripTimeL =  '5:00->6:00'

      await newDlistingtripTimeL.save();
      res = await exec();

      expect(res.body[0]).toHaveProperty('tripTimeL', newDlistingtripTimeL.tripTimeL);
      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty('groupL', newDlisting.groupL);
      expect(res.body[1]).toBeUndefined();

      
      // testing TripDay Filter
      input = 'driverGroup=basha&dayFilter=aDay&hourFilter=allHours&regionFilter=allRegions&goBackFilter=allGoBack';
      let newDlistingtripDayL = new Listing(newDlisting);
      newDlistingtripDayL.tripDayL =  'aDay'
      newDlistingtripDayL.tripDayEng = 'aDay'
      
      await newDlistingtripDayL.save();
      res = await exec();
      
      expect(res.body[0]).toHaveProperty('tripDayL', newDlistingtripDayL.tripDayL);
      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty('groupL', newDlisting.groupL);
      expect(res.body[1]).toBeUndefined();

      
      // testing regions Filter
      input = 'driverGroup=basha&dayFilter=currentDay&hourFilter=allHours&regionFilter=Slapekhat&goBackFilter=allGoBack'
      let newDlistingaddressRegionL = new Listing(newDlisting);
      newDlistingaddressRegionL.addressRegionL =  'Slapekhat'

      await newDlistingaddressRegionL.save();
      res = await exec();

      expect(res.body[0]).toHaveProperty('addressRegionL', newDlistingaddressRegionL.addressRegionL);
      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty('groupL', newDlisting.groupL);
      expect(res.body[1]).toBeUndefined();


      await Listing.deleteMany({groupL: newDlisting.groupL})
    }, 15000);
        
    //////////////////////////////////////
    it('should return 200 and a list of this week trips', async () => {
      const newDlisting = new Listing({
        tripTypeL: 'String',
        tripTimeL: 'String',
        tripDayL: 'String', 
        tripDayEng: day, 
        descriptionL: 'String',
        groupL: 'basha',
        idListing: 90000000,
        useId: 900000000,
        addressL: {lat: 0},
        addressRegionL: 'String',
      });
      await newDlisting.save();

      let newDlisting2 = new Listing(newDlisting);
      newDlisting2.tripTypeL =  'newListing2'
      await newDlisting2.save();
      
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty('tripTypeL');
      expect(res.body[0]).toHaveProperty('addressL');
      expect(res.body[0]).toHaveProperty('idListing', newDlisting.idListing);
      expect(res.body[0]).toHaveProperty('useId', newDlisting.useId);
      expect(res.body[1]).not.toBeNull();

      await Listing.deleteMany({groupL: newDlisting.groupL})
    }, 15000);
  });

  // DELEET
  describe('DELETE /', () => {
    let token;
    let input;
    
    const exec = () => {
      return  request(server).delete(`/api/driverListings?listingId=${input}`).set('x-auth-token', token).send();
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
    
    it('should return 201 if the listing deleted', async () => {

      const testlisting = new Listing({
        groupL: 'String',
        idListing: 999,
        useId: 30000});
      await testlisting.save();
      input = testlisting.idListing

      const res = await exec();
      const check = Listing.findOne({idListing: testlisting.idListing})

      expect(res.status).toBe(201);
      expect(check[0]).toBeUndefined();
    }, 15000);
  });


  // POST
  describe('POST /', () => {
    let token;
    let input;
    
    const exec = async () => {
      return await request(server).post('/api/driverListings').set('x-auth-token', token).send(input);
    }

    beforeEach(() => {
      token = new User().generateAuthToken()
      input = { 
        typeCateLabelListing: "string",
        timeCateLabelListing: 'string',
        dayCateLabelListing: "thisDay",
        descriptionListing: null,
        groupListing: 'basha2',
        useId: 50000,
        addressCateIdListing: JSON.stringify({
          longitude: 22.2,
          latitude: 33.3
        }),
      }
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''
      
      const res = await exec();

      expect(res.status).toBe(401);
    }, 15000);
    
    it('should return 404 when sending invalid input Form', async () => {
      input = undefined
      let res = await exec();

      expect(res.status).toBe(404);
     
     
      input = null
      res = await exec();

      expect(res.status).toBe(404);

    }, 15000);

    it('should return 201 when posting New Listing', async () => {
      const res = await exec();

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('groupL', input.groupListing);

      await Listing.deleteMany({groupL:input.groupListing});

    }, 15000);

  });
});