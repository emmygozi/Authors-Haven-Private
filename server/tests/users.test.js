import chai from 'chai';
import chaiHttp from 'chai-http';
import UserController from '@controllers/users';
import app from '../app';
import { createTestUser, generateToken, createNonActiveUser } from './factory/user-factory';

chai.use(chaiHttp);
const { expect } = chai;
const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZjZDAwNDBmLTI3MDktNGU0Yi05YjU2LWYzZDk3MmRhNjk4OTg5IiwiZW1haWwiOiJqdXN0c2luZUBzbnF3c3QuY29tIiwiaWF0IjoxNTYwMjA3NTAyLCJleHAiOjE1NjAyOTM5MDJ9.FpXu8SrboezKr57MNcrEA_pGhsMRm0G5ptUGqQje12I';
let globalResetToken, globalAuthToken, secondUserToken, userMail,
  resetToken, testUser, unVerifiedUser, userToken, authToken;

describe('TESTS TO SIGNUP A USER', () => {
  before(async () => {
    const { email } = await createNonActiveUser({});

    userMail = email;
  });
  afterEach(async () => {
    const { id, email } = await createTestUser({});
    const payload = {
      id,
      email
    };
    secondUserToken = await generateToken(payload);
  });

  it('should return `username is required` if username is absent ', (done) => {
    try {
      chai.request(app)
        .post('/api/v1/users')
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
        .post('/api/v1/users')
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
        .post('/api/v1/users')
        .send({
          username: 'Sanchezqwst',
          email: 'justsine@snqwst.com',
          password: '1234567'
        })
        .end((err, res) => {
          globalAuthToken = res.body.payload.token;
          expect(res.status).to.equal(201);
          expect(res.body.payload).to.be.an('object');
          expect(res.body.payload.token).to.be.a('string');
          expect(res.body).to.have.property('status');
          expect(res.body.message).to.equal('User created successfully');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should return a duplicate signup', (done) => {
    try {
      chai.request(app)
        .post('/api/v1/users')
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
        .post('/api/v1/users')
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
          userToken = res.body.payload.token;
          expect(res.status).to.equal(200);
          expect(res.body.payload).to.be.an('object');
          expect(res.body.payload.token).to.be.a('string');
          expect(res.body).to.have.property('status');
          expect(res.body.message).to.equal('User successfully logged in');
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

  it('should success email sent ', (done) => {
    try {
      chai.request(app)
        .post('/api/v1/auth/verify_account')
        .set('Authorization', `Bearer ${globalAuthToken}`)
        .send({})
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should return unsuccesful reset token', (done) => {
    try {
      chai.request(app)
        .post(`/api/v1/auth/activate_user?token=${globalResetToken}&email=justsine@snqwst.com`)
        .set('Authorization', `Bearer ${globalAuthToken}`)
        .send({})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.be.an('object');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should return not found', (done) => {
    try {
      chai.request(app)
        .post('/api/v1/auth/verify_account')
        .set('Authorization', `Bearer ${secondUserToken}`)
        .send({})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.an('object');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should no token present', (done) => {
    try {
      chai.request(app)
        .post('/api/v1/auth/activate_user')
        .set('Authorization', `Bearer ${globalAuthToken}`)
        .send({})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.an('object');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should return user does not exist', (done) => {
    try {
      chai.request(app)
        .post(`/api/v1/auth/activate_user?token=${resetToken}&email=x0x0xx0x@88.com`)
        .set('Authorization', `Bearer ${globalAuthToken}`)
        .send({})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.be.an('object');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should return Invalid token', (done) => {
    try {
      chai.request(app)
        .post(`/api/v1/auth/activate_user?token=12345&email=${userMail}`)
        .set('Authorization', `Bearer ${globalAuthToken}`)
        .send({})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.be.an('object');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });


  it('should create a dropped token', (done) => {
    try {
      chai.request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.status).to.be.equal(201);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.equal('You are now logged out');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
  it('should return 200 even though token has been dropped', (done) => {
    try {
      chai.request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body).to.have.property('status');
          expect(res.body.payload).to.be.an('object');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should return error for empty token', (done) => {
    try {
      chai.request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', '')
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(400);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors.global).to.be.equal('Invalid token supplied: format Bearer <token>');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should return 200 even though token is invalid', (done) => {
    try {
      chai.request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${invalidToken}`)
        .end((err, res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body).to.have.property('status');
          expect(res.body.payload).to.be.an('object');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
});

describe('TEST TO GET ALL USERS', () => {
  before(async () => {
    testUser = await createTestUser({});
    authToken = await generateToken({ id: testUser.id });
  });
  it('should return all users', (done) => {
    try {
      chai.request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.payload).to.be.an('array');
          expect(res.body).to.have.property('status');
          expect(res.body.message).to.equal('Users and corresponding profiles retrieved successfully');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
  it('should return errors if no token was provided', (done) => {
    try {
      chai.request(app)
        .get('/api/v1/users')
        .set('Authorization', '')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('errors');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
  it('should return invalid token', (done) => {
    try {
      chai.request(app)
        .get('/api/v1/users')
        .set('Authorization', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.global).to.eql('Invalid token supplied: format Bearer <token>');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
});

describe('TEST TO SEND RESET TOKEN TO EMAIL', () => {
  before(async () => {
    unVerifiedUser = await createNonActiveUser({ active: true });
    authToken = await generateToken({ id: testUser.id });
  });

  it('should fail because the email is not provided', (done) => {
    try {
      chai.request(app)
        .post('/api/v1/auth/forgot_password')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.email).to.eql('email is required');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should fail because the email is invalid', (done) => {
    try {
      chai.request(app)
        .post('/api/v1/auth/forgot_password')
        .send({ email: 'this_is_not_an_email' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.email).to.eql('email must be a valid email');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should fail because the email does not exist in the database', (done) => {
    try {
      chai.request(app)
        .post('/api/v1/auth/forgot_password')
        .send({ email: 'fakeemail@fakeemail.fake' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.global).to.eql('Please use a valid reset link');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should fail because the email account has not been verified', (done) => {
    try {
      chai.request(app)
        .post('/api/v1/auth/forgot_password')
        .send({ email: unVerifiedUser.email })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.global).to.eql('Your account is not verified');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should fail because the user does not have any valid reset token created yet', (done) => {
    try {
      chai.request(app)
        .post(`/api/v1/auth/reset_password?token=this_is_a_fake_token&email=${testUser.email}`)
        .send({ password: 'emmanuel', confirmPassword: 'emmanuel' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.global).to.eql('Please use a valid reset link');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should send email to the user', (done) => {
    try {
      chai.request(app)
        .post('/api/v1/auth/forgot_password')
        .send({ email: testUser.email })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.be.an('string');
          expect(res.body.message).to.eql('A reset token has been sent to your email address');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should update user token', (done) => {
    try {
      chai.request(app)
        .post('/api/v1/auth/forgot_password')
        .send({ email: testUser.email })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.be.an('string');
          expect(res.body.message).to.eql('A reset token has been sent to your email address');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
});

describe('TEST TO RESET USER PASSWORD', () => {
  it('should fail because password and confirm password is not provided', (done) => {
    try {
      chai.request(app)
        .post('/api/v1/auth/reset_password')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.password).to.eql('password is required');
          expect(res.body.errors.confirmPassword).to.eql('Passwords do not match');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should fail because password is less than 5 characters', (done) => {
    try {
      chai.request(app)
        .post('/api/v1/auth/reset_password')
        .send({ password: 'emma' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.password).to.eql('password length must be at least 5 characters long');
          expect(res.body.errors.confirmPassword).to.eql('Passwords do not match');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should fail because password and confirm password do not match', (done) => {
    try {
      chai.request(app)
        .post('/api/v1/auth/reset_password')
        .send({ password: 'emmanuel', confirmPassword: 'emmanuell' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.confirmPassword).to.eql('Passwords do not match');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should fail because email and token were not passed in the request query', (done) => {
    try {
      chai.request(app)
        .post('/api/v1/auth/reset_password')
        .send({ password: 'emmanuel', confirmPassword: 'emmanuel' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.global).to.eql('Please use a valid reset link');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should fail because user does not exist', (done) => {
    try {
      chai.request(app)
        .post('/api/v1/auth/reset_password?token=this_is_a_fake_token&email=fakeemail@fakeemail.fake')
        .send({ password: 'emmanuel', confirmPassword: 'emmanuel' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.global).to.eql('Please use a valid reset link');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should fail because the token is different from the one in the database', (done) => {
    try {
      chai.request(app)
        .post(`/api/v1/auth/reset_password?token=this_is_a_fake_token&email=${testUser.email}`)
        .send({ password: 'emmanuel', confirmPassword: 'emmanuel' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.global).to.eql('Please use a valid reset link');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
});

describe('TEST SUCCESSFUL PASSWORD RESET', () => {
  let resetPasswordToken;
  before(async () => {
    resetPasswordToken = await UserController.updateToken(testUser);
  });

  it('should change user password, delete token and send success email', (done) => {
    try {
      chai.request(app)
        .post(`/api/v1/auth/reset_password?token=${resetPasswordToken}&email=${testUser.email}`)
        .send({ password: 'emmanuel', confirmPassword: 'emmanuel' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.be.an('string');
          expect(res.body.message).to.eql('Password reset successful');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
});

describe('TEST TO GET USER\'S READ HISTORY', () => {
  it('should return all users', (done) => {
    try {
      chai.request(app)
        .get('/api/v1/users/history')
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.payload).to.be.an('array');
          expect(res.body).to.have.property('status');
          expect(res.body.message).to.equal('Success');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
});
