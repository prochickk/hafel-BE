const request = require('supertest');
const User = require('../../../module/User');
const Listing = require('../../../module/Listing');
let server;

describe("/api/listing", () => {
  beforeEach(() => { server = require('../../../index');})
  afterEach(() => {server.close();})

  // GET
  describe('GET /:id', () => {
    let token;
    let input;
    
    const exec = async () => {
      return await request(server).get(`/api/listing/${input}`).set('x-auth-token', token);
    }

    beforeEach(() => {
      token = new User().generateAuthToken()
      input = 5000
    });

    it('should return 401 if client is not logged in', async () => {
      token = ''
      
      const res = await exec();
      
      expect(res.status).toBe(401);
    }, 15000);
    
    it('should return 200 if valid user', async () => {
      const newListing = new Listing({
        tripTypeL:'newListing',
        tripTimeL:'newListing',
        tripDayL:"الأحد",
        tripDayEng:'newListing',
        descriptionL:"undefined",
        groupL:'newListing',
        idListing: parseInt(input),
        useId:8
      })
      await newListing.save();

      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty('_id');
      expect(res.body[0]).toHaveProperty('groupL', 'newListing');

      await Listing.deleteOne({ idListing: parseInt(input) })

    }, 15000);
  });
});