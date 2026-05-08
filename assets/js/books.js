(() => {
  const tbody = document.getElementById('books-table-body');
  if (!tbody) return;
  const state = { page: 1, pageSize: 5, search: '', category: '', status: '', sort: 'title-asc' };
  const controls = {
    search: document.getElementById('books-search'), category: document.getElementById('books-category'), status: document.getElementById('books-status'), sort: document.getElementById('books-sort')
  };
  [...new Set(window.booksStore.map((b) => b.category))].forEach((cat) => controls.category.insertAdjacentHTML('beforeend', `<option value="${cat}">${cat}</option>`));
  function filtered() {
    let data = [...window.booksStore];
    if (state.search) data = data.filter((b) => `${b.title} ${b.author}`.toLowerCase().includes(state.search.toLowerCase()));
    if (state.category) data = data.filter((b) => b.category === state.category);
    if (state.status) data = data.filter((b) => b.status === state.status);
    data.sort((a,b)=> state.sort === 'title-desc' ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title));
    return data;
  }
  function render() {
    const data = filtered();
    const totalPages = Math.max(1, Math.ceil(data.length / state.pageSize));
    if (state.page > totalPages) state.page = totalPages;
    const pageData = data.slice((state.page-1)*state.pageSize, state.page*state.pageSize);
    tbody.innerHTML = pageData.length ? pageData.map((b)=>`<tr><td>${b.title}</td><td>${b.author}</td><td>${b.category}</td><td>${b.stock}</td><td>${window.badgeForStatus(b.status)}</td><td><button class="btn btn-sm btn-outline-primary">Ver</button></td></tr>`).join('') : '<tr><td colspan="6" class="text-center text-secondary py-4">No hay resultados.</td></tr>';
    document.getElementById('books-total-label').textContent = `Mostrando ${pageData.length} de ${data.length} resultados`;
    const pg = document.getElementById('books-pagination');
    pg.innerHTML = '';
    for (let i=1;i<=totalPages;i++) pg.insertAdjacentHTML('beforeend', `<li class="page-item ${i===state.page?'active':''}"><button class="page-link" data-page="${i}">${i}</button></li>`);
  }
  Object.values(controls).forEach((el) => el.addEventListener('input', () => { state.page = 1; state.search = controls.search.value; state.category = controls.category.value; state.status = controls.status.value; state.sort = controls.sort.value; render(); }));
  document.getElementById('books-clear-filters').addEventListener('click', () => { controls.search.value=''; controls.category.value=''; controls.status.value=''; controls.sort.value='title-asc'; state.page=1; state.search=''; state.category=''; state.status=''; state.sort='title-asc'; render(); });
  document.getElementById('books-pagination').addEventListener('click', (e)=>{ const btn = e.target.closest('button[data-page]'); if(!btn) return; state.page = Number(btn.dataset.page); render(); });
  render();
})();
