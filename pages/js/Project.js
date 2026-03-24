import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ⚠️ Paste your config from Firebase Console here
const firebaseConfig = {
  apiKey: "AIzaSyDKs7xgTGLb1y5Vjy7lzEv4IQhUqBFfAJc",
  authDomain: "pixelneev.firebaseapp.com",
  projectId: "pixelneev",
  storageBucket: "pixelneev.firebasestorage.app",
  messagingSenderId: "80609130066",
  appId: "1:80609130066:web:79fa789bd34aef1edd118b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Keep a local copy of projects for quick searching
let currentProjects = [];
let currentUser = null;

// ===============================
// AUTHENTICATION LISTENER
// ===============================
// This fires automatically when the page loads to check if someone is logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    loadUserProjects(user.uid);
  } else {
    currentUser = null;
    document.getElementById("projectGrid").innerHTML = `<p style="color: gray;">Please log in to view your projects.</p>`;
  }
});

// ===============================
// LOAD PROJECTS (Real-time)
// ===============================
function loadUserProjects(uid) {
  const projectsRef = collection(db, "projects");
  
  // Query: Only get projects where authorId matches the logged-in user
  const q = query(projectsRef, where("authorId", "==", uid), orderBy("timestamp", "desc"));

  onSnapshot(q, (snapshot) => {
    currentProjects = snapshot.docs.map(doc => ({
      id: doc.id, // Store the Firestore Document ID
      ...doc.data()
    }));
    renderProjects(currentProjects);
  }, (error) => {
    console.error("Error fetching projects:", error);
    // Note: If you get a "requires an index" error in the console, click the link Firebase provides in the console to auto-create the index!
  });
}

// ===============================
// RENDER PROJECTS
// ===============================
function renderProjects(list) {
  const grid = document.getElementById("projectGrid");
  grid.innerHTML = "";

  if (list.length === 0) {
    grid.innerHTML = `<p style="color: gray;">No projects found. Create your first one!</p>`;
    return;
  }

  list.forEach((p) => {
    // Safely handle missing data
    const projectData = p.project || {}; 
    const techList = projectData.tech || [];
    
    const techHTML = techList.map(t => `<span class="tech-badge">${t.label || t}</span>`).join("");
    const status = p.status || "draft";

    // Notice we attach data-id to the card so the buttons know which document to target
    grid.innerHTML += `
      <div class="card" data-id="${p.id}">
        <span class="status ${status}">${capitalize(status)}</span>
        <img src="${projectData.img || 'https://via.placeholder.com/400x200'}" onerror="this.src='https://via.placeholder.com/400x200'" />
        
        <div class="card-content">
          <h3>${projectData.title || 'Untitled'}</h3>
          <p style="font-size: 0.8rem; color: var(--color-text-muted);">
            ${projectData.description || 'No description provided.'}
          </p>
          <div class="card-tech">${techHTML}</div>
        </div>

        <div class="card-actions">
          <button class="action-btn" data-action="view">View</button>
          <button class="action-btn" data-action="edit">Edit</button>
          <button class="action-btn" data-action="delete" style="color: #ef4444; border-color: #ef4444;">Delete</button>
        </div>
      </div>
    `;
  });
}

// ===============================
// ADD PROJECT
// ===============================
async function addProject() {
  if (!currentUser) return alert("Must be logged in!");

  const title = prompt("Project name:");
  if (!title) return;
  const desc = prompt("Project description:");
  const techInput = prompt("Tech stack (comma separated):");
  const techArray = techInput ? techInput.split(",").map(t => t.trim()) : [];

  try {
    await addDoc(collection(db, "projects"), {
      authorId: currentUser.uid, // The crucial link!
      status: "draft",
      timestamp: serverTimestamp(),
      user: {
        username: currentUser.displayName || "Developer",
        email: currentUser.email
      },
      project: {
        title: title,
        description: desc || "",
        tech: techArray,
        views: 0,
        likes: 0
      }
    });
  } catch (err) {
    alert("Error adding project: " + err.message);
  }
}

// ===============================
// EVENT DELEGATION (Clicks & Search)
// ===============================
// Attach Add Project button
document.querySelector(".actions button:first-child").addEventListener("click", addProject);

// Attach Search functionality
document.getElementById("searchInput").addEventListener("input", (e) => {
  const queryText = e.target.value.toLowerCase();
  const filtered = currentProjects.filter(p => 
    (p.project?.title || "").toLowerCase().includes(queryText)
  );
  renderProjects(filtered);
});

// Handle View, Edit, Delete clicks dynamically
document.getElementById("projectGrid").addEventListener("click", async (e) => {
  if (!e.target.classList.contains("action-btn")) return;
  
  const action = e.target.dataset.action;
  const card = e.target.closest(".card");
  const docId = card.dataset.id;
  
  // Find the full project object from our local array
  const p = currentProjects.find(proj => proj.id === docId);

  if (action === "delete") {
    if (confirm("Delete this project permanently?")) {
      await deleteDoc(doc(db, "projects", docId));
    }
  } 
  
  else if (action === "edit") {
    const newTitle = prompt("Edit name:", p.project.title);
    if (!newTitle) return;
    const newDesc = prompt("Edit description:", p.project.description);
    
    // Update exactly that document in the cloud
    await updateDoc(doc(db, "projects", docId), {
      "project.title": newTitle,
      "project.description": newDesc
    });
  }
  
  else if (action === "view") {
    alert(`📌 ${p.project.title}\n\n📝 ${p.project.description}\n\n🚀 Status: ${p.status}`);
  }
});

// ===============================
// HELPERS
// ===============================
function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}