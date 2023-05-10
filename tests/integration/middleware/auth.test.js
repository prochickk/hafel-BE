const Address = require('../../../module/Address')
const User = require('../../../module/User')
const request = require('supertest')

let server;

describe("auth middleware", () => {
  beforeEach(() => { server = require('../../../index');})
  afterEach(() => {server.close();})

  let token
  let input

  const exec = () => {
    return request(server).post('/api/addresses').set('x-auth-token', token).send(input);
  }

  beforeEach(() => {
    token = new User().generateAuthToken()
    input = { 
      name: 'shamekh',
      useId: 123,
      nearLocCateLabel: 'shmaikhah',
      location: JSON.stringify({
        longitude: 49.58798440173268,
        latitude: 25.330102514529933
      }),
    }
  })


  it('should return 401 if no token is provided', async () => {
    token = ''
    const res = await exec();

    expect(res.status).toBe(401);
  }, 15000);

  it('should return 400 if no token is invalid', async () => {
    token = 'a'
    const res = await exec();

    expect(res.status).toBe(400);
  }, 15000);
  
  it('should return 200 if token is valid', async () => {
    const res = await exec();

    expect(res.status).toBe(201);

    await Address.deleteOne({_id: res.body._id})
  }, 15000);



})


