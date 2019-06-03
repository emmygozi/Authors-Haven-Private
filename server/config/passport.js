import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import models from '../models';
import comparePassword from '../helpers/comparePassword';

const { User } = models;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    ((email, password, done) => {
      User.findOne({ email })
        .then((user) => {
          if (!user) {
            return done({ message: 'Incorrect Credentials' });
          }

          if (comparePassword(password, user.password)) {
            return done({ message: 'Incorrect credentials.' });
          }
          return done(null, user);
        }).catch(() => done({ message: 'Incorrect Credentials.' }));
    })
  )
);
