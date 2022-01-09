/**
 * Decode, parse and return user credentials (username and password)
 * from the Authorization header.
 *
 * @param {http.incomingMessage} request http request
 * @returns {Array|null} [username, password] or null if header is missing
 */
 const getCredentials = request => {

  if(!request.headers.authorization){
    return null;
  }
  if(request.headers.authorization.indexOf('Basic ') === -1){
    return null;
  }
  const base64Credentials = request.headers.authorization.split(' ')[1];
  const buff = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const user = buff.split(':');
  return user;
  //throw new Error('Not Implemented');
};

/**
 * Does the client accept JSON responses?
 *
 * @param {http.incomingMessage} request http request
 * @returns {boolean} returns true if JSON accepted, false if not
 */
const acceptsJson = request => {
  //Check if the client accepts JSON as a response based on "Accept" request header
  // NOTE: "Accept" header format allows several comma separated values simultaneously
  // as in "text/html,application/xhtml+xml,application/json,application/xml;q=0.9,*/*;q=0.8"
  // Do not rely on the header value containing only single content type!
  const acceptHeader = request.headers.accept || '';
  return acceptHeader.includes('application/json') || acceptHeader.includes('*/*');
};

/**
 * Is the client request content type JSON?
 *
 * @param {http.incomingMessage} request http request
 * @returns {boolean} returns true if content-type in request is JSON, false if not
 */
const isJson = request => {
  // Check whether request "Content-Type" is JSON or not
  const contentType = request.headers['content-type'] || '';
  return contentType.toLowerCase() === 'application/json';
};

/**
 * Asynchronously parse request body to JSON
 *
 * Remember that an async function always returns a Promise which
 * needs to be awaited or handled with then() as in:
 *
 *   const json = await parseBodyJson(request);
 *
 *   -- OR --
 *
 *   parseBodyJson(request).then(json => {
 *     // Do something with the json
 *   })
 *
 * @param {http.IncomingMessage} request http request
 * @returns {Promise<*>} Promise resolves to JSON content of the body
 */
const parseBodyJson = request => {
  return new Promise((resolve, reject) => {
    let body = '';

    request.on('error', err => reject(err));

    request.on('data', chunk => {
      body += chunk.toString();
    });

    request.on('end', () => {
      resolve(JSON.parse(body));
    });
  });
};

module.exports = { acceptsJson, getCredentials, isJson, parseBodyJson };