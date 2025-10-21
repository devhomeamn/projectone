console.log("✅ add-section.js loaded");

const API_BASE = "http://localhost:5000/api/sections";

async function fetchSections() {
  try {
    console.log("📡 Fetching sections...");
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const sectionSelect = document.getElementById('sectionSelect');
    const sectionList = document.getElementById('sectionList');
    sectionSelect.innerHTML = '';
    sectionList.innerHTML = '';

    data.forEach(sec => {
      const opt = document.createElement('option');
      opt.value = sec.id;
      opt.textContent = sec.name;
      sectionSelect.appendChild(opt);

      const subs = sec.Subcategories?.map(sub => `<li>${sub.name}</li>`).join('') || '';
      sectionList.innerHTML += `
        <div class="section-block">
          <h4>${sec.name}</h4>
          <ul>${subs}</ul>
        </div>`;
    });
  } catch (err) {
    console.error("❌ fetchSections error:", err);
    alert("Server error — check if backend is running!");
  }
}

// Add new Section
document.getElementById('sectionForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('sectionName').value;
  const description = document.getElementById('sectionDesc').value;

  try {
    const res = await fetch(`${API_BASE}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await res.json();

    e.target.reset();
    fetchSections();
  } catch (err) {
    console.error("❌ addSection error:", err);
  }
});

// Add Subcategory
document.getElementById('subForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const sectionId = document.getElementById('sectionSelect').value;
  const name = document.getElementById('subName').value;

  try {
    const res = await fetch(`${API_BASE}/add-sub`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sectionId, name })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await res.json();

    e.target.reset();
    fetchSections();
  } catch (err) {
    console.error("❌ addSubcategory error:", err);
  }
});

// Logout function
function logout() {
  localStorage.clear();
  window.location.href = 'login.html';
}

// On load
fetchSections();
