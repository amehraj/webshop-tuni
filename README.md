# Group 76

Member1:  Ali Mehraj, ali.mehraj@tuni.fi, 50508879, 
responsible for: Routes implementation, Controller functions implementation for User, Product & Order, Front-end helper js function implementation for User, Product & Order, Implement HTML for User, Product & Order, Mocha Tests implementation for coverage, Heroku Deployment, SonarQube Technical Debt fixation.

Member2:  Anna Knappe, anna.knappe@tuni.fi, 50333099, 
responsible for: TODO, short description of duties 



# WebDev1 coursework assignment

A web shop with vanilla HTML, CSS.


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

TODO: describe the system, important buzzwords include MVC and REST.
UML diagrams would be highly appreciated.


## Tests and documentation

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

TODO: list the security threats represented in the course slides.
Document how your application protects against the threats.
You are also free to add more security threats + protection here, if you will.

