import sinon from 'sinon';
import { validateProfileDetails } from '@validations/profile';
import ProfileController from '@controllers/profile';


describe('ProfileController', () => {
  let sandbox = null;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should handle update of profiles', async () => {
    const stubFunc = { validateProfileDetails };
    sandbox.stub(stubFunc, 'validateProfileDetails').rejects('Oops');

    const next = sinon.spy();
    await ProfileController.updateProfile({}, {}, next);
    sinon.assert.calledOnce(next);
  });

  it('should handle no slug passed to get one profile', async () => {
    const next = sinon.spy();
    await ProfileController.getProfile({}, {}, next);
    sinon.assert.calledOnce(next);
  });


  it('should handle no user to follow', async () => {
    const next = sinon.spy();
    await ProfileController.follow({}, {}, next);
    sinon.assert.calledOnce(next);
  });

  it('should handle no user to unfollow', async () => {
    const next = sinon.spy();
    await ProfileController.unfollow({}, {}, next);
    sinon.assert.calledOnce(next);
  });
});
