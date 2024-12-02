const xss = require('xss');

const sanitize = (data) => {
  if (typeof data === 'string') {
    return xss(data);
  } else if (typeof data === 'object' && data !== null) {
    for (const key in data) {
      data[key] = sanitize(data[key]);
    }
  }
  return data;
};

const sanitizeMW = (req, res, next) => {
  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);
  next();
};

module.exports = sanitizeMW;
