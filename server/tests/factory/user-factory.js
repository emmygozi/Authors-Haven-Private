import models from '@models';
import faker from 'faker';
import Token from '@helpers/Token';
import { createTestProfile } from './profile-factory';

const { User } = models;

const generateToken = async (userDetails) => {
  const token = await Token.create(userDetails);
  return token;
};

const createTestUser = async ({ username, email }) => {
  const newUser = await User.create({
    id: faker.random.uuid(),
    username: username || faker.internet.userName(),
    email: email || faker.internet.email(),
    password: faker.internet.password()
  });

  await createTestProfile(newUser);
  return newUser;
};

const createTestUserWithoutProfile = async ({ username, email }) => {
  const newUser = await User.create({
    id: faker.random.uuid(),
    username: username || faker.internet.userName(),
    email: email || faker.internet.email(),
    password: faker.internet.password()
  });

  return newUser;
};

export { createTestUser, createTestUserWithoutProfile, generateToken };
