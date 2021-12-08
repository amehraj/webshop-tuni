/**
 * Send all users as JSON
 *
 * @param {http.ServerResponse} response
 */
const responseUtils = require('../utils/responseUtils');
const User = require('../models/user');

const getAllUsers = async response => {
  // TODO: 10.2 Implement this
    const allUsers = await User.find({});
    return responseUtils.sendJson(response, allUsers, 200);
};

/**
 * Delete user and send deleted user as JSON
 *
 * @param {http.ServerResponse} response http response
 * @param {string} userId user ID as String
 * @param {object} currentUser (mongoose document object)

 */
const deleteUser = async(response, userId, currentUser) => {
  // TODO: 10.2 Implement this
  if(currentUser.id === userId){
    return responseUtils.badRequest(response, '400 Bad Request');
  }
  if(currentUser.role === 'customer'){
    return responseUtils.forbidden(response);
  }
  else{
      const deletedUser = await User.findOneAndDelete({ _id: userId }).exec();
      if(deletedUser){
        return responseUtils.sendJson(response, deletedUser, 200);
      }
      else{
        return responseUtils.notFound(response);
      }

  }
};

/**
 * Update user and send updated user as JSON
 *
 * @param {http.ServerResponse} response http response
 * @param {string} userId User ID as String
 * @param {object} currentUser (mongoose document object)
 * @param {object} userData JSON data from request body
 */
const updateUser = async(response, userId, currentUser, userData) => {
  // TODO: 10.2 Implement this
  if(currentUser.role === 'customer'){
    return responseUtils.forbidden(response);
  }
  if(currentUser.id === userId){
    return responseUtils.badRequest(response, 'Updating own data is not allowed');
  }
  if(!userData.role){
    return responseUtils.badRequest(response, '400 Bad Request');
  }
  if(userData.role !== 'admin' && userData.role !== 'customer'){
    return responseUtils.badRequest(response, '400 Bad Request');
  }
  else{
      const updatedUser = await User.findOneAndUpdate({ _id: userId}, { role: userData.role }, { new: true });
      if(updatedUser){
        return responseUtils.sendJson(response, updatedUser, 200);
      }
      else{
        return responseUtils.notFound(response);
      }
  }
};

/**
 * Send user data as JSON
 *
 * @param {http.ServerResponse} response http response
 * @param {string} userId User ID as String
 * @param {object} currentUser (mongoose document object)
 */
const viewUser = async(response, userId, currentUser) => {
  // TODO: 10.2 Implement this
  if(currentUser.role === 'customer'){
    return responseUtils.forbidden(response);
  }
  else{
      const singleUser = await User.findOne({ _id: userId }).exec();
      if(singleUser){
            return responseUtils.sendJson(response, singleUser, 200);
      }
      else{
        return responseUtils.notFound(response);
      }
  }
};

/**
 * Register new user and send created user back as JSON
 *
 * @param {http.ServerResponse} response http response
 * @param {object} userData JSON data from request body
 */
const registerUser = async(response, userData) => {
  // TODO: 10.2 Implement this
    const isEmailInUse = await User.findOne({ email: userData.email }).exec();
    if(isEmailInUse){
      return responseUtils.badRequest(response, '400 Bad Request');
    }
    if(!userData.name || !userData.email || !userData.password){
      return responseUtils.badRequest(response, '400 Bad Request');
    }
    if(userData.password.length < 10){
      return responseUtils.badRequest(response, '400 Bad Request');
    }
    const regExpEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    const checkIfValidEmail = regExpEmail.test(userData.email);
    if(!checkIfValidEmail){
      return responseUtils.badRequest(response, '400 Bad Request');
    }
    let userDataForDB = {};
    if(userData.isAdminCreation === 'isAdminCreation'){
      userDataForDB = { name: userData.name, email: userData.email, password: userData.password, role: userData.role };
    }
    else{
      userDataForDB = { name: userData.name, email: userData.email, password: userData.password };
    }
    const newUser = new User(userDataForDB);
    await newUser.save();
    return responseUtils.createdResource(response, newUser, '201 Created');
};



module.exports = { getAllUsers, registerUser, deleteUser, viewUser, updateUser };