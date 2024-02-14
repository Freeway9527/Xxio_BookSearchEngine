const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // function for our authenticated routes
  authMiddleware: function (context) {
    // allows token to be sent via  req.query or headers
    let token = context.req.query.token || context.req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (context.req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      throw new Error('you need to be logged in!');
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      context.req.user = data;
    } catch (error) {
      console.log('Invalid token', error);
      throw new Error('Invalid token');
    }
  },

  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
