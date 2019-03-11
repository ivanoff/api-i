module.exports = {

  MODEL_HAS_NO_NAME: 'Model has no name. Please, define any name for model',

  NO_TOKEN: {
    status: 401,
    developerMessage: 'You need to login or use token',
  },

  BAD_TOKEN: {
    status: 403,
    message: 'Bad token',
  },

  TOKEN_EXPIRED: {
    status: 403,
    message: 'Token expired',
  },

  ACCESS_DENIED: {
    status: 401,
    message: 'Access denied',
  },

  METHOD_NOT_ALLOWED: {
    status: 405,
    message: 'Method Not Allowed',
  },

  METHOD_NOT_FOUND: {
    status: 404,
    message: 'Method Not Found',
  },

  USER_NOT_FOUND: {
    status: 404,
    message: 'User not found',
  },

  USER_NEED_CREDENTIALS: {
    status: 400,
    message: 'User not found',
  },

  USER_EXISTS: {
    status: 409,
    message: 'User already exists',
  },

  PASSWORD_REQUIRED: {
    status: 400,
    message: 'Password required',
  },

  NOT_FOUND: {
    status: 404,
    message: 'Not Found',
  },

  TABLE_EXISTS: {
    status: 409,
    message: 'Table already exists',
  },

};
