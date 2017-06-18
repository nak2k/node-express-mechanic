exports.locals = (locals = {}) => app => next => {
  const { settings = {} } = locals;

  /*
   * Set properties of `locals`, and a `settings` property
   * is merged.
   */
  const orgSettings = app.locals.settings;
  Object.assign(app.locals, locals);
  app.locals.settings = Object.assign(orgSettings, settings);

  /*
   * Additional settings.
   */
  if (locals.env === undefined) {
    app.locals.env = app.get('env');
  }

  if (settings['trust proxy'] === undefined) {
    app.set('trust proxy', truthy(process.env.TRUST_PROXY));
  }

  next();
};

function truthy(value) {
  const str = (value || '').toLowerCase();
  return str === 'yes' || str === 'true';
}
