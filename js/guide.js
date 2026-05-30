/**
 * Switch the active tab within a tab group.
 * @param {string} group   - Unused group identifier (kept for backwards compat)
 * @param {string} panelId - ID of the tab panel to show
 * @param {HTMLElement} btn - The button that was clicked
 */
function switchTab(group, panelId, btn) {
  // Deactivate all sibling tab buttons
  const allBtns = btn.closest('.tabs').querySelectorAll('.tab-btn');
  allBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Show the matching panel, hide its siblings
  const panelEl = document.getElementById(panelId);
  if (!panelEl) return;
  const parent = panelEl.parentElement;
  parent.querySelectorAll(':scope > .tab-panel').forEach(p => p.classList.remove('active'));
  panelEl.classList.add('active');
}

/**
 * Switch between pill-nav sub-panels within the same parent.
 * @param {string} groupClass - CSS class shared by all panels in this group
 * @param {string} panelId    - ID of the panel to show
 * @param {HTMLElement} btn   - The button that was clicked
 */
function switchPill(groupClass, panelId, btn) {
  const allBtns = btn.closest('.pill-nav').querySelectorAll('.pill-btn');
  allBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const panelEl = document.getElementById(panelId);
  if (!panelEl) return;
  const parent = panelEl.parentElement;
  parent.querySelectorAll('.' + groupClass).forEach(p => p.classList.remove('active'));
  panelEl.classList.add('active');
}

/**
 * Toggle a FAQ accordion item open/closed.
 * @param {HTMLElement} item - The .faq-item element
 */
function toggleFaq(item) {
  item.classList.toggle('open');
}

/**
 * Smooth-scroll back to the top of the page.
 */
function backToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


/**
 * Render DPS Distrubution charts using Chart.js. Data is hardcoded for now, but could be made dynamic in the future if desired.
 */
(function () {
  const skills = [
    { label: "Astaros",          icon: 'images/skills/astaros.webp',      value: 24, color: '#3d9ea7' },
    { label: "Vestige",          icon: 'images/skills/vestige.webp',       value: 17, color: '#9b6fd4' },
    { label: "Gluttony",         icon: 'images/skills/gluttony.webp',      value: 16, color: '#3d9ea7' },
    { label: "Guillotine Swing", icon: 'images/skills/guillotine.webp',    value: 16, color: '#9b6fd4' },
    { label: "T-Skill",          icon: 'images/skills/fatalfinale.webp',   value: 15, color: '#7e53b6' },
    { label: "Reaper's Scythe",  icon: 'images/skills/reaperscythe.webp',  value:  8, color: '#9b6fd4' },
    { label: "Other",            icon: 'images/skills/unknown.webp',     value:  4, color: '#3d4060' },
  ];

  const labels = skills.map(s => s.label);
  const values = skills.map(s => s.value);
  const colors = skills.map(s => s.color);

  const ICON_SIZE = 32;
  const ICON_PAD  = 6;
  const Y_PADDING = ICON_SIZE + ICON_PAD;

  const imgs = skills.map(s => {
    const img = new Image();
    img.src = s.icon;
    return img;
  });

  const iconLabelPlugin = {
    id: 'iconLabels',
    afterDraw(chart) {
      const ctx = chart.ctx;
      const yAxis = chart.scales.y;
      yAxis.ticks.forEach((tick, i) => {
        const y = yAxis.getPixelForTick(i);
        const x = yAxis.left - ICON_PAD - ICON_SIZE;
        if (imgs[i].complete) {
          ctx.drawImage(imgs[i], x, y - ICON_SIZE / 2, ICON_SIZE, ICON_SIZE);
        }
      });
    }
  };

  let barChartInstance;
  let loaded = 0;
  imgs.forEach(img => {
    img.onload = () => { loaded++; if (loaded === imgs.length && barChartInstance) barChartInstance.update(); };
  });

  const textColor = '#7a7d94';
  const gridColor = 'rgba(255,255,255,0.06)';

  new Chart(document.getElementById('donutChart'), {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data: values, backgroundColor: colors, borderColor: '#0f1117', borderWidth: 2, hoverOffset: 6 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '62%',
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ~${ctx.parsed}%` } }
      }
    }
  });

  barChartInstance = new Chart(document.getElementById('barChart'), {
    type: 'bar',
    plugins: [iconLabelPlugin],
    data: {
      labels,
      datasets: [{ data: values, backgroundColor: colors, borderRadius: 3, borderSkipped: false }]
    },
    options: {
      indexAxis: 'y', responsive: true, maintainAspectRatio: false,
      layout: { padding: { left: Y_PADDING } },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` ~${ctx.parsed.x}%` } }
      },
      scales: {
        x: {
          min: 0, max: 25,
          ticks: {
            color: textColor,
            font: { size: 13, family: 'JetBrains Mono, monospace' },
            callback: v => v + '%'
          },
          grid: { color: gridColor }
        },
        y: {
          ticks: { display: false },
          grid: { display: false }
        }
      }
    }
  });
})();


/**
 * Toggle a nexus style side nav.
 */
function toggleSideNav() {
  document.getElementById('sideNav').classList.toggle('collapsed');
}

// highlight active section on scroll
(function () {
  const links = document.querySelectorAll('.side-nav-link[href^="#"]');
  const sections = Array.from(links)
    .map(l => {
      const href = l.getAttribute('href');
      if (!href || href === '#') return null;
      return document.querySelector(href);
    })
    .filter(Boolean);

  function onScroll() {
    const scrollY = window.scrollY + 100;
    let current = sections[0];
    sections.forEach(s => { if (scrollY >= s.offsetTop) current = s; });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current.id);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();