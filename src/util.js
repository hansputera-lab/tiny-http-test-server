import urlRegex from 'url-regex';

/**
 * Get URL Protocol
 * @param {string | URL} url Target URL.
 * @return {string}
 */
export const getURLProtocol = (url) => {
  if (url instanceof URL) {
    return url.protocol.slice(0, -1);
  } else {
    if (!urlRegex({exact: true}).test(url)) {
      return undefined;
    }

    return (new URL(url)).protocol.slice(0, -1);
  }
};
