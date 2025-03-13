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
