import Response from '@helpers/Response';

const authorizeAccess = (req, res, next) => {
  if (!req.user) return Response.error(res, 400, 'Invalid token supplied: format Bearer <token>');
  return next();
};

export default authorizeAccess;
