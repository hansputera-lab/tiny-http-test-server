import {HTTPWebServer} from './http.js';
import urlRegex from 'url-regex';

const server = new HTTPWebServer();

server.on('/', 'GET', (ctx) => {
  ctx.send('Hello World');
});

server.on('/redirect', 'GET', async (ctx) => {
  const toSite = ctx.params.get('to');

  if (toSite && urlRegex({ exact: true }).test(toSite))
    ctx.redirect(toSite);
  else
    ctx.redirect('./');
});

server.setup();
