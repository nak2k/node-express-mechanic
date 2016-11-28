export const urlencodedParser = (options = { path: '/' }) => {
  const { urlencoded } = require('body-parser');

  if (typeof options === 'string') {
    options = { path: options };
  }

  return app => next => {
    app.use(options.path, urlencoded({ extended: true }));

    next();
  };
};
