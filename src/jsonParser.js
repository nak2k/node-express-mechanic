export const jsonParser = (options = { path: '/' }) => {
  const { json } = require('body-parser');

  if (typeof options === 'string') {
    options = { path: options };
  }

  return app => next => {
    app.use(options.path, json(options));

    next();
  };
};
