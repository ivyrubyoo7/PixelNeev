/**
 * PixelNeev – Navbar.js (Updated with Global Auth Guard & Logout)
 * Handles: HTML injection, navigation, theme toggle, mobile menu, and Auth State
 */

(function () {
    "use strict";

    /* ──────────────────────────────────────────────
       1. INJECT HTML WORKAROUND
    ────────────────────────────────────────────── */
    const navbarHTML = `
      <header class="navbar" role="banner">
        <nav class="navbar__inner" aria-label="Main navigation">
          <a href="#" class="navbar__brand" aria-label="PixelNeev home" data-page="home">
            <span class="navbar__brand-icon"></span>
            <span class="navbar__brand-name">PixelNeev</span>
          </a>
          <ul class="navbar__links" role="list" id="navLinks">
            <li><a href="#" class="navbar__link" data-page="home">Home</a></li>
            <li><a href="#" class="navbar__link" data-page="explore">Explore</a></li>
            <li><a href="#" class="navbar__link" data-page="projects">Projects</a></li>
            <li><a href="#" class="navbar__link" data-page="profile">Profile</a></li>
          </ul>
          <div class="navbar__controls">
            <button class="navbar__theme-btn" id="themeToggle">🌙</button>
            
            <button class="navbar__login-btn" id="navLoginBtn" data-page="auth">Login</button>

            <div class="navbar__avatar-container" id="avatarContainer" style="display: none; position: relative;">
                <button class="navbar__avatar" id="avatarBtn">
                    <span id="avatarLetter">U</span>
                </button>
                
                <div class="navbar__dropdown" id="avatarDropdown">
                    <button class="navbar__dropdown-item" id="logoutBtn">Log Out</button>
                </div>
            </div>
            
          </div>
        </nav>
      </header>
    `;

    const container = document.getElementById("navbar-container");
    if (container) {
        container.innerHTML = navbarHTML;
    } else {
        console.error("Navbar container not found.");
        return; 
    }

    /* ──────────────────────────────────────────────
       2. CONFIGURATION – map data-page → destination
    ────────────────────────────────────────────── */
    const PAGE_MAP = {
        home:     "../../pages/html/Main.html",
        explore:  "../../pages/html/Explore.html",
        projects: "../../pages/html/Projects.html", 
        profile:  "../../pages/html/Profile.html",
        auth:     "../../pages/html/Auth.html"
    };

    /* ──────────────────────────────────────────────
       3. DOM REFERENCES
    ────────────────────────────────────────────── */
    const html           = document.documentElement;
    const themeToggle    = document.getElementById("themeToggle");
    
    const navLoginBtn    = document.getElementById("navLoginBtn");
    const avatarContainer = document.getElementById("avatarContainer");
    const avatarBtn      = document.getElementById("avatarBtn");
    const avatarLetter   = document.getElementById("avatarLetter");
    const avatarDropdown = document.getElementById("avatarDropdown");
    const logoutBtn      = document.getElementById("logoutBtn");
    
    const desktopLinks   = document.querySelectorAll(".navbar__link, .navbar__brand");

    /* ──────────────────────────────────────────────
       4. HELPERS
    ────────────────────────────────────────────── */
    function navigateTo(page) {
        const path = PAGE_MAP[page];
        if (!path) return;
        // Using replace() for auth redirects prevents users from using the "Back" button to bypass security
        window.location.replace(path); 
    }

    function setActivePage(page) {
        desktopLinks.forEach(function (link) {
            const linkPage = link.dataset.page;
            const isActive = linkPage === page;
            link.classList.toggle("is-active", isActive);
            link.setAttribute("aria-current", isActive ? "page" : "false");
        });
    }

    function getCurrentPage() {
        const path = window.location.pathname.toLowerCase();
        if (path.includes("explore")) return "explore";
        if (path.includes("project")) return "projects";
        if (path.includes("profile")) return "profile";
        if (path.includes("auth")) return "auth";
        return "home";
    }

    /* ──────────────────────────────────────────────
       5. NAVIGATION HANDLERS
    ────────────────────────────────────────────── */
    desktopLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault(); 
            const page = link.dataset.page;
            if (!page) return;

            if (getCurrentPage() !== page) {
                navigateTo(page);
            }
        });
    });

    if (navLoginBtn) {
        navLoginBtn.addEventListener("click", function () {
            if (getCurrentPage() !== "auth") navigateTo("auth");
        });
    }

    /* ──────────────────────────────────────────────
       6. THEME TOGGLE (dark / light)
    ────────────────────────────────────────────── */
    const THEME_KEY = "pixelneev-theme";

    function applyTheme(theme) {
        html.dataset.theme = theme;
        localStorage.setItem(THEME_KEY, theme);
        if (themeToggle) {
            themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const current = html.dataset.theme || "dark";
            applyTheme(current === "dark" ? "light" : "dark");
        });
    }

    (function initTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        applyTheme(saved || (prefersDark ? "dark" : "light"));
    })();

    /* ──────────────────────────────────────────────
       7. AVATAR / LOGIN STATE & LOGOUT
    ────────────────────────────────────────────── */
    if (avatarBtn) {
        avatarBtn.addEventListener("click", function (e) {
            e.stopPropagation(); 
            avatarDropdown.classList.toggle("is-open");
        });
    }

    document.addEventListener("click", function (event) {
        if (avatarDropdown && avatarDropdown.classList.contains("is-open")) {
            if (!avatarContainer.contains(event.target)) {
                avatarDropdown.classList.remove("is-open");
            }
        }
    });

    // Handle Logout
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            console.log("Logging out...");
            
            // 1. Clear Local Storage (FIXED TYPO HERE: capital 'N')
            localStorage.removeItem('pixelNeev_user');
            
            // 2. Update UI locally (just in case)
            setUsername(null);
            
            // 3. Force redirect to Auth page
            navigateTo("auth");
        });
    }

    function getInitials(name) {
        if (!name) return "U";
        const parts = name.trim().split(" ");
        if (parts.length >= 2) {
            return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
        }
        return name.charAt(0).toUpperCase();
    }

    function setUsername(name) {
        if (name && typeof name === "string" && name.length > 0) {
            if (avatarLetter) avatarLetter.textContent = getInitials(name);
            if (avatarBtn) avatarBtn.setAttribute("title", name + "'s profile");
            
            if (navLoginBtn) navLoginBtn.style.display = "none";
            if (avatarContainer) avatarContainer.style.display = "block"; 
        } else {
            if (navLoginBtn) navLoginBtn.style.display = "block";
            if (avatarContainer) avatarContainer.style.display = "none";
            if (avatarDropdown) avatarDropdown.classList.remove("is-open");
        }
    }

    window.PixelNeevNavbar = { setUsername: setUsername };

    /* ──────────────────────────────────────────────
       8. INITIALISE NAVBAR STATE & AUTH GUARD ON LOAD
    ────────────────────────────────────────────── */
    (function init() {
        const page = getCurrentPage();
        setActivePage(page);
        
        const savedUser = localStorage.getItem('pixelNeev_user');
        
        // ==============================================
        // GLOBAL AUTH GUARD
        // ==============================================
        // If the user is NOT logged in, and they are trying to view a page 
        // that is NOT the Auth page, immediately redirect them.
        if (!savedUser && page !== "auth") {
            console.warn("Unauthorized access detected. Redirecting to login...");
            navigateTo("auth");
            return; // Stop the rest of the initialization
        }
        
        // If they are logged in (or on the auth page safely), update the UI
        if (savedUser) {
            setUsername(savedUser);
            
            // Optional UX enhancement: If logged in user tries to visit Auth page, send them to Home
            if (page === "auth") {
                navigateTo("home");
            }
        } else {
            setUsername(null);
        }
    })();

})();