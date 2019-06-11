import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';

chai.use(chaiHttp);
const { expect } = chai;


describe('TEST TO RATE AN ARTICLE', () => {
  // Login and get a token
  let userToken;
  before(() => {
    it('should login with status 200', (done) => {
      try {
        chai.request(app)
          .post('/api/v1/auth/login')
          .send({
            email: 'justsine@snqwst.com',
            password: '1234567'
          })
          .end((err, res) => {
            userToken = res.body.user.token;
            console.log('TOken3: ', userToken);
            expect(res.status).to.equal(200);
            expect(res.body.user).to.be.an('object');
            expect(res.body.user.token).to.be.a('string');
            expect(res.body).to.have.property('status');
            const returnStatus = 'success';
            expect(res.body).to.have.property('status', returnStatus);
            done();
          });
      } catch (err) {
        throw err.message;
      }
    });
  });

  console.log('The token is: ', userToken);
});
