import models from '@models';
import faker from 'faker';
import Token from '@helpers/Token';
import { createTestProfile, createProfileWithDetails } from './profile-factory';

const { User } = models;

const generateToken = async (userDetails) => {
  const token = await Token.create(userDetails);
  return token;
};

const createTestUser = async ({
  username, email, password
}) => {
  const newUser = await User.create({
    id: faker.random.uuid(),
    username: username || faker.random.alphaNumeric(6),
    email: email || faker.internet.email(),
    password: password || faker.internet.password(),
    active: true
  });

  await createProfileWithDetails(newUser, {});

  return newUser;
};

const createNonActiveUser = async ({
  username, email, password
}) => {
  const newUser = await User.create({
    id: faker.random.uuid(),
    username: username || faker.random.alphaNumeric(6),
    email: email || faker.internet.email(),
    password: password || faker.internet.password(),
    active: false
  });

  await createProfileWithDetails(newUser, {});

  return newUser;
};

const createTestUserWithoutProfile = async ({ username, email }) => {
  const newUser = await User.create({
    id: faker.random.uuid(),
    username: username || faker.internet.userName(),
    email: email || faker.internet.email(),
    password: faker.internet.password()
  });

  await createTestProfile(newUser);
  return newUser;
};

export {
  createTestUser,
  createTestUserWithoutProfile,
  generateToken,
  createNonActiveUser
};
