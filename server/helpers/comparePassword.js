import bcrypt from 'bcrypt';

const comparePassword = (password, hashedPassword) => bcrypt.compare(password, hashedPassword);

export default comparePassword;
