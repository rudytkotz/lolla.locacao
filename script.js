// ===== SUPABASE =====
const SUPABASE_URL = 'https://bgeybgxyiwektzmgkcdk.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZXliZ3h5aXdla3R6bWdrY2RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3NTE0NjUsImV4cCI6MjEwMDMyNzQ2NX0.7vrmRFuA-QLIohCFbthfrkwiioa79vQ0_sa8Vz4Eeyw';

async function sbFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      'apikey': SUPABASE_ANON,
      'Authorization': `Bearer ${SUPABASE_ANON}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...(options.headers || {})
    }
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// ===== CATEGORIAS =====
const categoryLabels = {
  "mesas": "Mesas & Cadeiras",
  "paineis": "Painéis",
  "pegue-e-monte": "Pegue & Monte",
  "decoracao": "Decoração"
};

// ===== RENDER PRODUTOS =====
async function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  grid.innerHTML = `<div class="loading-products">Carregando catálogo...</div>`;

  let products = [];
  try {
    products = await sbFetch('produtos?select=*&order=ordem.asc,id.asc');
  } catch(e) {
    grid.innerHTML = `<p style="color:#c0392b;grid-column:1/-1;text-align:center">Erro ao carregar produtos. Tente recarregar a página.</p>`;
    return;
  }

  if (!products || products.length === 0) {
    grid.innerHTML = `<p style="color:#6b6b6b;grid-column:1/-1;text-align:center">Nenhum produto disponível no momento.</p>`;
    return;
  }

  grid.innerHTML = products.map(p => {
    const imgHtml = p.image
      ? `<div class="product-img"><img src="${p.image}" alt="${p.name}" /></div>`
      : `<div class="product-img emoji">${p.emoji || '📦'}</div>`;

    const label = categoryLabels[p.category] || p.category;
    const unitEscaped = (p.unit || '').replace(/'/g, "\\'");
    const nameEscaped = (p.name || '').replace(/'/g, "\\'");
    const stock = (p.stock !== null && p.stock !== undefined) ? parseInt(p.stock) : null;
    const stockHtml = stock !== null
      ? `<span class="product-stock ${stock === 0 ? 'out' : ''}">${stock === 0 ? '⚠️ Indisponível' : `📦 ${stock} disponíve${stock === 1 ? 'l' : 'is'}`}</span>`
      : '';
    const addDisabled = stock === 0 ? 'disabled' : '';

    return `
      <div class="product-card" data-category="${p.category}">
        ${imgHtml}
        <div class="product-info">
          <span class="product-tag">${label}</span>
          <h3>${p.name}</h3>
          <p>${p.description || ''}</p>
          ${stockHtml}
          <div class="product-footer">
            <span class="price">R$ ${p.price}<small>${p.unit}</small></span>
            <div class="card-add-row">
              <div class="card-qty">
                <button class="card-qty-btn" onclick="cardQty(this,-1)" ${addDisabled}>−</button>
                <input class="card-qty-input" type="number" value="1" min="1" max="${stock !== null ? stock : 999}" readonly ${addDisabled} />
                <button class="card-qty-btn" onclick="cardQty(this,1)" ${addDisabled}>+</button>
              </div>
              <button class="btn-card" onclick="addToCartFromCard(this,'${nameEscaped}',${p.price},'${unitEscaped}')" ${addDisabled}>${stock === 0 ? 'Indisponível' : 'Adicionar'}</button>
            </div>
          </div>
        </div>
      </div>`;
  }).join('');

  // Reaplica filtro ativo
  const activeFilter = document.querySelector('.filter-btn.active');
  const filter = activeFilter ? activeFilter.dataset.filter : 'todos';
  document.querySelectorAll('.product-card').forEach(card => {
    card.classList.toggle('hidden', filter !== 'todos' && card.dataset.category !== filter);
  });

  // Animação de entrada
  document.querySelectorAll('.product-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    observer.observe(el);
  });
}

// ===== LIGHTBOX =====
function openLightbox(src, caption) {
  const lb = document.getElementById('lightbox');
  document.getElementById('lightboxImg').src = src;
  document.getElementById('lightboxImg').alt = caption;
  document.getElementById('lightboxCaption').textContent = caption;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

document.addEventListener('click', e => {
  const img = e.target.closest('.product-img img');
  if (img) {
    const card = img.closest('.product-card');
    const caption = card ? card.querySelector('h3')?.textContent : '';
    openLightbox(img.src, caption);
  }
});

// ===== CARRINHO DE ORÇAMENTO =====
let cart = [];

function cardQty(btn, delta) {
  const wrapper = btn.closest('.card-qty');
  const input = wrapper.querySelector('.card-qty-input');
  const max = parseInt(input.max) || 999;
  const newVal = Math.min(max, Math.max(1, parseInt(input.value) + delta));
  input.value = newVal;
}

function addToCartFromCard(btn, name, price, unit) {
  const wrapper = btn.closest('.card-add-row');
  const input = wrapper.querySelector('.card-qty-input');
  const qty = Math.max(1, parseInt(input.value) || 1);

  const existing = cart.find(item => item.name === name);
  if (existing) existing.qty += qty;
  else cart.push({ name, price, unit, qty });

  btn.textContent = '✓ Adicionado!';
  btn.classList.add('added');
  setTimeout(() => { btn.textContent = 'Adicionar'; btn.classList.remove('added'); }, 1500);

  input.value = 1;
  updateCartUI();
  showCartBubble(qty);
}

function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  updateCartUI();
}

function changeQty(name, delta) {
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(name);
  else updateCartUI();
}

function updateCartUI() {
  const count = cart.reduce((acc, i) => acc + i.qty, 0);
  const total = cart.reduce((acc, i) => acc + i.qty * i.price, 0);

  const badge = document.getElementById('cartBadge');
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';

  document.getElementById('cartFab').classList.toggle('has-items', count > 0);

  const cartItems  = document.getElementById('cartItems');
  const cartFooter = document.getElementById('cartFooter');
  const cartEmpty  = document.getElementById('cartEmpty');

  if (cart.length === 0) {
    cartEmpty.style.display = 'flex';
    cartItems.style.display = 'none';
    cartFooter.style.display = 'none';
  } else {
    cartEmpty.style.display = 'none';
    cartItems.style.display = 'block';
    cartFooter.style.display = 'block';

    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-info">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')} ${item.unit}</span>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQty('${item.name}', -1)">−</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${item.name}', 1)">+</button>
          <button class="remove-btn" onclick="removeFromCart('${item.name}')" aria-label="Remover">✕</button>
        </div>
      </div>
    `).join('');

    document.getElementById('cartTotal').textContent =
      `R$ ${total.toFixed(2).replace('.', ',')}`;
  }
}

