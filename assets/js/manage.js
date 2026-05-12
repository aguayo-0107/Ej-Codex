(() => {
  const tbody = document.getElementById('manage-table-body');
  if (!tbody) return;
  const state = { page: 1, pageSize: 5, search: '', status: '', editId: null, data: [] };
  const form = document.getElementById('manage-form');
  const alertBox = document.getElementById('manage-alert');
  const fields = ['id', 'title', 'author', 'publication_date', 'image_url', 'quantity', 'is_borrowed'].reduce((acc, k) => (acc[k] = document.getElementById(`book-${k}`), acc), {});

  const showAlert = (msg, type = 'danger') => { alertBox.innerHTML = `<div class="alert alert-${type} py-2 mb-2">${msg}</div>`; };
  const clearAlert = () => { alertBox.innerHTML = ''; };
  function resetForm() { state.editId = null; form.reset(); fields.is_borrowed.value = 'false'; document.getElementById('form-title').textContent = 'Nuevo libro'; document.getElementById('manage-submit-btn').textContent = 'Guardar'; }

  const filtered = () => state.data.filter((b) => (!state.search || `${b.title} ${b.author}`.toLowerCase().includes(state.search.toLowerCase())) && (state.status === '' || String(b.is_borrowed) === state.status));

  function render() {
    const data = filtered();
    const totalPages = Math.max(1, Math.ceil(data.length / state.pageSize));
    if (state.page > totalPages) state.page = totalPages;
    const rows = data.slice((state.page - 1) * state.pageSize, state.page * state.pageSize);
    tbody.innerHTML = rows.map((b) => `<tr><td>${b.id}</td><td>${b.title}</td><td>${b.author}</td><td>${b.quantity}</td><td>${window.badgeForBorrowStatus(b.is_borrowed)}</td><td class="d-flex gap-1"><button class="btn btn-sm btn-outline-primary" data-action="edit" data-id="${b.id}">Editar</button><button class="btn btn-sm btn-outline-warning" data-action="toggle" data-id="${b.id}">${b.is_borrowed ? 'Marcar disponible' : 'Marcar prestado'}</button><button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${b.id}">Eliminar</button></td></tr>`).join('');
    const pg = document.getElementById('manage-pagination'); pg.innerHTML = ''; for (let i = 1; i <= totalPages; i += 1) pg.insertAdjacentHTML('beforeend', `<li class="page-item ${i === state.page ? 'active' : ''}"><button class="page-link" data-page="${i}">${i}</button></li>`);
  }

  async function loadData() { state.data = await window.booksApi.getBooks(); render(); }

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); clearAlert();
    const payload = {
      title: fields.title.value.trim(), author: fields.author.value.trim(), publication_date: fields.publication_date.value,
      image_url: fields.image_url.value.trim() || null, is_borrowed: fields.is_borrowed.value === 'true', quantity: Number(fields.quantity.value)
    };
    if (!payload.title || !payload.author || !payload.publication_date || Number.isNaN(payload.quantity)) return showAlert('Completa todos los campos requeridos');
    try {
      if (state.editId) await window.booksApi.updateBook(state.editId, payload);
      else await window.booksApi.createBook(payload);
      resetForm(); await loadData(); showAlert('Guardado correctamente', 'success');
    } catch (err) { showAlert(err.message); }
  });

  document.getElementById('manage-cancel-btn').addEventListener('click', resetForm);
  document.getElementById('manage-search').addEventListener('input', (e) => { state.search = e.target.value; state.page = 1; render(); });
  document.getElementById('manage-status-filter').addEventListener('change', (e) => { state.status = e.target.value; state.page = 1; render(); });
  tbody.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-id]'); if (!btn) return;
    const id = Number(btn.dataset.id);
    const item = state.data.find((b) => b.id === id);
    try {
      if (btn.dataset.action === 'edit') {
        state.editId = id; fields.id.value = id; fields.title.value = item.title; fields.author.value = item.author; fields.publication_date.value = item.publication_date;
        fields.image_url.value = item.image_url || ''; fields.quantity.value = item.quantity; fields.is_borrowed.value = String(item.is_borrowed);
        document.getElementById('form-title').textContent = `Editar libro #${id}`;
        document.getElementById('manage-submit-btn').textContent = 'Actualizar';
      } else if (btn.dataset.action === 'toggle') await window.booksApi.changeStatus(id, !item.is_borrowed);
      else if (btn.dataset.action === 'delete') await window.booksApi.deleteBook(id);
      await loadData();
    } catch (err) { showAlert(err.message); }
  });
  document.getElementById('manage-pagination').addEventListener('click', (e) => { const btn = e.target.closest('button[data-page]'); if (!btn) return; state.page = Number(btn.dataset.page); render(); });
  resetForm(); loadData().catch((err) => showAlert(err.message));
})();
