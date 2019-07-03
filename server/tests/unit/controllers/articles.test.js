import sinon from 'sinon';
import chai from 'chai';
import { validateArticle } from '@validations/auth';
import validateRatings from '@validations/rating';
import { findAllArticle, extractArticle } from '@helpers/articlePayload';
import ArticleController from '@controllers/articles';
import createArticle from '../../factory/article-factory';
import { createTestUser } from '../../factory/user-factory';

const { expect } = chai;

describe('ArticleController', () => {
  let article;

  before(async () => {
    const { id } = await createTestUser({});
    article = (await createArticle(id, {})).get();
  });

  let sandbox = null;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should handle creation of new articles', async () => {
    const stubFunc = { validateArticle };
    sandbox.stub(stubFunc, 'validateArticle').rejects('Oops');

    const next = sinon.spy();
    await ArticleController.create({}, {}, next);
    sinon.assert.calledOnce(next);
  });

  it('should handle update of articles', async () => {
    const stubFunc = { validateArticle };
    sandbox.stub(stubFunc, 'validateArticle').rejects('Oops');

    const next = sinon.spy();
    await ArticleController.update({}, {}, next);
    sinon.assert.calledOnce(next);
  });

  it('should handle rating of articles', async () => {
    const stubFunc = { validateRatings };
    sandbox.stub(stubFunc, 'validateRatings').rejects('Oops');

    const next = sinon.spy();
    await ArticleController.rate({}, {}, next);
    sinon.assert.calledOnce(next);
  });

  it('should handle no slug passed to delete article', async () => {
    const next = sinon.spy();
    await ArticleController.delete({}, {}, next);
    sinon.assert.calledOnce(next);
  });

  it('should handle no slug passed to get one article', async () => {
    const next = sinon.spy();
    await ArticleController.getOne({}, {}, next);
    sinon.assert.calledOnce(next);
  });

  it('should handle cannot get all articles', async () => {
    const stubFunc = { findAllArticle };
    sandbox.stub(stubFunc, 'findAllArticle').rejects('Oops');

    const next = sinon.spy();
    await ArticleController.getAll({}, {}, next);
    sinon.assert.calledOnce(next);
  });
  it('should handle no slug passed to like article', async () => {
    const next = sinon.spy();
    await ArticleController.like({}, {}, next);
    sinon.assert.calledOnce(next);
  });
  it('should handle no slug passed to unlike article', async () => {
    const next = sinon.spy();
    await ArticleController.unlike({}, {}, next);
    sinon.assert.calledOnce(next);
  });

  it('should return specified article attributes', (done) => {
    const articleMock = {
      ...article,
      invalidKey: 'This should not be returned',
    };
    const get = () => articleMock;
    const articles = [{ ...articleMock, get }];

    const filteredArticle = extractArticle(articles);
    expect(filteredArticle[0]).to.be.an('object');
    expect(filteredArticle[0]).to.have.property('id');
    expect(filteredArticle[0]).to.not.have.property('invalidKey');
    done();
  });
});
