/**
 * Get current user based on the request headers
 *
 * @param {http.IncomingMessage} request
 * @returns {Object|null} current authenticated user or null if not yet authenticated
 */
 const requestUtils = require('../utils/requestUtils');
 const users = require('../utils/users');
 const getCurrentUser = async request => {
   // TODO: 8.5 Implement getting current user based on the "Authorization" request header
 
   // NOTE: You can use getCredentials(request) function from utils/requestUtils.js
   // and getUser(email, password) function from utils/users.js to get the currently
   // logged in user
   //console.log(request);
   const credentials = requestUtils.getCredentials(request);
   if(!credentials){
     return null;
   }
   //console.log(credentials);
   const loggedUser = await users.getUser(credentials[0], credentials[1]);
   if(!loggedUser){
     return null;
   }
   //console.log(loggedUser);
   //throw new Error('Not Implemented');
   return loggedUser;
 };
 
 module.exports = { getCurrentUser };