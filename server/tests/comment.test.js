import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import { createTestUser, generateToken } from './factory/user-factory';
import createTestArticle from './factory/article-factory';
import createTestComment from './factory/comment-factory';

let userToken, userTokenTwo, testSlug, testArticle, testComment;
chai.use(chaiHttp);
const { expect } = chai;

describe('TESTS TO CREATE A COMMENT', () => {
  before(async () => {
    const testUser = await createTestUser({});
    const { id } = testUser;
    userToken = await generateToken({ id });

    testArticle = await createTestArticle(id, {});
    const { slug } = testArticle;
    testSlug = slug;

    testComment = await createTestComment({}, id, testArticle.id);
  });
  it('should return `comment is required` if comment is blank ', (done) => {
    try {
      chai.request(app)
        .post(`/api/v1/articles/${testSlug}/comments`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.comment).to.eql('commentis required');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
  it('should return `Article does not exist` if article doesnt exist', (done) => {
    try {
      chai.request(app)
        .post('/api/v1/articles/book/comments')
        .send({ comment: 'This is beautiful' })
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.global).to.eql('Article does not exist');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
  it('should return `Comment added successfully.` ', (done) => {
    try {
      chai.request(app)
        .post(`/api/v1/articles/${testSlug}/comments`)
        .send({ comment: testComment.body })
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('payload');
          expect(res.body.payload).to.be.an('array');
          expect(res.body.message).to.eql('Comment added successfully.');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
  it('should return error if no token was provided ', (done) => {
    try {
      chai.request(app)
        .post(`/api/v1/articles/${testSlug}/comments`)
        .send({ comment: 'This is not beautiful' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.global).to.eql('Invalid token supplied: format Bearer <token>');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
  it('should return error if an invalid token was provided ', (done) => {
    try {
      chai.request(app)
        .post(`/api/v1/articles/${testSlug}/comments`)
        .send({ comment: 'This is not beautiful' })
        .set('Authorization', 'Bearer')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.global).to.eql('Invalid token supplied: format Bearer <token>');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
});

describe('TESTS TO GET ALL COMMENTS ON AN ARTICLE', () => {
  it('should return `Comments retrieved successfully.` ', (done) => {
    try {
      chai.request(app)
        .get(`/api/v1/articles/${testSlug}/comments`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('payload');
          expect(res.body.payload).to.be.an('array');
          expect(res.body.message).to.eql('Comments retrieved successfully.');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
  it('should return error if no token was provided ', (done) => {
    try {
      chai.request(app)
        .get(`/api/v1/articles/${testSlug}/comments`)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.global).to.eql('Invalid token supplied: format Bearer <token>');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
  it('should return error if an invalid token was provided ', (done) => {
    try {
      chai.request(app)
        .get(`/api/v1/articles/${testSlug}/comments`)
        .set('Authorization', 'Bearer')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.global).to.eql('Invalid token supplied: format Bearer <token>');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
});

describe('TESTS TO UPDATE A COMMENT', () => {
  it('should return `comment is required` if comment is blank ', (done) => {
    try {
      chai.request(app)
        .put(`/api/v1/articles/${testSlug}/comments/${testComment.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.comment).to.eql('commentis required');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
  it('should return `Comment does not exist` if comment doesnt exist', (done) => {
    try {
      chai.request(app)
        .put(`/api/v1/articles/book/comments/${testComment.id + 5.7}`)
        .send({ comment: 'This is beautiful' })
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.global).to.eql('Comment does not exist');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
  it('should return `Comment updated successfully.` ', (done) => {
    try {
      chai.request(app)
        .put(`/api/v1/articles/${testSlug}/comments/${testComment.id}`)
        .send({ comment: 'This is not beautiful' })
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('payload');
          expect(res.body.payload).to.be.an('array');
          expect(res.body.message).to.eql('Comment updated successfully.');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
  it('should return invalid token provided ', (done) => {
    before(async () => {
      const testUserTwo = await createTestUser({});
      const { idTwo } = testUserTwo;
      userTokenTwo = await generateToken({ idTwo });
    });
    try {
      chai.request(app)
        .put(`/api/v1/articles/${testSlug}/comments/${testComment.id}`)
        .send({ comment: 'This is not beautiful' })
        .set('Authorization', `Bearer ${userTokenTwo}`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.global).to.eql('Invalid Token Provided');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
  it('should return error if no token was provided ', (done) => {
    try {
      chai.request(app)
        .put(`/api/v1/articles/${testSlug}/comments/${testComment.id}`)
        .send({ comment: 'This is not beautiful' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.global).to.eql('Invalid token supplied: format Bearer <token>');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
  it('should return error if an invalid token was provided ', (done) => {
    try {
      chai.request(app)
        .put(`/api/v1/articles/${testSlug}/comments/${testComment.id}`)
        .send({ comment: 'This is not beautiful' })
        .set('Authorization', 'Bearer')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.global).to.eql('Invalid token supplied: format Bearer <token>');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
});

describe('TESTS TO DELETE A COMMENT', () => {
  it('should return `Comment deleted successfully.` ', (done) => {
    try {
      chai.request(app)
        .delete(`/api/v1/articles/${testSlug}/comments/${testComment.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.eql('Comment deleted successfully.');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
  it('should return error if no token was provided ', (done) => {
    try {
      chai.request(app)
        .delete(`/api/v1/articles/${testSlug}/comments/${testComment.id}`)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.global).to.eql('Invalid token supplied: format Bearer <token>');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
  it('should return error if an invalid token was provided ', (done) => {
    try {
      chai.request(app)
        .delete(`/api/v1/articles/${testSlug}/comments/${testComment.id}`)
        .set('Authorization', 'Bearer')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.global).to.eql('Invalid token supplied: format Bearer <token>');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
});

describe('TESTS TO LIKE A COMMENT', () => {
  before(async () => {
    const testUser = await createTestUser({});
    const { id } = testUser;
    userToken = await generateToken({ id });

    testArticle = await createTestArticle(id, {});
    const { slug } = testArticle;
    testSlug = slug;

    testComment = await createTestComment({}, id, testArticle.id);
  });
  it('should return `Comment liked successfully.` ', (done) => {
    try {
      chai.request(app)
        .post(`/api/v1/articles/${testSlug}/comments/${testComment.id}/like`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('payload');
          expect(res.body.payload).to.be.an('object');
          expect(res.body.message).to.eql('Comment liked successfully.');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should return `Comment unliked successfully.` ', (done) => {
    try {
      chai.request(app)
        .delete(`/api/v1/articles/${testSlug}/comments/${testComment.id}/like`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('payload');
          expect(res.body.payload).to.be.an('object');
          expect(res.body.message).to.eql('Comment unliked successfully.');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
});
