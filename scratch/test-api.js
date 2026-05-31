async function test() {
  try {
    const url = 'http://localhost:5000/api/v1/products?title=asas';
    console.log('Testing URL:', url);
    const response = await fetch(url);
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Results:', data.results);
    console.log('Products:', data.data.products.map(p => `${p.title} (${p.price})`));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
