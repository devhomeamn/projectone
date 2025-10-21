console.log("✅ view-record.js loaded");

const API_BASE = "http://localhost:5000/api";
let allRecords = [];

// ============= FETCH RECORDS =============
async function fetchRecords() {
  const res = await fetch(`${API_BASE}/records`);
  const data = await res.json();
  allRecords = data;
  renderTable(allRecords);
}

// ============= RENDER TABLE =============
function renderTable(records) {
  const tbody = document.querySelector('#recordTable tbody');
  tbody.innerHTML = '';

  if (!records.length) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;">No records found</td></tr>`;
    return;
  }

  records.forEach(rec => {
    const tr = document.createElement('tr');
    const sectionName = rec.Section ? rec.Section.name : '-';
    const subName = rec.Subcategory ? rec.Subcategory.name : '-';
    const statusClass = rec.is_moved_to_central ? 'central' : 'section';
    const statusText = rec.is_moved_to_central ? 'Moved to Central' : 'In Section';

    tr.innerHTML = `
      <td>${rec.id}</td>
      <td>${rec.file_name}</td>
      <td>${sectionName}</td>
      <td>${subName}</td>
      <td>${rec.rack_no}</td>
      <td>${rec.added_by}</td>
      <td><span class="status ${statusClass}">${statusText}</span></td>
      <td>
        ${rec.is_moved_to_central
          ? '—'
          : `<button class="btn-move" onclick="moveToCentral(${rec.id})">🏛 Move</button>`}
      </td>
    `;
    // 🪟 On click show modal
    tr.addEventListener('click', (e) => {
      if (e.target.tagName !== 'BUTTON') showDetails(rec);
    });
    tbody.appendChild(tr);
  });
}

// ============= SEARCH =============
document.getElementById('searchInput').addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = allRecords.filter(r =>
    r.file_name.toLowerCase().includes(term) ||
    (r.Section && r.Section.name.toLowerCase().includes(term)) ||
    r.rack_no.toLowerCase().includes(term)
  );
  renderTable(filtered);
});

// ============= MOVE TO CENTRAL =============
async function moveToCentral(id) {
  if (!confirm("Move this record to Central Record Room?")) return;
  const res = await fetch(`${API_BASE}/records/move/${id}`, { method: 'PUT' });
  const data = await res.json();
  alert(data.message || 'Updated!');
  fetchRecords();
}

// ============= EXPORT TO CSV =============
function exportToCSV() {
  if (!allRecords.length) return alert("No records to export!");
  const headers = ['ID','File Name','Section','Subcategory','Rack No','Added By','Status'];
  const rows = allRecords.map(r => [
    r.id,
    r.file_name,
    r.Section ? r.Section.name : '',
    r.Subcategory ? r.Subcategory.name : '',
    r.rack_no,
    r.added_by,
    r.is_moved_to_central ? 'Moved to Central' : 'In Section'
  ]);
  let csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'records_export.csv';
  link.click();
}

// ============= MODAL: Show Details =============
function showDetails(rec) {
  const modal = document.getElementById('recordModal');
  const body = document.getElementById('modalBody');

  body.innerHTML = `
    <p><strong>File Name:</strong> ${rec.file_name}</p>
    <p><strong>Section:</strong> ${rec.Section ? rec.Section.name : '-'}</p>
    <p><strong>Subcategory:</strong> ${rec.Subcategory ? rec.Subcategory.name : '-'}</p>
    <p><strong>Rack No:</strong> ${rec.rack_no}</p>
    <p><strong>Description:</strong> ${rec.description || '-'}</p>
    <p><strong>Added By:</strong> ${rec.added_by}</p>
    <p><strong>Status:</strong> ${rec.is_moved_to_central ? 'Moved to Central' : 'In Section'}</p>
    <p><strong>Created At:</strong> ${new Date(rec.createdAt).toLocaleString()}</p>
  `;

  modal.style.display = 'flex';
}

function closeModal() {
  document.getElementById('recordModal').style.display = 'none';
}

// ============= LOGOUT =============
function logout() {
  localStorage.clear();
  window.location.href = 'login.html';
}

// ============= INIT =============
document.addEventListener('DOMContentLoaded', () => {
  const userInfo = document.getElementById('userInfo');
  if (userInfo) userInfo.textContent = `Logged in as: ${localStorage.getItem('email') || 'Unknown User'}`;
  fetchRecords();
});
