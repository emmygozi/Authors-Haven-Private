import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);
const { expect } = chai;

describe('TEST TRAVIS /', () => {
  it('should test travis integration ', () => {
    expect(true).to.equal(true);
  });
});
