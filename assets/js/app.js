const sitesData = [
  {
    id: 1,
    name: "Rebahin",
    category: "indonesia",
    tags: ["indonesia"],
    description: "Film & series Indonesia dan luar negeri dengan subtitle.",
    url: "https://rebahinxxi3.online/",
    badge: "🇮🇩 Indo",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
    quality: "HD",
    qualityColor: "text-green-400",
  },
  {
    id: 2,
    name: "Kita Nonton",
    category: "indonesia",
    tags: ["indonesia"],
    description: "Film & series Indonesia terlengkap dan gratis.",
    url: "http://124.150.139.91/",
    badge: "🇮🇩 Indo",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
    quality: "HD",
    qualityColor: "text-green-400",
  },
  {
    id: 3,
    name: "NgeFilm21",
    category: "indonesia",
    tags: ["indonesia"],
    description: "Film & series Indonesia berkualitas tinggi.",
    url: "https://ngefilm21.pw/",
    badge: "🇮🇩 Indo",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
    quality: "HD",
    qualityColor: "text-green-400",
  },
  {
    id: 4,
    name: "Layar Kaca 21",
    category: "foreign",
    tags: ["foreign"],
    description: "Film & series luar negeri subtitle Bahasa Indonesia.",
    url: "https://lk21.de/",
    badge: "🌍 Luar Negeri",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    quality: "Full HD",
    qualityColor: "text-blue-400",
  },
  {
    id: 5,
    name: "IDLIX",
    category: "foreign",
    tags: ["foreign"],
    description: "Film & series luar negeri terlengkap dengan sub Indo.",
    url: "https://idlixian.com/",
    badge: "🌍 Luar Negeri",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    quality: "Full HD",
    qualityColor: "text-blue-400",
  },
];

let currentFilter = "all";

const defaultConfig = {
  site_title: "Golden Movie Hub",
  logo_url:
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23000"%3E%3Cpath d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/%3E%3C/svg%3E',
  background_color: "#0A0A0A",
  card_color: "#1F1F1F",
  text_color: "#FFFFFF",
  primary_color: "#FFD700",
  secondary_color: "#3D3D3D",
};

// Unique icon per site using film reel SVG variants
function getSiteIcon(name) {
  const icons = {
    Rebahin: `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg>`,
    "Kita Nonton": `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>`,
    NgeFilm21: `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>`,
    "Layar Kaca 21": `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/></svg>`,
    IDLIX: `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z"/></svg>`,
  };
  return (
    icons[name] ||
    `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg>`
  );
}

function createSiteCard(site, delay = 0) {
  const initials = site.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return `
    <article
      class="glass-card card-glow rounded-2xl border border-gold-500/10 overflow-hidden group card-enter"
      style="animation-delay: ${delay}ms"
      data-category="${site.category}"
    >
      <!-- Card top accent line -->
      <div class="h-0.5 w-full ${site.category === 'indonesia' ? 'bg-gradient-to-r from-red-500/60 via-red-400/30 to-transparent' : 'bg-gradient-to-r from-blue-500/60 via-blue-400/30 to-transparent'}"></div>

      <div class="p-5 sm:p-6">
        <!-- Header row -->
        <div class="flex items-start justify-between mb-4">
          <!-- Icon -->
          <div class="relative">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-dark-600 to-dark-700 border border-dark-500/80 flex items-center justify-center text-gold-500 group-hover:border-gold-500/30 group-hover:text-gold-400 transition-all duration-300 shadow-lg">
              ${getSiteIcon(site.name)}
            </div>
            <!-- Quality badge on icon -->
            <span class="absolute -bottom-1.5 -right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-dark-900 border border-dark-600 ${site.qualityColor} leading-none">
              ${site.quality}
            </span>
          </div>

          <!-- Category badge -->
          <span class="text-[10px] sm:text-xs px-2.5 py-1 rounded-full border ${site.badgeColor} font-semibold flex-shrink-0">
            ${site.badge}
          </span>
        </div>

        <!-- Name -->
        <h4 class="text-base sm:text-lg font-bold text-white mb-1.5 group-hover:text-gold-400 transition-colors duration-200 leading-tight">
          ${site.name}
        </h4>

        <!-- Description -->
        <p class="text-gray-500 text-xs sm:text-sm mb-5 leading-relaxed line-clamp-2">
          ${site.description}
        </p>

        <!-- CTA Button -->
        <a
          href="${site.url}"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-gradient site-card-visit-btn ripple flex items-center justify-center gap-2 w-full py-2.5 sm:py-3 rounded-xl text-dark-900 font-bold text-sm"
        >
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Nonton Sekarang
        </a>
      </div>
    </article>
  `;
}

function getFilteredSites() {
  let sites = sitesData;
  if (currentFilter !== "all") {
    sites = sites.filter(
      (s) => s.category === currentFilter || s.tags.includes(currentFilter)
    );
  }
  return sites;
}

