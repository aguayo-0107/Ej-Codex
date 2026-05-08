const booksStore = [...(window.MOCK_BOOKS || [])];
const badgeForStatus = (status) => status === 'active'
  ? '<span class="badge text-bg-success">Activo</span>'
  : '<span class="badge text-bg-secondary">Inactivo</span>';
document.querySelectorAll('#footer-year').forEach((el) => { el.textContent = new Date().getFullYear(); });

if (document.getElementById('kpi-total')) {
  const total = booksStore.length;
  const available = booksStore.filter((b) => b.status === 'active').length;
  const inactive = total - available;
  document.getElementById('kpi-total').textContent = total;
  document.getElementById('kpi-available').textContent = available;
  document.getElementById('kpi-inactive').textContent = inactive;
  document.getElementById('latest-books-grid').innerHTML = booksStore.slice(-4).reverse().map((b) => `
    <div class="col-md-6 col-lg-3"><div class="card card-clean p-3 h-100"><div class="book-cover mb-2"></div><h3 class="h6 mb-1">${b.title}</h3><p class="small text-secondary mb-2">${b.author}</p>${badgeForStatus(b.status)}</div></div>
  `).join('');
}
window.booksStore = booksStore;
window.badgeForStatus = badgeForStatus;


const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-bs-theme', theme);
  const btn = document.getElementById('theme-toggle');
  if (btn) {
    const isDark = theme === 'dark';
    btn.textContent = isDark ? '☀️ Modo claro' : '🌙 Modo oscuro';
    btn.classList.toggle('btn-outline-light', isDark);
    btn.classList.toggle('btn-outline-secondary', !isDark);
  }
};

const initThemeToggle = () => {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-bs-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', next);
    applyTheme(next);
  });
};

initThemeToggle();
