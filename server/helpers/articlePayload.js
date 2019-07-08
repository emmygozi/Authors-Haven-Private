import sequelize from 'sequelize';
import models from '@models';
import Pagination from '@helpers/Pagination';

const {
  Article, User, Rating, Profile, ArticleLike, Tag
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
      model: ArticleLike,
      as: 'ArticleLikes',
      attributes: ['id']
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
  group: ['Article.id', 'author.id', 'author->profile.id', 'ArticleLikes.userId', 'ArticleLikes.articleId', 'ArticleLikes.id']
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


/**
   * Get Tags based on the Articles
   *
   * @static
   * @param {*} articleSlug The article slug
   * @memberof ArticleController
   * @return {json} return json object
   */
const getSpecificTag = async articleSlug => Tag.findOne({
  where: {
    articleSlug,
  }
});

export {
  findAllArticle,
  findArticle,
  articleObject,
  extractArticle,
  getSpecificTag
};
