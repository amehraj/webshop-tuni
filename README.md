# Group 76

Member1:  Ali Mehraj, ali.mehraj@tuni.fi, 50508879, 
responsible for: Routes implementation, Controller functions implementation for User, Product & Order, Front-end helper js function implementation for User, Product & Order, Implemention of HTML pages for User, Product & Order, Mocha Tests implementation for coverage, Heroku Deployment with MongoDB Atlas, SonarQube Technical Debt fixation.

Member2:  Anna Knappe, anna.knappe@tuni.fi, 50333099, 
responsible for: CSS and the layout design, Frontpage header image & product images, Responsiveness, Accessibility, Mongoose schemas, JSDoc documentation, GitOps implementation.



# WebDev1 coursework assignment

A web shop with vanilla HTML, CSS, Node.js & MongoDB.


### The project structure

```
.
├── index.js                --> creates the node server
├── package.json            --> metadata: dependencies, run scripts, and the entry point to our package
├── routes.js               --> File handling the routing
├── auth                    --> Files that handle the authorization
│   └──  auth.js            --> Identifies the current user and exports it
├── controllers             --> All files functioning as controllers
│   ├── orders.js           --> controller for order
│   ├── products.js         --> controller for product
│   └── users.js            --> controller for user
├── models                  --> mongoose schemas and connection to the database
│   ├──  db.js              --> connects to the database
│   ├──  user.js            --> mongoose schema defining a user
│   ├──  product.js         --> mongoose schema defining a product
│   └──  order.js           --> mongoose schema defining user's order of products 
├── public                  --> root folder containing all html, css and front-end js files
│   ├── 404.html            --> the html page displayed when 404 error occurs
│   ├── addproducts.html    --> html page with a form to add more products, for admins
│   ├── cart.html           --> html page for the content of shopping cart, for customers
│   ├── changeProducts.html --> html page listing all the products in the database with option to modify and remove them, for admins
│   ├── createAdmin.html    --> html page with a form to add new admin, for admins
│   ├── index.html          --> the landing html page
│   ├── orders.html         --> html page for displaying either all orders for admins, or customer's orders for customers
│   ├── products.html       --> html page for displaying all products in the database, for customers and admins
│   ├── register.html       --> html page with a form to register a new customer
│   ├── users.html          --> html page displaying all users in the database, for admins
│   ├── img                 --> image folder
│   │   ├── ...             --> logo and header image in three different sizes
│   ├── js                  -->
│   │   ├── addProduct.js   --> js scripts supporting the functionality of addproducts.html
│   │   ├── adminUsers.js   --> js scripts for deleting and modifying users
│   │   ├── cart.js         --> js scripts supporting the functionality of cart.html
│   │   ├── changeProduct.js--> js scripts for deleting and modifying products
│   │   ├── createAdmin.js  --> js scripts supporting the functionality of createAdmin.html
│   │   ├── order.js        --> js scripts supporting the functionality of orders.html
│   │   ├── products.js     --> js scripts supporting the functionality of products.html
│   │   ├── register.js     --> js scripts supporting the functionality of register.html
│   │   └── utils.js        --> js scripts for communication with the server
│   └── css                 --> CSS styles folder
│   │   └── styles.css      --> CSS file containing all UI styling
├── utils                   --> utilities folder
│   ├── render.js           --> renders the files from ./public directory
│   ├── requestUtils.js     --> handles http requests
│   └── responseUtils.js    --> handles http responses
└── test                    --> tests
│   ├── auth                --> tests related to authentication
│   │   └── auth.test.js    
│   ├── controllers         --> tests related to controllers
│   │   ├── products.test.js
│   │   └── users.test.js   
└── └── own                 --> mocha tests of all new content
│   │   └── own.test.js     --> test related to static product fetch from json
│   │   └── orderSchema.test.js     --> tests related to Order Schema for validation
│   │   └── ownRoutes.test.js  --> additional tests related to routes 
│   │   └── productSchema.test.js  --> tests related to Product Schema for validation
└── setup                   --> Folder containing files needed for initializing the webshop
│   ├── create-orders.js    --> creates orders
│   ├── products.json       --> JSON file containing all initial products for the database
│   ├── reset-db.js         --> resets the database
│   └── users.json          --> JSON file containing all initial users for the database

```


## The architecture 

For the purpose of the exercise, the UI of the webshop is a mock-up to display the back-end functionality and is not intended to function as an actual webshop. The customer and admin features are all visible as separate links in the nav bar, but access to them is restricted based on the current user role. The demonstrated functions include registering a new customer, viewing all products and placing them in cart, viewing the cart and placing an order, and viewing one’s own orders for customers, and additionally adding an admin, viewing all users and modifying their roles, and viewing all orders for admins. 

CUSTOMER LOGIN:
e-mail: customer@email.com
password: 1234567890

ADMIN LOGIN:
e-mail: admin@email.com
password: 1234567890

The website follows MVC model in its architecture. The corresponding files are located in folders models, public, and controllers. The Model of the application includes mongoose schemas and access to the database to fetch, add, modify and remove entries. The view handles the display of the data from models and the controllers handles all communication between everything.


