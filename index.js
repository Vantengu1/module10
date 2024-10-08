const API_URL = 'https://fakestoreapi.com';

// getProducts принимает дополнительные фргументы в виде названия категории товара и если его не укажем, то он будет пустым
async function getProducts(category = '') {
    try {
        //Подготавливаем адрес для запроса
        let url = `${API_URL}/products`;
        //ЕСли категория в которой была указана то меняем адрес на запрос товараб у который есть выбранная категория
        if (category && category !== 'All products') {
            url = `${API_URL}/products/category/${category}`;
        }
        //Выполняем запрос по выбранной категории
        const respons = await fetch(url);
        if (!respons.ok) throw new Error("Network response was not ok")
        const products = await respons.json();
        displayProducts(products);
    } catch (error) {
        showMessage('Error fetching products: ' + error.message, 'error');
    }
}

//Функция для отображения бродукта
function displayProducts(products) {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.innerHTML = `
                    <img src="${product.image}" alt="${product.title}">
                    <h3>${product.title}</h3>
                    <p>$${product.price}</p>
                    <button id="btn-delete" onclick="deleteProduct(${product.id})">DELETE</button>
                `;
        productList.appendChild(productElement);
    });
}

//функция для добавления нового продукта
async function addProduct(e) {
    e.preventDefault();
    const newProduct = {
        title: document.getElementById('productTitle').value,
        price: parseFloat(document.getElementById('productPrice').value),
        description: document.getElementById('productDescription').value,
        category: document.getElementById('productCategory').value
    };

    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct)
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const addedProduct = await response.json();
        showMessage('Product added successfully');
        getProducts();
    } catch (error) {
        showMessage('Error deleting product: ' + error.message, 'error');
    }
}

//функция для сортировки продуктов по категориям
async function sortProduct(products) {
    const sort = {
        category: document.getElementById('sortProduct').value
    }

    try {
        const respons = await fetch(`${API_URL}/products?sort=desc`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productList)
        });
        if (!respons.ok) throw new Error('Network response was not ok');
        const sortedProduct = await respons.json();
        showMessage('Product sorted!');
        getProducts();
    } catch (error) {
        showMessage('Error sorted product: ' + error.message, 'error');
    }
}

async function deleteProduct(id) {
    try {
        const respons = await fetch(`${API_URL}/products/${id}`, {method: 'DELETE'});
        if (!respons.ok) throw new Error('Network response was not ok');
        showMessage('Product deleted');
        getProducts();
    } catch (error) {
        showMessage('Error deleting product: ' + error.message, 'error');
    }
}

function showMessage(message, type = 'success') {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.className = type;
    messageElement.style.display = 'block';
    setTimeout(() => messageElement.style.display = 'none', 3000);
}

//Фильтрация товара
function filterProducts() {
    // Получаем название категории
    const category = document.getElementById('sortProduct').value;
    // Заполняем список товаров и в данную функцию передаем название категории
    getProducts(category);
}


//Отслеживаем событие отправки в кнопке ОПРАВИТЬ
document.getElementById('addProductForm').addEventListener('submit', addProduct);
// Отслеживаем событие смены значения в кнопке сортировки
document.getElementById('sortProduct').addEventListener('change', filterProducts);

sortProduct();
getProducts();
