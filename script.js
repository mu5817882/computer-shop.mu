const products = [
  { id: 1, name: "Gaming Desktop PC", desc: "RTX 4060 | 16GB RAM | 1TB SSD", price: 1850, category: "desktop", icon: "\uD83D\uDDA5\uFE0F", rating: 4.9 },
  { id: 2, name: "Office Desktop PC", desc: "Core i5 | 8GB RAM | 512GB SSD", price: 920, category: "desktop", icon: "\uD83D\uDDBB\uFE0F", rating: 4.7 },
  { id: 3, name: "Gaming Laptop", desc: "RTX 4070 | 32GB RAM | 2TB SSD", price: 2400, category: "laptop", icon: "\uD83D\uDCBB", rating: 4.8 },
  { id: 4, name: "Business Laptop", desc: "Core i7 | 16GB RAM | 1TB SSD", price: 1350, category: "laptop", icon: "\uD83D\uDCBE", rating: 4.6 },
  { id: 5, name: "Graphics Card", desc: "RTX 4070 Super | 12GB GDDR6X", price: 1250, category: "gpu", icon: "\uD83C\uDFAE", rating: 4.9 },
  { id: 6, name: "Processor", desc: "Core i9 | 24 Cores | Up to 5.6GHz", price: 780, category: "cpu", icon: "\u2699\uFE0F", rating: 4.8 },
  { id: 7, name: "Mechanical Keyboard", desc: "RGB | Hot-swappable switches", price: 120, category: "accessory", icon: "\u2328\uFE0F", rating: 4.7 },
  { id: 8, name: "Gaming Mouse", desc: "26K DPI | 8 programmable buttons", price: 85, category: "accessory", icon: "\uD83D\uDC09", rating: 4.8 },
  { id: 9, name: "27\" Monitor", desc: "QHD | 165Hz | 1ms | IPS", price: 420, category: "accessory", icon: "\uD83D\uDCFA", rating: 4.9 },
  { id: 10, name: "RGB Headset", desc: "7.1 Surround | Noise cancelling mic", price: 95, category: "accessory", icon: "\uD83C\uDFA7", rating: 4.6 },
  { id: 11, name: "Crypto Mining GPU", desc: "AMD RX 7800 XT | 16GB", price: 980, category: "gpu", icon: "\uD83E\uDDE0", rating: 4.5 },
  { id: 12, name: "Ultrabook Laptop", desc: "Core i5 | 8GB RAM | 512GB | 1.1kg", price: 890, category: "laptop", icon: "\uD83D\uDCF1", rating: 4.5 }
];

let cart = {};
let activeFilter = "all";

const grid = document.getElementById("productsGrid");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartOverlay = document.getElementById("cartOverlay");
const toast = document.getElementById("toast");

function renderProducts() {
  const list = activeFilter === "all" ? products : products.filter(p => p.category === activeFilter);
  grid.innerHTML = list.map(p => `
    <div class="product-card" data-category="${p.category}">
      <div class="product-img">${p.icon}</div>
      <div class="product-body">
        <h3>${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-meta">
          <span class="price">$${p.price.toLocaleString()}</span>
          <span class="rating">&#9733; ${p.rating}</span>
        </div>
        <button class="add-btn" onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    </div>
  `).join("");
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  updateCartUI();
  showToast("Added to cart");
}

function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart();
  updateCartUI();
}

function removeItem(id) {
  delete cart[id];
  saveCart();
  updateCartUI();
}

function cartList() {
  return Object.keys(cart).map(id => {
    const p = products.find(x => x.id === Number(id));
    return { product: p, qty: cart[id] };
  });
}

function cartTotalValue() {
  return cartList().reduce((sum, item) => sum + item.product.price * item.qty, 0);
}

function updateCartUI() {
  const count = cartList().reduce((s, i) => s + i.qty, 0);
  cartCount.textContent = count;

  const items = cartList();
  if (items.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
  } else {
    cartItems.innerHTML = items.map(({ product, qty }) => `
      <div class="cart-item">
        <div class="thumb">${product.icon}</div>
        <div class="cart-item-info">
          <h4>${product.name}</h4>
          <p>$${product.price.toLocaleString()}</p>
        </div>
        <div class="cart-qty">
          <button class="qty-btn" onclick="changeQty(${product.id}, -1)">&#8722;</button>
          <span>${qty}</span>
          <button class="qty-btn" onclick="changeQty(${product.id}, 1)">+</button>
        </div>
        <button class="cart-remove" onclick="removeItem(${product.id})">&times;</button>
      </div>
    `).join("");
  }

  cartTotal.textContent = "$" + cartTotalValue().toLocaleString();
}

function saveCart() {
  localStorage.setItem("usmanCart", JSON.stringify(cart));
}

function loadCart() {
  try {
    cart = JSON.parse(localStorage.getItem("usmanCart")) || {};
  } catch (e) {
    cart = {};
  }
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 2200);
}

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    renderProducts();
  });
});

document.getElementById("cartBtn").addEventListener("click", () => cartOverlay.classList.add("open"));
document.getElementById("cartClose").addEventListener("click", () => cartOverlay.classList.remove("open"));
cartOverlay.addEventListener("click", e => {
  if (e.target === cartOverlay) cartOverlay.classList.remove("open");
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  const items = cartList();
  if (items.length === 0) {
    showToast("Your cart is empty");
    return;
  }
  cart = {};
  saveCart();
  updateCartUI();
  cartOverlay.classList.remove("open");
  showToast("Order placed! We'll contact you soon.");
});

document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  e.target.reset();
  showToast("Message sent! Thank you.");
});

document.getElementById("menuToggle").addEventListener("click", () => {
  document.querySelector(".nav-links").classList.toggle("open");
});

grid.addEventListener("mousemove", e => {
  const card = e.target.closest(".product-card");
  if (!card) return;
  const r = card.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width - 0.5;
  const py = (e.clientY - r.top) / r.height - 0.5;
  card.style.transform =
    "perspective(900px) rotateX(" + (-py * 10).toFixed(2) + "deg) rotateY(" + (px * 10).toFixed(2) + "deg) translateZ(12px)";
});

grid.addEventListener("mouseleave", () => {
  grid.querySelectorAll(".product-card").forEach(c => {
    c.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  });
});

renderProducts();
loadCart();
updateCartUI();
