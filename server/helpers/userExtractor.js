/**
 * @param {user} user object from the database
 * @param {token} token gotten from payload
 */

const userExtractor = (user, token) => {
  const { email, id, username } = user;
  return {
    id, email, username, token,
  };
};

export default userExtractor;
