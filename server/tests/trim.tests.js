import chai from 'chai';
import sinon from 'sinon';
import trim from '../middlewares/trim';

const { expect, assert } = chai;

const req = {
  body: {
    first: '      ballon',
    second: 'goal         ',
    third: '   passion   ',
  },
};

const res = {
  json: message => ({ message }),
  status: status => ({
    json: message => ({ status, message }),
  }),
};

const next = sinon.spy();

describe('Trim', () => {
  it('should trim and return trimmed values', (done) => {
    trim(req, res, next);
    expect(req.body).to.deep.equal({
      first: 'ballon',
      second: 'goal',
      third: 'passion',
    });
    assert(next.called);
    done();
  });
});