function showCartBubble(qty) {
  const bubble = document.getElementById('cartBubble');
  bubble.textContent = qty > 1 ? `${qty}x adicionado!` : 'Item adicionado!';
  bubble.classList.add('show');
  clearTimeout(window._bubbleTimer);
  window._bubbleTimer = setTimeout(() => bubble.classList.remove('show'), 2200);
}

function openCart() {
  document.getElementById('cartPanel').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
}

function closeCart() {
  document.getElementById('cartPanel').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
}

function sendWhatsApp() {
  if (cart.length === 0) return;
  let msg = 'Olá! Gostaria de solicitar um orçamento pelos itens abaixo:\n\n';
  cart.forEach(item => {
    msg += `• ${item.name} — ${item.qty}x (R$ ${item.price.toFixed(2).replace('.', ',')} ${item.unit})\n`;
  });
  const total = cart.reduce((acc, i) => acc + i.qty * i.price, 0);
  msg += `\n*Total estimado: R$ ${total.toFixed(2).replace('.', ',')}*`;
  msg += '\n\nAguardo confirmação de disponibilidade. Obrigado(a)!';
  window.open(`https://wa.me/5524974050674?text=${encodeURIComponent(msg)}`, '_blank');
}

// ===== HEADER SCROLL =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
});

// ===== MENU MOBILE =====
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('open');
});

function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
}

// ===== FILTRO =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.product-card').forEach(card => {
      card.classList.toggle('hidden', filter !== 'todos' && card.dataset.category !== filter);
    });
  });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  });
});

// ===== ANIMAÇÃO DE ENTRADA =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

// Inicializa
renderProducts();

document.querySelectorAll('.sobre-card, .contato-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  observer.observe(el);
});

document.getElementById('cartOverlay').addEventListener('click', closeCart);
