export const render404 = options => app => next => {
  app.use((req, res, next) => {
    res.status(404).render('404');
  });

  next();
};
