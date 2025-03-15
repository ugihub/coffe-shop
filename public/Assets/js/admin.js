// admin.js
const form = document.getElementById('addProductForm');
const productContainer = document.getElementById('productContainer');
const passwordModal = document.getElementById('passwordModal');
const adminContent = document.getElementById('adminContent');
const submitPasswordButton = document.getElementById('submitPassword');
const errorMessage = document.getElementById('errorMessage');
const loadingIndicator = document.getElementById('loadingIndicator');

// Sembunyikan loading indicator saat awal
loadingIndicator.style.display = 'none';

// Fungsi untuk menampilkan loading
function showLoading() {
    loadingIndicator.style.display = 'block';
}

// Fungsi untuk menyembunyikan loading
function hideLoading() {
    loadingIndicator.style.display = 'none';
}

// Simpan password yang valid di memory (tidak disimpan di localStorage)
let validPassword = null;

// submit
submitPasswordButton.addEventListener('click', async () => {
    const enteredPassword = document.getElementById('adminPassword').value;

    try {
        const response = await fetch('/api/admin/verify-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password: enteredPassword })
        });

        if (response.status === 200) {
            validPassword = enteredPassword;
            passwordModal.classList.add('hidden');
            adminContent.classList.remove('hidden');
            fetchProducts();
        } else {
            throw new Error('Invalid password');
        }
    } catch (err) {
        console.error(err);
        errorMessage.textContent = "Invalid password. Please try again!";
        errorMessage.classList.remove('hidden');
    }
});

// Fungsi helper untuk request dengan header authorization
const fetchWithAuth = (url, options = {}) => {
    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': validPassword // Pastikan password valid disimpan
        }
    });
};

// Fungsi untuk memuat daftar produk
async function fetchProducts() {
    if (!authToken) return;

    showLoading();
    try {
        const response = await fetch('http://localhost:5000/api/admin/products', {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (!response.ok) {
            if (response.status === 401) {
                logout();
                return;
            }
            throw new Error('Gagal memuat produk');
        }

        const products = await response.json();
        renderProducts(products);
    } catch (err) {
        console.error(err);
        alert(`Error: ${err.message}`);
    } finally {
        hideLoading();
    }
}

// Fungsi untuk render daftar produk
function renderProducts(products) {
    productContainer.innerHTML = products.map(product => `
        <li class="flex justify-between mb-4 items-center p-4 border rounded">
            <div class="flex items-center">
                <img src="${product.imageUrl}" 
                     alt="${product.name}" 
                     class="w-20 h-20 mr-4 object-cover rounded"
                     onerror="this.src='/placeholder.jpg'">
                <div>
                    <h3 class="font-bold">${product.name}</h3>
                    <p>Harga: ${formatCurrency(product.price)}</p>
                    <p class="text-sm text-gray-600">${product.description}</p>
                </div>
            </div>
            <button onclick="deleteProduct('${product._id}')" 
                    class="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded">
                Hapus
            </button>
        </li>
    `).join('');
}

// Fungsi untuk format mata uang
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(amount);
}

// Handler form tambah produk
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!authToken) {
        alert('Anda harus login terlebih dahulu');
        return;
    }

    const formData = new FormData();
    formData.append('name', form.name.value);
    formData.append('price', form.price.value);
    formData.append('description', form.description.value);
    formData.append('image', form.image.files[0]);

    showLoading();

    try {
        const response = await fetch('http://localhost:5000/api/admin/products', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Gagal menambahkan produk');
        }

        form.reset();
        await fetchProducts();
        alert('Produk berhasil ditambahkan!');
    } catch (err) {
        console.error(err);
        alert(`Error: ${err.message}`);
    } finally {
        hideLoading();
    }
});

// Fungsi untuk hapus produk
async function deleteProduct(productId) {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;

    showLoading();

    try {
        const response = await fetch(
            `http://localhost:5000/api/admin/products/${productId}`,
            {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` }
            }
        );

        if (!response.ok) throw new Error('Gagal menghapus produk');

        await fetchProducts();
        alert('Produk berhasil dihapus!');
    } catch (err) {
        console.error(err);
        alert(`Error: ${err.message}`);
    } finally {
        hideLoading();
    }
}

// Fungsi logout
function logout() {
    localStorage.removeItem('adminAuthToken');
    authToken = null;
    adminContent.classList.add('hidden');
    passwordModal.classList.remove('hidden');
}