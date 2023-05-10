const request = require('supertest');
const Address = require('../../../module/Address');
const User = require('../../../module/User');

let server;




describe("GET /api/address", () => {
  
  beforeEach(() => { server = require('../../../index'); })
  afterEach(() => { server.close(); })


  let token;
  let input;
    
  const exec = async () => {
    return await request(server).get(`/api/address/${input}`).set('x-auth-token', token);
  }

  beforeEach(() => {
    token = new User().generateAuthToken()
  })


  describe("GET /:id", () => {
    it('should return 401 if client is not logged in', async () => {
      token = ''
      
      const res = await exec();

      expect(res.status).toBe(401);
    }, 15000);

    it("should return the address object if a valid ID is provided", async () => {
      const address = new Address({name: "testAddressAdding", region: "Integration", useId: 999});
      await address.save();
      input = address._id

      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body[0].name).toBe("testAddressAdding");
      expect(res.body[0].region).toBe("Integration");
      expect(res.body[0].useId).toBe(999);

      await Address.deleteOne({_id: address._id});

    }, 15000);

    it("should return 404 if an invalid ID is provided", async () => {
      input = 1
      const res = await exec()

      expect(res.status).toBe(404);
    }, 15000);
  });
});


