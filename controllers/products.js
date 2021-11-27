/**
 * Send all products as JSON
 *
 * @param {http.ServerResponse} response
 */
// const productsFromJson = require('../products.json').map(product => ({...product }));
const Product = require('../models/product');
const responseUtils = require('../utils/responseUtils');
const getAllProducts = async response => {
  // TODO: 10.2 Implement this
  const products = await Product.find({});
  return responseUtils.sendJson(response, products, 200);
  //throw new Error('Not Implemented');
};

module.exports = { getAllProducts };