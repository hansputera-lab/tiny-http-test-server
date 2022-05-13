/**
 * @class HttpContext
 */
export class HttpContext {
  /**
   * @param {*} raw (req, and res)
   */
  constructor(raw) {
    this.raw = raw;
    this.body = Buffer.alloc(0);

    raw.req.on('data', (chunk) => {
      this.body = Buffer.concat([this.body, chunk]);
    });
  }

  /**
   * Request URL
   */
  get url() {
    return this.raw.req.url.toLowerCase()
        .replace(/\?(.*)/gi, '');
  }

  /**
   * Request parameters
   */
  get params() {
    return new URLSearchParams(this.raw.req.url
        .toLowerCase().replace(this.url, ''));
  }

  /**
   * Request method.
   */
  get method() {
    return this.raw.req.method.toUpperCase();
  }

  /**
   * Request body.
   * @return {string}
   */
  body() {
    return this.raw_data.toString('utf-8');
  }

  /**
   * Request body in JSON
   * @return {*}
   */
  json() {
    return JSON.parse(this.body);
  }

  /**
   * Request headers
   */
  get headers() {
    return this.raw.req.headers;
  }

  /**
   * Sent http status code.
   * @param {number} code HTTP Status Code.
   * @param {string?} message HTTP Status Message (optional)
   * @return {HttpContext}
   */
  status(code, message) {
    this.raw.res.statusCode = code;
    if (typeof message === 'string') this.raw.res.statusMessage = message;

    return this;
  }

  /**
   * Redirect to /*
   * @param {string} url Redirect URL.
   * @param {number} statusCode HTTP Status Code (optional)
   * @return {void}
   */
  redirect(url, statusCode = 301) {
    this.raw.res.setHeader('location', url);
    if (typeof statusCode === 'number') this.status(301);

    return this.send('');
  }

  /**
   * Send {any} data to client.
   * @param {*} data Anything.
   * @return {void}
   */
  send(data) {
    if (typeof data === 'object') data = JSON.stringify(data);
    else if (typeof data === 'function') data = (`Function: ${data.name}`);

    this.raw.res.end(data);
  }
}
