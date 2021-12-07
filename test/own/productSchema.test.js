const chai = require('chai');
const expect = chai.expect;

const Product = require('../../models/product');

describe('Product Model', () => {
    describe('Schema validation', () => {
      it('must not allow negative price', () => {
        const data = { name: "test", price: -15 , image: "test image", description: "test description"};
        const product = new Product(data);
        const error = product.validateSync();
        expect(error).to.exist;
      });
      it('must not allow zero price', () => {
        const data = { name: "test", price: 0 , image: "test image", description: "test description"};
        const product = new Product(data);
        const error = product.validateSync();
        expect(error).to.exist;
      });
    });
});