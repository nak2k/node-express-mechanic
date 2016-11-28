export const pug = views => app => next => {
  app.set('view engine', 'pug');
  app.set('views', views);

  next();
};
