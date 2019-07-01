import chai from 'chai';
import chaiHttp from 'chai-http';
import { generateToken, createNonActiveUser } from './factory/user-factory';
import createArticles from './factory/article-factory';
import app from '../app';

chai.use(chaiHttp);
const { expect } = chai;

describe('TESTS TO DELETE AN ARTICLE', () => {
  let newArticle, userToken;
  before(async () => {
    const { id, email } = await createNonActiveUser({});
    const payload = {
      id,
      email
    };
    userToken = await generateToken(payload);
    newArticle = await createArticles(id, {});
  });


  it('should update an article successfully', (done) => {
    try {
      chai.request(app)
        .delete(`/api/v1/articles/${newArticle.slug}`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.global).to.eql('You need to verify your account to perform this operation');
          expect(res.body).to.have.property('status');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
});
