import sinon from 'sinon';
import bcrypt from 'bcrypt';
import models from '@models/';
import {
  validateSignup,
  validateLogin,
  validateForgotPassword,
  validatePasswordReset
} from '@validations/auth';
import UsersController from '@controllers/users';
import Token from '@helpers/Token';

const { User } = models;

describe('UsersController', () => {
  let sandbox = null;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should handle update of creation of users', async () => {
    const stubFunc = { validateSignup };
    sandbox.stub(stubFunc, 'validateSignup').rejects('Oops');

    const next = sinon.spy();
    await UsersController.create({}, {}, next);
    sinon.assert.calledOnce(next);
  });

  it('should handle user login', async () => {
    const stubFunc = { validateLogin };
    sandbox.stub(stubFunc, 'validateLogin').rejects('Oops');

    const next = sinon.spy();
    await UsersController.login({}, {}, next);
    sinon.assert.calledOnce(next);
  });

  it('should log users out', async () => {
    const jsonFunc = sinon.spy();
    const res = {
      status: () => ({
        json: jsonFunc
      })
    };
    await UsersController.logout({}, res);
    sinon.assert.calledOnce(jsonFunc);
  });


  it('should handle get users', async () => {
    const next = sinon.spy();
    await UsersController.getUsers({}, {}, next);
    sinon.assert.calledOnce(next);
  });

  it('should log users out', async () => {
    const jsonFunc = sinon.spy();
    const res = {
      status: () => ({
        json: jsonFunc
      })
    };
    await UsersController.logout({}, res);
    sinon.assert.calledOnce(jsonFunc);
  });

  it('should handle forgot password', async () => {
    const stubFunc = { validateForgotPassword };
    sandbox.stub(stubFunc, 'validateForgotPassword').rejects('Oops');

    const next = sinon.spy();
    await UsersController.forgotPassword({}, {}, next);
    sinon.assert.calledOnce(next);
  });

  it('should handle reset password', async () => {
    const stubFunc = { validatePasswordReset };
    sandbox.stub(stubFunc, 'validatePasswordReset').rejects('Oops');

    const next = sinon.spy();
    await UsersController.resetPassword({}, {}, next);
    sinon.assert.calledOnce(next);
  });

  it('should return already verified', async () => {
    const jsonFunc = sinon.spy();
    const next = sinon.spy();
    const res = {
      status: () => ({
        json: jsonFunc
      })
    };
    const req = {
      user: {
        id: 'as223e-7yhu',
        active: true,
        email: 'email@something.com',
        username: 'username',
        getVerifiedUser: () => ({
          update: () => {}
        })
      }
    };
    const stubFunc = {
      createVerifyToken: UsersController.createVerifyToken,
      sendVerifyMailToken: UsersController.sendVerifyMailToken
    };
    sandbox.stub(stubFunc, 'createVerifyToken').resolves('aRandomToken');
    sandbox.stub(stubFunc, 'sendVerifyMailToken');
    await UsersController.sendMailToVerifyAccount(req, res, next);
    sinon.assert.calledOnce(jsonFunc);
  });

  it('should send verify mail', async () => {
    const jsonFunc = sinon.spy();
    const next = sinon.spy();
    const res = {
      status: () => ({
        json: jsonFunc
      })
    };
    const req = {
      user: {
        id: 'as223e-7yhu',
        active: false,
        email: 'email@something.com',
        username: 'username',
        getVerifiedUser: () => ({
          update: () => {}
        })
      }
    };
    const stubFunc = {
      createVerifyToken: UsersController.createVerifyToken,
      sendVerifyMailToken: UsersController.sendVerifyMailToken
    };
    sandbox.stub(stubFunc, 'createVerifyToken').resolves('aRandomToken');
    sandbox.stub(stubFunc, 'sendVerifyMailToken');
    await UsersController.sendMailToVerifyAccount(req, res, next);
    sinon.assert.calledOnce(jsonFunc);
  });

  it('should return already verified', async () => {
    const jsonFunc = sinon.spy();
    const next = sinon.spy();
    const res = {
      status: () => ({
        json: jsonFunc
      })
    };
    const req = {
      user: {
        id: 'as223e-7yhu',
        active: true,
        email: 'email@something.com',
        username: 'username',
        getVerifiedUser: () => ({
          update: () => {}
        })
      }
    };
    const stubFunc = {
      createVerifyToken: UsersController.createVerifyToken,
      sendVerifyMailToken: UsersController.sendVerifyMailToken
    };
    sandbox.stub(stubFunc, 'createVerifyToken').resolves('aRandomToken');
    sandbox.stub(stubFunc, 'sendVerifyMailToken');
    await UsersController.sendMailToVerifyAccount(req, res, next);
    sinon.assert.calledOnce(jsonFunc);
  });

  it('should return activate user successful', async () => {
    const jsonFunc = sinon.spy();
    const next = sinon.spy();
    const res = {
      status: () => ({
        json: jsonFunc
      })
    };
    const req = {
      query: {
        token: 'as223e-7yhu',
        email: 'email@something.com',
      }
    };
    sandbox.stub(User, 'findOne').resolves({
      id: 'nhgtfvrcdftvygbuhn',
      getVerifiedUser: () => ({
        verifyToken: 'jhgyvftcdrftvgy',
        get: () => ({ verifyToken: 'jhgyvftcdrftvgy' }),
        destroy: () => {},
      }),
      update: () => {},
    });
    sandbox.stub(bcrypt, 'compare').resolves('token');
    await UsersController.verifyAccount(req, res, next);
    sinon.assert.calledOnce(jsonFunc);
  });

  it('should return activate user successful', async () => {
    const jsonFunc = sinon.spy();
    const next = sinon.spy();
    const res = {
      status: () => ({
        json: jsonFunc
      })
    };
    const req = {
      query: {
        token: 'as223e-7yhu',
        email: 'email@something.com',
      }
    };
    sandbox.stub(User, 'findOne').resolves({
      id: 'nhgtfvrcdftvygbuhn',
      getVerifiedUser: () => ({
        verifyToken: 'jhgyvftcdrftvgy',
        get: () => ({ verifyToken: 'jhgyvftcdrftvgy' }),
        destroy: () => {},
      }),
      update: () => {},
    });
    await UsersController.verifyAccount(req, res, next);
    sinon.assert.calledOnce(jsonFunc);
  });

  it('should handle get user\'s history', async () => {
    const next = sinon.spy();
    await UsersController.getReadHistory({}, {}, next);
    sinon.assert.calledOnce(next);
  });
});

