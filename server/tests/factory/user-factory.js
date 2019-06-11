import Token from '../../helpers/Token';

const generateToken = async (userDetails) => {
  const token = await Token.create(userDetails);
  return token;
};

export default generateToken;
