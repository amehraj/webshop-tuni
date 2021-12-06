const submitButton = document.querySelector('#btnAddProduct');
const form = document.querySelector('#product-form');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    let formData = new FormData(form);
    
    let data = {};
    formData.forEach((value, key) => (data[key] = value));
    postOrPutJSON('api/register', 'POST', data);
    createNotification('Product added succesfully', 'notifications-container', true);
    
    form.reset();
})