 const submitButton = document.querySelector('#btnRegister');
 const form = document.querySelector('#register-form');


 form.addEventListener('submit', async (event) => {
     event.preventDefault();

     let formData = new FormData(form);
     let password = formData.get('password');
     let passwordConfirmation = formData.get('passwordConfirmation');

     if(password !== passwordConfirmation){
        createNotification('Password and Password Confirmation does not match', 'notifications-container', false);
     }
     else{
        let data = {};
        formData.forEach((value, key) => (data[key] = value));
        try{
        const user = await postOrPutJSON('api/register', 'POST', data);
        createNotification('Admin Creation Successful', 'notifications-container', true);
        } catch (error) {
           console.error(error);
           createNotification('Admin Creation Failed', 'notifications-container', false);
        }
     }
     form.reset();
 })