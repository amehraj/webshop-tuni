const addToCart = productId => {
  addProductToCart(productId);
  updateProductAmount(productId);
};

const decreaseCount = productId => {

  const decreasedAmount = decreaseProductCount(productId);
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

  const productCountFromCart = getProductCountFromCart(productId);
  document.querySelector(`#amount-${productId}`).textContent = productCountFromCart + 'x';
  //return productCountFromCart;
};

const placeOrder = async() => {
  const allProductsFromCart = await getAllProductsFromCart();
  let items = [];
  allProductsFromCart.forEach((singleProduct) => {
    const productId = singleProduct.name;
    const quantity = singleProduct.amount;
    const productNmae = document.querySelector(`#name-${productId}`).textContent;
    const productPrice = document.querySelector(`#price-${productId}`).textContent;
    const productDescription = document.querySelector(`#description-${productId}`).textContent;
    const cartProductData = {"product":{"_id": productId,"name": productNmae,"price":productPrice,"description":productDescription},"quantity":quantity}
    items.push(cartProductData);
    removeElement('cart-container', `amount-${productId}`);
    removeElement('cart-container', `price-${productId}`);
    removeElement('cart-container', `name-${productId}`);
    removeElement('cart-container', `description-${productId}`);
    removeElement('cart-container', `minus-${productId}`);
    removeElement('cart-container', `plus-${productId}`);
    removeElement('cart-container', `item-row-${productId}`);
  });
  try{
    const orderData = {items};
    await postOrPutJSON('api/orders', 'POST', orderData);
    createNotification('Successfully created an order!', 'notifications-container', true);
    clearCart();
  } catch (error) {
    console.error(error);
    createNotification('Order Placing failed!', 'notifications-container', false);
  }

};

(async() => {
  
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

      const productToFind = products.find(singleProduct => singleProduct._id === id);
      const { name, price, description } = productToFind;
      const cartTemplateContainer = cartItemTemplate.content.cloneNode(true);
      cartTemplateContainer.querySelector('.item-row').id = `item-row-${id}`;
      cartTemplateContainer.querySelector('.product-name').id = `name-${id}`;
      cartTemplateContainer.querySelector('.product-name').textContent = name;
      cartTemplateContainer.querySelector('.product-price').id = `price-${id}`;
      cartTemplateContainer.querySelector('.product-price').textContent = price;
      cartTemplateContainer.querySelector('.product-amount').id = `amount-${id}`;
      cartTemplateContainer.querySelector('.product-amount').textContent = amount + 'x';
      cartTemplateContainer.querySelector('.product-description').id = `description-${id}`;
      cartTemplateContainer.querySelector('.product-description').textContent = description;
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