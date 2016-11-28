export const serveStatic = baseDir => {
  const serveStaticMiddleware = require('serve-static');

  return app => next => {
    app.use(serveStaticMiddleware(baseDir));

    next();
  };
};
