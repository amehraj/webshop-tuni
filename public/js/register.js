/**
 * TODO: 8.4 Register new user
 *       - Handle registration form submission
 *       - Prevent registration when password and passwordConfirmation do not match
 *       - Use createNotification() function from utils.js to show user messages of
 *       - error conditions and successful registration
 *       - Reset the form back to empty after successful registration
 *       - Use postOrPutJSON() function from utils.js to send your data back to server
 */

 const submitButton = document.querySelector('#btnRegister');
 const form = document.querySelector('#register-form');


 form.addEventListener('submit', (event) => {
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
        postOrPutJSON('api/register', 'POST', data);
        createNotification('Registration Successful', 'notifications-container', true);
     }
     form.reset();
 })