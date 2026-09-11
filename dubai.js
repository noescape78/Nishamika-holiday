/**
 * NISHAMIKA HOLIDAY — DUBAI & ABU DHABI EXPERIENCE (dubai.js)
 * High-performance, modular scripts for category filtering, 
 * in-website YouTube modal player, and quick-view destination drawer.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. DOM Elements
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const spotCards = document.querySelectorAll('.spot-card');

  // Video Modal
  const videoModal = document.getElementById('videoModal');
  const videoFrame = document.getElementById('videoPlayerIframe');
  const videoTitle = document.getElementById('videoModalTitle');
  const closeVideoBtn = document.getElementById('closeVideoModal');
  const videoTriggers = document.querySelectorAll('.btn-video');

  // Detail / Quick-View Modal
  const detailModal = document.getElementById('detailModal');
  const detailImg = document.getElementById('detailModalImg');
  const detailTag = document.getElementById('detailModalTag');
  const detailTitle = document.getElementById('detailModalTitle');
  const detailDesc = document.getElementById('detailModalDesc');
  const detailFeatures = document.getElementById('detailModalFeatures');
  const detailWaBtn = document.getElementById('detailModalWaBtn');
  const closeDetailBtn = document.getElementById('closeDetailModal');
  const detailTriggers = document.querySelectorAll('.btn-details');

  // Mobile Menu Toggle (matching main navbar)
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  // --------------------------------------------------------------------------
  // 2. Category Filter System
  // --------------------------------------------------------------------------
  const categorySections = document.querySelectorAll('.category-section');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active class
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter') || 'all';

        // Toggle category sections if present
        if (categorySections.length > 0) {
          categorySections.forEach(sec => {
            const secCat = sec.getAttribute('data-category');
            if (filterValue === 'all' || secCat === filterValue) {
              sec.style.display = 'block';
              sec.style.opacity = '0';
              requestAnimationFrame(() => {
                sec.style.transition = 'opacity 0.35s ease';
                sec.style.opacity = '1';
              });
            } else {
              sec.style.display = 'none';
            }
          });

          // If on mobile and a specific category was clicked, smoothly scroll to it
          if (filterValue !== 'all' && window.innerWidth <= 768) {
            const targetSec = document.querySelector(`.category-section[data-category="${filterValue}"]`);
            if (targetSec) {
              const yOffset = -75; // Account for sticky filter bar
              const y = targetSec.getBoundingClientRect().top + window.pageYOffset + yOffset;
              window.scrollTo({ top: y, behavior: 'smooth' });
            }
          }
        } else if (spotCards.length > 0) {
          spotCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filterValue === 'all' || category === filterValue) {
              card.style.display = 'flex';
              card.style.opacity = '0';
              requestAnimationFrame(() => {
                card.style.transition = 'opacity 0.35s ease';
                card.style.opacity = '1';
              });
            } else {
              card.style.display = 'none';
            }
          });
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. In-Website YouTube Video Player Modal
  // --------------------------------------------------------------------------
  function openVideoModal(url, titleText) {
    if (!videoModal || !videoFrame) return;

    // Convert standard youtube link to embed if needed
    let embedUrl = url;
    if (url.includes('watch?v=')) {
      embedUrl = url.replace('watch?v=', 'embed/');
    }
    // Add autoplay & clean parameters
    const separator = embedUrl.includes('?') ? '&' : '?';
    embedUrl = `${embedUrl}${separator}autoplay=1&rel=0&modestbranding=1`;

    videoFrame.src = embedUrl;
    if (videoTitle) {
      videoTitle.textContent = titleText || 'Excursion Experience Video';
    }

    videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeVideoModalFunc() {
    if (!videoModal || !videoFrame) return;
    videoModal.classList.remove('active');
    // Immediately clear source so audio and video stop playing
    videoFrame.src = '';
    document.body.style.overflow = '';
  }

  videoTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const videoUrl = btn.getAttribute('data-video-url');
      const title = btn.getAttribute('data-video-title') || 'Dubai Excursion Preview';
      if (videoUrl) {
        openVideoModal(videoUrl, title);
      }
    });
  });

  if (closeVideoBtn) {
    closeVideoBtn.addEventListener('click', closeVideoModalFunc);
  }

  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        closeVideoModalFunc();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. Quick-View Attraction Detail Modal
  // --------------------------------------------------------------------------
  function openDetailModal(card) {
    if (!detailModal) return;

    const title = card.getAttribute('data-title') || card.querySelector('.spot-title')?.textContent || '';
    const categoryLabel = card.getAttribute('data-category-label') || 'Iconic Experience';
    const imgSrc = card.getAttribute('data-img') || card.querySelector('.spot-img')?.getAttribute('src') || '';
    const desc = card.getAttribute('data-desc') || card.querySelector('.spot-desc')?.textContent || '';
    const featuresRaw = card.getAttribute('data-features') || 'Private Chauffeur Transfers|Curated Guided Itinerary|Priority VIP Admission';

    if (detailTitle) detailTitle.textContent = title;
    if (detailTag) detailTag.textContent = categoryLabel;
    if (detailImg) {
      detailImg.src = imgSrc;
      detailImg.alt = title;
    }
    if (detailDesc) detailDesc.textContent = desc;

    // Build features checklist
    if (detailFeatures) {
      detailFeatures.innerHTML = '';
      const items = featuresRaw.split('|');
      items.forEach(itemText => {
        if (itemText.trim()) {
          const row = document.createElement('div');
          row.className = 'detail-feature-row';
          row.innerHTML = `<span class="icon">&#10003;</span> <span>${itemText.trim()}</span>`;
          detailFeatures.appendChild(row);
        }
      });
    }

    // WhatsApp Direct Inquiry CTA
    if (detailWaBtn) {
      const customMsg = encodeURIComponent(`Hi Nishamika Holiday, I would like to inquire about including "${title}" in my bespoke Dubai travel itinerary.`);
      detailWaBtn.href = `https://wa.me/919389892213?text=${customMsg}`;
    }

    detailModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDetailModalFunc() {
    if (!detailModal) return;
    detailModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  detailTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.spot-card');
      if (card) {
        openDetailModal(card);
      }
    });
  });

  if (closeDetailBtn) {
    closeDetailBtn.addEventListener('click', closeDetailModalFunc);
  }

  if (detailModal) {
    detailModal.addEventListener('click', (e) => {
      if (e.target === detailModal) {
        closeDetailModalFunc();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. Global Keyboard Listener (Escape key closes modals)
  // --------------------------------------------------------------------------
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (videoModal && videoModal.classList.contains('active')) {
        closeVideoModalFunc();
      }
      if (detailModal && detailModal.classList.contains('active')) {
        closeDetailModalFunc();
      }
    }
  });
});
