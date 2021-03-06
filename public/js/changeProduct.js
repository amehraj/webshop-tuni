(async() => {

    const productsContainer = document.querySelector('#products-container');
    const productTemplate = document.querySelector('#product-template');
    const formTemplate = document.querySelector('#form-template');
    const modifyContainer = document.querySelector('#modify-product');
    const containerColors = ['#2e0017', '#520101', '#1c0347', '#031647', '#034734', '#471f03','#400347', '#47032c','#022e22', '#02272e'];


    const updateProduct = async event => {
        event.preventDefault();
    
        const form = event.target;
        const id = form.querySelector('#id-input').value;
        const name = form.querySelector('#name-input').value;
        const description = form.querySelector('#description-input').value;
        const price = form.querySelector('#price-input').value;
        const image = form.querySelector('#image-input').value;
    
        try {
          const product = await postOrPutJSON(`/api/products/${id}`, 'PUT', { name, description, price, image });
          document.querySelector(`#name-${id}`).textContent = product.name;
          document.querySelector(`#description-${id}`).textContent = product.description;
          document.querySelector(`#price-${id}`).textContent = product.price;
          document.querySelector(`#modify-product-${id}`).addEventListener('click', () => {
            return showEditForm(id, name, description, price, image);
          })            
          removeElement('modify-product', 'edit-product-form');
          return createNotification(`Updated Product ${product.name}`, 'notifications-container');
        } catch (error) {
          console.error(error);
          return createNotification('Update failed!', 'notifications-container', false);
        }
      };
    
      const deleteProduct = async productId => {
        removeElement('modify-product', 'edit-product-form');
        try {
          const product = await deleteResource(`/api/products/${productId}`);
          removeElement('products-container', `product-container-${productId}`);
          return createNotification(`Deleted Product ${product.name}`, 'notifications-container');
        } catch (error) {
          console.error(error);
          return createNotification('Delete failed!', 'notifications-container', false);
        }
      };
    
      const showEditForm = (id, name, description, price, image) => {
        removeElement('modify-product', 'edit-product-form');

        modifyContainer.style.display = "block";
    
        const form = formTemplate.content.cloneNode(true);
        form.querySelector('h2').textContent = `Modify Product ${name}`;
        form.querySelector('#id-input').value = id;
        form.querySelector('#name-input').value = name;
        form.querySelector('#description-input').value = description;
        form.querySelector('#price-input').value = price;
        form.querySelector('#image-input').value = image;
    
        modifyContainer.append(form);
        modifyContainer.querySelector('form').addEventListener('submit', updateProduct);

        window.onclick = function(event) {
          if (event.target == modifyContainer) {
            modifyContainer.style.display = "none";
          }
        }
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
        productContainer.querySelector('.product-container').id = `product-container-${id}`;
        productContainer.querySelector('.item-row-narrow').id = `product-${id}`;
        productContainer.querySelector('.product-name').id = `name-${id}`;
        productContainer.querySelector('.product-name').textContent = name;
        productContainer.getElementById('product-image').src = image;
        productContainer.querySelector('.product-description').id = `description-${id}`;
        productContainer.querySelector('.product-description').textContent = description;
        productContainer.querySelector('.product-price').id = `price-${id}`;
        productContainer.querySelector('.product-price').textContent = price;
        productContainer.querySelector('.modify-product').id = `modify-product-${id}`;
        productContainer.querySelector('.delete-product').id = `delete-product-${id}`;
        productContainer.querySelector('.modify-product').addEventListener('click', () => {
            return showEditForm(id, name, description, price, image);
        })
        productContainer.querySelector('.delete-product').addEventListener('click', () => {
            return deleteProduct(id);
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