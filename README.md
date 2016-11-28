# express-mechanic

Configure Express.

## Installation

```
npm install express-mechanic -S
```

## Usage

``` javascript
import express from 'express';
import callInitializer from 'call-initializer';
import {
  pug,
  render404,
  urlencodedParser,
} from 'express-mechanic';

callInitializer(express(),
  urlencodedParser(),
  pug(__dirname + '../views'),
  render404()
)((err, app) => {
  // ...
});
```

## API

### aws(options)

Requirement: aws-sdk

Adds properties to use aws-sdk.

- `options.region`
    - A string to specify a region.
    - If this option is not speficied, the environment variable `AWS_REGION` is used instead.
      If it is also undefiend, a region is determined by using MetadataService.

#### Environment Variables

- `AWS_REGION`

### jsonParser(options)

Makes an app to use [bodyParser.json](https://github.com/expressjs/body-parser/blob/master/README.md#bodyparserjsonoptions).

- `options.path`
    - A path to use the body-parser middleware.

`options` is passed to bodyParser.json too.

### locals(locals)

Set `app.locals` and `app.settings`.

- `locals`
    - An object of values that are set to `app.locals`.
- `locals.settings`
    - An object of values that are set to `app.settings`.

#### Environment Variables

- `TRUST_PROXY`

### pug(options)

Makes an app to use [pug](https://github.com/pugjs/pug).

### render404(options)

### serveStatic(baseDir)

Makes an app to use [serve-static](https://github.com/expressjs/serve-static).

### urlencodedParser(options)

Makes an app to use [bodyParser.urlencoded](https://github.com/expressjs/body-parser/blob/master/README.md#bodyparserurlencodedoptions).

- `options.path`
    - A path to use the body-parser middleware.

`options` is passed to bodyParser.urlencoded too.

## License

MIT
