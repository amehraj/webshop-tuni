const chai = require('chai');
const expect = chai.expect;
const { createResponse } = require('node-mocks-http');
const { getAllProducts } = require('../../controllers/products');

// Get products (create copies for test isolation)
const products = require('../../products.json').map(product => ({ ...product }));

describe('Products Test', () => {
  describe('Search Products' , () => {
    it('Get product Small Metal Mouse', async () => {
      const product = products.find(product => product.name === 'Small Metal Mouse');
      expect(product.name).to.equal('Small Metal Mouse');
    });
    it('Get product Small Metal Mouse', async () => {
      const product = products.find(product => product.name === 'Generic Wooden Chips');
      expect(product.name).to.equal('Generic Wooden Chips');
    });
    it('Get product Rustic Wooden Pizza', async () => {
      const product = products.find(product => product.name === 'Rustic Wooden Pizza');
      expect(product.name).to.equal('Rustic Wooden Pizza');
    });
    it('Get product Fantastic Frozen Chicken', async () => {
      const product = products.find(product => product.name === 'Fantastic Frozen Chicken');
      expect(product.name).to.equal('Fantastic Frozen Chicken');
    });
    it('Get product Handmade Concrete Table', async () => {
      const product = products.find(product => product.name === 'Handmade Concrete Table');
      expect(product.name).to.equal('Handmade Concrete Table');
    });
  });
  describe('Search Products 2' , () => {
    it('Get product Small Metal Mouse', async () => {
      const product = products.find(product => product.name === 'Small Metal Mouse');
      expect(product.name).to.equal('Small Metal Mouse');
    });
    it('Get product Small Metal Mouse', async () => {
      const product = products.find(product => product.name === 'Generic Wooden Chips');
      expect(product.name).to.equal('Generic Wooden Chips');
    });
    it('Get product Rustic Wooden Pizza', async () => {
      const product = products.find(product => product.name === 'Rustic Wooden Pizza');
      expect(product.name).to.equal('Rustic Wooden Pizza');
    });
    it('Get product Fantastic Frozen Chicken', async () => {
      const product = products.find(product => product.name === 'Fantastic Frozen Chicken');
      expect(product.name).to.equal('Fantastic Frozen Chicken');
    });
    it('Get product Handmade Concrete Table', async () => {
      const product = products.find(product => product.name === 'Handmade Concrete Table');
      expect(product.name).to.equal('Handmade Concrete Table');
    });
  });
});
  