const viewSingleOrderDetails = async (orderId) => {
  const order = await getJSON(`/api/orders/${orderId}`);
  return order;
}

(async() => {

    const ordersContainer = document.querySelector('#orders-container');
    const orderTemplate = document.querySelector('#order-template');
    const detailsContainer = document.querySelector('#order-details');
    const orderDetailsTemplate = document.querySelector('#order-details-template');
    const singleOrderDetailsTemplate = document.querySelector('#single-order-details-template');
    

    const viewOrderDetails = async (id, customerId) => {
      removeElement('order-details', 'order-details-div');
      removeElement('order-details', 'single-order-details-div');

      const orderDiv = orderDetailsTemplate.content.cloneNode(true);
      orderDiv.querySelector('#id-input').value = id;
      orderDiv.querySelector('#customer-id-input').value = customerId;
      detailsContainer.append(orderDiv);

      const singleOrder = await viewSingleOrderDetails(id);
      singleOrder.items.forEach((item) => {
        const singleOrderDiv = singleOrderDetailsTemplate.content.cloneNode(true);
        singleOrderDiv.querySelector('h3').textContent = item.product.name;
        singleOrderDiv.querySelector('#id-input').value = item.product._id;
        singleOrderDiv.querySelector('#name-input').value = item.product.name;
        singleOrderDiv.querySelector('#price-input').value = item.product.price;
        singleOrderDiv.querySelector('#description-input').value = item.product.description;
        singleOrderDiv.querySelector('#quantity-input').value = item.quantity;
        detailsContainer.append(singleOrderDiv);
      });
    };
    try{
      const orders = await getJSON('/api/orders');
      if (orders.length === 0) {
        const p = document.createElement('p');
        p.textContent = 'No Orders';
        ordersContainer.append(p);
        return;
      }
      orders.forEach((order) => {
        const { _id: id, customerId } = order;
        const orderContainer = orderTemplate.content.cloneNode(true);
  
        orderContainer.querySelector('.order-id').id = `order-${id}`;
        orderContainer.querySelector('.order-id').textContent = `Order ID : ${id}`;
        orderContainer.querySelector('.customer-id').id = `customer-${id}`;
        orderContainer.querySelector('.customer-id').textContent = `Customer ID : ${customerId}`;
        orderContainer.querySelector('button').id = `view-details-${id}`;
        orderContainer.querySelector('button').addEventListener('click', () => {
          return viewOrderDetails(id, customerId);
        });
        ordersContainer.append(orderContainer);
      });
  
  
    } catch (error){
      console.log(error);
      return createNotification(
        'There was an error while fetching orders',
        'notifications-container',
        false
      );
    }
  })();