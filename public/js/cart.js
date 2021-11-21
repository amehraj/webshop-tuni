const addToCart = productId => {
  // TODO 9.2
  // use addProductToCart(), available already from /public/js/utils.js
  // call updateProductAmount(productId) from this file
  const addedProductId = addProductToCart(productId);
  updateProductAmount(productId);
};

const decreaseCount = productId => {
  // TODO 9.2
  // Decrease the amount of products in the cart, /public/js/utils.js provides decreaseProductCount()
  // Remove product from cart if amount is 0,  /public/js/utils.js provides removeElement = (containerId, elementId
  const decreasedAmount = decreaseProductCount(productId);
  //document.querySelector(`#amount-${productId}`).textContent = decreasedAmount + 'x';
  updateProductAmount(productId);
  if(decreasedAmount === 0){
    removeElement('cart-container', `amount-${productId}`);
    removeElement('cart-container', `price-${productId}`);
    removeElement('cart-container', `name-${productId}`);
    removeElement('cart-container', `minus-${productId}`);
    removeElement('cart-container', `plus-${productId}`);
    removeElement('cart-container', `item-row-${productId}`);
  }
  

};

const updateProductAmount = productId => {
  // TODO 9.2
  // - read the amount of products in the cart, /public/js/utils.js provides getProductCountFromCart(productId)
  // - change the amount of products shown in the right element's innerText
  const productCountFromCart = getProductCountFromCart(productId);
  document.querySelector(`#amount-${productId}`).textContent = productCountFromCart + 'x';
  //return productCountFromCart;
};

const placeOrder = async() => {
  // TODO 9.2
  // Get all products from the cart, /public/js/utils.js provides getAllProductsFromCart()
  // show the user a notification: /public/js/utils.js provides createNotification = (message, containerId, isSuccess = true)
  // for each of the products in the cart remove them, /public/js/utils.js provides removeElement(containerId, elementId)
  const allProductsFromCart = await getAllProductsFromCart();
  createNotification('Successfully created an order!', 'notifications-container', true);
  allProductsFromCart.forEach((singleProduct) => {
    const productId = singleProduct.name;
    removeElement('cart-container', `amount-${productId}`);
    removeElement('cart-container', `price-${productId}`);
    removeElement('cart-container', `name-${productId}`);
    removeElement('cart-container', `minus-${productId}`);
    removeElement('cart-container', `plus-${productId}`);
    removeElement('cart-container', `item-row-${productId}`);
  })
  clearCart();
};

(async() => {
  // TODO 9.2
  // - get the 'cart-container' element
  // - use getJSON(url) to get the available products
  // - get all products from cart
  // - get the 'cart-item-template' template
  // - for each item in the cart
  //    * copy the item information to the template
  //    * hint: add the product's ID to the created element's as its ID to 
  //        enable editing ith 
  //    * remember to add event listeners for cart-minus-plus-button
  //        cart-minus-plus-button elements. querySelectorAll() can be used 
  //        to select all elements with each of those classes, then its 
  //        just up to finding the right index.  querySelectorAll() can be 
  //        used on the clone of "product in the cart" template to get its two
  //        elements with the "cart-minus-plus-button" class. Of the resulting
  //        element array, one item could be given the ID of 
  //        `plus-${product_id`, and other `minus-${product_id}`. At the same
  //        time we can attach the event listeners to these elements. Something 
  //        like the following will likely work:
  //          clone.querySelector('button').id = `add-to-cart-${prodouctId}`;
  //          clone.querySelector('button').addEventListener('click', () => addToCart(productId, productName));
  //
  // - in the end remember to append the modified cart item to the cart 
  const cartContainer = document.querySelector('#cart-container');
  const cartItemTemplate = document.querySelector('#cart-item-template');
  const placeOrderButton = document.querySelector('#place-order-button');
  placeOrderButton.addEventListener('click', () => {
    return placeOrder();
  })

  try{
    const products = await getJSON('/api/products');
    const allProductsFromCart = await getAllProductsFromCart();

    if (allProductsFromCart.length === 0) {
      const p = document.createElement('p');
      p.textContent = 'No Items in Cart';
      cartContainer.append(p);
      return;
    }
    allProductsFromCart.forEach((product) => {
      const { name: id , amount } = product;

      const productToFind = products.find(product => product._id === id);
      const { name, price } = productToFind;
      const cartTemplateContainer = cartItemTemplate.content.cloneNode(true);
      cartTemplateContainer.querySelector('.item-row').id = `item-row-${id}`;
      cartTemplateContainer.querySelector('.product-name').id = `name-${id}`;
      cartTemplateContainer.querySelector('.product-name').textContent = name;
      cartTemplateContainer.querySelector('.product-price').id = `price-${id}`;
      cartTemplateContainer.querySelector('.product-price').textContent = price;
      cartTemplateContainer.querySelector('.product-amount').id = `amount-${id}`;
      cartTemplateContainer.querySelector('.product-amount').textContent = amount + 'x';
      cartTemplateContainer.querySelectorAll('.cart-minus-plus-button')[0].id = `plus-${id}`;
      cartTemplateContainer.querySelectorAll('.cart-minus-plus-button')[0].addEventListener('click', () => {
        return addToCart(id);
      })
      cartTemplateContainer.querySelectorAll('.cart-minus-plus-button')[1].id = `minus-${id}`;
      cartTemplateContainer.querySelectorAll('.cart-minus-plus-button')[1].addEventListener('click', () => {
        return decreaseCount(id);
      })

      cartContainer.append(cartTemplateContainer);
    })

  } catch (error){
    console.log(error);
    return createNotification(
      'There was an error while fetching products',
      'notifications-container',
      false
    );
  }
})();