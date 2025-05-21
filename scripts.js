const loginModal = document.getElementById("loginModal");
const cartSection = document.getElementById("cartSection");
const loginBtn = document.getElementById("loginBtn");
const cartBtn = document.getElementById("cartBtn");
const closeLoginBtn = document.getElementById("closeLoginBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItems = document.getElementById("cartItems");
const totalPrice = document.getElementById("totalPrice");
const cartCount = document.getElementById("cartCount");
const checkoutBtn = document.getElementById("checkoutBtn");

let cart = [];

const components = [
  { id: 1, nombre: "Procesador AMD Ryzen", tipo: "CPU", precio: 250, icono: "⚙️", moneda: "USD" },
  { id: 2, nombre: "Placa Madre ASUS", tipo: "Motherboard", precio: 180, icono: "🔌", moneda: "MXN" },
  { id: 3, nombre: "Memoria RAM 16GB", tipo: "RAM", precio: 90, icono: "💾", moneda: "MXN" },
  { id: 4, nombre: "Fuente 650W", tipo: "PSU", precio: 70, icono: "🔋", moneda: "USD" },
  { id: 5, nombre: "Tarjeta de Video RTX", tipo: "GPU", precio: 400, icono: "🎮", moneda: "USD" },
  { id: 6, nombre: "Placa Incompatible", tipo: "Motherboard", precio: 100, icono: "❌", moneda: "MXN" },
];

const componentContainer = document.getElementById("components");

components.forEach(c => {
  const div = document.createElement("div");
  div.className = "component";
  div.innerHTML = `
    <div class="icon">${c.icono}</div>
    <h3>${c.nombre}</h3>
    <p>$${c.precio} ${c.moneda === "USD" ? "USD" : "MXN"}</p>
    <button onclick='addToCart(${JSON.stringify(c).replace(/"/g, '&quot;')})'>Agregar</button>
  `;
  componentContainer.appendChild(div);
});

function addToCart(comp) {
  cart.push(comp);
  updateCart();
}

function updateCart() {
  cartItems.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    const li = document.createElement('li');
    li.className = 'cart-item';

    const compatibility = checkItemCompatibility(item);
    li.innerHTML = `
      <div class="cart-thumb">${item.icono}</div>
      <div class="cart-info">
        <span class="cart-name">${item.nombre}</span><br>
        <span class="cart-price">$${item.precio} ${item.moneda === "USD" ? "USD" : "MXN"}</span><br>
        <span class="cart-status ${compatibility === 'Compatible' ? 'ok' : 'fail'}">${compatibility}</span>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${item.id})">X</button>
    `;
    cartItems.appendChild(li);
    total += item.precio;
  });
  totalPrice.textContent = total;
  cartCount.textContent = cart.length;
}

function removeFromCart(id) {
  const index = cart.findIndex(c => c.id === id);
  if (index > -1) {
    cart.splice(index, 1);
    updateCart();
  }
}

function checkItemCompatibility(item) {
  if (item.nombre.includes("Incompatible")) return "No compatible";
  return "Compatible";
}

// Stripe Checkout
checkoutBtn.onclick = async () => {
  const stripe = Stripe("pk_test_REEMPLAZA_ESTA_LLAVE_PUBLICA");

  const response = await fetch("https://tu-backend.com/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cart })
  });

  const session = await response.json();
  stripe.redirectToCheckout({ sessionId: session.id });
};

// Mostrar / ocultar modales
loginBtn.onclick = () => loginModal.classList.remove("hidden");
cartBtn.onclick = () => cartSection.classList.remove("hidden");
closeLoginBtn.onclick = () => loginModal.classList.add("hidden");
closeCartBtn.onclick = () => cartSection.classList.add("hidden");
