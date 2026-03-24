/**
 * PixelNeev – Main.js  (Home Feed)
 * Handles: feed rendering, card interactions, modal, engagement actions,
 *          feed tabs, sidebar widgets, toast notifications.
 */

(function () {
  "use strict";

  /* ──────────────────────────────────────────────
     1. DUMMY DATA
  ────────────────────────────────────────────── */
  const PROJECTS = [
    {
      id: "p001",
      user: {
        username: "Arjun Mehta",
        email: "arjun.m@dev.io",
        avatar: "A",
        avatarGradient: "linear-gradient(135deg,#6366f1,#a855f7)",
        followers: 1240,
      },
      project: {
        title: "Portfolio Website v2",
        description:
          "A fully animated personal portfolio built with Three.js WebGL backgrounds, smooth GSAP scroll triggers, and a dark glassmorphism design system.",
        tech: [
          { label: "React",      type: "frontend" },
          { label: "Three.js",   type: "frontend" },
          { label: "GSAP",       type: "frontend" },
          { label: "Vite",       type: "devops" },
        ],
        views: 2340,
        reposts: 87,
        likes: 312,
        hasPreview: true,
        previewColor: "#0f0a1e",
        githubUrl: "https://github.com",
        liveUrl: "https://example.com",
        timestamp: "2h ago",
      },
    },
    {
      id: "p002",
      user: {
        username: "Priya Sharma",
        email: "priya.s@pixelneev.dev",
        avatar: "P",
        avatarGradient: "linear-gradient(135deg,#ec4899,#f59e0b)",
        followers: 856,
      },
      project: {
        title: "E-Commerce Platform",
        description:
          "Full-stack e-commerce with real-time inventory, Stripe payment integration, and a microservices backend deployed on Kubernetes.",
        tech: [
          { label: "Next.js",     type: "frontend" },
          { label: "Node.js",     type: "backend" },
          { label: "MongoDB",     type: "database" },
          { label: "Stripe",      type: "backend" },
          { label: "Docker",      type: "devops" },
        ],
        views: 5120,
        reposts: 204,
        likes: 891,
        hasPreview: true,
        previewColor: "#0a1420",
        githubUrl: "https://github.com",
        liveUrl: "https://example.com",
        timestamp: "5h ago",
      },
    },
    {
      id: "p003",
      user: {
        username: "Rohan Kapoor",
        email: "rohan@buildfast.dev",
        avatar: "R",
        avatarGradient: "linear-gradient(135deg,#10b981,#06b6d4)",
        followers: 2103,
      },
      project: {
        title: "AI Code Reviewer",
        description:
          "A VS Code extension that uses GPT-4 to review pull requests inline, suggest refactors, and detect security vulnerabilities automatically.",
        tech: [
          { label: "TypeScript", type: "frontend" },
          { label: "Python",     type: "backend" },
          { label: "FastAPI",    type: "backend" },
          { label: "OpenAI",     type: "backend" },
        ],
        views: 8750,
        reposts: 430,
        likes: 1560,
        hasPreview: false,
        previewColor: null,
        githubUrl: "https://github.com",
        liveUrl: null,
        timestamp: "1d ago",
      },
    },
    {
      id: "p004",
      user: {
        username: "Sneha Nair",
        email: "sneha.n@fullstack.io",
        avatar: "S",
        avatarGradient: "linear-gradient(135deg,#f59e0b,#ef4444)",
        followers: 390,
      },
      project: {
        title: "Spring Boot Microservices",
        description:
          "A production-ready microservices template using Spring Boot, Spring Cloud Gateway, Eureka service discovery, and Kafka event streaming.",
        tech: [
          { label: "Java",         type: "backend" },
          { label: "Spring Boot",  type: "backend" },
          { label: "Kafka",        type: "devops" },
          { label: "PostgreSQL",   type: "database" },
          { label: "Docker",       type: "devops" },
        ],
        views: 3200,
        reposts: 115,
        likes: 278,
        hasPreview: true,
        previewColor: "#0e1520",
        githubUrl: "https://github.com",
        liveUrl: null,
        timestamp: "2d ago",
      },
    },
    {
      id: "p005",
      user: {
        username: "Dev Anand",
        email: "dev.a@mobile.dev",
        avatar: "D",
        avatarGradient: "linear-gradient(135deg,#8b5cf6,#3b82f6)",
        followers: 770,
      },
      project: {
        title: "React Native Fitness App",
        description:
          "Cross-platform workout tracker with Bluetooth heart-rate integration, adaptive AI-generated workout plans, and real-time progress charts.",
        tech: [
          { label: "React Native", type: "mobile" },
          { label: "Expo",         type: "mobile" },
          { label: "Firebase",     type: "database" },
          { label: "TensorFlow",   type: "backend" },
        ],
        views: 4810,
        reposts: 197,
        likes: 624,
        hasPreview: true,
        previewColor: "#0a0e1a",
        githubUrl: "https://github.com",
        liveUrl: "https://example.com",
        timestamp: "3d ago",
      },
    },
    {
      id: "p006",
      user: {
        username: "Meera Iyer",
        email: "meera@cloudops.io",
        avatar: "M",
        avatarGradient: "linear-gradient(135deg,#06b6d4,#6366f1)",
        followers: 1580,
      },
      project: {
        title: "Kubernetes Dashboard",
        description:
          "A beautiful, real-time Kubernetes cluster dashboard with resource usage graphs, pod health monitoring, and one-click rollback.",
        tech: [
          { label: "Vue 3",      type: "frontend" },
          { label: "Go",         type: "backend" },
          { label: "Kubernetes", type: "devops" },
          { label: "Prometheus", type: "devops" },
        ],
        views: 6300,
        reposts: 319,
        likes: 987,
        hasPreview: false,
        previewColor: null,
        githubUrl: "https://github.com",
        liveUrl: "https://example.com",
        timestamp: "4d ago",
      },
    },
  ];

  const TRENDING_TAGS = [
    { label: "#React",       count: "2.4k posts" },
    { label: "#NextJS",      count: "1.8k posts" },
    { label: "#SpringBoot",  count: "1.1k posts" },
    { label: "#TypeScript",  count: "3.2k posts" },
    { label: "#OpenAI",      count: "920 posts" },
    { label: "#Kubernetes",  count: "740 posts" },
  ];

  const SUGGESTED_DEVS = [
    { name: "Kabir Singh",  role: "Full-Stack Dev",  avatar: "K", gradient: "linear-gradient(135deg,#6366f1,#a855f7)" },
    { name: "Tanya Bose",   role: "ML Engineer",     avatar: "T", gradient: "linear-gradient(135deg,#ec4899,#f59e0b)" },
    { name: "Nishant Rao",  role: "DevOps Engineer", avatar: "N", gradient: "linear-gradient(135deg,#10b981,#06b6d4)" },
    { name: "Isha Gupta",   role: "UI/UX Designer",  avatar: "I", gradient: "linear-gradient(135deg,#f59e0b,#ef4444)" },
  ];

  /* ──────────────────────────────────────────────
     2. STATE
  ────────────────────────────────────────────── */
  const state = {
    // Mutable card state keyed by project id
    cards: {},
    activeFilter: "all",
    openModalId: null,
  };

  // Initialise per-card state from data
  PROJECTS.forEach(function (p) {
    state.cards[p.id] = {
      views:     p.project.views,
      reposts:   p.project.reposts,
      likes:     p.project.likes,
      isReposted: false,
      isLiked:    false,
      isSaved:    false,
      isFollowing: false,
    };
  });

  /* ──────────────────────────────────────────────
     3. DOM REFERENCES
  ────────────────────────────────────────────── */
  const feedEl        = document.getElementById("feed");
  const loadMoreBtn   = document.getElementById("loadMoreBtn");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalBody     = document.getElementById("modalBody");
  const modalClose    = document.getElementById("modalClose");
  const toastRegion   = document.getElementById("toastRegion");
  const trendingTagsEl = document.getElementById("trendingTags");
  const suggestedDevsEl = document.getElementById("suggestedDevs");
  const feedTabs      = document.querySelectorAll(".feed-tab");
  const postProjectBtn = document.getElementById("postProjectBtn");

  /* ──────────────────────────────────────────────
     4. UTILITY HELPERS
  ────────────────────────────────────────────── */
  function formatNumber(n) {
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    return String(n);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ──────────────────────────────────────────────
     5. CARD RENDERING
  ────────────────────────────────────────────── */
  function buildTechBadges(techArray) {
    return techArray
      .map(function (t) {
        return '<span class="tech-badge" data-type="' + escapeHtml(t.type) + '">' +
               escapeHtml(t.label) + "</span>";
      })
      .join("");
  }

  function buildPreviewSection(project) {
    if (!project.hasPreview) return "";
    const color = project.previewColor || "#0d0d1a";
    return (
      '<div class="card-preview">' +
        '<div class="card-preview__placeholder" style="background:' + color + '">' +
          '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>' +
          '<span>' + escapeHtml(project.title) + " preview</span>" +
        "</div>" +
      "</div>"
    );
  }

  function buildEngagementBar(projectId, cardState, project) {
    return (
      '<div class="card-engagement">' +
        '<button class="engagement-btn engagement-btn--views" data-action="views" data-id="' + projectId + '" aria-label="View count">' +
          '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>' +
          '<span class="views-count">' + formatNumber(cardState.views) + "</span>" +
        "</button>" +

        '<button class="engagement-btn engagement-btn--repost' + (cardState.isReposted ? " is-reposted" : "") + '" data-action="repost" data-id="' + projectId + '" aria-label="Repost project" aria-pressed="' + cardState.isReposted + '">' +
          '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>' +
          '<span class="repost-count">' + formatNumber(cardState.reposts) + "</span>" +
        "</button>" +

        '<button class="engagement-btn engagement-btn--like' + (cardState.isLiked ? " is-liked" : "") + '" data-action="like" data-id="' + projectId + '" aria-label="Like project" aria-pressed="' + cardState.isLiked + '">' +
          '<svg width="15" height="15" viewBox="0 0 24 24" fill="' + (cardState.isLiked ? "currentColor" : "none") + '" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' +
          '<span class="like-count">' + formatNumber(cardState.likes) + "</span>" +
        "</button>" +

        '<div class="engagement-spacer"></div>' +

        '<button class="engagement-btn engagement-btn--bookmark' + (cardState.isSaved ? " is-saved" : "") + '" data-action="bookmark" data-id="' + projectId + '" aria-label="Save project" aria-pressed="' + cardState.isSaved + '">' +
          '<svg width="15" height="15" viewBox="0 0 24 24" fill="' + (cardState.isSaved ? "currentColor" : "none") + '" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>' +
        "</button>" +

        '<button class="engagement-btn engagement-btn--share" data-action="share" data-id="' + projectId + '" aria-label="Share project">' +
          '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>' +
        "</button>" +
      "</div>"
    );
  }

  function createCardElement(data, index) {
    const { id, user, project } = data;
    const cardState = state.cards[id];

    const article = document.createElement("article");
    article.className = "project-card";
    article.setAttribute("data-id", id);
    article.setAttribute("tabindex", "0");
    article.setAttribute("role", "button");
    article.setAttribute("aria-label", "Open " + project.title + " by " + user.username);
    article.style.animationDelay = (index * 60) + "ms";

    article.innerHTML =
      /* ── User info ── */
      '<div class="card-user">' +
        '<div class="card-avatar" aria-hidden="true">' +
          '<span class="card-avatar__bg" style="background:' + user.avatarGradient + '"></span>' +
          '<span class="card-avatar__letter">' + escapeHtml(user.avatar) + "</span>" +
        "</div>" +
        '<div class="card-user__meta">' +
          '<span class="card-user__name">' + escapeHtml(user.username) + "</span>" +
          '<span class="card-user__email">' + escapeHtml(user.email) + "</span>" +
        "</div>" +
        '<span class="card-user__timestamp">' + escapeHtml(project.timestamp) + "</span>" +
        '<button class="card-follow-btn' + (cardState.isFollowing ? " is-following" : "") + '" data-action="follow" data-id="' + id + '" aria-label="Follow ' + escapeHtml(user.username) + '" aria-pressed="' + cardState.isFollowing + '">' +
          (cardState.isFollowing ? "Following" : "Follow") +
        "</button>" +
      "</div>" +

      /* ── Project info ── */
      '<div class="card-project">' +
        '<h2 class="card-project__title">' + escapeHtml(project.title) + "</h2>" +
        '<p class="card-project__desc">' + escapeHtml(project.description) + "</p>" +
      "</div>" +

      /* ── Tech stack ── */
      '<div class="card-tech">' + buildTechBadges(project.tech) + "</div>" +

      /* ── Preview ── */
      buildPreviewSection(project) +

      /* ── Engagement ── */
      buildEngagementBar(id, cardState, project);

    return article;
  }

  /* ──────────────────────────────────────────────
     6. RENDER FEED
  ────────────────────────────────────────────── */
  function renderFeed(projects) {
    // Clear skeletons / existing cards
    feedEl.innerHTML = "";

    if (projects.length === 0) {
      feedEl.innerHTML =
        '<div class="card-skeleton" style="padding:40px;text-align:center;color:var(--color-text-muted);font-size:.875rem">' +
        "No projects found." +
        "</div>";
      return;
    }

    projects.forEach(function (data, index) {
      const card = createCardElement(data, index);
      feedEl.appendChild(card);
    });

    attachCardListeners();
  }

  /* ──────────────────────────────────────────────
     7. CARD EVENT LISTENERS
  ────────────────────────────────────────────── */
  function attachCardListeners() {
    feedEl.querySelectorAll(".project-card").forEach(function (card) {
      // Click / Enter on card body opens modal
      card.addEventListener("click", function (e) {
        // Stop if an action button was clicked
        if (e.target.closest("[data-action]")) return;
        const id = card.dataset.id;
        openModal(id);
      });

      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          if (e.target.closest("[data-action]")) return;
          e.preventDefault();
          const id = card.dataset.id;
          openModal(id);
        }
      });
    });

    // Delegate engagement actions
    feedEl.addEventListener("click", handleEngagementClick);
  }

  function handleEngagementClick(e) {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    e.stopPropagation();

    const action = btn.dataset.action;
    const id     = btn.dataset.id;
    if (!id) return;

    switch (action) {
      case "repost":   handleRepost(id, btn); break;
      case "like":     handleLike(id, btn); break;
      case "bookmark": handleBookmark(id, btn); break;
      case "share":    handleShare(id); break;
      case "follow":   handleFollowFromCard(id, btn); break;
    }
  }

  /* ── Repost ── */
  function handleRepost(id, btn) {
    const s = state.cards[id];
    s.isReposted = !s.isReposted;
    s.reposts   += s.isReposted ? 1 : -1;

    btn.classList.toggle("is-reposted", s.isReposted);
    btn.setAttribute("aria-pressed", String(s.isReposted));
    btn.querySelector(".repost-count").textContent = formatNumber(s.reposts);

    showToast(s.isReposted ? "Reposted to your feed" : "Repost removed");
  }

  /* ── Like ── */
  function handleLike(id, btn) {
    const s = state.cards[id];
    s.isLiked = !s.isLiked;
    s.likes  += s.isLiked ? 1 : -1;

    btn.classList.toggle("is-liked", s.isLiked);
    btn.setAttribute("aria-pressed", String(s.isLiked));
    // Update SVG fill
    const path = btn.querySelector("svg path, svg polygon");
    if (path) path.setAttribute("fill", s.isLiked ? "currentColor" : "none");
    btn.querySelector(".like-count").textContent = formatNumber(s.likes);
  }

  /* ── Bookmark ── */
  function handleBookmark(id, btn) {
    const s = state.cards[id];
    s.isSaved = !s.isSaved;

    btn.classList.toggle("is-saved", s.isSaved);
    btn.setAttribute("aria-pressed", String(s.isSaved));
    const path = btn.querySelector("svg path");
    if (path) path.setAttribute("fill", s.isSaved ? "currentColor" : "none");

    showToast(s.isSaved ? "Saved to bookmarks" : "Removed from bookmarks");
  }

  /* ── Share ── */
  function handleShare(id) {
    const data = PROJECTS.find(function (p) { return p.id === id; });
    if (!data) return;

    if (navigator.share) {
      navigator.share({
        title: data.project.title,
        text:  data.project.description,
        url:   window.location.href,
      }).catch(function () {});
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(function () { showToast("Link copied to clipboard"); })
        .catch(function () { showToast("Share link ready"); });
    }
  }

  /* ── Follow from card ── */
  function handleFollowFromCard(id, btn) {
    const s = state.cards[id];
    s.isFollowing = !s.isFollowing;
    btn.classList.toggle("is-following", s.isFollowing);
    btn.setAttribute("aria-pressed", String(s.isFollowing));
    btn.textContent = s.isFollowing ? "Following" : "Follow";

    const data = PROJECTS.find(function (p) { return p.id === id; });
    showToast(s.isFollowing
      ? "Following " + (data ? data.user.username : "user")
      : "Unfollowed"
    );
  }

  /* ──────────────────────────────────────────────
     8. MODAL
  ────────────────────────────────────────────── */
  function openModal(id) {
    const data = PROJECTS.find(function (p) { return p.id === id; });
    if (!data) return;

    const { user, project } = data;
    const s = state.cards[id];

    // Increment view count
    s.views += 1;
    const viewBtn = feedEl.querySelector('[data-id="' + id + '"].project-card .views-count');
    if (viewBtn) viewBtn.textContent = formatNumber(s.views);

    // Build modal content
    const previewHtml = project.hasPreview
      ? '<div class="modal-preview"><div class="modal-preview__placeholder" style="background:' + (project.previewColor || "#0d0d1a") + '">' +
          '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>' +
          "<span>Project Preview</span>" +
        "</div></div>"
      : "";

    const techHtml = project.tech
      .map(function (t) {
        return '<span class="tech-badge" data-type="' + escapeHtml(t.type) + '">' + escapeHtml(t.label) + "</span>";
      })
      .join("");

    const liveLink = project.liveUrl
      ? '<a href="' + escapeHtml(project.liveUrl) + '" target="_blank" rel="noopener noreferrer" class="modal-btn modal-btn--primary" aria-label="View live demo">Live Demo</a>'
      : "";

    modalBody.innerHTML =
      '<div class="modal-header">' +
        '<h2 class="modal-header__title" id="modalTitle">' + escapeHtml(project.title) + "</h2>" +
        '<p class="modal-header__desc">' + escapeHtml(project.description) + "</p>" +
      "</div>" +

      previewHtml +

      '<div class="modal-section">' +
        '<div class="modal-section__label">Tech Stack</div>' +
        '<div class="modal-tech">' + techHtml + "</div>" +
      "</div>" +

      '<div class="modal-section">' +
        '<div class="modal-section__label">Project Stats</div>' +
        '<div class="modal-meta-grid">' +
          '<div class="modal-meta-item"><span class="modal-meta-item__label">Views</span><span class="modal-meta-item__value">' + formatNumber(s.views) + "</span></div>" +
          '<div class="modal-meta-item"><span class="modal-meta-item__label">Reposts</span><span class="modal-meta-item__value">' + formatNumber(s.reposts) + "</span></div>" +
          '<div class="modal-meta-item"><span class="modal-meta-item__label">Likes</span><span class="modal-meta-item__value">' + formatNumber(s.likes) + "</span></div>" +
          '<div class="modal-meta-item"><span class="modal-meta-item__label">Posted by</span><span class="modal-meta-item__value">' + escapeHtml(user.username) + "</span></div>" +
        "</div>" +
      "</div>" +

      '<div class="modal-actions">' +
        '<a href="' + escapeHtml(project.githubUrl || "#") + '" target="_blank" rel="noopener noreferrer" class="modal-btn modal-btn--secondary" aria-label="View on GitHub">View on GitHub</a>' +
        liveLink +
      "</div>";

    state.openModalId = id;
    modalBackdrop.setAttribute("aria-hidden", "false");
    modalBackdrop.classList.add("is-open");
    document.body.style.overflow = "hidden";
    modalClose.focus();
  }

  function closeModal() {
    modalBackdrop.classList.remove("is-open");
    modalBackdrop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    state.openModalId = null;
  }

  modalClose.addEventListener("click", closeModal);

  modalBackdrop.addEventListener("click", function (e) {
    if (e.target === modalBackdrop) closeModal();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && state.openModalId) closeModal();
  });


  /* ──────────────────────────────────────────────
     9. FEED TABS
  ────────────────────────────────────────────── */
  feedTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      feedTabs.forEach(function (t) {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");

      state.activeFilter = tab.dataset.filter || "all";

      // Simulate different ordering per tab
      let filtered;
      if (state.activeFilter === "trending") {
        filtered = [...PROJECTS].sort(function (a, b) {
          return (b.project.views + b.project.likes) - (a.project.views + a.project.likes);
        });
      } else if (state.activeFilter === "following") {
        filtered = PROJECTS.filter(function (p) { return state.cards[p.id].isFollowing; });
      } else {
        filtered = PROJECTS;
      }

      renderFeed(filtered);
    });
  });


  /* ──────────────────────────────────────────────
     10. LOAD MORE
  ────────────────────────────────────────────── */
  loadMoreBtn.addEventListener("click", function () {
    loadMoreBtn.textContent = "Loading…";
    loadMoreBtn.disabled = true;

    setTimeout(function () {
      showToast("You're all caught up! ✨");
      loadMoreBtn.textContent = "No more projects";
      loadMoreBtn.disabled = true;
    }, 800);
  });


  /* ──────────────────────────────────────────────
     11. SIDEBAR WIDGETS
  ────────────────────────────────────────────── */
  function renderTrendingTags() {
    if (!trendingTagsEl) return;
    trendingTagsEl.innerHTML = TRENDING_TAGS.map(function (tag) {
      return (
        '<li>' +
          '<div class="trending-tag-item" role="button" tabindex="0" aria-label="Filter by ' + escapeHtml(tag.label) + '">' +
            '<span class="trending-tag-item__label">' + escapeHtml(tag.label) + "</span>" +
            '<span class="trending-tag-item__count">' + escapeHtml(tag.count) + "</span>" +
          "</div>" +
        "</li>"
      );
    }).join("");
  }

  function renderSuggestedDevs() {
    if (!suggestedDevsEl) return;
    suggestedDevsEl.innerHTML = SUGGESTED_DEVS.map(function (dev) {
      return (
        '<li class="suggested-dev">' +
          '<div class="suggested-dev__avatar" style="background:' + dev.gradient + '" aria-hidden="true">' +
            escapeHtml(dev.avatar) +
          "</div>" +
          '<div class="suggested-dev__info">' +
            '<div class="suggested-dev__name">' + escapeHtml(dev.name) + "</div>" +
            '<div class="suggested-dev__role">' + escapeHtml(dev.role) + "</div>" +
          "</div>" +
          '<button class="suggested-dev__follow-btn" aria-label="Follow ' + escapeHtml(dev.name) + '">Follow</button>' +
        "</li>"
      );
    }).join("");

    // Toggle follow state for sidebar suggestions
    suggestedDevsEl.querySelectorAll(".suggested-dev__follow-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const isFollowing = btn.dataset.following === "true";
        btn.dataset.following = String(!isFollowing);
        btn.textContent = !isFollowing ? "Following" : "Follow";
        btn.style.color = !isFollowing ? "var(--color-text-muted)" : "";
        if (!isFollowing) {
          btn.style.borderColor = "var(--color-border)";
          btn.style.background  = "var(--color-surface)";
        } else {
          btn.style.borderColor = "";
          btn.style.background  = "";
        }
      });
    });
  }


  /* ──────────────────────────────────────────────
     12. POST PROJECT BUTTON
  ────────────────────────────────────────────── */
  /* ──────────────────────────────────────────────
   11. POST PROJECT BUTTON (Live to Firebase)
────────────────────────────────────────────── */
if (postProjectBtn) {
    postProjectBtn.addEventListener("click", async function () {
      const user = auth.currentUser;
      if (!user) return showToast("Please login first! 🔐");

      // Ask the user for the real data using prompts
      const title = prompt("Enter Project Title:");
      if (!title) return; // Cancel if they leave it blank

      const description = prompt("Enter Project Description:");
      
      const techInput = prompt("Enter Tech Stack (comma separated, e.g., React, Firebase, Node):");
      // Convert the comma-separated string into an array of objects
      const techArray = techInput ? techInput.split(",").map(t => ({ label: t.trim(), type: "frontend" })) : [];

      try {
        await addDoc(collection(db, "projects"), {
          user: {
            username: user.displayName || "Anonymous Dev",
            email: user.email,
            avatar: (user.displayName || "D").charAt(0),
            avatarGradient: "linear-gradient(135deg,#6366f1,#a855f7)" 
          },
          project: {
            title: title, // Use the user's input
            description: description || "No description provided.", // Use the user's input
            tech: techArray, // Use the user's input
            views: 0, reposts: 0, likes: 0,
            timestamp: serverTimestamp(),
            hasPreview: false
          },
          authorId: user.uid 
        });
        showToast("Project posted successfully! 🚀");
      } catch (error) {
        showToast("Error posting: " + error.message);
      }
    });
  }


  /* ──────────────────────────────────────────────
     13. TOAST NOTIFICATIONS
  ────────────────────────────────────────────── */
  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.innerHTML =
      '<span class="toast__dot" aria-hidden="true"></span>' +
      '<span>' + escapeHtml(message) + "</span>";

    toastRegion.appendChild(toast);

    setTimeout(function () {
      toast.classList.add("toast--exit");
      toast.addEventListener("animationend", function () {
        toast.remove();
      }, { once: true });
    }, 2800);
  }


  /* ──────────────────────────────────────────────
     14. INITIALISE
  ────────────────────────────────────────────── */
  function init() {
    // Brief delay to show skeleton animation
    setTimeout(function () {
      renderFeed(PROJECTS);
      renderTrendingTags();
      renderSuggestedDevs();
    }, 350);
  }

  init();

})();