(() => {
  const tbody = document.getElementById('manage-table-body');
  if (!tbody) return;
  const state = { page: 1, pageSize: 5, search: '', status: '', editId: null };
  const form = document.getElementById('manage-form');
  const fields = ['id','title','author','category','isbn','stock','status'].reduce((acc,k)=> (acc[k]=document.getElementById(`book-${k}`),acc),{});
  function resetForm(){ state.editId=null; form.reset(); fields.status.value='active'; document.getElementById('form-title').textContent='Nuevo libro'; document.getElementById('manage-submit-btn').textContent='Guardar'; }
  function getData(){ return window.booksStore.filter(b => (!state.search || `${b.title} ${b.author}`.toLowerCase().includes(state.search.toLowerCase())) && (!state.status || b.status===state.status)); }
  function render(){ const data=getData(); const totalPages=Math.max(1,Math.ceil(data.length/state.pageSize)); if(state.page>totalPages) state.page=totalPages; const rows=data.slice((state.page-1)*state.pageSize,state.page*state.pageSize); tbody.innerHTML=rows.map((b)=>`<tr><td>${b.id}</td><td>${b.title}</td><td>${b.author}</td><td>${b.stock}</td><td>${window.badgeForStatus(b.status)}</td><td class="d-flex gap-1"><button class="btn btn-sm btn-outline-primary" data-action="edit" data-id="${b.id}">Editar</button><button class="btn btn-sm btn-outline-warning" data-action="toggle" data-id="${b.id}">${b.status==='active'?'Baja':'Alta'}</button></td></tr>`).join('');
    const pg=document.getElementById('manage-pagination'); pg.innerHTML=''; for(let i=1;i<=totalPages;i++) pg.insertAdjacentHTML('beforeend', `<li class="page-item ${i===state.page?'active':''}"><button class="page-link" data-page="${i}">${i}</button></li>`);
  }
  form.addEventListener('submit', (e)=>{ e.preventDefault(); const payload = { title:fields.title.value.trim(),author:fields.author.value.trim(),category:fields.category.value.trim(),isbn:fields.isbn.value.trim(),stock:Number(fields.stock.value),status:fields.status.value }; if(!payload.title||!payload.author||!payload.category||payload.stock<0) return;
    if(state.editId){ const item=window.booksStore.find(b=>b.id===state.editId); Object.assign(item,payload); }
    else { window.booksStore.push({ id: Math.max(0,...window.booksStore.map(b=>b.id))+1, ...payload, createdAt: new Date().toISOString().slice(0,10)}); }
    resetForm(); render();
  });
  document.getElementById('manage-cancel-btn').addEventListener('click', resetForm);
  document.getElementById('manage-search').addEventListener('input', (e)=>{ state.search=e.target.value; state.page=1; render(); });
  document.getElementById('manage-status-filter').addEventListener('change', (e)=>{ state.status=e.target.value; state.page=1; render(); });
  tbody.addEventListener('click', (e)=>{ const btn=e.target.closest('button[data-id]'); if(!btn) return; const id=Number(btn.dataset.id); const item=window.booksStore.find(b=>b.id===id); if(btn.dataset.action==='edit'){ state.editId=id; fields.title.value=item.title; fields.author.value=item.author; fields.category.value=item.category; fields.isbn.value=item.isbn; fields.stock.value=item.stock; fields.status.value=item.status; document.getElementById('form-title').textContent=`Editar libro #${id}`; document.getElementById('manage-submit-btn').textContent='Actualizar'; } else { item.status=item.status==='active'?'inactive':'active'; render(); } });
  document.getElementById('manage-pagination').addEventListener('click', (e)=>{ const btn=e.target.closest('button[data-page]'); if(!btn) return; state.page=Number(btn.dataset.page); render(); });
  resetForm(); render();
})();
