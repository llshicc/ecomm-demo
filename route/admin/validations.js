const { check } = require('express-validator');
const usersRepository = require('../../repositories/user');

Object.assign(module.exports, {
  emailValidation: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom(async email => {
      const user = await usersRepository.getOneBy({ email });
      if (user) throw new Error('This email has been registered');
    }),

  passwordValidation: check('password')
    .isLength({ min: 6, max: 20 })
    .withMessage('The password must between 6-20 characters'),

  passwordConfirmationValidation: check('passwordConfirmation')
    .isLength({ min: 6, max: 20 })
    .withMessage('The password must between 6-20 characters')
    .custom((passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.body.password) {
        throw new Error('Password confirmation is not match with password');
      } else {
        return true;
      }
    }),

  loginEmailValidation: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom(async email => {
      const user = await usersRepository.getOneBy({ email });
      if (!user) throw new Error('This email is not registered');
    }),

  loginPasswordValidation: check('password').custom(
    async (password, { req }) => {
      const user = await usersRepository.getOneBy({ email: req.body.email });
      if (
        !user ||
        (user &&
          !(await usersRepository.verifyPassword(user.password, password)))
      ) {
        throw new Error('Password is not valid, please try again');
      }
    }
  )
});
