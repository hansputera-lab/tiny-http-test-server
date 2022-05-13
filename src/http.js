import http from 'node:http';
import {HttpContext} from './http.context.js';

/**
 * @class HTTPWebServer
 */
export class HTTPWebServer {
  /**
   * @param {number} port Web Server PORT
   */
  constructor(port = 3000) {
    this.port = port;

    this.server = null;
    this.routes = [];
  }

  /**
   * Route listen.
   * @param {string} route Web Route Path
   * @param {string | string[]} methods HTTP Methods.
   * @param {Function} handler Route handler.
   * @return {void}
   */
  on(route, methods, handler) {
    const r = this.routes.find(
        (p) => p.path.toLowerCase() === route.toLowerCase());
    if (r) {
      this.routes = this.routes.filter((x) => x !== r);
    }

    this.routes.push({
      path: route,
      handler,
      method: methods,
    });
  }

  /**
   * Setup http webserver.
   * @return {Promise<void>}
   */
  async setup() {
    if (!(this.server instanceof http.Server)) {
      this.server = new http.Server();
    }

    this.server.on('error', (err) => {
      if (/eaddrinuse/gi.test(err.message)) {
        console.log('[WEB] This port', this.port, 'already used!');
        this.port++;
        console.log('[WEB] Trying port', this.port);
      }

      console.log('[WEB] Restarting');
      this.server = null;
      this.setup();
    });

    this.server.on('request', (req, res) => {
      try {
        const context = new HttpContext({req, res});
        const route = this.routes.find(
            (p) => p.path.toLowerCase() === context.url &&
                 (Array.isArray(p.method) ?
                   p.method.includes(req.method.toUpperCase()) :
                   req.method.toUpperCase() === p.method.toUpperCase()),
        );

        if (route) route.handler(context);
        else context.status(404).send('Oops!');
      } catch (e) {
        res.statusCode = 500;
        res.end(e.message);
      }
    });

    this.server.listen(this.port, '0.0.0.0', () => {
      console.log('[WEB]', 'Listening to', this.port);
    });
  }
}
