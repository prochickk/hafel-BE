const request = require('supertest');
const Address = require('../../../module/Address');
const User = require('../../../module/User');
const Listing = require('../../../module/Listing');
const moment = require('moment');
let day = moment().format('dddd');
if (day == "Friday" || day == "Saturday"){
  day = "Sunday"
}

const engToArbDay = (EngilshDay) => {
  if (EngilshDay == "Sunday") {return "الأحد"
  } else if (EngilshDay == "Monday") {return "الأثنين"
  } else if (EngilshDay == "Tuesday") {return "الثلاثاء"
  } else if (EngilshDay == "Wednesday") {return "الأربعاء"
  } else if (EngilshDay == "Thursday") {return "الخميس"
  } else {return "الأحد"}
}

dayArab = engToArbDay(day)
let server;

describe("/api/listings", () => {
  beforeEach(() => { server = require('../../../index');})
  afterEach(() => {server.close();})

  // GET
  describe('GET /', () => {
    let token;
    let input;
    
    const exec = async () => {
      return await request(server).get(`/api/listings?${input}`).set('x-auth-token', token);
    }

    beforeEach(() => {
      token = new User().generateAuthToken()
      input = 'userId=88888&day=currentDay'
    });

    it('should return 401 if client is not logged in', async () => {
      token = ''
      
      const res = await exec();
      
      expect(res.status).toBe(401);
    }, 15000);
    
    it('should return 200 and list of one item if no elemnts added', async () => {
      await Listing.deleteMany({ userId: 88888 });

      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty('tripDayL', 'لا يوجد أي عنصر');
      expect(res.body[0]).toHaveProperty('addressL', 0);

    }, 15000);

   
    it('should return 200 and list of items if related to the USERID', async () => {
      const content = {
        tripTypeL:'newListing',
        tripTimeL:'newListing',
        tripDayL: dayArab,
        tripDayEng: day,
        descriptionL:"undefined",
        groupL:'newListing',
        idListing: 8888888,
        useId:88888
      };
  
      let fakeListing1 = new Listing(content);
      await fakeListing1.save();
      
      let fakeListing2 = new Listing(content);
      fakeListing2.idListing = 77777777
      await fakeListing2.save();

      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty('_id');
      expect(res.body[0]).toHaveProperty('useId');

      expect(res.body[1]).toHaveProperty('_id');
      expect(res.body[1]).toHaveProperty('useId');

      expect(res.body[1].idListing).not.toBe(res.body[0].idListing);
    }, 15000);
  });


  // DELEET
  describe('DELETE /', () => {
    let token;
    let input;
    
    const exec = () => {
      return  request(server).delete(`/api/listings?listingId=${input}`).set('x-auth-token', token).send();
    }

    beforeEach(() => {
      token = new User().generateAuthToken()
      input = '8888887'
    });

    it('should return 401 if client is not logged in', async () => {
      token = ''
      
      const res = await exec();
      
      expect(res.status).toBe(401);
    }, 15000);
    
    
    it('should return 404 if invalid listing Id', async () => {
      
      const res = await exec();
      
      expect(res.status).toBe(404);
    }, 15000);
    
    it('should return 201 if address deleted', async () => {
      const testListing = new Listing({
        name: "testListingDel",
        region: "Integration",
        idListing: 8888888});
      await testListing.save();
      input = 8888888

      const res = await exec();

      const check = Listing.findOne({idListing: testListing.idListing})

      expect(res.status).toBe(201);
      expect(check[0]).toBeUndefined();
    }, 15000);
  });
});