import sinon from 'sinon';
import {
  validateSignup,
  validateLogin,
  validateForgotPassword,
  validatePasswordReset
} from '@validations/auth';
import UsersController from '@controllers/users';
import Token from '@helpers/Token';

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
});
