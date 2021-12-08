 const responseUtils = require('../utils/responseUtils');
 const Order = require('../models/order');

 /**
  * Send all orders as JSON
  * 
  * @param {http.ServerResponse} response http response
  * @param {object} currentUser mongoose document object
  * 
  */
 const getAllOrders = async (response, currentUser) => {
      if(currentUser.role === 'admin'){
        const allOrders = await Order.find({});
        return responseUtils.sendJson(response, allOrders, 200);
      }
      else{
        const allOrders = await Order.find({ customerId : currentUser.id});
        return responseUtils.sendJson(response, allOrders, 200);
      }
};

/**
 * View user's order
 * 
 * @param {http.ServerResponse} response http response
 * @param {string} orderId order ID as String
 * @param {object} currentUser mongoose document object
 * 
 */
const viewOrder = async(response, orderId, currentUser) => {
        const singleOrder = await Order.findOne({ _id: orderId }).exec();
        if(singleOrder){
            if(currentUser.role === 'admin'){
                return responseUtils.sendJson(response, singleOrder, 200);
            }
            if((singleOrder.customerId).toString() === (currentUser._id).toString()){
                return responseUtils.sendJson(response, singleOrder, 200);
            }
            else {
                return responseUtils.notFound(response);
            }
        }
        else{
          return responseUtils.notFound(response);
        }
};

/**
 * Create a new order
 * 
 * @param {http.ServerResponse} response http response
 * @param {object} orderData mongoose document object of an order
 * @param {object} currentUser mongoose document object of current user
 * 
 */
const createOrder = async(response, orderData, currentUser) => {
    if(currentUser.role === 'admin'){
      return responseUtils.forbidden(response);
    }
    if(orderData.items.length === 0){
        return responseUtils.badRequest(response, '400 Bad Request');
    }
    orderData.items.forEach((productObj) => {
        if(!productObj.quantity || !productObj.product || !productObj.product._id || !productObj.product.name || !productObj.product.price){
            return responseUtils.badRequest(response, '400 Bad Request');
        }
    });
    orderData.customerId = currentUser._id;
    try{
      const newOrder = new Order(orderData);
      await newOrder.save();
      return responseUtils.createdResource(response, newOrder, '201 Created');

    } catch (error) {
      return responseUtils.internalServerError(response);
    }
  
  };

module.exports = { getAllOrders, viewOrder, createOrder };