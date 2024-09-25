const API_URL = 'https://fakestoreapi.com/products';


async function getProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error("...")
        const products = await response.json();
        console.log(products);
    } catch (error) {
        console.log(error.message);
    }
}

getProducts();