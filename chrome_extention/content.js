// content.js

function addCaptureButton(buttonText, clickHandler) {
  const buttonContainer = document.createElement('div');
  buttonContainer.style.position = 'fixed';
  buttonContainer.style.top = '100px';
  buttonContainer.style.right = '20px';
  buttonContainer.style.zIndex = '9999';

  const button = document.createElement('button');
  button.textContent = buttonText;
  button.style.backgroundColor = '#ff9900';
  button.style.color = 'white';
  button.style.padding = '10px 20px';
  button.style.fontSize = '16px';
  button.style.border = 'none';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';
  button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

  button.addEventListener('mouseover', function() {
      this.style.backgroundColor = '#e68a00';
  });

  button.addEventListener('mouseout', function() {
      this.style.backgroundColor = '#ff9900';
  });

  button.addEventListener('click', clickHandler);

  buttonContainer.appendChild(button);
  document.body.appendChild(buttonContainer);
}

function captureAllOrders() {
  const orders = document.querySelectorAll('.order');
  const capturedOrders = Array.from(orders).map(order => {
      return {
          orderId: order.querySelector('.order-info')?.textContent.trim(),
          orderDate: order.querySelector('.order-date')?.textContent.trim(),
          totalAmount: order.querySelector('.grand-total-price')?.textContent.trim(),
          items: Array.from(order.querySelectorAll('.a-fixed-left-grid-inner')).map(item => {
              return {
                  name: item.querySelector('.a-line-clamp-2')?.textContent.trim(),
                  price: item.querySelector('.a-color-price')?.textContent.trim()
              };
          })
      };
  });

  sendToApi(capturedOrders);
}

function captureSingleOrder() {
  const orderDetails = {
      orderId: document.querySelector('#print-order-number')?.textContent.trim(),
      orderDate: document.querySelector('#print-order-date')?.textContent.trim(),
      totalAmount: document.querySelector('#print-grand-total')?.textContent.trim(),
      items: Array.from(document.querySelectorAll('.print-item-row')).map(item => {
          return {
              name: item.querySelector('.print-item-name')?.textContent.trim(),
              price: item.querySelector('.print-item-price')?.textContent.trim(),
              quantity: item.querySelector('.print-item-quantity')?.textContent.trim()
          };
      })
  };

  sendToApi([orderDetails]);
}

function sendToApi(data) {
  fetch('https://api.doceator.io/feed-monster', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
      alert('モンスターが注文を美味しく食べました！');
  })
  .catch(error => {
      alert('モンスターがお腹を壊してしまいました...もう一度お試しください。');
      console.error('Error:', error);
  });
}

// ページのURLに基づいて適切なボタンを追加
if (window.location.href.includes('https://www.amazon.co.jp/gp/css/order-history')) {
  addCaptureButton('全ての注文をモンスターに食べさせる', captureAllOrders);
} else if (window.location.href.includes('https://www.amazon.co.jp/gp/css/summary/print.html')) {
  addCaptureButton('この注文をモンスターに食べさせる', captureSingleOrder);
}