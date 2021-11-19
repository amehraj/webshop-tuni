/**
 * Get current user based on the request headers
 *
 * @param {http.IncomingMessage} request
 * @returns {Object|null} current authenticated user or null if not yet authenticated
 */
 const requestUtils = require('../utils/requestUtils');
 const User = require('../models/user');
 const bcrypt = require('bcryptjs');
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

  try{
    const dbUser = await User.findOne({ email: credentials[0] }).exec();
    //const match = await bcrypt.compare(credentials[1], dbUser.password);
    const match = await dbUser.checkPassword(credentials[1]);
    if(match){
      return dbUser;
    }
  }
  catch(error){
      return null;
  }
  
 };
 
 module.exports = { getCurrentUser };