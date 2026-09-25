const whatsappNumber = '265998502637';

function whatsappUrl(message) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function installSharedNavbar() {
  const nav = document.querySelector('.main-nav, .navbar');
  if (!nav) return;
  const isDetailPage = window.location.pathname.includes('/tool%20usage/') || window.location.pathname.includes('/tool usage/');
  const prefix = isDetailPage ? '../' : '';
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const links = [
    ['Home', `${prefix}index.html`, page === 'index.html' || page === ''],
    ['Tools', `${prefix}tools.html`, page === 'tools.html' || isDetailPage],
    ['Prices', `${prefix}prices.html`, page === 'prices.html'],
    ['Rent a Tool', `${prefix}rent-tool.html`, page === 'rent-tool.html' || page === 'rent.html'],
    ['Contact Us', `${prefix}contact.html`, page === 'contact.html']
  ];
  nav.classList.add('main-nav', 'navbar');
  nav.setAttribute('aria-label', 'Main navigation');
  nav.innerHTML = links.map(([label, href, active]) => `<a${active ? ' class="current active"' : ''} href="${href}">${label}</a>`).join('');
}

function addFloatingWhatsappButton() {
  if (document.querySelector('.whatsapp')) return;
  const button = document.createElement('a');
  button.className = 'whatsapp';
  button.href = whatsappUrl('Hello REND, I need help with a tool.');
  button.target = '_blank';
  button.rel = 'noopener noreferrer';
  button.setAttribute('aria-label', 'Chat with REND on WhatsApp');
  button.innerHTML = '<i class="fab fa-whatsapp"></i>';
  document.body.appendChild(button);
}

function addRendMeButtons() {
  document.querySelectorAll('.price-grid .tool-card').forEach((card) => {
    if (card.querySelector('.rend-me')) return;
    const tool = card.querySelector('h3')?.textContent.trim();
    if (!tool) return;
    const button = document.createElement('a');
    button.className = 'rend-me';
    button.href = whatsappUrl(`Hello REND, I would like to rent ${tool}. Please confirm availability and rental details.`);
    button.target = '_blank';
    button.rel = 'noopener noreferrer';
    button.textContent = 'Rend me ↗';
    card.appendChild(button);
  });
}

function removeAskPriceButtons() {
  document.querySelectorAll('.ask-price').forEach((button) => button.remove());
}

installSharedNavbar();
addFloatingWhatsappButton();
addRendMeButtons();
removeAskPriceButtons();

document.querySelectorAll('.tool-card').forEach((card) => {
  if (card.querySelector('.latest-version')) return;
  const badge = document.createElement('span');
  badge.className = 'latest-version';
  badge.innerHTML = '<i></i> Latest version';
  const toolName = card.querySelector('h3');
  if (toolName) toolName.appendChild(badge);
});

document.querySelectorAll('.detail-panel').forEach((panel) => {
  if (panel.querySelector('.detail-chipsets')) return;
  const chipsetBlock = document.createElement('div');
  chipsetBlock.className = 'detail-chipsets';
  chipsetBlock.innerHTML = '<span class="mono">SUPPORTED CHIPSETS</span><h2>Common phone<br />chipset families</h2><p>Support varies by tool, model, and software version. Ask us to confirm the exact chipset before use.</p><ul class="chipset-list"><li>Qualcomm Snapdragon</li><li>MediaTek Helio / Dimensity</li><li>Samsung Exynos</li><li>Unisoc / Spreadtrum</li></ul>';
  panel.appendChild(chipsetBlock);
});

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav, .navbar');
if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

document.querySelectorAll('.main-nav a, .navbar a').forEach((link) => link.addEventListener('click', () => {
  mainNav?.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

const filterButtons = document.querySelectorAll('.filter-button');
const toolCards = document.querySelectorAll('.tool-grid .tool-card');
const searchToggle = document.querySelector('.search-toggle');
const searchInput = document.querySelector('#tool-search-input');
function applyToolFilters() {
  const active = document.querySelector('.filter-button.active')?.dataset.filter || 'all';
  const search = searchInput?.value.trim().toLowerCase() || '';
  toolCards.forEach((card) => {
    const hidden = (active !== 'all' && card.dataset.category !== active) || (search && !card.textContent.toLowerCase().includes(search));
    card.hidden = hidden;
    card.classList.toggle('search-hidden', hidden);
  });
}
filterButtons.forEach((button) => button.addEventListener('click', () => {
  filterButtons.forEach((item) => item.classList.remove('active'));
  button.classList.add('active');
  applyToolFilters();
}));
if (searchToggle && searchInput) {
  searchToggle.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('tool-search-open');
    searchToggle.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) searchInput.focus();
    else { searchInput.value = ''; applyToolFilters(); }
  });
  ['input', 'keyup', 'search'].forEach((event) => searchInput.addEventListener(event, applyToolFilters));
}

document.querySelectorAll('.tool-card[data-page]').forEach((card) => {
  const openDetails = (event) => {
    if (event.target.closest('a, button')) return;
    window.location.href = card.dataset.page;
  };
  card.addEventListener('click', openDetails);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openDetails(event);
    }
  });
});

const availableCount = document.querySelector('#available-count');
const unavailableCount = document.querySelector('#unavailable-count');
function updateAvailableCount() {
  if (availableCount) availableCount.textContent = document.querySelectorAll('.tool-grid .tool-status.available').length;
  if (unavailableCount) unavailableCount.textContent = document.querySelectorAll('.tool-grid .tool-status.unavailable').length;
}
updateAvailableCount();

const rentalForm = document.querySelector('#rental-form');
const rentalStatus = document.querySelector('#rental-status');
rentalForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const tool = new FormData(rentalForm).get('tool') || 'a tool';
  if (rentalStatus) rentalStatus.textContent = `Thanks, we’ve got your request for ${tool}. We’ll be in touch soon.`;
  window.open(whatsappUrl(`Hello REND, I would like to request ${tool}.`), '_blank', 'noopener');
  rentalForm.reset();
});

document.querySelectorAll('.footer-links a').forEach((link) => {
  if (link.textContent.trim() === 'Visit GSM XPAND online') link.href = 'https://www.gsmxpand.unaux.com';
});
