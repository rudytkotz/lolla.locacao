// ===== DADOS DOS PRODUTOS =====
const defaultProducts = [
  { id: 1, category: "mesas", emoji: "🪑", image: "", name: "Mesa Bistrô Redonda", description: "Mesa bistrô com tampo redondo, perfeita para lounges e coquetéis.", price: 45, unit: "/diária" },
  { id: 2, category: "mesas", emoji: "🪑", image: "", name: "Mesa Posta 6 Lugares", description: "Mesa retangular com toalha inclusa, ideal para 6 pessoas.", price: 120, unit: "/diária" },
  { id: 3, category: "mesas", emoji: "🪑", image: "", name: "Cadeira Tiffany", description: "Cadeira Tiffany transparente, elegante para qualquer tema de festa.", price: 12, unit: "/un/diária" },
  { id: 4, category: "paineis", emoji: "🖼️", image: "", name: "Painel Florido", description: "Painel com flores artificiais 2x2m, ideal para fotos e cenário de festa.", price: 180, unit: "/diária" },
  { id: 5, category: "paineis", emoji: "🖼️", image: "", name: "Painel de Balões", description: "Painel com estrutura para balões coloridos, montado no local do evento.", price: 150, unit: "/diária" },
  { id: 6, category: "paineis", emoji: "🖼️", image: "", name: "Painel Ripado", description: "Painel ripado em madeira clara, estilo rústico chic para qualquer tema.", price: 200, unit: "/diária" },
  { id: 7, category: "pegue-e-monte", emoji: "", image: "fotos/kit1.jpg", name: "Kit Mesa Posta Completa", description: "Toalha, caminho de mesa, porta-guardanapo e vela. Basta montar!", price: 85, unit: "/kit" },
  { id: 8, category: "pegue-e-monte", emoji: "🎀", image: "", name: "Kit Cantinho do Bolo", description: "Mesinha, toalha, faqueiro decorativo e arranjo floral. Pronto para usar!", price: 110, unit: "/kit" },
  { id: 9, category: "pegue-e-monte", emoji: "🎀", image: "", name: "Kit Lounge Externo", description: "Tapete, puff, mesinha de centro e lanternas. Crie um cantinho aconchegante.", price: 220, unit: "/kit" },
  { id: 10, category: "decoracao", emoji: "🎊", image: "", name: "Arranjo de Balões", description: "Arranjo com balões coloridos ou temáticos, entregue inflado no local.", price: 60, unit: "/arranjo" },
  { id: 11, category: "decoracao", emoji: "🎊", image: "", name: "Coluna de Balões", description: "Coluna de balões 1,5m de altura, ideal para entrada ou palco do evento.", price: 90, unit: "/unidade" },
  { id: 12, category: "decoracao", emoji: "🎊", image: "", name: "Varal de Luzes", description: "Varal de luzes LED 5m, cria ambiente intimista e romântico para o evento.", price: 35, unit: "/diária" }
];

const categoryLabels = {
  "mesas": "Mesas & Cadeiras",
  "paineis": "Painéis",
  "pegue-e-monte": "Pegue & Monte",
  "decoracao": "Decoração"
};

function getProducts() {
  try {
    const saved = localStorage.getItem('lolla_products');
    return saved ? JSON.parse(saved) : defaultProducts;
  } catch(e) {
    return defaultProducts;
  }
}

function renderProducts() {
  const products = getProducts();
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  grid.innerHTML = products.map(p => {
    const imgHtml = p.image
      ? `<div class="product-img"><img src="${p.image}" alt="${p.name}" /></div>`
      : `<div class="product-img emoji">${p.emoji || '📦'}</div>`;

    const label = categoryLabels[p.category] || p.category;
    const unitEscaped = p.unit.replace(/'/g, "\\'");
    const nameEscaped = p.name.replace(/'/g, "\\'");

    return `
      <div class="product-card" data-category="${p.category}">
        ${imgHtml}
        <div class="product-info">
          <span class="product-tag">${label}</span>
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <div class="product-footer">
            <span class="price">R$ ${p.price}<small>${p.unit}</small></span>
            <div class="card-add-row">
              <div class="card-qty">
                <button class="card-qty-btn" onclick="cardQty(this,-1)">−</button>
                <input class="card-qty-input" type="number" value="1" min="1" max="999" readonly />
                <button class="card-qty-btn" onclick="cardQty(this,1)">+</button>
              </div>
              <button class="btn-card" onclick="addToCartFromCard(this,'${nameEscaped}',${p.price},'${unitEscaped}')">Adicionar</button>
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

  // Reaplica animação de entrada
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

// Fecha com tecla Esc
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

// Abre lightbox ao clicar em qualquer imagem de produto
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

// Seletor de quantidade no card: incrementa/decrementa o input ao lado do botão clicado
function cardQty(btn, delta) {
  const wrapper = btn.closest('.card-qty');
  const input = wrapper.querySelector('.card-qty-input');
  const newVal = Math.max(1, parseInt(input.value) + delta);
  input.value = newVal;
}

// Lê a quantidade do seletor do card e adiciona ao carrinho
function addToCartFromCard(btn, name, price, unit) {
  const wrapper = btn.closest('.card-add-row');
  const input = wrapper.querySelector('.card-qty-input');
  const qty = Math.max(1, parseInt(input.value) || 1);

  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ name, price, unit, qty });
  }

  // Feedback visual no botão
  btn.textContent = '✓ Adicionado!';
  btn.classList.add('added');
  setTimeout(() => {
    btn.textContent = 'Adicionar';
    btn.classList.remove('added');
  }, 1500);

  // Reseta o seletor para 1
  input.value = 1;

  updateCartUI();
  showCartBubble(qty);
}

function addToCart(name, price, unit, qty = 1) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ name, price, unit, qty });
  }
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

  // Badge
  const badge = document.getElementById('cartBadge');
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';

  // Botão flutuante
  const fab = document.getElementById('cartFab');
  fab.classList.toggle('has-items', count > 0);

  // Conteúdo do painel
  const cartItems = document.getElementById('cartItems');
  const cartFooter = document.getElementById('cartFooter');
  const cartEmpty = document.getElementById('cartEmpty');

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

  const url = `https://wa.me/5524974050674?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

// ===== HEADER SCROLL =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
});

// ===== MENU MOBILE =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
}

// ===== FILTRO DE PRODUTOS =====
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    productCards.forEach(card => {
      if (filter === 'todos' || card.dataset.category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
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

// Renderiza produtos dinamicamente
renderProducts();

// Animação para cards estáticos (sobre, contato)
document.querySelectorAll('.sobre-card, .contato-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  observer.observe(el);
});

// Fecha painel ao clicar fora
document.getElementById('cartOverlay').addEventListener('click', closeCart);
