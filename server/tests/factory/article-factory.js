import faker from 'faker';
import models from '@models';

const { Article, Tag } = models;

const createTestArticle = async (userId, { title, body, tags }) => {
  const newArticle = await Article.create({
    id: faker.random.uuid(),
    userId,
    slug: faker.lorem.slug(),
    title: title || faker.lorem.words(),
    body: body || faker.lorem.sentences(),
    readTime: '4 mins',
    image: faker.image.imageUrl()
  });
  const newTag = await Tag.create({
    articleSlug: newArticle.slug,
    tagList: tags || undefined
  });
  const generatedArticle = newArticle.dataValues;
  generatedArticle.tagList = newTag.dataValues.tagList;
  return generatedArticle;
};

export default createTestArticle;
