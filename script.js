document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const htmlElement = document.documentElement;

    // Check saved theme in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-bs-theme', savedTheme);
        themeIcon.textContent = savedTheme === 'dark' ? 'light_mode' : 'dark_mode';
    } else {
        // Default to dark mode based on user prompt template
        htmlElement.setAttribute('data-bs-theme', 'dark');
        themeIcon.textContent = 'light_mode';
    }

    // Toggle click event
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-bs-theme', newTheme);
        themeIcon.textContent = newTheme === 'dark' ? 'light_mode' : 'dark_mode';
        
        // Save to localStorage
        localStorage.setItem('theme', newTheme);
    });

    // Navbar scroll effect for glassmorphism adjustments
    const navbar = document.querySelector('.navbar-custom');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '8px 30px';
            navbar.style.background = 'var(--nav-bg)';
            navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
        } else {
            navbar.style.padding = '15px 30px';
            navbar.style.boxShadow = 'none';
        }
    });

    // Animate progress bars on scroll into view (only if on skills page)
    const progressBars = document.querySelectorAll('.progress-bar');
    const skillsSection = document.getElementById('skills');

    if(skillsSection && progressBars.length > 0) {
        const skillsObserver = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) {
                progressBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 300);
                });
                skillsObserver.disconnect(); // only animate once
            }
        }, { threshold: 0.5 });
        
        skillsObserver.observe(skillsSection);
    }

    // ---- Global Lightbox Logic ----
    const overlay    = document.getElementById('lightboxOverlay');
    const lbImg      = document.getElementById('lightboxImg');
    const lbBadge    = document.getElementById('lightboxBadge');
    const lbClose    = document.getElementById('lightboxClose');
    const lbImgWrap  = document.getElementById('lightboxImgWrap');

    if (overlay) {
        function openLightbox(imgSrc, badgeText) {
            lbImg.src = imgSrc;
            lbImg.style.width  = 'auto';
            lbImg.style.height = 'auto';
            if (lbBadge) lbBadge.textContent = badgeText || '';
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => { lbImg.src = ''; }, 300);
        }

        // Attach to the parent item, not the image, because the overlay blocks the image click
        document.querySelectorAll('.portfolio-item-new').forEach(item => {
            item.style.cursor = 'pointer';
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const img = this.querySelector('img');
                const badge = this.querySelector('.portfolio-overlay-badge');
                if (img) openLightbox(img.src, badge ? badge.textContent : '');
            });
        });

        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) closeLightbox();
        });

        if (lbClose) lbClose.addEventListener('click', closeLightbox);

        if (lbImgWrap) {
            lbImgWrap.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && overlay.classList.contains('active')) closeLightbox();
        });
    }
});
