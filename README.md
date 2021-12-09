# Group 

Member1:  Ali Mehraj, ali.mehraj@tuni.fi, 50508879, 
responsible for: TODO, short description of duties 

Member2:  Anna Knappe, anna.knappe@tuni.fi, 50333099, 
responsible for: TODO, short description of duties 



# WebDev1 coursework assignment

A web shop with vanilla HTML, CSS.


### The project structure

```
.
├── index.js                --> TODO
├── package.json            --> TODO
├── routes.js               --> TODO
├── auth                    --> TODO
│   └──  auth.js            --> TODO
├── controllers             --> TODO
│   ├── orders.js           -->   ...
│   ├── products.js         -->   ...
│   └── users.js            --> controller for user
├── models                  --> 
│   ├──  db.js              -->   
│   ├──  user.js            --> mongoose schema defining a user
│   ├──  product.js         --> mongoose schema defining a product
│   └──  order.js           --> mongoose schema defining user's order of products 
├── public                  --> root folder containing all html, css and front-end js files
│   ├── 404.html            --> the html page displayed when 404 error occurs
│   ├── addproducts.html    --> html page with a form to add more products, for admins
│   ├── cart.html           --> html page for the content of shopping cart, for customers
│   ├── changeProducts.html --> html page listing all the products in the database with buttons to modify and remove them, for admins
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
├── utils                   --> TODO
│   ├── render.js           --> TODO
│   ├── requestUtils.js     --> TODO
│   └── responseUtils.js    --> TODO
└── test                    --> tests
│   ├── auth                --> TODO
│   │   └── autj.test.js    -->
│   ├── controllers         --> TODO
│   │   ├── products.test.js-->
│   │   └── users.test.js   -->
└── └── own                 --> TODO
│   │   └── own.test.js     -->
└── setup                   --> TODO
│   ├── create-orders.js    --> TODO
│   ├── products.json       --> JSON file containing all initial products for the database
│   ├── reset-db.js         --> TODO
│   └── users.json          --> JSON file containing all initial users for the database

```

TODO: describe added files here and give them short descriptions

## The architecture 

TODO: describe the system, important buzzwords include MVC and REST.
UML diagrams would be highly appreciated.


## Tests and documentation

TODO: Links to at least 10 of your group's GitLab issues, and their associated Mocha tests and test files.

## Security concerns

TODO: list the security threats represented in the course slides.
Document how your application protects against the threats.
You are also free to add more security threats + protection here, if you will.

