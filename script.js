/* ============================================================
   INDIAN WEDDING INVITATION - JAVASCRIPT
   ============================================================ */

(function () {
    'use strict';

    /* ---------- CONFIGURATION ---------- */
    const WEDDING_DATE = new Date('2026-07-11T10:00:00+05:30');

    /* ---------- GUEST NAME FROM URL ---------- */
    function extractGuestName() {
        const path = window.location.pathname;
        const segments = path.split('/').filter(Boolean);
        const raw = segments.pop() || '';
        if (raw && raw !== 'index.html') return formatName(raw);
        if (window.location.hash) {
            const hash = window.location.hash.slice(1);
            if (hash) return formatName(hash);
        }
        const params = new URLSearchParams(window.location.search);
        const qName = params.get('name') || params.get('guest');
        if (qName) return formatName(qName);
        return null;
    }

    function formatName(raw) {
        const decoded = decodeURIComponent(raw);
        const name = decoded
            .replace(/[-_+]/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase())
            .trim();
        return name || null;
    }

    function setGuestGreeting() {
        const el = document.getElementById('guestGreeting');
        if (!el) return;
        const name = extractGuestName();
        if (name) {
            el.textContent = `Dear ${name}, you are cordially invited!`;
            document.title = `Wedding Invitation for ${name} - Prabhleen & Aryan`;
            const nameInput = document.getElementById('rsvpName');
            if (nameInput) nameInput.value = name;
        }
    }

    /* ---------- COUNTDOWN TIMER ---------- */
    function updateCountdown() {
        const now = new Date();
        const diff = WEDDING_DATE - now;
        if (diff <= 0) {
            document.getElementById('days').textContent = '0';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    /* ---------- SCROLL ANIMATIONS ---------- */
    function initScrollAnimations() {
        const elements = document.querySelectorAll('.fade-up, .fade-left, .fade-right');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
        );
        elements.forEach((el) => observer.observe(el));
    }

    /* ---------- NAVIGATION DOTS ---------- */
    function initNavDots() {
        const sections = document.querySelectorAll('.section');
        const dots = document.querySelectorAll('.nav-dot');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        dots.forEach((dot) => {
                            dot.classList.toggle('active', dot.dataset.section === id);
                        });
                    }
                });
            },
            { threshold: 0.3 }
        );
        sections.forEach((section) => observer.observe(section));
        dots.forEach((dot) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.getElementById(dot.dataset.section);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    /* ---------- FALLING PETALS ---------- */
    function initPetals() {
        const canvas = document.getElementById('petalsCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let w, h, petals = [];

        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        const COLORS = [
            // Pink (60%)
            { fill: 'rgba(220,140,160,0.35)', stroke: 'rgba(200,110,135,0.15)' },
            { fill: 'rgba(245,190,200,0.3)',  stroke: 'rgba(230,160,175,0.12)' },
            { fill: 'rgba(255,235,235,0.35)', stroke: 'rgba(230,200,200,0.12)' },
            { fill: 'rgba(230,155,175,0.33)', stroke: 'rgba(210,130,150,0.14)' },
            { fill: 'rgba(240,175,190,0.32)', stroke: 'rgba(220,150,168,0.13)' },
            { fill: 'rgba(250,200,210,0.3)',  stroke: 'rgba(235,175,188,0.12)' },
            // Light yellow (20%)
            { fill: 'rgba(245,225,150,0.3)',  stroke: 'rgba(220,200,120,0.12)' },
            { fill: 'rgba(255,240,180,0.32)', stroke: 'rgba(230,215,140,0.13)' },
            // Light blue (20%)
            { fill: 'rgba(180,210,240,0.28)', stroke: 'rgba(150,185,220,0.12)' },
            { fill: 'rgba(200,225,250,0.3)',  stroke: 'rgba(170,200,235,0.12)' },
        ];

        class Petal {
            constructor(scatter) {
                this.reset(scatter);
            }
            reset(scatter) {
                this.x = Math.random() * w;
                this.y = scatter ? Math.random() * h : -(Math.random() * 40 + 10);
                this.size = Math.random() * 7 + 4;
                this.speedY = Math.random() * 0.8 + 0.5;
                this.speedX = Math.random() * 0.15 - 0.075;
                this.rot = Math.random() * 360;
                this.rotSpd = Math.random() * 0.6 - 0.3;
                this.wobbleSpd = Math.random() * 0.008 + 0.003;
                this.wobbleOff = Math.random() * Math.PI * 2;
                this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
                this.sx = Math.random() * 0.25 + 0.7;
                this.sy = Math.random() * 0.2 + 0.5;
            }
            update(t) {
                this.y += this.speedY;
                this.x += this.speedX + Math.sin(t * this.wobbleSpd + this.wobbleOff) * 0.25;
                this.rot += this.rotSpd;
                if (this.y > h + 20) this.reset(false);
            }
            draw(ctx) {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rot * Math.PI / 180);
                ctx.scale(this.sx, this.sy);
                ctx.beginPath();
                ctx.moveTo(0, -this.size);
                ctx.bezierCurveTo(this.size * 0.7, -this.size * 0.4, this.size * 0.7, this.size * 0.3, 0, this.size);
                ctx.bezierCurveTo(-this.size * 0.7, this.size * 0.3, -this.size * 0.7, -this.size * 0.4, 0, -this.size);
                ctx.closePath();
                ctx.fillStyle = this.color.fill;
                ctx.fill();
                ctx.strokeStyle = this.color.stroke;
                ctx.lineWidth = 0.4;
                ctx.stroke();
                ctx.restore();
            }
        }

        var count = w < 768 ? Math.min(80, Math.floor(w / 14)) : Math.min(100, Math.floor(w / 14));
        for (var i = 0; i < count; i++) petals.push(new Petal(true));

        /* --- Fireworks --- */
        var rockets = [];
        var sparks = [];
        var fireworksFired = false;

        var SPARK_COLORS = [
            '#FF6B8A', '#FF85A2', '#FFB3C6',  // pinks
            '#FFD700', '#FFEC80', '#FFF4B8',  // golds
            '#87CEEB', '#ADD8E6', '#B0E0FF',  // blues
            '#FF7F50', '#FFA07A', '#FFB088',  // corals
            '#DDA0DD', '#DA70D6', '#E8A0E8',  // purples
            '#98FB98', '#90EE90', '#B0FFB0',  // greens
            '#FF4500', '#FF6347', '#FF8C69',  // reds
            '#FFFFFF', '#FFFAF0',              // whites
        ];

        function explodeAt(x, y, color, sparkCount) {
            for (var i = 0; i < sparkCount; i++) {
                var angle = Math.random() * Math.PI * 2;
                var speed = Math.random() * 3 + 1.2;
                var c = Math.random() < 0.6 ? color : SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];
                sparks.push({
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 1,
                    decay: 0.004 + Math.random() * 0.006,
                    color: c,
                    size: Math.random() * 3.5 + 1.5,
                    gravity: 0.012 + Math.random() * 0.01,
                });
            }
        }

        function launchFireworks() {
            if (fireworksFired) return;
            fireworksFired = true;

            var numBursts = 12;
            for (var i = 0; i < numBursts; i++) {
                (function(idx) {
                    setTimeout(function() {
                        var x = w * 0.1 + Math.random() * w * 0.8;
                        var y = h * 0.08 + Math.random() * h * 0.35;
                        var color = SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];
                        var count = 50 + Math.floor(Math.random() * 50);
                        explodeAt(x, y, color, count);
                    }, idx * 250 + Math.random() * 150);
                })(i);
            }
        }

        // Trigger fireworks once when countdown section is visible
        var countdownEl = document.getElementById('countdown');
        if (countdownEl) {
            var fwObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting && !fireworksFired) {
                        launchFireworks();
                        fwObserver.unobserve(countdownEl);
                    }
                });
            }, { threshold: 0.6 });
            fwObserver.observe(countdownEl);
        }



        var t = 0;
        function animate() {
            ctx.clearRect(0, 0, w, h);
            t++;

            // Petals
            for (var i = 0; i < petals.length; i++) { petals[i].update(t); petals[i].draw(ctx); }


            // Sparks
            if (sparks.length > 0) {
                for (var i = sparks.length - 1; i >= 0; i--) {
                    var s = sparks[i];
                    s.x += s.vx;
                    s.y += s.vy;
                    s.vy += s.gravity;
                    s.vx *= 0.99;
                    s.life -= s.decay;

                    if (s.life <= 0) {
                        sparks.splice(i, 1);
                        continue;
                    }

                    ctx.beginPath();
                    ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
                    ctx.fillStyle = s.color;
                    ctx.globalAlpha = s.life;
                    ctx.fill();
                    ctx.globalAlpha = 1;
                }
            }

            requestAnimationFrame(animate);
        }
        animate();
    }

    /* ---------- RSVP FORM ---------- */
    // Paste your Google Apps Script web app URL here after setup:
    var RSVP_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxvizPid3_jnKh5l6Vc5T0caTi4c7D5MpJDhFBtqbaRuuPs4i1klmCI9XsXpGnD_hfT8w/exec';

    function initRSVP() {
        const form = document.getElementById('rsvpForm');
        const success = document.getElementById('rsvpSuccess');
        if (!form || !success) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const btn = form.querySelector('.rsvp-submit');
            const btnLabel = btn.querySelector('span');
            btn.disabled = true;
            btnLabel.textContent = 'Sending…';

            const formData = new FormData(form);
            const events = formData.getAll('events');
            const eventLabels = { haldi: 'Haldi Ceremony', wedding: 'Wedding Ceremony', reception: 'Grand Reception' };
            const eventsText = events.length
                ? events.map(function(ev) { return eventLabels[ev] || ev; }).join(', ')
                : 'None';

            const payload = JSON.stringify({
                name:       formData.get('name') || '',
                email:      formData.get('email') || '',
                phone:      formData.get('phone') || '',
                guests:     formData.get('guests') || '',
                attendance: formData.get('attendance') === 'yes' ? 'Accepting' : 'Declining',
                events:     eventsText,
                message:    formData.get('message') || '',
            });

            function showSuccess() {
                form.style.display = 'none';
                success.classList.add('show');
                success.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            if (RSVP_SHEET_URL && RSVP_SHEET_URL !== 'YOUR_APPS_SCRIPT_URL') {
                fetch(RSVP_SHEET_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'text/plain' },
                    body: payload,
                }).finally(showSuccess);
            } else {
                console.log('RSVP (sheet not configured):', payload);
                showSuccess();
            }
        });
    }

    /* ---------- PARALLAX EFFECT ON SCROLL ---------- */
    function initParallax() {
        const hero = document.querySelector('.hero-section');
        const heroCouple = document.getElementById('heroCouple');
        function onScroll() {
            const scrollY = window.scrollY;
            const vh = window.innerHeight;
            if (scrollY > vh) return;

            if (hero) {
                const heroContent = hero.querySelector('.hero-content');
                if (heroContent) {
                    heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
                    heroContent.style.opacity = 1 - scrollY / (vh * 0.8);
                }
            }

            if (heroCouple) {
                var progress = scrollY / (vh * 0.6);
                heroCouple.style.opacity = 1 - progress;
                heroCouple.style.transform = `translateX(-50%) translateY(${scrollY * 0.4}px)`;
            }
        }
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ---------- IMAGE CAROUSEL ---------- */
    function initCarousel() {
        var images = [
            'assets/images/couple_pune.jpg',
            'assets/images/couple_bbnp.jpg',
            'assets/images/couple_acadia.png',
            'assets/images/couple_grad.png'
        ];
        var idx = 0;
        var img = document.getElementById('carouselImg');
        var prev = document.getElementById('carouselPrev');
        var next = document.getElementById('carouselNext');
        if (!img || !prev || !next) return;

        function show(newIdx) {
            img.style.opacity = 0;
            setTimeout(function() {
                idx = (newIdx + images.length) % images.length;
                img.src = images[idx];
                img.style.opacity = 1;
            }, 300);
        }

        prev.addEventListener('click', function() { show(idx - 1); });
        next.addEventListener('click', function() { show(idx + 1); });
    }

    /* ---------- SMOOTH ANCHOR LINKS ---------- */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                var target = document.querySelector(this.getAttribute('href'));
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    /* ---------- INIT ---------- */
    /* ---------- LOCK BACKGROUND SIZE (mobile only) ---------- */
    function lockBgSize() {
        var bg = document.getElementById('bgFixed');
        if (!bg) return;
        // Only lock on mobile/touch — prevents URL bar resize jank
        // Desktop uses inset:0 which handles zoom correctly
        var isMobile = 'ontouchstart' in window || window.innerWidth <= 1024;
        if (isMobile) {
            bg.style.height = window.screen.height + 'px';
        }
    }

    function init() {
        lockBgSize();
        setGuestGreeting();
        updateCountdown();
        setInterval(updateCountdown, 1000);
        initScrollAnimations();
        initNavDots();
        initPetals();
        initRSVP();
        initCarousel();
        initParallax();
        initSmoothScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
