/**
 * Nexus Guide — Interactive UI
 */

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