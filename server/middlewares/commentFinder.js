import models from '@models';
import Response from '@helpers/Response';

const { Comment } = models;

const commentFinder = async (req, res, next) => {
  const { id } = req.params;

  const comment = await Comment.findOne({ where: { id } });
  if (!comment) return Response.error(res, 404, 'Comment does not exist');

  const commentOwner = await comment.getAuthor();
  if (!commentOwner) return Response.error(res, 403, 'You do not have enough permissions');

  req.oldComment = comment;

  next();
};

export default commentFinder;
