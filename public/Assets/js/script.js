const menuContainer = document.getElementById('menu-container');

// MENU SECTION
fetch('http://localhost:5000/api/products')
    .then(response => response.json())
    .then(data => {
        data.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('bg-white', 'shadow-md', 'rounded-md', 'p-4');
            div.innerHTML = `
                <div class="menu-item">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <p>${item.price} IDR</p>
                </div>
            `;
            menuContainer.appendChild(div);
        });
    })
    .catch(err => console.error('Error fetching menu:', err));


// Fungsi untuk menambahkan produk ke keranjang
function addToCart(productId) {
    fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert(data.message); // Notifikasi berhasil
            location.reload(); // Refresh halaman untuk memperbarui tampilan keranjang
        })
        .catch(err => console.error('Error adding to cart:', err.message));
}

function updateCart(orderId, newQuantity) {
    fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Jika respons sukses, panggil fetchCart() untuk memperbarui tampilan keranjang
            fetchCart();
        })
        .catch(err => console.error('Error updating cart:', err.message));
}



function fetchCart() {
    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = ''; // Kosongkan kontainer keranjang sebelum memuat ulang

    fetch('http://localhost:5000/api/orders')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            data.forEach(order => {
                if (!order.productId) {
                    console.warn('Order has null productId:', order); // Debugging jika ada null productId
                    return;
                }

                const div = document.createElement('div');
                div.classList.add('bg-white', 'shadow-md', 'rounded-md', 'p-4');
                div.innerHTML = `
                    <h3 class="text-lg font-bold">${order.productId.name}</h3>
                    <p class="text-gray-600">Price: ${order.productId.price} IDR</p>
                    <div class="flex items-center mt-4">
                        <button class="bg-red-500 text-white px-3 py-1 rounded-md" onclick="updateCart('${order._id}', ${order.quantity - 1})">-</button>
                        <p class="mx-4">${order.quantity}</p>
                        <button class="bg-green-500 text-white px-3 py-1 rounded-md" onclick="updateCart('${order._id}', ${order.quantity + 1})">+</button>
                    </div>
                `;
                cartContainer.appendChild(div);
            });
        })
        .catch(err => console.error('Error fetching cart:', err.message));
}


fetchCart(); // Ambil data keranjang saat halaman dimuat


