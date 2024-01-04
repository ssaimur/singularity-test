export const MESSAGES = {
  loginFailed: 'Username or Password is incorrect',
  unexpected: 'Oops, something went wrong',
  error: {
    unauthenticated: 'Unauthenticated',
    notFound: 'Not Found',
    functionIssue: 'Functional Issue',
    unexpected: 'Unexpected Error',
    internal: 'Internal Error',
  },
  auth: {
    unauthenticated: {
      emptyToken: 'No token provided',
      expiredToken: 'Token was expired',
      invalidToken: 'Token is invalid',
    },
  },
  user: {
    doesNotExists: 'User does not exist!',
    emailExists: 'This Email already exists!',
    phoneNumberExists: 'This Phone Number already exists!',
    userNameExists: 'This Username already exists!',
  },
  shift: {
    userExists: 'Cannot delete this shift. There are users associatd with this shift!',
  },
};
