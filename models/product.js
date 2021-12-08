const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const validatorPrice = (val) => {
    return val > 0;

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

productSchema.set('toJSON', { virtuals: false, versionKey: false });

const Product = new mongoose.model('Product', productSchema);
module.exports = Product;
