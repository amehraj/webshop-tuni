/**
 * Send all users as JSON
 *
 * @param {http.ServerResponse} response
 */
 const responseUtils = require('../utils/responseUtils');
 const Order = require('../models/order');

 const getAllOrders = async (response, currentUser) => {
    try{
      if(currentUser.role === 'admin'){
        const allOrders = await Order.find({});
        return responseUtils.sendJson(response, allOrders, 200);
      }
      if(currentUser.role === 'customer'){
        const allOrders = await Order.find({ customerId : currentUser.id});
        return responseUtils.sendJson(response, allOrders, 200);
      }
    }
    catch(error){
      return error;
    }
};
const viewOrder = async(response, orderId, currentUser) => {
    if(currentUser.role === 'admin' || currentUser.role === 'customer'){
      try {
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
  
      } catch(error) {
        return error;
      }
    }
};

module.exports = { getAllOrders, viewOrder };