const badgeForBorrowStatus = (isBorrowed) => isBorrowed
  ? '<span class="badge text-bg-warning">Prestado</span>'
  : '<span class="badge text-bg-success">Disponible</span>';

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

const renderHome = async () => {
  if (!document.getElementById('kpi-total')) return;
  try {
    const books = await window.booksApi.getBooks();
    const total = books.length;
    const borrowed = books.filter((b) => b.is_borrowed).length;
    const available = total - borrowed;
    document.getElementById('kpi-total').textContent = total;
    document.getElementById('kpi-available').textContent = available;
    document.getElementById('kpi-inactive').textContent = borrowed;
    document.getElementById('latest-books-grid').innerHTML = books.slice(-4).reverse().map((b) => `
      <div class="col-md-6 col-lg-3"><div class="card card-clean p-3 h-100"><div class="book-cover mb-2"></div><h3 class="h6 mb-1">${b.title}</h3><p class="small text-secondary mb-2">${b.author}</p>${badgeForBorrowStatus(b.is_borrowed)}</div></div>
    `).join('');
  } catch (err) {
    document.getElementById('latest-books-grid').innerHTML = `<p class="text-danger">No se pudo cargar: ${err.message}</p>`;
  }
};

document.querySelectorAll('#footer-year').forEach((el) => { el.textContent = new Date().getFullYear(); });
window.badgeForBorrowStatus = badgeForBorrowStatus;
initThemeToggle();
renderHome();
