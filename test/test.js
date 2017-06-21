const test = require('tape');
const {
  aws,
} = require('../');

test('test', t => {
  t.plan(4);

  const app = {};

  aws({ region: 'us-west-2' })(app)(err => {
    t.error(err);
    t.ok(app.AWS);
    t.ok(app.DynamoDB);
    t.ok(app.DocumentClient);
  });
});
