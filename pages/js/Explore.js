/**
 * PixelNeev – Explore.js
 * Handles: Searchable Dropdown Logic & Masonry Grid Demo Data
 */

document.addEventListener("DOMContentLoaded", () => {
    
    /* ──────────────────────────────────────────────
       1. SEARCHABLE TECH STACK DROPDOWN
    ────────────────────────────────────────────── */
    const techInput = document.getElementById("techSearchInput");
    const techOptionsList = document.getElementById("techOptionsList");
    const techDropdownWrapper = document.getElementById("techDropdown");
  
    // Dummy list of available tech stacks
    const techStacks = [
      "React", "Node.js", "Python", "Django", "Arduino", 
      "Raspberry Pi", "Vue.js", "Next.js", "C++", "Java", 
      "Spring Boot", "Docker", "Kubernetes", "TypeScript"
    ];
  
    // Function to render the list based on search query
    function renderTechOptions(filterText = "") {
      techOptionsList.innerHTML = ""; // Clear list
      
      const filtered = techStacks.filter(tech => 
        tech.toLowerCase().includes(filterText.toLowerCase())
      );
  
      if (filtered.length === 0) {
        techOptionsList.innerHTML = `<li class="tech-option" style="cursor:default;">No results found</li>`;
        return;
      }
  
      filtered.forEach(tech => {
        const li = document.createElement("li");
        li.className = "tech-option";
        li.textContent = tech;
        
        // On click, select the tech and close dropdown
        li.addEventListener("click", () => {
          techInput.value = tech;
          techOptionsList.classList.remove("is-open");
          // Here you would normally trigger the actual grid filtering
          console.log(`Filtering grid by: ${tech}`); 
        });
        
        techOptionsList.appendChild(li);
      });
    }
  
    // Show dropdown and render list when input is focused
    techInput.addEventListener("focus", () => {
      techOptionsList.classList.add("is-open");
      renderTechOptions(techInput.value);
    });
  
    // Filter list as user types
    techInput.addEventListener("input", (e) => {
      renderTechOptions(e.target.value);
    });
  
    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!techDropdownWrapper.contains(e.target)) {
        techOptionsList.classList.remove("is-open");
      }
    });
  
  
    /* ──────────────────────────────────────────────
       2. GENERATE DEMO PINTEREST CARDS
    ────────────────────────────────────────────── */
    const masonryGrid = document.getElementById("masonryGrid");
  
    // Array of different image aspect ratios to prove the masonry works
    const demoImages = [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80", // Standard
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&h=800&q=80", // Tall (Hardware)
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&h=400&q=80", // Wide (Data)
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&h=900&q=80", // Very Tall
      "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?auto=format&fit=crop&w=600&q=80", 
      "https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?auto=format&fit=crop&w=600&h=700&q=80"
    ];
  
    const demoTitles = [
      "AI Code Assistant", "IoT Smart Home Hub", "Data Viz Dashboard", 
      "Arduino Weather Station", "E-Commerce App", "Custom Mechanical Keyboard"
    ];
  
    // Generate 12 cards dynamically
    let cardsHTML = "";
    for (let i = 0; i < 12; i++) {
      const randomImg = demoImages[i % demoImages.length];
      const randomTitle = demoTitles[i % demoTitles.length];
      const initial = randomTitle.charAt(0);
      
      // Add animation delay so they load in beautifully step-by-step
      const delay = (i * 0.05).toFixed(2); 
  
      cardsHTML += `
        <article class="masonry-card" style="animation-delay: ${delay}s">
          <div class="masonry-card__img-wrapper">
            <img src="${randomImg}" alt="Project preview" class="masonry-card__img" loading="lazy">
          </div>
          <div class="masonry-card__content">
            <h3 class="masonry-card__title">${randomTitle}</h3>
            <div class="masonry-card__author">
              <span class="masonry-card__avatar">${initial}</span>
              <span>Developer ${i + 1}</span>
            </div>
          </div>
        </article>
      `;
    }
  
    masonryGrid.innerHTML = cardsHTML;
  });