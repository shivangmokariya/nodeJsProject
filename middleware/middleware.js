const jwt = require('jsonwebtoken');
require('dotenv').config("/config/config.env");
const login = require("../controllers/userController")

const authenticate = (req, res, next) => {
  const authorization = req.headers['authorization'];
  if (authorization) {
    const token = authorization.replace('Bearer ', '').replace('bearer ', '');
    // console.log('authorization: ' + authorization)
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      if (decoded._id) {
        // console.log('decoded: ' + JSON.stringify(decoded._id))
        return login.checkUser(decoded, (err, response) => {
          // console.log('response: ' + JSON.stringify(response))
          if (!err && response != null) {
            req._id = decoded._id;
            req.user = response;
            return next();
          } else {
            return res.status(401).send({ error: 'Unauthorized', message: 'Authentication failed (token 3).' });
          }
        });
      } else {
        return res.status(401).send({ error: 'Unauthorized', message: 'Authentication failed (token 1).' });
      }
    } catch (e) {
      return res.status(401).send({ error: 'Unauthorized 2', message: 'Authentication failed (token 2).' });
    }
  }
  return res.status(401).send({ error: 'Unauthorized 1', message: 'Authentication failed (token).' });
}
module.exports = authenticate;














