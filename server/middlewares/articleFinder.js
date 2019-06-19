import models from '@models';
import Response from '@helpers/Response';

const { Article } = models;

const articleFinder = async (req, res, next) => {
  const { slug } = req.params;

  const article = await Article.findOne({ where: { slug } });
  if (!article) {
    return Response.error(res, 404, 'Article does not exist');
  }

  req.article = article;

  next();
};

export default articleFinder;
