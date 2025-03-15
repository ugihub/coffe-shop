const form = document.getElementById('addProductForm');
const productContainer = document.getElementById('productContainer');
const passwordModal = document.getElementById('passwordModal');
const adminContent = document.getElementById('adminContent');
const submitPasswordButton = document.getElementById('submitPassword');
const errorMessage = document.getElementById('errorMessage');
const loadingIndicator = document.getElementById('loadingIndicator');

// Sembunyikan loading indicator saat awal
loadingIndicator.style.display = 'none';

// Variabel untuk menyimpan password yang valid
let validPassword = null;

// Fungsi untuk menampilkan loading
function showLoading() {
    loadingIndicator.style.display = 'block';
}

// Fungsi untuk menyembunyikan loading
function hideLoading() {
    loadingIndicator.style.display = 'none';
}

// Handler submit password
submitPasswordButton.addEventListener('click', async () => {
    const enteredPassword = document.getElementById('adminPassword').value.trim();

    try {
        showLoading();

        const response = await fetch('/api/admin/verify-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: enteredPassword })
        });

        if (response.ok) {
            validPassword = enteredPassword;
            passwordModal.classList.add('hidden');
            adminContent.classList.remove('hidden');
            fetchProducts();
        } else {
            throw new Error('Invalid password');
        }
    } catch (err) {
        errorMessage.classList.remove('hidden');
        errorMessage.textContent = "Password salah. Coba lagi!";
    } finally {
        hideLoading();
    }
});

// Fungsi helper untuk request dengan auth
const fetchWithAuth = (url, options = {}) => {
    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': validPassword
        }
    });
};

// Fungsi untuk memuat produk
async function fetchProducts() {
    if (!validPassword) return;

    try {
        const response = await fetchWithAuth('/api/admin/products');
        const products = await response.json();
        console.log('Received products:', products); // Tambahkan log
        renderProducts(products);
    } catch (err) {
        console.error(err);
        alert('Terjadi kesalahan saat memuat produk');
    } finally {
        hideLoading();
    }
}

// Fungsi format mata uang
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(amount || 0); // Tambahkan nilai default 0
}

// Fungsi untuk render produk
function renderProducts(products) {
    if (!products || products.length === 0) {
        productContainer.innerHTML = '<p class="text-center">Tidak ada produk</p>';
        return;
    }
    console.log('Rendering products:', products); // Debug log
    productContainer.innerHTML = products.map(item => `
        <li class="flex justify-between mb-4 items-center p-4 border rounded">
            <div class="flex items-center">
        <img 
            src="${item.imageUrl}" 
            alt="${item.name}"
            onerror="this.src='/placeholder.jpg'"
            class="w-20 h-20 mr-4 object-cover rounded"
        >
                <div>
                    <h3 class="font-bold">${item.name || 'No Name'}</h3>
                    <p>Harga: ${formatCurrency(item.price)}</p>
                    <p class="text-sm text-gray-600">${item.description || '-'}</p>
                </div>
            </div>
            <button onclick="deleteProduct('${item._id}')" 
                    class="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded">
                Hapus
            </button>
        </li>
    `).join('');
}

// Handler form tambah produk
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validPassword) {
        alert('Anda harus login terlebih dahulu');
        return;
    }

    const formData = new FormData();
    formData.append('name', form.name.value);
    formData.append('price', form.price.value);
    formData.append('description', form.description.value);
    formData.append('image', form.image.files[0]);

    try {
        showLoading();
        const response = await fetchWithAuth('/api/admin/products', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Gagal menambahkan produk');

        form.reset();
        await fetchProducts();
        alert('Produk berhasil ditambahkan!');
    } catch (err) {
        console.error(err);
        alert('Terjadi kesalahan saat menambahkan produk');
    } finally {
        hideLoading();
    }
});

// Fungsi hapus produk
async function deleteProduct(productId) {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;

    try {
        showLoading();
        const response = await fetchWithAuth(`/api/admin/products/${productId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Gagal menghapus produk');

        await fetchProducts();
        alert('Produk berhasil dihapus!');
    } catch (err) {
        console.error(err);
        alert('Terjadi kesalahan saat menghapus produk');
    } finally {
        hideLoading();
    }
}