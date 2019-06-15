import models from '@models';
import Response from '@helpers/Response';
import { validateProfileDetails } from '@validations/profile';
import { validationResponse } from '@helpers/validationResponse';

const { User } = models;

/**
* @exports ProfileController
* @class ProfileController
* @description Handles User Profile
* */
class ProfileController {
  /**
  * Get all user profiles by username
  * @async
  * @param  {object} req - Request object
  * @param {object} res - Response object
  * @param {object} next The next middleware
  * @return {json} Returns json object
  * @static
  */
  static async getProfile(req, res, next) {
    try {
      const { username } = req.params;
      const user = await User.findOne({
        where: { username }
      });

      if (!user) {
        return Response.error(res, 404, 'User does not exists');
      }

      const profile = await user.getProfile();
      return Response.success(res, 200, profile);
    } catch (error) {
      next(error);
    }
  }

  /**
  * Update user profile
  * @async
  * @param  {object} req - Request object
  * @param {object} res - Response object
  * @param {object} next The next middleware
  * @return {json} Returns json object
  * @static
  */
  static async updateProfile(req, res, next) {
    try {
      const profileDetails = await validateProfileDetails(req.body);

      const {
        firstname, lastname, bio, avatar, phone, location
      } = profileDetails;

      const profile = await req.user.getProfile();

      const updatedDetails = await profile.update({
        firstname,
        lastname,
        bio,
        avatar,
        phone,
        location
      });

      return Response.success(res, 200, updatedDetails);
    } catch (err) {
      if (err.isJoi && err.name === 'ValidationError') {
        return res.status(400).json({
          status: 400,
          errors: validationResponse(err)
        });
      }
      next(err);
    }
  }
}

export default ProfileController;
