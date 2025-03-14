const form = document.getElementById('addProductForm');
const productContainer = document.getElementById('productContainer');
const tokenModal = document.getElementById('tokenModal');
const adminContent = document.getElementById('adminContent');
const submitTokenButton = document.getElementById('submitToken');
const errorMessage = document.getElementById('errorMessage');

// Token valid
const validToken = 'your-admin-token'; // Ganti dengan token yang sesuai

// Cek token saat pengguna memasuki halaman
submitTokenButton.addEventListener('click', () => {
    const enteredToken = document.getElementById('adminToken').value;

    if (enteredToken === validToken) {
        tokenModal.classList.add('hidden'); // Sembunyikan modal
        adminContent.classList.remove('hidden'); // Tampilkan konten admin
    } else {
        errorMessage.classList.remove('hidden'); // Tampilkan pesan error
    }
});

// Fungsi untuk memuat daftar produk
function fetchProducts() {
    fetch('http://localhost:5000/api/products', {
        headers: {
            'Authorization': `Bearer ${validToken}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            return response.json();
        })
        .then(data => {
            productContainer.innerHTML = ''; // Bersihkan kontainer sebelum memuat ulang
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
        .catch(err => alert('Error fetching products: ' + err.message));
}

// Fungsi untuk menambahkan produk
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;

    fetch('http://localhost:5000/api/admin/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${validToken}`
        },
        body: JSON.stringify({ name, price, description })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add product');
            }
            return response.json();
        })
        .then(() => {
            alert('Product added successfully!');
            form.reset(); // Reset form setelah sukses
            fetchProducts(); // Refresh daftar produk
        })
        .catch(err => alert('Error adding product: ' + err.message));
});

// Fungsi untuk menghapus produk
function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    fetch(`http://localhost:5000/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${validToken}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete product');
            }
            alert('Product deleted successfully!');
            fetchProducts(); // Refresh daftar produk
        })
        .catch(err => alert('Error deleting product: ' + err.message));
}

// Muat daftar produk saat halaman dimuat
fetchProducts();
