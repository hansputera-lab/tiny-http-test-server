import {HTTPWebServer} from './http.js';
import {getURLProtocol} from './util.js';

const server = new HTTPWebServer();

server.on('/', 'GET', (ctx) => {
  ctx.send('Hello World');
});

server.on('/redirect', 'GET', async (ctx) => {
  const toSite = ctx.params.get('to');
  const protocolSite = getURLProtocol(toSite ?? '');

  if (toSite && protocolSite && ['http', 'https'].includes(protocolSite)) {
    ctx.redirect(toSite);
  } else {
    ctx.redirect('./');
  }

  return;
});

server.setup();
