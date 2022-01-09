/**
 * Get current user based on the request headers
 *
 * @param {http.IncomingMessage} request
 * @returns {object|null} current authenticated user or null if not yet authenticated
 */
 const requestUtils = require('../utils/requestUtils');
 const User = require('../models/user');
 const getCurrentUser = async request => {


   const credentials = requestUtils.getCredentials(request);
   if(!credentials){
     return null;
   }

  try{
    const currentUser = await User.findOne({ email: credentials[0] }).exec();
    const match = await currentUser.checkPassword(credentials[1]);
    if(match){
      return currentUser;
    }
    else {
      return null;
    }
  }
  catch(error){
      return null;
  }
  
 };
 
 module.exports = { getCurrentUser };