import sinon from 'sinon';
import { assert } from 'chai';
import errorHandler from '../middlewares/errorHandler';

const jsonFunc = sinon.spy();

const res = {
  headersSent: false,
  status: status => ({
    send: message => ({
      status,
      message,
    }),
  }),
  json: jsonFunc,
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
  afterEach(() => {
    process.env.NODE_ENV = 'test';
  });
  it('handles errors with headers sent', () => {
    res.headersSent = true;
    errorHandler(err, req, res, next);

    assert(next.called);
  });
  it('handles errors when in development mode', () => {
    process.env.NODE_ENV = 'development';
    errorHandler(err, req, res, next);

    sinon.assert.calledOnce(jsonFunc);
  });
});
