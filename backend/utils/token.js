const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = {
  generateAccessToken: // Generate an Access Token for the given User ID 
  function generateAccessToken(user) {
    // How long will the token be valid for
    const expiresIn = '24h';
    // Which service issued the token
    const issuer = config.JWT_ISSUER;
    // Which service is the token intended for
    const audience = config.JWT_AUDIENCE;
    // The signing key for signing the token
    const secret = config.JWT_SECRET;

    const token = jwt.sign(user, secret, {
      expiresIn: expiresIn,
      audience: audience,
      issuer: issuer,
      subject: ''+user.id
    });

    return token;
  },
  decodeAccessToken: function(token) {
    console.log('-----------NEWTOKEN--------', token)
    const decodedToken = jwt.verify(token, config.JWT_SECRET)
    console.log('DECODED INFO', decodedToken);
    return decodedToken
  },
};