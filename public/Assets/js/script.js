const menuContainer = document.getElementById('menu-container');

fetch('http://localhost:5000/api/products')
    .then(response => response.json())
    .then(data => {
        data.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('bg-white', 'shadow-md', 'rounded-md', 'p-4');
            div.innerHTML = `
                <h3 class="text-lg font-bold">${item.name}</h3>
                <p class="text-gray-600">${item.description}</p>
                <p class="text-yellow-500 font-semibold">${item.price} IDR</p>
            `;
            menuContainer.appendChild(div);
        });
    })
    .catch(err => console.error('Error fetching menu:', err));


// CART SECTION
fetch('http://localhost:5000/api/products')
    .then(response => response.json())
    .then(data => {
        data.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('bg-white', 'shadow-md', 'rounded-md', 'p-4');
            div.innerHTML = `
                <h3 class="text-lg font-bold">${item.name}</h3>
                <p class="text-gray-600">${item.description}</p>
                <p class="text-yellow-500 font-semibold">${item.price} IDR</p>
                <button class="bg-blue-500 text-white px-4 py-2 rounded-md mt-4" onclick="addToCart('${item._id}')">Add to Cart</button>
            `;
            menuContainer.appendChild(div);
        });
    })
    .catch(err => console.error('Error fetching menu:', err));

// Fungsi untuk menambahkan produk ke keranjang
function addToCart(productId) {
    fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, quantity: 1 })
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message); // Notifikasi berhasil
        })
        .catch(err => console.error('Error adding to cart:', err));
}

function fetchCart() {
    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = ''; // Kosongkan kontainer terlebih dahulu

    fetch('http://localhost:5000/api/orders')
        .then(response => response.json())
        .then(data => {
            data.forEach(order => {
                const div = document.createElement('div');
                div.classList.add('bg-white', 'shadow-md', 'rounded-md', 'p-4');
                div.innerHTML = `
                    <h3 class="text-lg font-bold">${order.productId.name}</h3>
                    <p class="text-gray-600">Quantity: ${order.quantity}</p>
                    <p class="text-yellow-500 font-semibold">${order.productId.price} IDR</p>
                `;
                cartContainer.appendChild(div);
            });
        })
        .catch(err => console.error('Error fetching cart:', err));
}

// Panggil fetchCart() setiap kali halaman dimuat
fetchCart();
