const chai = require('chai');
const expect = chai.expect;

const Order = require('../../models/order');

describe('Order Model', () => {
    describe('Schema validation', () => {
      it('must not allow negative quantity', () => {
        const data = {"items":[{"product":{"_id":"61accdc7d3ff6005b4858fd3","name":"Fantastic Cotton Chair","price":102,"description":"The Football Is Good For Training And Recreational Purposes"},"quantity":-2}]};
        const order = new Order(data);
        const error = order.validateSync();
        expect(error).to.exist;
      });
      it('must not allow zero items', () => {
        const data = {"items":[]};
        const order = new Order(data);
        const error = order.validateSync();
        expect(error).to.exist;
      });
    });
});