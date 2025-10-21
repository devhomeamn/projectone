console.log("✅ add-record.js loaded");

const API_BASE = "http://localhost:5000/api";

// ================== LOAD SECTIONS ==================
async function loadSections() {
  try {
    const res = await fetch(`${API_BASE}/sections`);
    const data = await res.json();

    const sectionSelect = document.getElementById('section_id');
    const subSelect = document.getElementById('subcategory_id');

    // Reset options
    sectionSelect.innerHTML = '<option value="">-- Select Section --</option>';
    subSelect.innerHTML = '<option value="">-- Select Subcategory --</option>';

    // Populate sections
    data.forEach(sec => {
      const opt = document.createElement('option');
      opt.value = sec.id;
      opt.textContent = sec.name;
      sectionSelect.appendChild(opt);
    });

    // When section changes, populate subcategories
    sectionSelect.addEventListener('change', () => {
      const selected = data.find(s => s.id == sectionSelect.value);
      subSelect.innerHTML = '<option value="">-- Select Subcategory --</option>';

      if (selected && selected.Subcategories) {
        selected.Subcategories.forEach(sub => {
          const opt = document.createElement('option');
          opt.value = sub.id;
          opt.textContent = sub.name;
          subSelect.appendChild(opt);
        });
      }
    });
  } catch (err) {
    console.error("❌ Error loading sections:", err);
    alert("Failed to load sections — please check your backend.");
  }
}

// ================== ADD RECORD ==================
document.getElementById('recordForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const file_name = document.getElementById('file_name').value.trim();
  const section_id = document.getElementById('section_id').value;
  const subcategory_id = document.getElementById('subcategory_id').value;
  const rack_no = document.getElementById('rack_no').value.trim();
  const description = document.getElementById('description').value.trim();

  // Get current logged user (from login)
  const added_by = localStorage.getItem('email') || 'Unknown User';

  if (!file_name || !section_id || !rack_no) {
    alert("⚠️ Please fill in all required fields.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/records/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file_name,
        section_id,
        subcategory_id,
        rack_no,
        description,
        added_by
      })
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Record Added Successfully!");
      e.target.reset();
    } else {
      alert(`❌ Failed to Add Record: ${data.error || 'Unknown error'}`);
    }
  } catch (err) {
    console.error("❌ addRecord error:", err);
    alert("Server error while adding record!");
  }
});

// ================== LOGOUT ==================
function logout() {
  localStorage.clear();
  window.location.href = 'login.html';
}

// ================== INITIALIZE ==================
document.addEventListener('DOMContentLoaded', () => {
  // show current user email
  const userInfo = document.getElementById('userInfo');
  if (userInfo) {
    userInfo.textContent = `Logged in as: ${localStorage.getItem('email') || 'Unknown User'}`;
  }

  loadSections();
});
