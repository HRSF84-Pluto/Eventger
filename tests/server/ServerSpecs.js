const expect = require('chai').expect;
let request = require('supertest');
const chai = require('chai')
  , chaiHttp = require('chai-http');

chai.use(chaiHttp);

request = request('http://localhost:3000');


describe('server is listening on port 3000', function() {
  it('succeeds silently!', function() {
    chai.request('http://localhost:3000')
      .get('/')
      .end(function(err, res) {
        expect(res).to.have.status(200);
      });
  }) ;
  });