function renderSites() {
  const flatGrid = document.getElementById("sites-grid");
  const sectionIndo = document.getElementById("section-indonesia");
  const sectionForeign = document.getElementById("section-foreign");
  const gridIndo = document.getElementById("grid-indonesia");
  const gridForeign = document.getElementById("grid-foreign");
  const noResults = document.getElementById("no-results");
  const siteCount = document.getElementById("site-count");
  const indoLabelCount = document.getElementById("indo-label-count");
  const foreignLabelCount = document.getElementById("foreign-label-count");

  const filteredSites = getFilteredSites();
  siteCount.textContent = `${filteredSites.length} situs tersedia`;

  if (filteredSites.length === 0) {
    sectionIndo.classList.add("hidden");
    sectionForeign.classList.add("hidden");
    flatGrid.classList.add("hidden");
    noResults.classList.remove("hidden");
    return;
  }

  noResults.classList.add("hidden");

  // Show flat grid for single-category filter
  if (currentFilter !== "all") {
    sectionIndo.classList.add("hidden");
    sectionForeign.classList.add("hidden");
    flatGrid.classList.remove("hidden");
    flatGrid.innerHTML = filteredSites
      .map((site, i) => createSiteCard(site, i * 60))
      .join("");
  } else {
    // Show categorised sections
    flatGrid.classList.add("hidden");
    const indoSites = filteredSites.filter((s) => s.category === "indonesia");
    const foreignSites = filteredSites.filter((s) => s.category === "foreign");

    if (indoSites.length > 0) {
      sectionIndo.classList.remove("hidden");
      gridIndo.innerHTML = indoSites
        .map((site, i) => createSiteCard(site, i * 60))
        .join("");
      if (indoLabelCount) indoLabelCount.textContent = `${indoSites.length} situs`;
    } else {
      sectionIndo.classList.add("hidden");
    }

    if (foreignSites.length > 0) {
      sectionForeign.classList.remove("hidden");
      gridForeign.innerHTML = foreignSites
        .map((site, i) => createSiteCard(site, i * 60))
        .join("");
      if (foreignLabelCount) foreignLabelCount.textContent = `${foreignSites.length} situs`;
    } else {
      sectionForeign.classList.add("hidden");
    }
  }
}

function updateStats() {
  const totalEl = document.getElementById("total-count");
  const indoEl = document.getElementById("indo-count");
  const foreignEl = document.getElementById("foreign-count");
  if (totalEl) totalEl.textContent = sitesData.length;
  if (indoEl) indoEl.textContent = sitesData.filter((s) => s.category === "indonesia").length;
  if (foreignEl) foreignEl.textContent = sitesData.filter((s) => s.category === "foreign").length;
}

function setupFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      renderSites();
    });
  });
}


async function onConfigChange(config) {
  const siteTitleEl = document.getElementById("site-title");
  if (siteTitleEl) {
    siteTitleEl.textContent = config.site_title || defaultConfig.site_title;
  }
  const logoImg = document.getElementById("logo-img");
  if (logoImg && config.logo_url) {
    logoImg.src = config.logo_url;
  }
  document.documentElement.style.setProperty("--bg-color", config.background_color || defaultConfig.background_color);
  document.documentElement.style.setProperty("--card-color", config.card_color || defaultConfig.card_color);
  document.documentElement.style.setProperty("--text-color", config.text_color || defaultConfig.text_color);
  document.documentElement.style.setProperty("--primary-color", config.primary_color || defaultConfig.primary_color);
}

if (window.elementSdk) {
  window.elementSdk.init({
    defaultConfig,
    onConfigChange,
    mapToCapabilities: (config) => ({
      recolorables: [
        { get: () => config.background_color || defaultConfig.background_color, set: (v) => { config.background_color = v; window.elementSdk.setConfig({ background_color: v }); } },
        { get: () => config.card_color || defaultConfig.card_color, set: (v) => { config.card_color = v; window.elementSdk.setConfig({ card_color: v }); } },
        { get: () => config.text_color || defaultConfig.text_color, set: (v) => { config.text_color = v; window.elementSdk.setConfig({ text_color: v }); } },
        { get: () => config.primary_color || defaultConfig.primary_color, set: (v) => { config.primary_color = v; window.elementSdk.setConfig({ primary_color: v }); } },
        { get: () => config.secondary_color || defaultConfig.secondary_color, set: (v) => { config.secondary_color = v; window.elementSdk.setConfig({ secondary_color: v }); } },
      ],
      borderables: [],
      fontEditable: undefined,
      fontSizeable: undefined,
    }),
    mapToEditPanelValues: (config) =>
      new Map([
        ["site_title", config.site_title || defaultConfig.site_title],
        ["logo_url", config.logo_url || defaultConfig.logo_url],
      ]),
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateStats();
  setupFilters();
  renderSites();
});
