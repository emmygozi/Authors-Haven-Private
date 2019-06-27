import chai from 'chai';
import chaiHttp from 'chai-http';
import { createTestUser, generateToken } from './factory/user-factory';
import app from '../app';

chai.use(chaiHttp);
const { expect } = chai;

let firstUserToken, secondUserToken, firstUsername, secondUsername;

describe('TESTS TO FOLLOW A USER', () => {
  before(async () => {
    const user1 = await createTestUser({ });
    const user2 = await createTestUser({ });
    firstUserToken = await generateToken({ id: user1.id });
    secondUserToken = await generateToken({ id: user2.id });
    firstUsername = user1.dataValues.username;
    secondUsername = user2.dataValues.username;
  });

  it('first-user should follow second-user', (done) => {
    try {
      chai.request(app)
        .post(`/api/v1/profiles/${secondUsername}/follow`)
        .set('authorization', `Bearer ${firstUserToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.eql('User followed successfully');
          expect(res.body).to.have.property('payload');
          expect(res.body).to.have.property('status');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('second-user should follow first-user', (done) => {
    try {
      chai.request(app)
        .post(`/api/v1/profiles/${firstUsername}/follow`)
        .set('authorization', `Bearer ${secondUserToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.eql('User followed successfully');
          expect(res.body).to.have.property('status');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should return user not found when wrong username is passed', (done) => {
    try {
      chai.request(app)
        .post('/api/v1/profiles/nhhg/follow')
        .set('authorization', `Bearer ${firstUserToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.be.an('object');
          expect(res.body.errors.global).to.eql('User to follow not found');
          expect(res.body).to.have.property('status');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('first-user cannot follow himself', (done) => {
    try {
      chai.request(app)
        .post(`/api/v1/profiles/${firstUsername}/follow`)
        .set('authorization', `Bearer ${firstUserToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.an('object');
          expect(res.body.errors.global).to.eql('you cannot follow yourself');
          expect(res.body).to.have.property('status');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
});

describe('TESTS TO UNFOLLOW A USER', () => {
  it('first-user should unfollow second-user', (done) => {
    try {
      chai.request(app)
        .delete(`/api/v1/profiles/${secondUsername}/follow`)
        .set('authorization', `Bearer ${firstUserToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.eql('User unfollowed successfully');
          expect(res.body).to.have.property('status');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('second-user should unfollow first-user', (done) => {
    try {
      chai.request(app)
        .delete(`/api/v1/profiles/${firstUsername}/follow`)
        .set('authorization', `Bearer ${secondUserToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('payload');
          expect(res.body.payload).to.be.an('object');
          expect(res.body.message).to.eql('User unfollowed successfully');
          expect(res.body).to.have.property('status');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should return user to unfollow not found when wrong username is passed', (done) => {
    try {
      chai.request(app)
        .delete('/api/v1/profiles/rbbwgeghrdegwrgebge/follow')
        .set('authorization', `Bearer ${firstUserToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.be.an('object');
          expect(res.body.errors.global).to.eql('User to unfollow not found');
          expect(res.body).to.have.property('status');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('first-user cannot unfollow himself', (done) => {
    try {
      chai.request(app)
        .delete(`/api/v1/profiles/${firstUsername}/follow`)
        .set('authorization', `Bearer ${firstUserToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.an('object');
          expect(res.body.errors.global).to.eql('you cannot unfollow yourself');
          expect(res.body).to.have.property('status');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
});
