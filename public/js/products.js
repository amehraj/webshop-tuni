const addToCart = (productId, productName) => {
  // TODO 9.2
  // use addProductToCart(), available already from /public/js/utils.js
  // /public/js/utils.js also includes createNotification() function
  addProductToCart(productId);

  createNotification(`Added ${productName} to cart!`, 'notifications-container', true);

};

(async() => {
  //TODO 9.2 
  // - get the 'products-container' element
  // - get the 'product-template' element
  // - use getJSON(url) to get the available products
  // - for each of the products:
  //    * clone the template
  //    * add product information to the template clone
  //    * remember to add an event listener for the button's 'click' event, and call addToCart() in the event listener's callback
  // - remember to add the products to the the page
  const productsContainer = document.querySelector('#products-container');
  const productTemplate = document.querySelector('#product-template');
  const productDetailsTemplate = document.querySelector('#product-details-template');
  const productDetailsContainer = document.querySelector('#product-details-container');
  const containerColors = ['#2e0017', '#520101', '#1c0347', '#031647', '#034734', '#471f03','#400347', '#47032c','#022e22', '#02272e'];


  const productDetails = (id, name, description, price, image) => {
    removeElement('product-details-container', 'product-div');

    const productDetail = productDetailsTemplate.content.cloneNode(true);
    productDetail.querySelector('h2').textContent = name;
    productDetail.querySelector('#id-input').value = id;
    productDetail.querySelector('#name-input').value = name;
    productDetail.querySelector('#description-input').value = description;
    productDetail.querySelector('#price-input').value = price;
    productDetail.querySelector('#image-input').value = image;

    productDetailsContainer.append(productDetail);
};
  try{
    const products = await getJSON('/api/products');
    if (products.length === 0) {
      const p = document.createElement('p');
      p.textContent = 'No Products';
      productsContainer.append(p);
      return;
    }
    products.forEach((product) => {
      const { _id: id, name, description, price, image } = product;
      const productContainer = productTemplate.content.cloneNode(true);
      const bgColor = Math.floor(Math.random() * (containerColors.length));
      productContainer.querySelector('.product-container').style.backgroundColor = containerColors[bgColor];
      productContainer.getElementById('product-image').src = image;
      productContainer.querySelector('.product-name').id = `name-${id}`;
      productContainer.querySelector('.product-name').textContent = name;
      productContainer.querySelector('.product-description').id = `description-${id}`;
      productContainer.querySelector('.product-description').textContent = description;
      productContainer.querySelector('.product-price').id = `price-${id}`;
      productContainer.querySelector('.product-price').textContent = price;
      productContainer.querySelector('button').id = `add-to-cart-${id}`;
      productContainer.querySelector('button').addEventListener('click', () => {
        return addToCart(id, name);
      });
      productContainer.querySelector('.details').id = `details-${id}`;
      productContainer.querySelector('.details').addEventListener('click', () => {
        return productDetails(id, name, description, price, image);
      })

      productsContainer.append(productContainer);
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