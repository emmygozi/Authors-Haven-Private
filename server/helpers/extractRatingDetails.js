
const extractUserDetails = (combinedDetails) => {
  const {
    id,
    firstname,
    lastname,
    middlename,
    username,
    email
  } = combinedDetails.User.dataValues;

  const user = {
    id,
    firstname,
    lastname,
    middlename,
    username,
    email
  };

  return user;
};

const extractArticleDetails = (combinedDetails) => {
  const {
    id, slug, title, body, readTime
  } = combinedDetails.dataValues;

  const article = {
    id,
    slug,
    title,
    body,
    readTime
  };

  return article;
};

const extractRatingDetails = (combinedDetails) => {
  const user = extractUserDetails(combinedDetails);
  const article = extractArticleDetails(combinedDetails);
  return ({ user, article });
};

export default extractRatingDetails;
