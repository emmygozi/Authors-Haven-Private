import sequelize from 'sequelize';
import models from '@models';
import Pagination from '@helpers/Pagination';

const {
  Article, Profile, User, Rating
} = models;

const articleObject = {
  attributes: [
    'id',
    'slug',
    'title',
    'body',
    'image',
    'createdAt',
    'updatedAt',
    [
      sequelize.fn('AVG', sequelize.col('articleRatings.ratings')),
      'averageRating'
    ]
  ],
  include: [
    {
      model: Rating,
      as: 'articleRatings',
      required: false,
      attributes: []
    },
    {
      model: User,
      as: 'author',
      attributes: [
        'id',
        'username'
      ],
      include: [{
        model: Profile,
        as: 'profile',
        attributes: ['firstname', 'lastname', 'bio', 'avatar']
      }]
    }
  ],
  group: ['Article.id', 'author.id', 'author->profile.id']
};

const findAllArticle = async (req) => {
  const { page } = req.query;
  const paginate = new Pagination(page, req.query.limit);
  const { limit, offset } = await paginate.getQueryMetadata();

  return Article.findAll({
    limit,
    offset,
    subQuery: false,
    ...articleObject
  });
};

const findArticle = ({ articleId, slug }) => {
  const where = {};
  if (!(articleId || slug)) {
    throw new Error('Parameters undefined');
  }
  if (articleId) {
    where.articleId = articleId;
  } else if (slug) {
    where.slug = slug;
  }

  return Article.findOne({
    where,
    ...articleObject
  });
};

const extractArticle = payload => payload.map((article) => {
  const {
    id,
    slug,
    title,
    body,
    image,
    createdAt,
    updatedAt,
    averageRating,
    author
  } = article.get();
  return {
    id,
    slug,
    title,
    body,
    image,
    createdAt,
    updatedAt,
    averageRating,
    author
  };
});

export {
  findAllArticle,
  findArticle,
  articleObject,
  extractArticle
};
