const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav, .navbar');
const filterButtons = document.querySelectorAll('.filter-button');
const toolCards = document.querySelectorAll('.tool-card');
const searchToggle = document.querySelector('.search-toggle');
const searchInput = document.querySelector('#tool-search-input');
const rentalForm = document.querySelector('#rental-form');
const rentalStatus = document.querySelector('#rental-status');
const toolSelect = document.querySelector('#tool-select');
const modal = document.querySelector('#rental-modal');
const modalToolName = document.querySelector('#modal-tool-name');
const modalAction = document.querySelector('#modal-action');
const modalClose = document.querySelector('.modal-close');
const availableCount = document.querySelector('#available-count');
const unavailableCount = document.querySelector('#unavailable-count');
const detailCards = document.querySelectorAll('.tool-card[data-page]');
const whatsappNumber = '265998502637';

function whatsappUrl(message) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function addFloatingWhatsappButton() {
  if (document.querySelector('.whatsapp')) return;
  const button = document.createElement('a');
  button.className = 'whatsapp';
  button.href = 'https://wa.me/265998502637';
  button.target = '_blank';
  button.rel = 'noopener noreferrer';
  button.setAttribute('aria-label', 'Chat with REND on WhatsApp');
  button.innerHTML = '<i class="fab fa-whatsapp"></i>';
  document.body.appendChild(button);
}

function installSharedNavbar() {
  const nav = document.querySelector('.main-nav, .navbar');
  if (!nav) return;

  const prefix = nav.closest('.site-header')?.querySelector('.brand')?.getAttribute('href')?.startsWith('../') ? '../' : '';
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const links = [
    ['Home', `${prefix}index.html`, page === 'index.html' || page === ''],
    ['Tools', `${prefix}tools.html`, page === 'tools.html' || page.startsWith('tool-')],
    ['Prices', `${prefix}prices.html`, page === 'prices.html'],
    ['Rent a Tool', `${prefix}rent.html`, page === 'rent.html' || page === 'rent-tool.html'],
    ['Contact Us', `${prefix}contact.html`, page === 'contact.html']
  ];

  nav.classList.add('main-nav', 'navbar');
  nav.setAttribute('aria-label', 'Main navigation');
  nav.innerHTML = links.map(([label, href, active]) => `<a${active ? ' class="current"' : ''} href="${href}">${label}</a>`).join('');
}

installSharedNavbar();
addFloatingWhatsappButton();

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
  chipsetBlock.innerHTML = `<span class="mono">SUPPORTED CHIPSETS</span><h2>Common phone<br />chipset families</h2><p>Support varies by tool, model, and software version. Ask us to confirm the exact chipset before use.</p><ul class="chipset-list"><li>Qualcomm Snapdragon</li><li>MediaTek Helio / Dimensity</li><li>Samsung Exynos</li><li>Unisoc / Spreadtrum</li></ul>`;
  panel.appendChild(chipsetBlock);
});

document.querySelectorAll('.tool-card').forEach((card) => {
  const meta = card.querySelector('.tool-meta');
  const toolName = card.querySelector('h3')?.textContent.trim();
  if (!meta || !toolName || meta.querySelector('.ask-price')) return;
  const askPrice = document.createElement('a');
  askPrice.className = 'ask-price';
  askPrice.href = whatsappUrl(`Hello REND, how much is ${toolName} for rent and how long will it be in use or valid?`);
  askPrice.target = '_blank';
  askPrice.rel = 'noopener noreferrer';
  askPrice.textContent = 'Ask price';
  const rentLink = meta.querySelector('a[href="rent-tool.html"]');
  if (rentLink) meta.insertBefore(askPrice, rentLink);
});

detailCards.forEach((card) => {
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

function updateAvailableCount() {
  if (!availableCount && !unavailableCount) return;
  if (availableCount) availableCount.textContent = document.querySelectorAll('.tool-card .tool-status.available').length;
  if (unavailableCount) unavailableCount.textContent = document.querySelectorAll('.tool-card .tool-status.unavailable').length;
}
updateAvailableCount();

if (availableCount || unavailableCount) {
  const grid = document.querySelector('#tool-grid');
  if (grid) new MutationObserver(updateAvailableCount).observe(grid, { subtree: true, attributes: true, attributeFilter: ['class'] });
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

document.querySelectorAll('.main-nav a, .navbar a').forEach((link) => {
  link.addEventListener('click', () => {
    if (mainNav && menuToggle) {
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

function applyToolFilters() {
  const activeFilter = document.querySelector('.filter-button.active')?.dataset.filter || 'all';
  const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
  toolCards.forEach((card) => {
    const shouldHide = (activeFilter !== 'all' && card.dataset.category !== activeFilter) || (searchTerm && !card.textContent.toLowerCase().includes(searchTerm));
    card.hidden = shouldHide;
    card.classList.toggle('search-hidden', shouldHide);
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

document.querySelectorAll('[data-tool]').forEach((link) => link.addEventListener('click', (event) => {
  if (!modal || !toolSelect || !modalToolName) return;
  event.preventDefault();
  modalToolName.textContent = link.dataset.tool;
  toolSelect.value = link.dataset.tool;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}));

function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}
if (modalClose && modal) {
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
}
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });
if (modalAction) modalAction.addEventListener('click', (event) => { event.preventDefault(); closeModal(); });

if (rentalForm) rentalForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const tool = new FormData(rentalForm).get('tool');
  if (rentalStatus) rentalStatus.textContent = `Thanks, we’ve got your request for ${tool || 'your tool'}. We’ll be in touch soon.`;
  window.open(whatsappUrl(`Hello REND, I would like to request ${tool || 'a tool rental'}.`), '_blank', 'noopener');
  rentalForm.reset();
});

document.querySelectorAll('.footer-links a').forEach((link) => {
  if (link.textContent.trim() === 'Visit GSM XPAND online') link.href = 'https://www.gsmxpand.unaux.com';
});
