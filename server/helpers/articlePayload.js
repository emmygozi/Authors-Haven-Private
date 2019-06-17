import sequelize from 'sequelize';
import models from '@models';

const {
  Article, User, Rating, Profile
} = models;


const findAllArticle = () => Article.findAll({
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
});

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
  });
};

export { findAllArticle, findArticle };
