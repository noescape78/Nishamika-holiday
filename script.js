/**
 * NISHAMIKA HOLIDAY — TRAVEL INTERACTIVE SCRIPT
 * Luxury travel search bar, mobile drawer, interactive destination cards,
 * quick search modal, and smooth micro-interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. Mobile Navigation Drawer
  // -------------------------------------------------------------------------
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', openMobileMenu);
  }
  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeMobileMenu);
  }
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // -------------------------------------------------------------------------
  // 2. Search Bar Dropdown Popovers
  // -------------------------------------------------------------------------
  const destField = document.getElementById('destField');
  const dateField = document.getElementById('dateField');
  const travelerField = document.getElementById('travelerField');
  const searchFields = [destField, dateField, travelerField];

  function closeAllDropdowns() {
    searchFields.forEach(field => {
      if (field) {
        field.classList.remove('active');
        field.setAttribute('aria-expanded', 'false');
      }
    });
  }

  searchFields.forEach(field => {
    if (!field) return;

    field.addEventListener('click', (e) => {
      // Don't close if clicking inside the popover controls
      if (e.target.closest('.counter-btn') || e.target.closest('.date-chip') || e.target.closest('.month-opt')) {
        return;
      }

      const isAlreadyActive = field.classList.contains('active');
      closeAllDropdowns();
      if (!isAlreadyActive) {
        field.classList.add('active');
        field.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Close popovers on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-field')) {
      closeAllDropdowns();
    }
  });

  // Handle Destination Selection
  const selectedDestText = document.getElementById('selectedDestText');
  const dropdownItems = document.querySelectorAll('#destDropdown .dropdown-item');

  dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const val = item.getAttribute('data-value');
      if (selectedDestText) {
        selectedDestText.textContent = val;
        selectedDestText.style.color = 'var(--color-primary-navy)';
      }
      closeAllDropdowns();
    });
  });

  // Handle Date Selection
  const selectedDateText = document.getElementById('selectedDateText');
  const dateChips = document.querySelectorAll('.date-chip');
  const monthOpts = document.querySelectorAll('.month-opt');

  dateChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      dateChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      if (selectedDateText) {
        selectedDateText.textContent = chip.textContent;
      }
    });
  });

  monthOpts.forEach(m => {
    m.addEventListener('click', (e) => {
      e.stopPropagation();
      const month = m.getAttribute('data-month');
      if (selectedDateText) {
        selectedDateText.textContent = `${month} 2026/27`;
      }
      closeAllDropdowns();
    });
  });

  // Handle Travelers Counter
  const selectedTravelerText = document.getElementById('selectedTravelerText');
  const adultCountEl = document.getElementById('adultCount');
  const childCountEl = document.getElementById('childCount');
  let adults = 2;
  let children = 0;

  function updateTravelerSummary() {
    let summary = `${adults} Adult${adults > 1 ? 's' : ''}`;
    if (children > 0) {
      summary += `, ${children} Child${children > 1 ? 'ren' : ''}`;
    }
    if (selectedTravelerText) {
      selectedTravelerText.textContent = summary;
    }
  }

  document.querySelectorAll('.counter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const type = btn.getAttribute('data-type');
      const isPlus = btn.classList.contains('plus');

      if (type === 'adults') {
        if (isPlus && adults < 10) adults++;
        if (!isPlus && adults > 1) adults--;
        if (adultCountEl) adultCountEl.textContent = adults;
      } else if (type === 'children') {
        if (isPlus && children < 8) children++;
        if (!isPlus && children > 0) children--;
        if (childCountEl) childCountEl.textContent = children;
      }
      updateTravelerSummary();
    });
  });

  // -------------------------------------------------------------------------
  // 3. Search Button Action & Scroll to Popular Destinations
  // -------------------------------------------------------------------------
  const searchSubmitBtn = document.getElementById('searchSubmitBtn');
  if (searchSubmitBtn) {
    searchSubmitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeAllDropdowns();
      
      const destination = selectedDestText ? selectedDestText.textContent.trim() : 'All';

      // Feedback animation
      const originalText = searchSubmitBtn.innerHTML;
      searchSubmitBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" class="spin-icon">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
        <span>Searching...</span>
      `;
      searchSubmitBtn.style.pointerEvents = 'none';

      setTimeout(() => {
        searchSubmitBtn.innerHTML = originalText;
        searchSubmitBtn.style.pointerEvents = '';
        showNotification(`Exploring popular destinations for ${destination}`);
        
        const popSection = document.getElementById('popular-destinations');
        if (popSection) {
          popSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    });
  }

  // -------------------------------------------------------------------------
  // 4. Destination Cards Interactive Sync with Search Bar (5 Cards)
  // -------------------------------------------------------------------------
  const destCardBoxes = document.querySelectorAll('.dest-card-box');
  destCardBoxes.forEach(card => {
    card.addEventListener('click', (e) => {
      // If clicking directly on an anchor link, allow normal navigation
      if (e.target.closest('a')) return;

      const country = card.getAttribute('data-dest');
      if (country && selectedDestText) {
        selectedDestText.textContent = country;
        selectedDestText.style.color = 'var(--color-primary-navy)';
      }
      showNotification(`Selected ${country} — Modern Luxury Travel Experience`);
      
      // Card bounce feedback
      card.style.transform = 'translateY(-8px) scale(1.02)';
      setTimeout(() => {
        card.style.transform = '';
      }, 300);
    });
  });

  // Also sync hero destination overlays
  const destPanels = {
    'panel-malaysia': 'Malaysia',
    'panel-thailand': 'Thailand',
    'panel-vietnam': 'Vietnam',
    'panel-india': 'India'
  };

  Object.entries(destPanels).forEach(([className, country]) => {
    const card = document.querySelector(`.${className}`);
    if (card) {
      card.addEventListener('click', () => {
        if (selectedDestText) {
          selectedDestText.textContent = country;
          selectedDestText.style.color = 'var(--color-primary-navy)';
        }
        const popSection = document.getElementById('popular-destinations');
        if (popSection) {
          popSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  });

  // -------------------------------------------------------------------------
  // 4b. Expanding Image Accordion (Curated Experiences)
  // -------------------------------------------------------------------------
  const accordionPanels = document.querySelectorAll('.accordion-panel');
  if (accordionPanels.length > 0) {
    accordionPanels.forEach(panel => {
      // Hover expands panel on desktop
      panel.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768) {
          accordionPanels.forEach(p => p.classList.remove('active'));
          panel.classList.add('active');
        }
      });

      // Click or tap expands panel on mobile & desktop
      panel.addEventListener('click', (e) => {
        // If clicking on the link button inside, allow navigation
        if (e.target.closest('a')) return;
        
        accordionPanels.forEach(p => p.classList.remove('active'));
        panel.classList.add('active');
      });
    });
  }

  // -------------------------------------------------------------------------
  // 5. Quick Search Modal
  // -------------------------------------------------------------------------
  const quickSearchBtn = document.getElementById('quickSearchBtn');
  const quickSearchModal = document.getElementById('quickSearchModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalSearchInput = document.getElementById('modalSearchInput');

  function openQuickModal() {
    if (quickSearchModal) {
      quickSearchModal.classList.add('open');
      quickSearchModal.setAttribute('aria-hidden', 'false');
      if (modalSearchInput) {
        setTimeout(() => modalSearchInput.focus(), 150);
      }
    }
  }

  function closeQuickModal() {
    if (quickSearchModal) {
      quickSearchModal.classList.remove('open');
      quickSearchModal.setAttribute('aria-hidden', 'true');
    }
  }

  if (quickSearchBtn) quickSearchBtn.addEventListener('click', openQuickModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeQuickModal);

  if (quickSearchModal) {
    quickSearchModal.addEventListener('click', (e) => {
      if (e.target === quickSearchModal) closeQuickModal();
    });
  }

  document.querySelectorAll('.quick-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const val = tag.getAttribute('data-tag') || tag.textContent;
      if (modalSearchInput) {
        modalSearchInput.value = val;
      }
      if (selectedDestText) {
        selectedDestText.textContent = val;
      }
      closeQuickModal();
      const popSection = document.getElementById('popular-destinations');
      if (popSection) {
        popSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ESC key listener to close modals/drawers/popovers
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDropdowns();
      closeQuickModal();
      closeMobileMenu();
    }
  });

  // -------------------------------------------------------------------------
  // 6. Minimal Luxury Notification Toast
  // -------------------------------------------------------------------------
  function showNotification(msg) {
    let toast = document.getElementById('luxuryToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'luxuryToast';
      toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: rgba(7, 26, 43, 0.95);
        color: #ffffff;
        padding: 0.85rem 1.6rem;
        border-radius: 9999px;
        font-size: 0.88rem;
        font-weight: 500;
        letter-spacing: 0.02em;
        border: 1px solid rgba(226, 192, 130, 0.4);
        box-shadow: 0 12px 35px rgba(0, 0, 0, 0.45);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        z-index: 999;
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
        opacity: 0;
        pointer-events: none;
        display: flex;
        align-items: center;
        gap: 0.6rem;
      `;
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span style="color:#e2c082;">✦</span> <span>${msg}</span>`;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(100px)';
    }, 3500);
  }

  // -------------------------------------------------------------------------
  // 7. Mobile Testimonials Swipe & Dot Indicator Sync
  // -------------------------------------------------------------------------
  const testimonialsGrid = document.querySelector('.testimonials-grid');
  const testimonialDots = document.querySelectorAll('.t-dot');

  if (testimonialsGrid && testimonialDots.length > 0) {
    testimonialDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-index'), 10);
        const cards = testimonialsGrid.querySelectorAll('.testimonial-card');
        if (cards[idx]) {
          cards[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });
    });

    let scrollTimeout;
    testimonialsGrid.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const cards = testimonialsGrid.querySelectorAll('.testimonial-card');
        if (!cards.length) return;
        const gridCenter = testimonialsGrid.getBoundingClientRect().left + (testimonialsGrid.offsetWidth / 2);

        let closestIdx = 0;
        let minDiff = Infinity;
        cards.forEach((card, i) => {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + (rect.width / 2);
          const diff = Math.abs(gridCenter - cardCenter);
          if (diff < minDiff) {
            minDiff = diff;
            closestIdx = i;
          }
        });

        testimonialDots.forEach((d, i) => {
          d.classList.toggle('active', i === closestIdx);
        });
      }, 50);
    }, { passive: true });
  }

  // -------------------------------------------------------------------------
  // 8. About Page Pillars Carousel Swipe & Dot Indicator Sync
  // -------------------------------------------------------------------------
  const pillarsGrid = document.querySelector('.pillars-grid');
  const pillarDots = document.querySelectorAll('.p-dot');

  if (pillarsGrid && pillarDots.length > 0) {
    pillarDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-index'), 10);
        const cards = pillarsGrid.querySelectorAll('.pillar-card');
        if (cards[idx]) {
          cards[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });
    });

    let pillarScrollTimeout;
    pillarsGrid.addEventListener('scroll', () => {
      clearTimeout(pillarScrollTimeout);
      pillarScrollTimeout = setTimeout(() => {
        const cards = pillarsGrid.querySelectorAll('.pillar-card');
        if (!cards.length) return;
        const gridCenter = pillarsGrid.getBoundingClientRect().left + (pillarsGrid.offsetWidth / 2);

        let closestIdx = 0;
        let minDiff = Infinity;
        cards.forEach((card, i) => {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + (rect.width / 2);
          const diff = Math.abs(gridCenter - cardCenter);
          if (diff < minDiff) {
            minDiff = diff;
            closestIdx = i;
          }
        });

        pillarDots.forEach((d, i) => {
          d.classList.toggle('active', i === closestIdx);
        });
      }, 50);
    }, { passive: true });
  }
});


