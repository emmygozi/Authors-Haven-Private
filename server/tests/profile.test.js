import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import { createProfileDetails } from './factory/profile-factory';
import { createTestUser, generateToken } from './factory/user-factory';


chai.use(chaiHttp);
const { expect } = chai;

let userToken, profileDetails, userName, profileDetails2;

describe('TEST FOR USER PROFILE', () => {
  before(async () => {
    const user = await createTestUser({ });
    const { id, username } = user;
    userName = username;
    userToken = `Bearer ${await generateToken({ id })}`;

    profileDetails = await createProfileDetails({ });
  });

  it('should return profile of valid user', (done) => {
    try {
      chai.request(app)
        .get(`/api/v1/profiles/${userName}`)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(200);
          expect(res.body).to.have.property('payload');

          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should return some properties', (done) => {
    try {
      chai.request(app)
        .get(`/api/v1/profiles/${userName}`)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(200);
          expect(res.body.payload).to.have.property('firstname');
          expect(res.body.payload).to.have.property('lastname');
          expect(res.body.payload).to.have.property('bio');
          expect(res.body.payload).to.have.property('avatar');
          expect(res.body.payload).to.have.property('location');

          done(err);
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should return error for non-existing profile', (done) => {
    try {
      chai.request(app)
        .get('/api/v1/profiles/Sanchez')
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(404);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.have.property('global');
          expect(res.body.errors.global).to.be.equal('User does not exists');

          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should update user details successfully', (done) => {
    try {
      chai.request(app)
        .put('/api/v1/users')
        .set('Authorization', userToken)
        .send({ ...profileDetails })
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(200);
          expect(res.body).to.have.property('payload');

          done(err);
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should return some fields on user update', (done) => {
    try {
      chai.request(app)
        .put('/api/v1/users')
        .set('Authorization', userToken)
        .send({ ...profileDetails })
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(200);
          expect(res.body).to.have.property('payload');
          expect(res.body.payload).to.have.property('firstname');
          expect(res.body.payload).to.have.property('lastname');
          expect(res.body.payload).to.have.property('bio');
          expect(res.body.payload).to.have.property('avatar');
          expect(res.body.payload).to.have.property('location');

          done(err);
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should return error with invalid user token', (done) => {
    try {
      chai.request(app)
        .put('/api/v1/users')
        .set('Authorization', 'Bearer mknkhjgbjnkmb')
        .send({ ...profileDetails })
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(401);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.have.property('global');
          expect(res.body.errors.global).to.be.equal('Invalid Token Provided');

          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should return error without token specifed', (done) => {
    try {
      chai.request(app)
        .put('/api/v1/users')
        .send({ ...profileDetails })
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(400);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.have.property('global');
          expect(res.body.errors.global).to.be.equal('Invalid token supplied: format Bearer <token>');

          done(err);
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should return error for some fields on user update', (done) => {
    try {
      chai.request(app)
        .put('/api/v1/users')
        .set('Authorization', userToken)
        .send({ firstname: 40, phone: 'fgrsmdlf' })
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(400);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.have.property('firstname');
          expect(res.body.errors).to.have.property('phone');
          expect(res.body.errors.firstname).to.be.equal('firstname must be a string');
          expect(res.body.errors.phone).to.be.equal('phone must be a number');

          done(err);
        });
    } catch (err) {
      throw err.message;
    }
  });
});

describe('TEST TO VALIDATE USER PROFILE', () => {
  before(async () => {
    profileDetails = await createProfileDetails({
      firstname: 't',
    });
    profileDetails2 = await createProfileDetails({
      bio: 'aaas',
    });
  });

  it('should return error when bio is not up to 5 letters', (done) => {
    try {
      chai.request(app)
        .put('/api/v1/users')
        .set('Authorization', userToken)
        .send({ ...profileDetails2 })
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(400);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors.bio).to.be.equal('bio length must be at least 5 characters long');
          done(err);
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should return error when firstname character is less than 2', (done) => {
    try {
      chai.request(app)
        .put('/api/v1/users')
        .set('Authorization', userToken)
        .send({ ...profileDetails })
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(400);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors.firstname).to.be.equal('firstname length must be at least 2 characters long');
          done(err);
        });
    } catch (err) {
      throw err.message;
    }
  });
});
