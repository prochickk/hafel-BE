// TODO
const request = require('supertest');
const Address = require('../../../module/Address');
const User = require('../../../module/User');
let server;

describe("/api/confirmedUsers?userGroup", () => {
  beforeEach(() => { server = require('../../../index');})
  afterEach(() => {server.close();})

  // GET
  describe('GET /', () => {
    let token;
    let input;
    
    const exec = async () => {
      return await request(server).get(`/api/confirmedUsers?${input}`)
    }

    beforeEach(() => {
      token = new User().generateAuthToken()
    //   input = 'userGroup=الـــبــــاشــــا'
      input = 'userGroup=null'
    });
    
    it('should return 201 if and a list of cinfirmed users accounts', async () => {

      const res = await exec();
      // console.log('BodyOfUsers', res.body);

      expect(input).toBe('userGroup=null');
    //   expect(res.status).toBe(201);

    //   expect(res.body[0]).toHaveProperty('_id');

    }, 15000);
  });

});