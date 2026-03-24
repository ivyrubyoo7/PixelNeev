// ===============================
// PixelNeev Profile Page Logic
// ===============================

// Dummy project data (later connect to backend)
const projects = [
  { img: "https://picsum.photos/400?1", type: "project" },
  { img: "https://picsum.photos/400?2", type: "project" },
  { img: "https://picsum.photos/400?3", type: "project" },
  { img: "https://picsum.photos/400?4", type: "saved" },
  { img: "https://picsum.photos/400?5", type: "saved" },
  { img: "https://picsum.photos/400?6", type: "tagged" }
];

// ===============================
// RENDER GRID
// ===============================
function renderGrid(type = "project") {
  const grid = document.querySelector(".profile-grid");
  grid.innerHTML = "";

  const filtered = projects.filter(p => p.type === type);

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="color: gray;">No items found</p>`;
    return;
  }

  filtered.forEach((p) => {
    grid.innerHTML += `
      <div class="grid-item">
        <img src="${p.img}" onclick="openProject('${p.img}')">
      </div>
    `;
  });
}

// ===============================
// TAB SWITCHING
// ===============================
const tabs = document.querySelectorAll(".tab");

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    
    // Remove active
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    // Switch content
    if (index === 0) renderGrid("project");
    if (index === 1) renderGrid("saved");
    if (index === 2) renderGrid("tagged");
  });
});

// ===============================
// OPEN PROJECT (Modal style basic)
// ===============================
function openProject(img) {
  alert("Open project preview 🚀\n\nImage: " + img);
}

// ===============================
// HIGHLIGHT CLICK
// ===============================
document.querySelectorAll(".highlight").forEach((item, index) => {
  item.addEventListener("click", () => {
    alert("Opening highlight #" + (index + 1));
  });
});

// ===============================
// INIT
// ===============================
renderGrid();