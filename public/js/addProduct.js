//add new Product
const submitButton = document.querySelector('#btnAddProduct');
const form = document.querySelector('#product-form');


 form.addEventListener('submit', (event) => {
     event.preventDefault();

    let formData = new FormData(form);
    let data = {};
    try {
    formData.forEach((value, key) => (data[key] = value));
    const product = await postOrPutJSON('/api/products', 'POST', data);
    createNotification('Product Added', 'notifications-container', true);
    } catch (error) {
        console.error(error);
        return createNotification('Product Adding failed!', 'notifications-container', false);
    }

    form.reset();
 })