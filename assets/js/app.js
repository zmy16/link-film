const sitesData = [
  {
    id: 1,
    name: "Rebahin",
    category: "indonesia",
    tags: ["indonesia"],
    description: "Film & series Indonesia dan luar negeri.",
    url: "https://rebahinxxi1.lol/",
    badge: "🇮🇩 Indo",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  {
    id: 2,
    name: "Kita Nonton",
    category: "indonesia",
    tags: ["indonesia"],
    description: "Film & series Indonesia terlengkap.",
    url: "http://124.150.139.91/",
    badge: "🇮🇩 Indo",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  {
    id: 3,
    name: "NgeFilm21",
    category: "indonesia",
    tags: ["indonesia"],
    description: "Film & series Indonesia berkualitas HD.",
    url: "https://ngefilm21.pw/",
    badge: "🇮🇩 Indo",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  {
    id: 4,
    name: "Layar Kaca 21",
    category: "foreign",
    tags: ["foreign"],
    description: "Film & series luar negeri subtitle Indonesia.",
    url: "https://lk21.de/",
    badge: "🌍 Luar Negeri",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  {
    id: 5,
    name: "IDLIX",
    category: "foreign",
    tags: ["foreign"],
    description: "Film & series luar negeri lengkap.",
    url: "https://idlixian.com/",
    badge: "🌍 Luar Negeri",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
];

let currentFilter = "all";
let searchQuery = "";

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

function createSiteCard(site) {
  return `
          <article class="glass-card card-glow rounded-2xl border border-gold-500/10 overflow-hidden group">
            <div class="p-5 sm:p-6">
              <div class="flex items-start justify-between mb-3">
                <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-dark-600 to-dark-700 border border-dark-500 flex items-center justify-center group-hover:border-gold-500/30 transition-colors">
                  <svg class="w-6 h-6 sm:w-7 sm:h-7 text-gold-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
                  </svg>
                </div>
                <span class="text-xs px-2.5 py-1 rounded-full border ${site.badgeColor} font-medium">
                  ${site.badge}
                </span>
              </div>
              
              <h4 class="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-gold-500 transition-colors">
                ${site.name}
              </h4>
              
              <p class="text-gray-400 text-xs sm:text-sm mb-4 line-clamp-2">
                ${site.description}
              </p>
              
              <a href="${site.url}" target="_blank" rel="noopener noreferrer" class="btn-gradient ripple block w-full text-center py-2.5 sm:py-3 rounded-xl text-dark-900 font-semibold text-sm transition-all hover:shadow-lg hover:shadow-gold-500/25">
                Buka
                <svg class="inline-block w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </a>
            </div>
          </article>
        `;
}

function renderSites() {
  const grid = document.getElementById("sites-grid");
  const noResults = document.getElementById("no-results");
  const siteCount = document.getElementById("site-count");

  let filteredSites = sitesData;

  if (currentFilter !== "all") {
    filteredSites = filteredSites.filter(
      (site) =>
        site.category === currentFilter || site.tags.includes(currentFilter),
    );
  }

  siteCount.textContent = `${filteredSites.length} situs tersedia`;

  if (filteredSites.length === 0) {
    grid.innerHTML = "";
    noResults.classList.remove("hidden");
  } else {
    noResults.classList.add("hidden");
    grid.innerHTML = filteredSites.map(createSiteCard).join("");
  }
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

function setupSearch() {
  const searchInput = document.getElementById("search-input");
  if (!searchInput) return;

  let debounceTimer;

  searchInput.addEventListener("input", (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchQuery = e.target.value;
      renderSites();
    }, 300);
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

  document.documentElement.style.setProperty(
    "--bg-color",
    config.background_color || defaultConfig.background_color,
  );
  document.documentElement.style.setProperty(
    "--card-color",
    config.card_color || defaultConfig.card_color,
  );
  document.documentElement.style.setProperty(
    "--text-color",
    config.text_color || defaultConfig.text_color,
  );
  document.documentElement.style.setProperty(
    "--primary-color",
    config.primary_color || defaultConfig.primary_color,
  );
}

if (window.elementSdk) {
  window.elementSdk.init({
    defaultConfig,
    onConfigChange,
    mapToCapabilities: (config) => ({
      recolorables: [
        {
          get: () => config.background_color || defaultConfig.background_color,
          set: (value) => {
            config.background_color = value;
            window.elementSdk.setConfig({ background_color: value });
          },
        },
        {
          get: () => config.card_color || defaultConfig.card_color,
          set: (value) => {
            config.card_color = value;
            window.elementSdk.setConfig({ card_color: value });
          },
        },
        {
          get: () => config.text_color || defaultConfig.text_color,
          set: (value) => {
            config.text_color = value;
            window.elementSdk.setConfig({ text_color: value });
          },
        },
        {
          get: () => config.primary_color || defaultConfig.primary_color,
          set: (value) => {
            config.primary_color = value;
            window.elementSdk.setConfig({ primary_color: value });
          },
        },
        {
          get: () => config.secondary_color || defaultConfig.secondary_color,
          set: (value) => {
            config.secondary_color = value;
            window.elementSdk.setConfig({ secondary_color: value });
          },
        },
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
  setupFilters();
  setupSearch();
  renderSites();
});
