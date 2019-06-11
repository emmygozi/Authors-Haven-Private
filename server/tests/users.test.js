import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
const { expect } = chai;

describe('TESTS TO SIGNUP A USER', () => {
  it('should return `username is required` if username is absent ', (done) => {
    try {
      chai.request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'justsine@snqwst.com',
          password: '1234567'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.username).to.eql('username is required');
          expect(res.body).to.have.property('status');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should return email is required if email is absent ', (done) => {
    try {
      chai.request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'Sanchezqwst',
          password: '1234567'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.email).to.eql('email is required');
          expect(res.body).to.have.property('status');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should return success status 201', (done) => {
    try {
      chai.request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'Sanchezqwst',
          email: 'justsine@snqwst.com',
          password: '1234567'
        })
        .end((err, res) => {
          expect(res.status).to.equal(201);
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

  it('should return a duplicate signup', (done) => {
    try {
      chai.request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'Sanchezqwst',
          email: 'justsine@snqwst.com',
          password: '1234567'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('status');
          const returnStatus = 400;
          expect(res.body).to.have.property('status', returnStatus);
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should return an empty entry error', (done) => {
    try {
      chai.request(app)
        .post('/api/v1/auth/register')
        .send({
          username: '',
          email: '',
          password: ''
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.be.an('object');
          expect(res.body).to.have.property('status');
          const returnStatus = 400;
          expect(res.body).to.have.property('status', returnStatus);
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
});

describe('TESTS TO LOGIN A USER', () => {
  it('should login with status 200', (done) => {
    try {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'justsine@snqwst.com',
          password: '1234567'
        })
        .end((err, res) => {
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

  it('should return an invalid login', (done) => {
    try {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'justsine@snqwfssst.com',
          password: '1234d567'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.global).to.equal('Invalid email or password');
          expect(res.body).to.have.property('status');
          const returnStatus = 400;
          expect(res.body).to.have.property('status', returnStatus);
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
  it('should return an invalid login when password does not match', (done) => {
    try {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'justsine@snqwst.com',
          password: '11224b'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.global).to.equal('Invalid email or password');
          expect(res.body).to.have.property('status');
          const returnStatus = 400;
          expect(res.body).to.have.property('status', returnStatus);
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should return `email is required` if email is absent ', (done) => {
    try {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send({
          password: '1234567'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.email).to.eql('email is required');
          expect(res.body).to.have.property('status');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
});