## Tests and documentation

Tests are implemented using Mocha to test functionality of the web shop. The tests are located in the test folder in the root directory. We were able to achieve around 97% branch coverage using both Plussa Mocha tests and our own tests. Own tests are located under the subdirectory own in tests folders. Some of our test along with the Gitlab issues are given below:

Issue 1: https://course-gitlab.tuni.fi/webdev1-autumn-2021/webdev1-group76/-/issues/18 (Ensure Product Schema Validation. If price is zero / 0, should respond with error. Test implemented in test/own/productSchema.test.js) <br />
Issue 2: https://course-gitlab.tuni.fi/webdev1-autumn-2021/webdev1-group76/-/issues/17 (Ensure Product Schema Validation. If price is negative, should respond with error. Test implemented in test/own/productSchema.test.js) <br />
Issue 3: https://course-gitlab.tuni.fi/webdev1-autumn-2021/webdev1-group76/-/issues/19 (Ensure Order Schema Validation. If quantity is negative, should respond with error. Test implemented in test/own/orderSchema.test.js) <br />
Issue 4: https://course-gitlab.tuni.fi/webdev1-autumn-2021/webdev1-group76/-/issues/20 (Ensure Order Schema Validation. If items is zero, should respond with error. Test implemented in test/own/orderSchema.test.js) <br />
Issue 5: https://course-gitlab.tuni.fi/webdev1-autumn-2021/webdev1-group76/-/issues/22 (Ensure blocking of wrong method for register route. If wrong method if given should respond with 405. Test implemented in test/own/ownRoutes.test.js) <br />
Issue 6: https://course-gitlab.tuni.fi/webdev1-autumn-2021/webdev1-group76/-/issues/23 (Ensure admins can create new admins. Test implemented in test/own/ownRoutes.test.js) <br />
Issue 7: https://course-gitlab.tuni.fi/webdev1-autumn-2021/webdev1-group76/-/issues/24. (Ensure customers cannot create new admins. Test implemented in test/own/ownRoutes.test.js) <br />
Issue 8: https://course-gitlab.tuni.fi/webdev1-autumn-2021/webdev1-group76/-/issues/26 (Ensure get All Products respond with 405 when method of request is not allowed. Test implemented in test/own/ownRoutes.test.js) <br />
Issue 9: https://course-gitlab.tuni.fi/webdev1-autumn-2021/webdev1-group76/-/issues/25 (Ensure getAllUsers respond with 405 when method of request is not allowed. Test implemented in test/own/ownRoutes.test.js) <br />
Issue 10: https://course-gitlab.tuni.fi/webdev1-autumn-2021/webdev1-group76/-/issues/27 (Ensure get All Orders respond with 405 when method of request is not allowed. Test implemented in test/own/ownRoutes.test.js) <br />
Issue 11: https://course-gitlab.tuni.fi/webdev1-autumn-2021/webdev1-group76/-/issues/28 (Ensure get single Product respond with 405 when method of request is not allowed. Test implemented in test/own/ownRoutes.test.js) <br />
Issue 12: https://course-gitlab.tuni.fi/webdev1-autumn-2021/webdev1-group76/-/issues/30 (Ensure get single User respond with 405 when method of request is not allowed. Test implemented in test/own/ownRoutes.test.js) <br />
Issue 13: https://course-gitlab.tuni.fi/webdev1-autumn-2021/webdev1-group76/-/issues/29 (Ensure get single Order respond with 405 when method of request is not allowed. Test implemented in test/own/ownRoutes.test.js) <br />



## Security concerns

In our course we were taught about security threats such as Cross Site Scripting, Cross-Site Request Forgery, Injection Attacks, Directory Traversal. <br />
Request headers are set with 'Access-Control-Allow-Methods' and 'Access-Control-Allow-Headers' to avoid unwanted method requests. Basic Authentication is implemented for prevention of unauthenticated usage. Unauthorized access has been blocked with user validation. Also user input is validated using mongoose schema validation. Although this does not prevent Injection Attacks completely, it creates a primary barrier for the application against such attacks.


## Instructions to run the application

Run Locally: The application can be cloned using SSH 'git@course-gitlab.tuni.fi:webdev1-autumn-2021/webdev1-group76.git' or HTTPS 'https://course-gitlab.tuni.fi/webdev1-autumn-2021/webdev1-group76.git' to run locally. After cloning, the dependencies need to be installed with 'npm install'. MongoDB needs to be running on the machine to run the application. To start the application the following command needs to be run 'npm start'. (For Dev mode: npm run nodemon). <br />

Run in Heroku: The application is already deployed in Heroku: https://webshop-tuni-webdev1.herokuapp.com/   <br />
The application is connected to MongoDB Atlas and users for both customer and admin are created for usage.  <br />

CUSTOMER LOGIN:
e-mail: customer@email.com
password: 1234567890

ADMIN LOGIN:
e-mail: admin@email.com
password: 1234567890

