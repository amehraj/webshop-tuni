const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const validatorArray = (val) => {
    return val.length > 0;

};

const validatorQuantity = (val) => {
    return val > 0;
};

const orderedItem = new Schema({
    product: {
        _id: {
            type: Schema.Types.ObjectId, ref: 'Product', required: true
        },
        name: {
            type: String, required: true
        },
        price: {
            type: Number,
            required: true
        },
        description: String
    },
    quantity: {
        type: Number, validate: validatorQuantity, required: true
    }
});

const orderSchema = new Schema({
    customerId:  {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    items: {
        type:[orderedItem], validate: validatorArray
    }
});

orderSchema.set('toJSON', { virtuals: false, versionKey: false });

const Order = new mongoose.model('Order', orderSchema);
module.exports = Order;