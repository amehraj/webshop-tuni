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
  '/api/orders' : ['GET', 'POST']
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

    const methodOfRequest = method.toUpperCase();
    
      const currentUser = await getCurrentUser(request);
      if(!currentUser){
        return responseUtils.basicAuthChallenge(response);
      }
      if(request.headers.accept !== 'application/json'){
        return responseUtils.contentTypeNotAcceptable(response);
      }
      //Get single user
      if(methodOfRequest === 'GET'){
          const userIdToSearch = url.split("/api/users/");
          return viewUser(response, userIdToSearch[1], currentUser);
      }
      //Delete single user
      if(methodOfRequest === 'DELETE'){
          const userIdToDelete = url.split("/api/users/");
          return deleteUser(response, userIdToDelete[1], currentUser);
      }
      //modify single user  
      if(methodOfRequest === 'PUT'){
          const requestBody = await parseBodyJson(request);
          const userIdToUpdate = url.split("/api/users/");
          return updateUser(response, userIdToUpdate[1], currentUser, requestBody);        
      }
      //handle unallowed methods
      else{
        return responseUtils.methodNotAllowed(response);
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
    //Get single product
    if(methodOfRequest === 'GET'){
      const productIdToSearch = url.split("/api/products/");
      return viewProduct(response, productIdToSearch[1], currentUser);
    }
    //Delete single product
    if(methodOfRequest === 'DELETE'){
      const productIdToDelete = url.split("/api/products/");
      return deleteProduct(response, productIdToDelete[1], currentUser);
    }
    //Update single product
    if(methodOfRequest === 'PUT'){
      const requestBody = await parseBodyJson(request);
      const productIdToUpdate = url.split("/api/products/");
      return updateProduct(response, productIdToUpdate[1], currentUser, requestBody);
    }
    //handle unallowed methods
    else {
      return responseUtils.methodNotAllowed(response);
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
    //Get single Order
    if(methodOfRequest === 'GET'){
      const orderIdToSearch = url.split("/api/orders/");
      return viewOrder(response, orderIdToSearch[1], currentUser);
    }
    //handle unallowed methods
    else{
      return responseUtils.methodNotAllowed(response);
    }
  }
  //Create Product
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
  //Create Order
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
      const currentUser = await getCurrentUser(request);
      if(!currentUser){
        return responseUtils.basicAuthChallenge(response);
      }
      if(currentUser.role === 'customer'){
        return responseUtils.forbidden(response);
      }
    return getAllUsers(response);
  }

  // register new user
  if (filePath === '/api/register' && method.toUpperCase() === 'POST') {
    // Fail if not a JSON request, don't allow non-JSON Content-Type
    if (!isJson(request)) {
      return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
    }
    const parsedRequestBody = await parseBodyJson(request);
    const currentUser = await getCurrentUser(request);
    if(parsedRequestBody.isAdminCreation === 'isAdminCreation'){
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
      if(currentUser){
        return responseUtils.forbidden(response);
      }
      else{
        return registerUser(response, parsedRequestBody);
      }
    }
  }
  else{
    return responseUtils.methodNotAllowed(response);
  }
};

module.exports = { handleRequest };