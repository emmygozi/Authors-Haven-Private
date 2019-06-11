import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import app from '../app';
import generateToken from './factory/user-factory';
import models from '@models';

chai.use(chaiHttp);
const { expect } = chai;

let userToken;

describe('TEST TO RATE AN ARTICLE', () => {
  before(async () => {
    const newUser = await models.User.create({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    });
    userToken = await generateToken({ id: newUser.id });
  });

  it('should not rate article because articleId is not provided in body', (done) => {
    try {
      chai
        .request(app)
        .post('/api/v1/articles/rate')
        .set('token', userToken)
        .send({ rate: '1234567' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.articleId).to.equal('articleId is required');
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('status', 400);
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should not rate article because rate is not provided in body', (done) => {
    try {
      chai
        .request(app)
        .post('/api/v1/articles/rate')
        .set('token', userToken)
        .send({ articleId: '26797322-78a7-4651-8a67-998315381b22' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.rate).to.equal('rate is required');
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('status', 400);
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should not rate article because rate is not a number', (done) => {
    try {
      chai
        .request(app)
        .post('/api/v1/articles/rate')
        .set('token', userToken)
        .send({ articleId: '26797322-78a7-4651-8a67-998315381b22', rate: '4s' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.rate).to.equal('rate must be a number');
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('status', 400);
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should not rate article because rate is not (1, 2, 3, 4, or 5)', (done) => {
    try {
      chai
        .request(app)
        .post('/api/v1/articles/rate')
        .set('token', userToken)
        .send({ articleId: '26797322-78a7-4651-8a67-998315381b22', rate: 4.5 })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.rate).to.equal(
            'rate must be one of [1, 2, 3, 4, 5]'
          );
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('status', 400);
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should not rate article because user token is not provided', (done) => {
    try {
      chai
        .request(app)
        .post('/api/v1/articles/rate')
        .send({ articleId: '26797322-78a7-4651-8a67-998315381b22', rate: 4.5 })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.global).to.equal('No token provided!');
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('status', 400);
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should not rate article because article does not exist', (done) => {
    try {
      chai
        .request(app)
        .post('/api/v1/articles/rate')
        .set('token', userToken)
        .send({ articleId: '00000000-78a7-4651-8a67-998315381b22', rate: 4 })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.global).to.equal('Article does not exist');
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('status', 404);
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
});
