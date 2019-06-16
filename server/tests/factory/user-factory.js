import models from '@models';
import faker from 'faker';
import Token from '@helpers/Token';
import { createTestProfile } from './profile-factory';

const { User, Profile } = models;

const generateToken = async (userDetails) => {
  const token = await Token.create(userDetails);
  return token;
};

const createTestUser = async ({
  username, email, firstname, lastname, bio, avatar, location
}) => {
  const newUser = await User.create({
    id: faker.random.uuid(),
    username: username || faker.internet.userName(),
    email: email || faker.internet.email(),
    password: faker.internet.password()
  });
  console.log(newUser);
  await Profile.create({
    userId: newUser.dataValues.id,
    firstname: firstname || faker.name.firstName(),
    lastname: lastname || faker.name.lastName(),
    bio: bio || faker.lorem.sentence(),
    avatar: avatar || faker.image.imageUrl(),
    location: location || faker.address.country()
  });

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

export { createTestUser, createTestUserWithoutProfile, generateToken };
