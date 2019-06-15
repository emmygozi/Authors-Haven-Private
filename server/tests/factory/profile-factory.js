import faker from 'faker';
import models from '@models';

const { Profile } = models;

const createTestProfile = async ({ id }) => {
  const newProfile = await Profile.create({
    userId: id,
  });

  return newProfile;
};

const createProfileDetails = async ({
  firstname, lastname, bio, avatar, location
}) => {
  const newProfile = await {
    firstname: firstname || faker.name.firstName(),
    lastname: lastname || faker.name.lastName(),
    bio: bio || faker.lorem.sentence(),
    avatar: avatar || faker.image.imageUrl(),
    location: location || faker.address.country()
  };

  return newProfile;
};

export { createTestProfile, createProfileDetails };
