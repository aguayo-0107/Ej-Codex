(() => {
  const tbody = document.getElementById('books-table-body');
  if (!tbody) return;
  const state = { page: 1, pageSize: 5, title: '', author: '', is_borrowed: '', sort: 'title-asc', data: [] };
  const controls = {
    title: document.getElementById('books-title'),
    author: document.getElementById('books-author'),
    status: document.getElementById('books-status'),
    sort: document.getElementById('books-sort')
  };

  const applySort = (arr) => [...arr].sort((a, b) => state.sort === 'title-desc' ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title));

  function render() {
    const data = applySort(state.data);
    const totalPages = Math.max(1, Math.ceil(data.length / state.pageSize));
    if (state.page > totalPages) state.page = totalPages;
    const pageData = data.slice((state.page - 1) * state.pageSize, state.page * state.pageSize);
    tbody.innerHTML = pageData.length ? pageData.map((b) => `<tr><td>${b.title}</td><td>${b.author}</td><td>${b.publication_date}</td><td>${b.quantity}</td><td>${window.badgeForBorrowStatus(b.is_borrowed)}</td><td>${b.id}</td></tr>`).join('') : '<tr><td colspan="6" class="text-center text-secondary py-4">No hay resultados.</td></tr>';
    document.getElementById('books-total-label').textContent = `Mostrando ${pageData.length} de ${data.length} resultados`;
    const pg = document.getElementById('books-pagination');
    pg.innerHTML = '';
    for (let i = 1; i <= totalPages; i += 1) pg.insertAdjacentHTML('beforeend', `<li class="page-item ${i === state.page ? 'active' : ''}"><button class="page-link" data-page="${i}">${i}</button></li>`);
  }

  async function loadData() {
    const filters = { title: state.title, author: state.author };
    if (state.is_borrowed !== '') filters.is_borrowed = state.is_borrowed;
    try {
      state.data = await window.booksApi.getBooks(filters);
      render();
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-danger text-center py-4">${err.message}</td></tr>`;
    }
  }

  Object.values(controls).forEach((el) => el.addEventListener('input', async () => {
    state.page = 1;
    state.title = controls.title.value.trim();
    state.author = controls.author.value.trim();
    state.is_borrowed = controls.status.value;
    state.sort = controls.sort.value;
    await loadData();
  }));

  document.getElementById('books-clear-filters').addEventListener('click', async () => {
    controls.title.value = ''; controls.author.value = ''; controls.status.value = ''; controls.sort.value = 'title-asc';
    state.page = 1; state.title = ''; state.author = ''; state.is_borrowed = ''; state.sort = 'title-asc';
    await loadData();
  });

  document.getElementById('books-pagination').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-page]'); if (!btn) return;
    state.page = Number(btn.dataset.page); render();
  });

  loadData();
})();
