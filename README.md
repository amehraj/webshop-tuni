# Tampere University Web Development 1 Course Project: Group 76

Member1:  Ali Mehraj, ali.mehraj@tuni.fi,
responsible for: Routes implementation, Controller functions implementation for User, Product & Order, Front-end helper js function implementation for User, Product & Order, Implemention of HTML pages for User, Product & Order, Mocha Tests implementation for coverage, Heroku Deployment with MongoDB Atlas, SonarQube Technical Debt fixation.

Member2:  Anna Knappe, anna.knappe@tuni.fi,
responsible for: CSS and the layout design, Frontpage header image & product images, Responsiveness, Accessibility, Mongoose schemas, JSDoc documentation, GitOps implementation.



# WebDev1 coursework assignment

A web shop with vanilla HTML, CSS, Node.js & MongoDB.
Initial code repository in GitLab.


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

## Data Models

There are three primary models in the application. They are User, Product and Order.  <br/>

User Model: <br/>
Attributes: name (String), email (String), password (String), role (String).
This model defines what attributes a user will have and contains the email which is unique and the password which is required to login. The role also defines the authority of the user in the application.

Product Model: <br/>
Attributes: name (String), price (Number), image (String), description (String).
This model defines what attributes a product will have and contains detailed information that is displayed to the user when purchasing products.

Order Model: <br/>
Attributes: customerId (Schema.Types.ObjectId), items ([orderedItem] -> product (Product), quantity (Number)). Customer id defines which user created the order. It is reference to User Model's id. The items defines a list of products that are ordered and their quantities. Product refers to the Product Model and its attributes and quantity defines the quantity of the product that was ordered.


## Usage

Register: Non-logged in Users can register. If a user is logged in it will respond with 403 (Forbidden). <br/>
List Products: Logged in users (Admin & Customer) can view product list and add product to cart.<br/>
Shopping Cart: Logged in users (Admin & Customer) can view cart and make changes to the quantity. Customers can place order. Admins will receive 403 (fordbidden) if they try to place order.<br/>
Show Orders: Logged in users (Admin & Customer) can view orders. Customers will see only their own orders. Admins will see all the orders <br/>
List Users: Admins can view the User List and edit user roles. Customers will receive 403 (Forbidden). <br/>
Create Admin: Admins can create new admins. Customers will receive 403 (Forbidden). <br/>
Add Products: Admins can add new products. Customers will receive 403 (Forbidden). <br/>
Modify Products: Admins can modifya and delete products. Customers will receive 403 (Forbidden). <br/>


## Tests and documentation

Tests are implemented using Mocha to test functionality of the web shop. The tests are located in the test folder in the root directory of the project. We were able to achieve around 97% branch coverage using both Plussa Mocha tests and our own tests. Own tests are located under the subdirectory own in test folder. 


## Security concerns

In our course we were taught about security threats such as Cross Site Scripting, Cross-Site Request Forgery, Injection Attacks, Directory Traversal. <br />
Request headers are set with 'Access-Control-Allow-Methods' and 'Access-Control-Allow-Headers' to avoid unwanted method requests. Basic Authentication is implemented for prevention of unauthenticated usage. Unauthorized access has been blocked with user validation. Also user input is validated using mongoose schema validation. Although this does not prevent Injection Attacks completely, it creates a primary barrier for the application against such attacks.


## Instructions to run the application

Run Locally: The application can be cloned using SSH or HTTPS to run locally. After cloning, the dependencies need to be installed with 'npm install'. MongoDB needs to be running on the machine to run the application. To start the application the following command needs to be run 'npm start'. (For Dev mode: npm run nodemon). <br />

Run in Heroku: The application is already deployed in Heroku: https://webshop-tuni-webdev1.herokuapp.com/   <br />
The application is connected to MongoDB Atlas and users for both customer and admin are created for usage.  <br />

CUSTOMER LOGIN:
e-mail: customer@email.com
password: 1234567890

ADMIN LOGIN:
e-mail: admin@email.com
password: 1234567890

