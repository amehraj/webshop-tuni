/**
 * Send all products as JSON
 *
 * @param {http.ServerResponse} response
 */
const Product = require('../models/product');
const responseUtils = require('../utils/responseUtils');

const getAllProducts = async response => {
  // TODO: 10.2 Implement this
  const products = await Product.find({});
  return responseUtils.sendJson(response, products, 200);
};

const viewProduct = async(response, productId, currentUser) => {
  if(currentUser.role === 'admin' || currentUser.role === 'customer'){
    try {
      const singleProduct = await Product.findOne({ _id: productId }).exec();
      if(singleProduct){
            return responseUtils.sendJson(response, singleProduct, 200);
      }
      else{
        return responseUtils.notFound(response);
      }

    } catch(error) {
      return error;
    }
  }
};

const deleteProduct = async(response, productId, currentUser) => {
  if(currentUser.role === 'customer'){
    return responseUtils.forbidden(response);
  }
  if(currentUser.role === 'admin'){
    try {
      const deletedProduct = await Product.findOneAndDelete({ _id: productId }).exec();
      if(deletedProduct){
        return responseUtils.sendJson(response, deletedProduct, 200);
      }
      else{
        return responseUtils.notFound(response);
      }

    } catch(error) {
      return error;
    }
  }
};

const updateProduct = async(response, productId, currentUser, productData) => {
  if(currentUser.role === 'customer'){
    return responseUtils.forbidden(response);
  }
  if(productData.name === ""){
    return responseUtils.badRequest(response, '400 Bad Request');
  }
  if(productData.price === 0 || productData.price < 0 || isNaN(productData.price)){
    return responseUtils.badRequest(response, '400 Bad Request');
  }
  if(currentUser.role === 'admin'){
    try{
      const updatedProduct = await Product.findOneAndUpdate({ _id: productId }, productData, { new: true });
      if(updatedProduct){
        return responseUtils.sendJson(response, updatedProduct, 200);
      }
      else{
        return responseUtils.notFound(response);
      }
    } catch (error) {
      return error;
    }
  }
};

module.exports = { getAllProducts, viewProduct, deleteProduct, updateProduct };