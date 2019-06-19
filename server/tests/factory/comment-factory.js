import faker from 'faker';
import models from '@models';

const { Comment } = models;

const createTestComment = async ({ body }, userId, articleId) => {
  const newComment = await Comment.create({
    body: body || faker.lorem.words(),
    userId,
    articleId
  });

  return newComment;
};

export default createTestComment;
