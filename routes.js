const responseUtils = require('./utils/responseUtils');
const { acceptsJson, isJson, parseBodyJson } = require('./utils/requestUtils');
const { renderPublic } = require('./utils/render');
const { getCurrentUser } = require('./auth/auth');
const { getAllProducts, viewProduct, deleteProduct, updateProduct, createProduct } = require('./controllers/products');
const { getAllUsers, viewUser, deleteUser, updateUser, registerUser } = require('./controllers/users');
const { getAllOrders, viewOrder, createOrder } = require('./controllers/orders');

/**
 * Known API routes and their allowed methods
 *
 * Used to check allowed methods and also to send correct header value
 * in response to an OPTIONS request by sendOptions() (Access-Control-Allow-Methods)
 */
const allowedMethods = {
  '/api/register': ['POST'],
  '/api/users': ['GET'],
  '/api/products': ['GET', 'POST'],
  '/api/orders' : ['GET', 'POST'],
  '/api/createAdmin' : ['POST']
};

/**
 * Send response to client options request.
 *
 * @param {string} filePath pathname of the request URL
 * @param {http.ServerResponse} response http response
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
  else{
    return responseUtils.notFound(response);
  }

};

/**
 * Does the url have an ID component as its last part? (e.g. /api/users/dsf7844e)
 *
 * @param {string} url filePath
 * @param {string} prefix the last part of the url after api/users/
 * @returns {boolean} returns true if the prefix is id, false if not
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
 * @returns {boolean} returns true if match, false if not
 */
const matchUserId = url => {
  return matchIdRoute(url, 'users');
};

const matchProductId = url => {
  return matchIdRoute(url, 'products');
};

const matchOrdertId = url => {
  return matchIdRoute(url, 'orders');
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
    
      const currentUser = await getCurrentUser(request);
      if(!currentUser){
        return responseUtils.basicAuthChallenge(response);
      }
      if(request.headers.accept !== 'application/json'){
        return responseUtils.contentTypeNotAcceptable(response);
      }
      if(methodOfRequest === 'GET'){
          const userIdToSearch = url.split("/api/users/");
          return viewUser(response, userIdToSearch[1], currentUser);
      }
      if(methodOfRequest === 'DELETE'){
          const userIdToDelete = url.split("/api/users/");
          return deleteUser(response, userIdToDelete[1], currentUser);
      }
        
      if(methodOfRequest === 'PUT'){
          const requestBody = await parseBodyJson(request);
          const userIdToUpdate = url.split("/api/users/");
          return updateUser(response, userIdToUpdate[1], currentUser, requestBody);        
      }
      else{
        return responseUtils.notFound(response);
      }
    
  }
  if(matchProductId(filePath)) {
    const methodOfRequest = method.toUpperCase();
    const currentUser = await getCurrentUser(request);
    if(!currentUser){
      return responseUtils.basicAuthChallenge(response);
    }
    if(request.headers.accept !== 'application/json'){
      return responseUtils.contentTypeNotAcceptable(response);
    }
    if(methodOfRequest === 'GET'){
      const productIdToSearch = url.split("/api/products/");
      return viewProduct(response, productIdToSearch[1], currentUser);
    }
    if(methodOfRequest === 'DELETE'){
      const productIdToDelete = url.split("/api/products/");
      return deleteProduct(response, productIdToDelete[1], currentUser);
    }
    if(methodOfRequest === 'PUT'){
      const requestBody = await parseBodyJson(request);
      const productIdToUpdate = url.split("/api/products/");
      return updateProduct(response, productIdToUpdate[1], currentUser, requestBody);
    }
    else {
      return responseUtils.notFound(response);
    }
  }
  if(matchOrdertId(filePath)) {
    const methodOfRequest = method.toUpperCase();
    const currentUser = await getCurrentUser(request);
    if(!currentUser){
      return responseUtils.basicAuthChallenge(response);
    }
    if(request.headers.accept !== 'application/json'){
      return responseUtils.contentTypeNotAcceptable(response);
    }
    if(methodOfRequest === 'GET'){
      const orderIdToSearch = url.split("/api/orders/");
      return viewOrder(response, orderIdToSearch[1], currentUser);
    }
    else{
      return responseUtils.notFound(response);
    }
  }
  if (filePath === '/api/products' && method.toUpperCase() === 'POST') {
    const currentUser = await getCurrentUser(request);
    if(!currentUser){
      return responseUtils.basicAuthChallenge(response);
    }
    if(request.headers.accept !== 'application/json'){
      return responseUtils.contentTypeNotAcceptable(response);
    }
    // Fail if not a JSON request, don't allow non-JSON Content-Type
    if (!isJson(request)) {
      return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
    }
    const parsedRequestBody = await parseBodyJson(request);
    return createProduct(response, parsedRequestBody, currentUser);
  }
  if (filePath === '/api/orders' && method.toUpperCase() === 'POST') {
    const currentUser = await getCurrentUser(request);
    if(!currentUser){
      return responseUtils.basicAuthChallenge(response);
    }
    if(request.headers.accept !== 'application/json'){
      return responseUtils.contentTypeNotAcceptable(response);
    }
    // Fail if not a JSON request, don't allow non-JSON Content-Type
    if (!isJson(request)) {
      return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
    }
    const parsedRequestBody = await parseBodyJson(request);
    return createOrder(response, parsedRequestBody, currentUser);
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
  //GET all orders
  if (filePath === '/api/orders' && method.toUpperCase() === 'GET') {
      const currentUser = await getCurrentUser(request);
      if(!currentUser){
        return responseUtils.basicAuthChallenge(response);
      }
      else{
        return getAllOrders(response, currentUser);
      }
  }
  // GET all products
  if (filePath === '/api/products' && method.toUpperCase() === 'GET') {
      const currentUser = await getCurrentUser(request);
      if(!currentUser){
        return responseUtils.basicAuthChallenge(response);
      }
      else{
        return getAllProducts(response);
      }
  }

  // GET all users
  if (filePath === '/api/users' && method.toUpperCase() === 'GET') {

    // TODO: 8.5 Add authentication (only allowed to users with role "admin")
      const currentUser = await getCurrentUser(request);
      if(!currentUser){
        return responseUtils.basicAuthChallenge(response);
      }
      if(currentUser.role === 'customer'){
        return responseUtils.forbidden(response);
      }
        // TODO 8.4 Replace the current code in this function.
    // First call getAllUsers() function to fetch the list of users.
    // Then you can use the sendJson(response, payload, code = 200) from 
    // ./utils/responseUtils.js to send the response in JSON format.
    //
    return getAllUsers(response);
  }

  // register new user
  if (filePath === '/api/register' && method.toUpperCase() === 'POST') {
    // Fail if not a JSON request, don't allow non-JSON Content-Type
    if (!isJson(request)) {
      return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
    }
    // TODO: 8.4 Implement registration
    // You can use parseBodyJson(request) method from utils/requestUtils.js to parse request body.
    const parsedRequestBody = await parseBodyJson(request);
    if(parsedRequestBody.isAdminCreation === 'isAdminCreation'){
      const currentUser = await getCurrentUser(request);
      if(!currentUser){
        return responseUtils.basicAuthChallenge(response);
      }
      if(currentUser.role === 'customer'){
        return responseUtils.forbidden(response);
      }
      else {
        return registerUser(response, parsedRequestBody);
      }
    }
    else{
      return registerUser(response, parsedRequestBody);
    }
  }
  else{
    return responseUtils.notFound(response);
  }
};

module.exports = { handleRequest };