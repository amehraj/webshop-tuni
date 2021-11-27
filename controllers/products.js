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
  //throw new Error('Not Implemented');
};

const viewProduct = async(response, productId, currentUser) => {
  if(currentUser.role === 'admin' || currentUser.role === 'customer'){
    try {
      const singleProduct = await Product.findOne({ _id: productId }).exec();
      console.log(singleProduct);
      if(singleProduct){
            console.log(singleProduct);
            return responseUtils.sendJson(response, singleProduct, 200);
      }
      else{
        return responseUtils.notFound(response);
      }

    } catch(error) {
      return error;
    }
  }
  //throw new Error('Not Implemented');
};

module.exports = { getAllProducts, viewProduct };