/* ds-init.js — Underground Design System v2
   Adds data-type="event|collab|portfolio|resource" to every
   card article and modal so ds-v2.css can colour type badges.
   Runs after the DOM is ready; re-runs on pagination changes. */

(() => {
  /* ─── Category → type map ─────────────────────────────
     Keys are lowercased category strings as they appear in
     .square-card-category / .wide-card-category text.      */
  const CAT_MAP = {
    // Events
    'events': 'event', 'event': 'event',
    'exhibition': 'event', 'music festival': 'event',
    'dance': 'event', 'performance': 'event',
    'screening': 'event', 'workshop': 'event',
    'market': 'event', 'talk': 'event',
    'open studio': 'event', 'theatre': 'event',
    // Collabs
    'collabs': 'collab', 'collab': 'collab', 'collab call': 'collab',
    'music': 'collab', 'visual arts': 'collab', 'cinema': 'collab',
    // Portfolios
    'portfolios': 'portfolio', 'portfolio': 'portfolio', 'work': 'portfolio',
    // Resources
    'resources': 'resource', 'resource': 'resource',
    'spaces': 'resource', 'studio space': 'resource',
    'recording studio': 'resource', 'equipment': 'resource',
    'materials': 'resource', 'mentorship': 'resource', 'saved': 'resource',
  };

  /* Pages where ALL cards share one type (overrides category text) */
  const PAGE_OVERRIDE = {
    'events': 'event',
    'collabs': 'collab',
    'map': 'resource',
  };

  function pageType() {
    const p = document.body.dataset.page;
    return p ? (PAGE_OVERRIDE[p] || null) : null;
  }

  function typeFromCategory(text) {
    return CAT_MAP[text.trim().toLowerCase()] || null;
  }

  function tagCard(article) {
    const forced = pageType();
    if (forced) { article.dataset.type = forced; return; }
    const catEl = article.querySelector(
      '.square-card-category, .wide-card-category'
    );
    if (!catEl) return;
    const t = typeFromCategory(catEl.textContent);
    if (t) article.dataset.type = t;
  }

  function tagAllCards() {
    document.querySelectorAll(
      '.square-card, .wide-card'
    ).forEach(tagCard);
  }

  /* Tag a modal's data-type so its category badge gets coloured.
     Called whenever the modal category text changes. */
  function tagModal(modal, categoryText) {
    const forced = pageType();
    const t = forced || typeFromCategory(categoryText);
    if (t) modal.dataset.type = t;
    else delete modal.dataset.type;
  }

  function watchModals() {
    document.querySelectorAll('.feed-overlay').forEach(overlay => {
      const modal = overlay.querySelector('.feed-modal');
      if (!modal) return;

      /* The category element id differs per page; grab any matching el */
      const catEl = modal.querySelector(
        '[id$="Category"], .feed-modal-category'
      );
      if (!catEl) return;

      /* Observe text changes — shared-ui.js sets textContent on open */
      new MutationObserver(() => {
        const txt = catEl.textContent.trim();
        if (txt) tagModal(modal, txt);
      }).observe(catEl, { childList: true, characterData: true, subtree: true });
    });
  }

  function watchGrids() {
    document.querySelectorAll(
      '.feed-grid, .three-grid, .wide-card-list'
    ).forEach(grid => {
      new MutationObserver(tagAllCards).observe(grid, { childList: true });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      tagAllCards();
      watchModals();
      watchGrids();
    });
  } else {
    tagAllCards();
    watchModals();
    watchGrids();
  }
})();
