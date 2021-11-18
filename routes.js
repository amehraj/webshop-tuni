const responseUtils = require('./utils/responseUtils');
const { acceptsJson, isJson, parseBodyJson, getCredentials } = require('./utils/requestUtils');
const { renderPublic } = require('./utils/render');
const { emailInUse, getAllUsers, saveNewUser, validateUser, getUserById, deleteUserById, updateUserRole } = require('./utils/users');
const { getCurrentUser } = require('./auth/auth');
const productsFromJson = require('./products.json').map(product => ({...product }));

/**
 * Known API routes and their allowed methods
 *
 * Used to check allowed methods and also to send correct header value
 * in response to an OPTIONS request by sendOptions() (Access-Control-Allow-Methods)
 */
const allowedMethods = {
  '/api/register': ['POST'],
  '/api/users': ['GET'],
  '/api/products': ['GET']
};

/**
 * Send response to client options request.
 *
 * @param {string} filePath pathname of the request URL
 * @param {http.ServerResponse} response
 */
const sendOptions = (filePath, response) => {
  if (filePath in allowedMethods) {
    response.writeHead(204, {
      'Access-Control-Allow-Methods': allowedMethods[filePath].join(','),
      'Access-Control-Allow-Headers': 'Content-Type,Accept',
      'Access-Control-Max-Age': '86400',
      'Access-Control-Expose-Headers': 'Content-Type,Accept'
    });
    return response.end();
  }

  return responseUtils.notFound(response);
};

/**
 * Does the url have an ID component as its last part? (e.g. /api/users/dsf7844e)
 *
 * @param {string} url filePath
 * @param {string} prefix
 * @returns {boolean}
 */
const matchIdRoute = (url, prefix) => {
  const idPattern = '[0-9a-z]{8,24}';
  const regex = new RegExp(`^(/api)?/${prefix}/${idPattern}$`);
  return regex.test(url);
};

/**
 * Does the URL match /api/users/{id}
 *
 * @param {string} url filePath
 * @returns {boolean}
 */
const matchUserId = url => {
  return matchIdRoute(url, 'users');
};

const handleRequest = async(request, response) => {
  const { url, method, headers } = request;
  const filePath = new URL(url, `http://${headers.host}`).pathname;

  // serve static files from public/ and return immediately
  if (method.toUpperCase() === 'GET' && !filePath.startsWith('/api')) {
    const fileName = filePath === '/' || filePath === '' ? 'index.html' : filePath;
    return renderPublic(fileName, response);
  }

  if (matchUserId(filePath)) {
    // TODO: 8.6 Implement view, update and delete a single user by ID (GET, PUT, DELETE)
    // You can use parseBodyJson(request) from utils/requestUtils.js to parse request body


    const methodOfRequest = method.toUpperCase();

    const requestAuth = await getCredentials(request);
    if(!requestAuth){
      return responseUtils.basicAuthChallenge(response);
    }

    const authorizedUser = await getCurrentUser(request);
    if(!authorizedUser){
      return responseUtils.basicAuthChallenge(response);
    }

    if(authorizedUser.role === 'customer'){
      return responseUtils.forbidden(response);
    }

    if(authorizedUser.role === 'admin'){
      if(methodOfRequest === 'GET'){
        const userIdToSearch = url.split("/api/users/");
        const singleUser = await getUserById(userIdToSearch[1]);
        if(singleUser === undefined){
          return responseUtils.notFound(response);
        }
        return responseUtils.sendJson(response, singleUser, 200);
      }
      if(methodOfRequest === 'DELETE'){
        const userIdToDelete = url.split("/api/users/");
        const deletedUser = await deleteUserById(userIdToDelete[1]);
        if(deletedUser === undefined){
          return responseUtils.notFound(response);
        }
        return responseUtils.sendJson(response, deletedUser, 200);
      }
      if(methodOfRequest === 'PUT'){
        const requestBody = await parseBodyJson(request);
        if(!requestBody.role){
          return responseUtils.badRequest(response, '400 Bad Request');
        }
        if(requestBody.role !== 'admin' && requestBody.role !== 'customer'){
          return responseUtils.badRequest(response, '400 Bad Request');
        }
        const userIdToUpdate = url.split("/api/users/");
        const updatedUser = await updateUserRole(userIdToUpdate[1], requestBody.role);
        if(updatedUser === undefined){
          return responseUtils.notFound(response);
        }
        return responseUtils.sendJson(response, updatedUser, 200);
      }

    }
  }

  // Default to 404 Not Found if unknown url
  if (!(filePath in allowedMethods)) return responseUtils.notFound(response);

  // See: http://restcookbook.com/HTTP%20Methods/options/
  if (method.toUpperCase() === 'OPTIONS') return sendOptions(filePath, response);

  // Check for allowable methods
  if (!allowedMethods[filePath].includes(method.toUpperCase())) {
    return responseUtils.methodNotAllowed(response);
  }

  // Require a correct accept header (require 'application/json' or '*/*')
  if (!acceptsJson(request)) {
    return responseUtils.contentTypeNotAcceptable(response);
  }

  // GET all products
  if (filePath === '/api/products' && method.toUpperCase() === 'GET') {
    const requestAuth = await getCredentials(request);
    if(!requestAuth){
      return responseUtils.basicAuthChallenge(response);
    }

    const authorizedUser = await getCurrentUser(request);
    if(!authorizedUser){
      return responseUtils.basicAuthChallenge(response);
    }

    if(authorizedUser.role === 'customer' || authorizedUser.role === 'admin'){
      return responseUtils.sendJson(response, productsFromJson, 200);
    }
  }

  // GET all users
  if (filePath === '/api/users' && method.toUpperCase() === 'GET') {

    // TODO: 8.5 Add authentication (only allowed to users with role "admin")
    const requestAuth = await getCredentials(request);
    if(!requestAuth){
      return responseUtils.basicAuthChallenge(response);
    }

    const authorizedUser = await getCurrentUser(request);
    if(!authorizedUser){
      return responseUtils.basicAuthChallenge(response);
    }

    if(authorizedUser.role === 'customer'){
      return responseUtils.forbidden(response);
    }
        // TODO 8.4 Replace the current code in this function.
    // First call getAllUsers() function to fetch the list of users.
    // Then you can use the sendJson(response, payload, code = 200) from 
    // ./utils/responseUtils.js to send the response in JSON format.
    //
    const allUsers = await getAllUsers();

    return responseUtils.sendJson(response, allUsers, 200);
  }

  // register new user
  if (filePath === '/api/register' && method.toUpperCase() === 'POST') {
    // Fail if not a JSON request, don't allow non-JSON Content-Type
    if (!isJson(request)) {
      return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
    }
    // TODO: 8.4 Implement registration
    // You can use parseBodyJson(request) method from utils/requestUtils.js to parse request body.

    const parsedRequestBody =  await parseBodyJson(request);

    const isEmailInUse = await emailInUse(parsedRequestBody.email);
    if(isEmailInUse){
      return responseUtils.badRequest(response, '400 Bad Request');
    }

    const notValidUser = await validateUser(parsedRequestBody);
    if(notValidUser.includes('Missing name') || notValidUser.includes('Missing email') || notValidUser.includes('Missing password')|| notValidUser.includes('Unknown role')){
      return responseUtils.badRequest(response, '400 Bad Request');
    }

    const newUser = await saveNewUser(parsedRequestBody);
    if(newUser){
      newUser.role = 'customer';
      return responseUtils.createdResource(response, newUser, '201 Created');
    }
    
    //throw new Error('Not Implemented');
  }
};

module.exports = { handleRequest };