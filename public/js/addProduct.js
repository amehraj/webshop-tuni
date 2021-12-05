//add new Product
const submitButton = document.querySelector('#btnAddProduct');
const form = document.querySelector('#product-form');


 form.addEventListener('submit', (event) => {
     event.preventDefault();

    let formData = new FormData(form);
    let data = {};

    formData.forEach((value, key) => (data[key] = value));
    postOrPutJSON('/api/products', 'POST', data);
    createNotification('Product Added', 'notifications-container', true);

    form.reset();
 })