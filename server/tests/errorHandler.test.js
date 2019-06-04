import sinon from 'sinon';
import { assert } from 'chai';
import errorHandler from '../middlewares/errorHandler';

const res = {
  headersSent: false,
  status: status => ({
    send: message => ({
      status,
      message,
    }),
  }),
};

const req = {
  headers: 'header',
};

const err = {
  status: 422,
  message: 'error',
};

const next = sinon.spy();

describe('Error Handler', () => {
  it('handles errors with headers sent', () => {
    res.headersSent = true;
    errorHandler(err, req, res, next);

    assert(next.called);
  });
});
