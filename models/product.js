const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const validatorPrice = (val) => {
    if (val <= 0) {
		return false;
	} else {
		return true;
	}
};

const productSchema = new Schema({
    name: {
        type: String, required: true
    },
    price: {
        type: Number, validate: validatorPrice, required: true
    },
    image:  String,
    description: String
    
});

const Product = new mongoose.model('Product', productSchema);
module.exports = Product;
