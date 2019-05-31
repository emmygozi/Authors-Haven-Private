import { check } from 'express-validator/check';
import notEmpty from '../helpers/notEmpty';
import models from '../models';

const { User } = models;

export default {
  create: [
    check('email')
      .trim()
      .exists()
      .withMessage('Email must be specified')
      .custom(value => notEmpty(value, 'Email field is required'))
      .isLength({ min: 1 })
      .isEmail()
      .withMessage('Input a valid Email address'),
    check('username')
      .trim()
      .exists()
      .withMessage('Username must be specified')
      .custom(value => notEmpty(value, 'Username field is required'))
      .isAlphanumeric()
      .custom(value => User.findOne({ where: { username: value } }).then((user) => {
        if (user !== null) {
          throw new Error('Username has already been taken');
        }
      })),
    check('password')
      .trim()
      .exists()
      .withMessage('Password must be specified')
      .custom(value => notEmpty(value, 'Password field is required'))
      .isLength({ min: 6 })
  ],
  login: [
    check('email')
      .trim()
      .exists()
      .withMessage('Email must be specified')
      .custom(value => notEmpty(value, 'Email field is required'))
      .isEmail()
      .withMessage('Input a valid Email address'),
    check('password')
      .trim()
      .exists()
      .withMessage('Password must be specified')
      .custom(value => notEmpty(value, 'Password field is required'))
  ],
  updateUserDetails: [
    check('username')
      .trim()
      .optional()
      .isAlphanumeric()
      .custom(value => User.findOne({ where: { username: value } }).then((user) => {
        if (user !== null) {
          throw new Error('Username has already been taken');
        }
      })),
    check('email')
      .trim()
      .optional()
      .isEmail()
      .withMessage('Input a valid Email address')
      .custom(value => User.findOne({ where: { email: value } }).then((user) => {
        if (user !== null) {
          throw new Error('Email has already been taken');
        }
      })),
    check('bio')
      .trim()
      .optional(),
    check('image')
      .trim()
      .optional()
      .isURL()
      .withMessage('Image must be a URL'),
    check('password')
      .trim()
      .optional()
      .isLength({ min: 6 })
  ]
};
