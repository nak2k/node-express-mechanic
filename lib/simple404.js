exports.simple404 = options => app => next => {
  app.use((req, res, next) => {
    res.status(404).end('Not found');
  });

  next();
};
