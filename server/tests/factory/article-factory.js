import faker from 'faker';
import models from '@models';

const { Article } = models;

const createTestArticle = async (userId, { title, body }) => {
  const newArticle = await Article.create({
    id: faker.random.uuid(),
    userId,
    slug: faker.lorem.slug(),
    title: title || faker.lorem.words(),
    body: body || faker.lorem.sentences(),
    readTime: '4 mins',
    image: faker.image.imageUrl()
  });

  return newArticle;
};

export default createTestArticle;
