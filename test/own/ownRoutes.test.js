const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const { handleRequest } = require('../../routes');

const registrationUrl = '/api/register';
const usersUrl = '/api/users';
const productsUrl = '/api/products';
const ordersUrl = '/api/orders';
const contentType = 'application/json';
chai.use(chaiHttp);

const User = require('../../models/user');
const Product = require('../../models/product');
const Order = require('../../models/order');

// helper function for authorization headers
const encodeCredentials = (username, password) =>
  Buffer.from(`${username}:${password}`, 'utf-8').toString('base64');

// helper function for creating randomized test data
const generateRandomString = (len = 9) => {
  let str = '';

  do {
    str += Math.random()
      .toString(36)
      .substr(2, 9)
      .trim();
  } while (str.length < len);

  return str.substr(0, len);
};

// Get products (create copies for test isolation)
const products = require('../../setup/products.json').map(product => ({ ...product }));

// Get users (create copies for test isolation)
const users = require('../../setup/users.json').map(user => ({ ...user }));

const adminUser = { ...users.find(u => u.role === 'admin') };
const customerUser = { ...users.find(u => u.role === 'customer') };

const adminCredentials = encodeCredentials(adminUser.email, adminUser.password);
const customerCredentials = encodeCredentials(customerUser.email, customerUser.password);


describe('Own Routes', () => {
    let allUsers;
    let allProducts;
    let allOrders;
  
    // get randomized test user
    const getTestUser = () => {
      return {
        name: generateRandomString(),
        email: `${generateRandomString()}@email.com`,
        password: generateRandomString(10)
      };
    };
  
    beforeEach(async () => {
      await User.deleteMany({});
      await User.create(users);
      allUsers = await User.find({});
  
      await Product.deleteMany({});
      await Product.create(products);
      allProducts = await Product.find({});
  
      const orders = allUsers.map(user => {
        return {
          customerId: user.id,
          items: [
            {
              product: {
                _id: allProducts[0].id,
                name: allProducts[0].name,
                price: allProducts[0].price,
                description: allProducts[0].description
              },
              quantity: Math.floor(Math.random() * 5) + 1
            }
          ]
        };
      });
  
      await Order.deleteMany({});
      await Order.create(orders);
      allOrders = await Order.find({});
    });
    describe('Register Route', () => {
        it('should create admin when admin creation is successful with admin credentials', async () => {
            const user = getTestUser();
            user.role = 'admin';
            user.isAdminCreation = 'isAdminCreation';
    
            const response = await chai
              .request(handleRequest)
              .post(registrationUrl)
              .set('Accept', contentType)
              .set('Authorization', `Basic ${adminCredentials}`)
              .send(user);
    
            const createdUser = await User.findOne({ email: user.email }).exec();
    
            expect(response).to.have.status(201);
            expect(response).to.be.json;
            expect(response.body).to.be.an('object');
            expect(response.body).to.have.all.keys('_id', 'name', 'email', 'password', 'role');
            expect(response.body.role).to.equal('admin');
            expect(createdUser.role).to.equal('admin');
          });
          it('should respond with forbidden when admin creation is failed with customer credentials', async () => {
            const user = getTestUser();
            user.role = 'admin';
            user.isAdminCreation = 'isAdminCreation';
    
            const response = await chai
              .request(handleRequest)
              .post(registrationUrl)
              .set('Accept', contentType)
              .set('Authorization', `Basic ${customerCredentials}`)
              .send(user);
    
            expect(response).to.have.status(403);
    
          });
          it('should respond with "405" when registration is url is sent with GET method', async () => {
            const user = getTestUser();
    
            const response = await chai
              .request(handleRequest)
              .get(registrationUrl)
              .set('Accept', contentType)
              .send(user);
    
            expect(response).to.have.status(405);
    
          });
          it('should respond with "405" when registration is url is sent with PATCH method', async () => {
            const user = getTestUser();
    
            const response = await chai
              .request(handleRequest)
              .patch(registrationUrl)
              .set('Accept', contentType)
              .send(user);
    
            expect(response).to.have.status(405);
    
          });
        });
        describe('User Route', () => {
            describe('Get All Users', () => {
                it('should respond with "405" when unallowed method is received', async () => {
                    const response = await chai
                    .request(handleRequest)
                    .patch(usersUrl)
                    .set('Accept', contentType)
                    .set('Authorization', `Basic ${adminCredentials}`);
            
                    expect(response).to.have.status(405);
                });
            });
            describe('Get Single User', () => {
                let testUser;
                let url;
          
                beforeEach(async () => {
                  const tempUser = users.find(u => u.role === 'admin' && u.email !== adminUser.email);
                  testUser = await User.findOne({ email: tempUser.email }).exec();
                  url = `${usersUrl}/${testUser.id}`;
                  unknownId = testUser.id
                    .split('')
                    .reverse()
                    .join('');
                });
                it('should respond with "405" when unallowed method is received', async () => {
                    const response = await chai
                      .request(handleRequest)
                      .patch(url)
                      .set('Accept', contentType)
                      .set('Authorization', `Basic ${adminCredentials}`);
            
                    expect(response).to.have.status(405);
                });
            });
        });
        describe('Product Route', () => {
            describe('Get All Products', () => {
                it('should respond with "405" when unallowed method is received', async () => {
                    const response = await chai
                    .request(handleRequest)
                    .patch(productsUrl)
                    .set('Accept', contentType)
                    .set('Authorization', `Basic ${adminCredentials}`);
            
                    expect(response).to.have.status(405);
                });
            });
            describe('Get Single Product', () => {
                let testProduct;
                let url;
          
                beforeEach(async () => {
                  testProduct = await Product.findOne({}).exec();
                  url = `${productsUrl}/${testProduct.id}`;
                  unknownId = testProduct.id
                    .split('')
                    .reverse()
                    .join('');
                });
                it('should respond with "405" when unallowed method is received', async () => {
                    const response = await chai
                      .request(handleRequest)
                      .patch(url)
                      .set('Accept', contentType)
                      .set('Authorization', `Basic ${adminCredentials}`);
            
                    expect(response).to.have.status(405);
                });
            });
        });
        describe('Order Route', () => { 
            describe('Get All Orders', () => {
                it('should respond with "405" when unallowed method is received', async () => {
                    const response = await chai
                    .request(handleRequest)
                    .patch(ordersUrl)
                    .set('Accept', contentType)
                    .set('Authorization', `Basic ${adminCredentials}`);
            
                    expect(response).to.have.status(405);
                });
            });
            describe('Viewing a single order: GET /api/orders/{id}', () => {
                let testOrder;
                let url;
          
                beforeEach(async () => {
                  const customer = allUsers.find(
                    user => user.email === customerUser.email && user.role === 'customer'
                  );
                  testOrder = await Order.findOne({ customerId: customer._id }).exec();
                  url = `${ordersUrl}/${testOrder.id}`;
                  unknownId = testOrder.id
                    .split('')
                    .reverse()
                    .join('');
                });
                it('should respond with "405" when unallowed method is received', async () => {
                    const response = await chai
                      .request(handleRequest)
                      .patch(url)
                      .set('Accept', contentType)
                      .set('Authorization', `Basic ${adminCredentials}`);
            
                    expect(response).to.have.status(405);
                });
            });
        });
});
