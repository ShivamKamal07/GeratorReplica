let allDevices = [];
let filteredDevices = [];
let displayed = 6;

const grid = document.querySelector('.device-grid');
const loadMoreBtn = document.getElementById('loadMoreBtn');

const brandFilter = document.getElementById('brandFilter');
const categoryFilter = document.getElementById('categoryFilter');
const minPrice = document.getElementById('minPrice');
const maxPrice = document.getElementById('maxPrice');
const applyFilterBtn = document.getElementById('applyFilter');
const sortSelect = document.getElementById('sortSelect');

// Fetch data
fetch('data.json')
  .then(response => response.json())
  .then(data => {
      allDevices = data;
      filteredDevices = [...allDevices];
      renderDevices(filteredDevices.slice(0, displayed));
  });

// Render devices
function renderDevices(devices) {
    grid.innerHTML = '';
    devices.forEach(device => {
        const card = document.createElement('div');
        card.classList.add('device-card');
        card.innerHTML = `
            <img src="${device.image}" alt="${device.name}">
            <h3>${device.name}</h3>
            <p>Brand: ${device.brand}</p>
            <p>Category: ${device.category}</p>
            <p>Price: $${device.price}</p>
        `;
        grid.appendChild(card);
    });

    loadMoreBtn.style.display = devices.length < filteredDevices.length ? 'block' : 'none';
}

// Load more
loadMoreBtn.addEventListener('click', () => {
    const nextDevices = filteredDevices.slice(displayed, displayed + 6);
    nextDevices.forEach(device => {
        const card = document.createElement('div');
        card.classList.add('device-card');
        card.innerHTML = `
            <img src="${device.image}" alt="${device.name}">
            <h3>${device.name}</h3>
            <p>Brand: ${device.brand}</p>
            <p>Category: ${device.category}</p>
            <p>Price: $${device.price}</p>
        `;
        grid.appendChild(card);
    });
    displayed += 6;
    if(displayed >= filteredDevices.length) loadMoreBtn.style.display = 'none';
});

// Apply filters
applyFilterBtn.addEventListener('click', () => {
    const brand = brandFilter.value;
    const category = categoryFilter.value;
    const min = minPrice.value ? parseInt(minPrice.value) : 0;
    const max = maxPrice.value ? parseInt(maxPrice.value) : Infinity;

    filteredDevices = allDevices.filter(device => {
        return (brand ? device.brand === brand : true) &&
               (category ? device.category === category : true) &&
               (device.price >= min && device.price <= max);
    });

    displayed = 6;
    sortDevices(sortSelect.value);
});

// Sort devices
sortSelect.addEventListener('change', () => {
    sortDevices(sortSelect.value);
});

function sortDevices(criteria) {
    if(criteria === 'price') {
        filteredDevices.sort((a,b) => a.price - b.price);
    } else if(criteria === 'popularity') {
        filteredDevices.sort((a,b) => b.popularity - a.popularity);
    } else if(criteria === 'newest') {
        filteredDevices.sort((a,b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    }

    renderDevices(filteredDevices.slice(0, displayed));
}
