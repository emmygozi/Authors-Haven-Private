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

  /**
   * Users can follow each ither
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} res message
   */
  static async follow(req, res, next) {
    try {
      const { username } = req.params;
      const { id } = req.decoded;
      const me = req.user;

      const userToFollow = await User.findOne({
        where: {
          username,
          active: true
        }
      });

      if (!userToFollow) {
        return Response.error(res, 404, 'User to follow not found');
      }
      const userToFollowId = userToFollow.id;
      if (userToFollowId === id) {
        return Response.error(res, 400, 'you cannot follow yourself');
      }

      await userToFollow.addFollowers(me);
      const myProfile = await me.getProfile();

      return Response.success(res, 201, myProfile, 'User followed successfully');
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Users should be able to unfollow each other
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof UserController
   * @return {json} Returns json object
   */
  static async unfollow(req, res, next) {
    try {
      const { username } = req.params;
      const { id } = req.decoded;
      const me = req.user;

      const userToUnfollow = await User.findOne({
        where: {
          username,
          active: true
        }
      });
      if (!userToUnfollow) {
        return Response.error(res, 404, 'User to unfollow not found');
      }
      const unfollowid = userToUnfollow.id;
      if (unfollowid === id) {
        return Response.error(res, 400, 'you cannot unfollow yourself');
      }

      await userToUnfollow.removeFollowers(me);

      const myProfile = await me.getProfile();

      return Response.success(res, 200, myProfile, 'User unfollowed successfully');
    } catch (err) {
      return next(err);
    }
  }
}

export default ProfileController;
