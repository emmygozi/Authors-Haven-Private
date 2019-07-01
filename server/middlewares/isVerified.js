import Response from '@helpers/Response';

const isVerified = (req, res, next) => {
  const isUserVerified = req.user;
  const { active } = isUserVerified;
  if (active === false) {
    return Response.error(res, 403, 'You need to verify your account to perform this operation');
  }

  next();
};

export default isVerified;
