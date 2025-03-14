const form = document.getElementById('addProductForm');
const productContainer = document.getElementById('productContainer');
const passwordModal = document.getElementById('passwordModal');
const adminContent = document.getElementById('adminContent');
const submitPasswordButton = document.getElementById('submitPassword');
const errorMessage = document.getElementById('errorMessage');

// Sandi admin yang dimasukkan pengguna
let adminPassword = null;

// Cek sandi saat pengguna memasuki halaman
submitPasswordButton.addEventListener('click', () => {
    const enteredPassword = document.getElementById('adminPassword').value;

    fetch('http://localhost:5000/api/admin/products', {
        method: 'GET',
        headers: {
            'Authorization': enteredPassword
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Invalid password');
            }
            passwordModal.classList.add('hidden');
            adminContent.classList.remove('hidden');
        })
        .catch(() => {
            adminPassword = null;
            errorMessage.innerText = "Invalid password. Please check your input!";
            errorMessage.classList.remove('hidden');
        });
});

// Fungsi untuk memuat daftar produk
function fetchProducts() {
    const enteredPassword = document.getElementById('adminPassword').value;

    fetch('http://localhost:5000/api/admin/products', {
        headers: {
            'Authorization': enteredPassword
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch products. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched products:', data); // Debug log
            productContainer.innerHTML = ''; // Bersihkan kontainer
            data.forEach(product => {
                const li = document.createElement('li');
                li.classList.add('flex', 'justify-between', 'mb-4', 'items-center');
                li.innerHTML = `
                    <div class="flex items-center">
                        ${product.image
                        ? `<img src="${product.image}" alt="${product.name}" class="w-16 h-16 mr-4 rounded">`
                        : `<span class="w-16 h-16 mr-4 bg-gray-300 flex items-center justify-center text-gray-500 rounded">No Image</span>`}
                        <span>${product.name} - ${product.price} IDR</span>
                    </div>
                    <button class="bg-red-500 text-white px-4 py-2 rounded" onclick="deleteProduct('${product._id}')">Delete</button>
                `;
                productContainer.appendChild(li);
            });
        })
        .catch(err => alert(`Error fetching products: ${err.message}`));
}

// Fungsi untuk menambahkan produk
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const enteredPassword = document.getElementById('adminPassword').value;
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;
    const image = document.getElementById('image').files[0]; // Ambil file gambar

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('image', image); // Tambahkan file gambar ke FormData

    fetch('http://localhost:5000/api/admin/products', {
        method: 'POST',
        headers: {
            'Authorization': enteredPassword
        },
        body: formData // Kirim data dalam bentuk FormData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add product');
            }
            return response.json();
        })
        .then(() => {
            alert('Product added successfully!');
            form.reset(); // Reset form setelah berhasil
            fetchProducts(); // Refresh daftar produk
        })
        .catch(err => alert('Error adding product: ' + err.message));
});


// Fungsi untuk menghapus produk
function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const enteredPassword = document.getElementById('adminPassword').value;

    fetch(`http://localhost:5000/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': enteredPassword
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