describe('Test Token authorize', () => {
  let sandbox = null;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should test user token', async () => {
    const next = sinon.spy();
    await Token.authorize({}, {}, next);
    sinon.assert.calledOnce(next);
  });

  it('should test mail sent function', async () => {
    const next = sinon.spy();
    await UsersController.sendMailToVerifyAccount({}, {}, next);
    sinon.assert.calledOnce(next);
  });

  it('should test verifyAccount function', async () => {
    const next = sinon.spy();
    await UsersController.verifyAccount({}, {}, next);
    sinon.assert.calledOnce(next);
  });

  it('should handle get user\'s history', async () => {
    const next = sinon.spy();
    await UsersController.getReadHistory({}, {}, next);
    sinon.assert.calledOnce(next);
  });

  it('should return activate user successful', async () => {
    const jsonFunc = sinon.spy();
    const next = sinon.spy();
    const res = {
      status: () => ({
        json: jsonFunc
      })
    };
    const req = {
      query: {
        token: 'as223e-7yhu',
        email: 'email@something.com',
      }
    };
    sandbox.stub(User, 'findOne').resolves({
      id: 'nhgtfvrcdftvygbuhn',
      getVerifiedUser: () => ({
        verifyToken: 'jhgyvftcdrftvgy',
        get: () => ({ verifyToken: 'jhgyvftcdrftvgy' }),
        destroy: () => {},
      }),
      update: () => {},
    });
    sandbox.stub(bcrypt, 'compare').resolves('token');
    await UsersController.verifyAccount(req, res, next);
    sinon.assert.calledOnce(jsonFunc);
  });

  it('should return activate user successful', async () => {
    const jsonFunc = sinon.spy();
    const next = sinon.spy();
    const res = {
      status: () => ({
        json: jsonFunc
      })
    };
    const req = {
      query: {
        token: 'as223e-7yhu',
        email: 'email@something.com',
      }
    };
    sandbox.stub(User, 'findOne').resolves({
      id: 'nhgtfvrcdftvygbuhn',
      getVerifiedUser: () => ({
        verifyToken: 'jhgyvftcdrftvgy',
        get: () => ({ verifyToken: 'jhgyvftcdrftvgy' }),
        destroy: () => {},
      }),
      update: () => {},
    });
    await UsersController.verifyAccount(req, res, next);
    sinon.assert.calledOnce(jsonFunc);
  });
});
