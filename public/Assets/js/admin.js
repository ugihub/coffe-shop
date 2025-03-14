const form = document.getElementById('addProductForm');
const productContainer = document.getElementById('productContainer');

// Fetch dan tampilkan daftar produk
function fetchProducts() {
    fetch('http://localhost:5000/api/admin/products')
        .then(response => response.json())
        .then(data => {
            productContainer.innerHTML = ''; // Kosongkan daftar sebelum memuat ulang
            data.forEach(product => {
                const li = document.createElement('li');
                li.classList.add('flex', 'justify-between', 'mb-4', 'items-center');
                li.innerHTML = `
                    <span>${product.name} - ${product.price} IDR</span>
                    <button class="bg-red-500 text-white px-4 py-2 rounded" onclick="deleteProduct('${product._id}')">Delete</button>
                `;
                productContainer.appendChild(li);
            });
        })
        .catch(err => console.error('Error fetching products:', err.message));
}

// Tambahkan produk
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;

    fetch('http://localhost:5000/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, description })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add product');
            }
            return response.json();
        })
        .then(() => {
            form.reset(); // Reset form setelah berhasil
            fetchProducts(); // Refresh daftar produk
        })
        .catch(err => console.error('Error adding product:', err.message));
});

// Hapus produk
function deleteProduct(productId) {
    fetch(`http://localhost:5000/api/admin/products/${productId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete product');
            }
            fetchProducts(); // Refresh daftar produk
        })
        .catch(err => console.error('Error deleting product:', err.message));
}

// Muat daftar produk saat halaman dimuat
fetchProducts();
