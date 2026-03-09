/* ========================================
   A GARDEN OF US — Multi-Page Script
   Handles: Navigation, Transitions, Canvas,
   Scroll Animations, Rich Interactions,
   Twinkling Stars, Love Counter, Music,
   Love Quiz, Ripple, Custom Cursor
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ============ PAGE TRANSITION ============
    const transition = document.getElementById('page-transition');

    if (transition) {
        transition.classList.add('leaving');
        setTimeout(() => { transition.style.display = 'none'; }, 600);
    }

    document.querySelectorAll('[data-nav]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || href === '#' || href === window.location.pathname.split('/').pop()) return;
            e.preventDefault();
            transition.style.display = 'flex';
            transition.classList.remove('leaving');
            requestAnimationFrame(() => transition.classList.add('entering'));
            setTimeout(() => { window.location.href = href; }, 500);
        });
    });

    // ============ MOBILE NAV TOGGLE ============
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
        });
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

    // ============ CUSTOM FLOWER CURSOR ============
    const cursorFlower = document.createElement('div');
    cursorFlower.className = 'custom-cursor';
    cursorFlower.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24"><g stroke="#B76E79" fill="none" stroke-width="0.8"><ellipse cx="12" cy="6" rx="3" ry="5" transform="rotate(0,12,12)" fill="rgba(240,212,216,0.4)"/><ellipse cx="12" cy="6" rx="3" ry="5" transform="rotate(72,12,12)" fill="rgba(230,224,243,0.4)"/><ellipse cx="12" cy="6" rx="3" ry="5" transform="rotate(144,12,12)" fill="rgba(240,212,216,0.4)"/><ellipse cx="12" cy="6" rx="3" ry="5" transform="rotate(216,12,12)" fill="rgba(230,224,243,0.4)"/><ellipse cx="12" cy="6" rx="3" ry="5" transform="rotate(288,12,12)" fill="rgba(240,212,216,0.4)"/><circle cx="12" cy="12" r="2.5" fill="rgba(218,165,32,0.5)" stroke="#DAA520" stroke-width="0.5"/></g></svg>`;
    document.body.appendChild(cursorFlower);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX, cursorY = mouseY;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        cursorFlower.style.transform = `translate(${cursorX - 12}px, ${cursorY - 12}px)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // ============ SCROLL REVEAL ANIMATIONS ============
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('[data-animate]').forEach(el => scrollObserver.observe(el));

    // ============ FLOATING PETALS CANVAS ============
    const petalsCanvas = document.getElementById('petals-canvas');
    if (petalsCanvas) {
        const ctx = petalsCanvas.getContext('2d');
        let petals = [];
        const petalColors = [
            'rgba(240, 212, 216, 0.45)', 'rgba(240, 212, 216, 0.3)',
            'rgba(230, 224, 243, 0.4)', 'rgba(230, 224, 243, 0.25)',
            'rgba(201, 160, 160, 0.35)', 'rgba(184, 169, 201, 0.35)',
            'rgba(184, 169, 201, 0.2)', 'rgba(218, 165, 32, 0.18)',
            'rgba(218, 165, 32, 0.12)', 'rgba(183, 110, 121, 0.25)',
            'rgba(200, 180, 210, 0.3)'
        ];

        function resizePetalsCanvas() {
            petalsCanvas.width = window.innerWidth;
            petalsCanvas.height = window.innerHeight;
        }
        resizePetalsCanvas();
        window.addEventListener('resize', resizePetalsCanvas);

        class Petal {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * petalsCanvas.width;
                this.y = -20 - Math.random() * 100;
                this.size = 3 + Math.random() * 10;
                this.speedY = 0.2 + Math.random() * 0.8;
                this.speedX = -0.4 + Math.random() * 0.8;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = -0.025 + Math.random() * 0.05;
                this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
                this.wobble = Math.random() * Math.PI * 2;
                this.wobbleSpeed = 0.015 + Math.random() * 0.035;
                this.isFlower = Math.random() > 0.75;
            }
            update() {
                this.y += this.speedY;
                this.wobble += this.wobbleSpeed;
                this.x += this.speedX + Math.sin(this.wobble) * 0.3;
                this.rotation += this.rotationSpeed;
                const dx = this.x - mouseX, dy = this.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const force = (120 - dist) / 120 * 0.8;
                    this.x += (dx / dist) * force;
                    this.y += (dy / dist) * force * 0.5;
                }
                if (this.y > petalsCanvas.height + 20) this.reset();
            }
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.fillStyle = this.color;
                if (this.isFlower) {
                    const pc = 5, r = this.size * 0.5;
                    ctx.strokeStyle = this.color.replace(/[\d.]+\)$/, '0.6)');
                    ctx.lineWidth = 0.6;
                    for (let i = 0; i < pc; i++) {
                        const angle = (i * Math.PI * 2) / pc;
                        ctx.beginPath();
                        ctx.ellipse(Math.cos(angle) * r * 0.5, Math.sin(angle) * r * 0.5,
                            r * 0.35, r * 0.65, angle, 0, Math.PI * 2);
                        ctx.fill(); ctx.stroke();
                    }
                    ctx.beginPath();
                    ctx.arc(0, 0, r * 0.22, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(218, 165, 32, 0.35)'; ctx.fill();
                } else {
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.bezierCurveTo(this.size * 0.4, -this.size * 0.5, this.size, -this.size * 0.3, this.size, 0);
                    ctx.bezierCurveTo(this.size, this.size * 0.3, this.size * 0.4, this.size * 0.5, 0, 0);
                    ctx.fill();
                }
                ctx.restore();
            }
        }

        const petalCount = Math.min(70, Math.floor(window.innerWidth / 22));
        for (let i = 0; i < petalCount; i++) {
            const p = new Petal();
            p.y = Math.random() * petalsCanvas.height;
            petals.push(p);
        }

        function animatePetals() {
            ctx.clearRect(0, 0, petalsCanvas.width, petalsCanvas.height);
            petals.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animatePetals);
        }
        animatePetals();
    }

    // ============ ✨ TWINKLING STARS CANVAS ============
    const starsCanvas = document.getElementById('stars-canvas');
    if (starsCanvas) {
        const sCtx = starsCanvas.getContext('2d');
        let stars = [];

        function resizeStarsCanvas() {
            starsCanvas.width = window.innerWidth;
            starsCanvas.height = document.documentElement.scrollHeight;
        }
        resizeStarsCanvas();
        window.addEventListener('resize', resizeStarsCanvas);

        class Star {
            constructor() {
                this.x = Math.random() * starsCanvas.width;
                this.y = Math.random() * starsCanvas.height;
                this.radius = 0.5 + Math.random() * 1.8;
                this.alpha = Math.random();
                this.alphaDirection = (Math.random() > 0.5 ? 1 : -1) * (0.003 + Math.random() * 0.012);
                this.color = ['#FFD700', '#F0D4D8', '#E6E0F3', '#B8A9C9', '#FFFFFF', '#C9A0A0'][Math.floor(Math.random() * 6)];
            }
            update() {
                this.alpha += this.alphaDirection;
                if (this.alpha <= 0.05 || this.alpha >= 0.9) this.alphaDirection *= -1;
            }
            draw() {
                sCtx.save();
                sCtx.globalAlpha = this.alpha * 0.6;
                sCtx.fillStyle = this.color;
                sCtx.beginPath();
                // Draw a tiny star shape
                if (this.radius > 1.2) {
                    const spikes = 4, outerR = this.radius, innerR = this.radius * 0.4;
                    for (let i = 0; i < spikes * 2; i++) {
                        const r = i % 2 === 0 ? outerR : innerR;
                        const angle = (i * Math.PI) / spikes - Math.PI / 2;
                        if (i === 0) sCtx.moveTo(this.x + Math.cos(angle) * r, this.y + Math.sin(angle) * r);
                        else sCtx.lineTo(this.x + Math.cos(angle) * r, this.y + Math.sin(angle) * r);
                    }
                    sCtx.closePath();
                } else {
                    sCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                }
                sCtx.fill();
                // Glow effect
                sCtx.shadowBlur = this.radius * 3;
                sCtx.shadowColor = this.color;
                sCtx.fill();
                sCtx.restore();
            }
        }

        const starCount = Math.min(120, Math.floor(window.innerWidth * starsCanvas.height / 15000));
        for (let i = 0; i < starCount; i++) stars.push(new Star());

        function animateStars() {
            sCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
            stars.forEach(s => { s.update(); s.draw(); });
            requestAnimationFrame(animateStars);
        }
        animateStars();
    }

    // ============ CHERRY BLOSSOM CANVAS (Wish page) ============
    const cherryCanvas = document.getElementById('cherry-canvas');
    if (cherryCanvas) {
        const cCtx = cherryCanvas.getContext('2d');
        let blossoms = [];

        function resizeCherryCanvas() {
            cherryCanvas.width = cherryCanvas.parentElement.offsetWidth;
            cherryCanvas.height = cherryCanvas.parentElement.offsetHeight;
        }
        resizeCherryCanvas();
        window.addEventListener('resize', resizeCherryCanvas);

        class Blossom {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * cherryCanvas.width;
                this.y = -10 - Math.random() * 50;
                this.size = 3 + Math.random() * 5;
                this.speedY = 0.4 + Math.random() * 0.8;
                this.speedX = -0.5 + Math.random() * 1;
                this.opacity = 0.15 + Math.random() * 0.25;
                this.wobble = Math.random() * Math.PI * 2;
                this.isFlower = Math.random() > 0.6;
            }
            update() {
                this.y += this.speedY;
                this.wobble += 0.02;
                this.x += this.speedX + Math.sin(this.wobble) * 0.4;
                if (this.y > cherryCanvas.height + 20) this.reset();
            }
            draw() {
                cCtx.save();
                cCtx.globalAlpha = this.opacity;
                cCtx.translate(this.x, this.y);
                if (this.isFlower) {
                    cCtx.strokeStyle = '#C9A0A0'; cCtx.lineWidth = 0.5;
                    cCtx.fillStyle = 'rgba(240, 212, 216, 0.3)';
                    for (let i = 0; i < 5; i++) {
                        cCtx.beginPath();
                        const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
                        const px = Math.cos(angle) * this.size, py = Math.sin(angle) * this.size;
                        cCtx.ellipse(px / 2, py / 2, this.size * 0.3, this.size * 0.6, angle, 0, Math.PI * 2);
                        cCtx.fill(); cCtx.stroke();
                    }
                    cCtx.beginPath();
                    cCtx.arc(0, 0, this.size * 0.2, 0, Math.PI * 2);
                    cCtx.fillStyle = 'rgba(218, 165, 32, 0.4)'; cCtx.fill();
                } else {
                    cCtx.fillStyle = Math.random() > 0.5 ? 'rgba(240, 212, 216, 0.5)' : 'rgba(230, 224, 243, 0.5)';
                    cCtx.beginPath();
                    cCtx.ellipse(0, 0, this.size * 0.5, this.size, 0, 0, Math.PI * 2);
                    cCtx.fill();
                }
                cCtx.restore();
            }
        }

        for (let i = 0; i < 65; i++) {
            const b = new Blossom();
            b.y = Math.random() * cherryCanvas.height;
            blossoms.push(b);
        }

        function animateBlossoms() {
            cCtx.clearRect(0, 0, cherryCanvas.width, cherryCanvas.height);
            blossoms.forEach(b => { b.update(); b.draw(); });
            requestAnimationFrame(animateBlossoms);
        }
        animateBlossoms();
    }

    // ============ 🌸 MOUSE FLOWER TRAIL ============
    let lastTrailTime = 0;

    function createTrailPetal(x, y) {
        const el = document.createElement('div');
        el.className = 'trail-petal';
        const size = 6 + Math.random() * 12;
        const hue = [340, 280, 45, 320, 260][Math.floor(Math.random() * 5)];
        const isFlower = Math.random() > 0.6;
        el.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;`;
        if (isFlower) {
            el.innerHTML = `<svg viewBox="0 0 20 20" width="${size}" height="${size}"><g stroke="hsl(${hue},50%,65%)" fill="hsl(${hue},40%,85%)" stroke-width="0.5" opacity="0.7"><ellipse cx="10" cy="4" rx="3" ry="5" transform="rotate(0,10,10)"/><ellipse cx="10" cy="4" rx="3" ry="5" transform="rotate(72,10,10)"/><ellipse cx="10" cy="4" rx="3" ry="5" transform="rotate(144,10,10)"/><ellipse cx="10" cy="4" rx="3" ry="5" transform="rotate(216,10,10)"/><ellipse cx="10" cy="4" rx="3" ry="5" transform="rotate(288,10,10)"/><circle cx="10" cy="10" r="2" fill="rgba(218,165,32,0.5)"/></g></svg>`;
        } else {
            el.style.background = `hsla(${hue}, 60%, 80%, 0.6)`;
            el.style.borderRadius = '50% 0 50% 50%';
        }
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1200);
    }

    document.addEventListener('mousemove', e => {
        const now = Date.now();
        if (now - lastTrailTime > 60) {
            lastTrailTime = now;
            createTrailPetal(e.clientX - 5 + Math.random() * 10, e.clientY - 5 + Math.random() * 10);
        }
    });

    // ============ 🌻 CLICK TO PLANT A FLOWER ============
    const flowerSVGs = [
        `<svg viewBox="0 0 40 70"><g stroke="#B76E79" fill="none" stroke-width="1" stroke-linecap="round"><path d="M20,24 C18,21 15,19 17,16 C20,14 23,16 22,19"/><path d="M20,24 C15,28 9,28 7,22 C5,16 11,12 17,16" fill="rgba(240,212,216,0.2)"/><path d="M20,24 C25,28 31,28 33,22 C35,16 29,12 23,16" fill="rgba(240,212,216,0.2)"/><path d="M20,28 L20,62" stroke="#5A8A5A"/><path d="M20,40 C14,34 8,34 10,38" stroke="#5A8A5A" fill="rgba(143,188,143,0.1)"/></g></svg>`,
        `<svg viewBox="0 -10 40 80"><g stroke="#DAA520" fill="none" stroke-width="1" stroke-linecap="round"><ellipse cx="20" cy="10" rx="4" ry="10" transform="rotate(0,20,22)" fill="rgba(218,165,32,0.12)"/><ellipse cx="20" cy="10" rx="4" ry="10" transform="rotate(30,20,22)" fill="rgba(240,212,216,0.08)"/><ellipse cx="20" cy="10" rx="4" ry="10" transform="rotate(60,20,22)" fill="rgba(218,165,32,0.12)"/><ellipse cx="20" cy="10" rx="4" ry="10" transform="rotate(90,20,22)" fill="rgba(240,212,216,0.08)"/><ellipse cx="20" cy="10" rx="4" ry="10" transform="rotate(120,20,22)" fill="rgba(218,165,32,0.12)"/><ellipse cx="20" cy="10" rx="4" ry="10" transform="rotate(150,20,22)" fill="rgba(240,212,216,0.08)"/><circle cx="20" cy="22" r="7" fill="rgba(139,69,19,0.15)" stroke="#8B4513"/><path d="M20,29 L20,62" stroke="#5A8A5A"/></g></svg>`,
        `<svg viewBox="0 0 40 70"><g stroke="#B8A9C9" fill="none" stroke-width="1" stroke-linecap="round"><ellipse cx="20" cy="10" rx="3.5" ry="9" transform="rotate(0,20,20)" fill="rgba(230,224,243,0.15)"/><ellipse cx="20" cy="10" rx="3.5" ry="9" transform="rotate(45,20,20)" fill="rgba(240,212,216,0.1)"/><ellipse cx="20" cy="10" rx="3.5" ry="9" transform="rotate(90,20,20)" fill="rgba(230,224,243,0.15)"/><ellipse cx="20" cy="10" rx="3.5" ry="9" transform="rotate(135,20,20)" fill="rgba(240,212,216,0.1)"/><ellipse cx="20" cy="10" rx="3.5" ry="9" transform="rotate(180,20,20)" fill="rgba(230,224,243,0.15)"/><ellipse cx="20" cy="10" rx="3.5" ry="9" transform="rotate(225,20,20)" fill="rgba(240,212,216,0.1)"/><ellipse cx="20" cy="10" rx="3.5" ry="9" transform="rotate(270,20,20)" fill="rgba(230,224,243,0.15)"/><ellipse cx="20" cy="10" rx="3.5" ry="9" transform="rotate(315,20,20)" fill="rgba(240,212,216,0.1)"/><circle cx="20" cy="20" r="4.5" fill="rgba(218,165,32,0.2)" stroke="#DAA520"/><path d="M20,25 L20,62" stroke="#5A8A5A"/></g></svg>`,
        `<svg viewBox="0 0 40 70"><g stroke="#B76E79" fill="none" stroke-width="1" stroke-linecap="round"><path d="M20,25 C16,15 12,3 20,0 C28,3 24,15 20,25" fill="rgba(240,212,216,0.15)"/><path d="M20,25 C14,18 6,12 10,4 C16,8 18,15 20,25" fill="rgba(230,224,243,0.1)"/><path d="M20,25 C26,18 34,12 30,4 C24,8 22,15 20,25" fill="rgba(240,212,216,0.15)"/><path d="M20,25 L20,62" stroke="#5A8A5A"/><path d="M20,40 C14,34 8,34 10,38" stroke="#5A8A5A" fill="rgba(143,188,143,0.08)"/></g></svg>`,
        `<svg viewBox="0 0 40 70"><g stroke="#C9A0A0" fill="none" stroke-width="1" stroke-linecap="round"><path d="M20,20 C18,14 14,8 20,5 C26,8 22,14 20,20" fill="rgba(240,212,216,0.15)"/><path d="M20,20 C14,18 8,14 8,20 C8,26 14,22 20,20" fill="rgba(240,212,216,0.15)"/><path d="M20,20 C26,18 32,14 32,20 C32,26 26,22 20,20" fill="rgba(230,224,243,0.15)"/><path d="M20,20 C17,26 14,32 18,34 C22,32 20,26 20,20" fill="rgba(240,212,216,0.15)"/><path d="M20,20 C23,26 26,32 22,34 C18,32 20,26 20,20" fill="rgba(230,224,243,0.15)"/><circle cx="20" cy="20" r="2.5" fill="rgba(218,165,32,0.25)" stroke="#DAA520" stroke-width="0.6"/><path d="M20,26 L20,62" stroke="#5A8A5A"/></g></svg>`
    ];

    let plantedFlowers = 0;
    const MAX_PLANTED = 25;

    document.addEventListener('click', (e) => {
        if (e.target.closest('.navbar, .love-note, .cake, a, button, .gallery-item, .timeline-card, .quiz-option, .quiz-container, .music-toggle')) return;

        // Ripple effect
        createRipple(e.clientX, e.clientY);

        if (plantedFlowers >= MAX_PLANTED) {
            const oldest = document.querySelector('.planted-flower');
            if (oldest) oldest.remove();
            plantedFlowers--;
        }

        const flower = document.createElement('div');
        flower.className = 'planted-flower';
        flower.innerHTML = flowerSVGs[Math.floor(Math.random() * flowerSVGs.length)];
        const size = 30 + Math.random() * 25;
        flower.style.cssText = `left:${e.pageX}px;top:${e.pageY}px;width:${size}px;`;
        document.body.appendChild(flower);
        plantedFlowers++;

        setTimeout(() => {
            flower.classList.add('wilting');
            setTimeout(() => { flower.remove(); plantedFlowers--; }, 1500);
        }, 12000);

        // Sparkles
        for (let i = 0; i < 6; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            const angle = (Math.PI * 2 * i) / 6;
            const distance = 15 + Math.random() * 25;
            sparkle.style.left = (e.clientX + Math.cos(angle) * distance) + 'px';
            sparkle.style.top = (e.clientY + Math.sin(angle) * distance) + 'px';
            sparkle.style.background = ['#FFD700', '#B76E79', '#B8A9C9', '#F0D4D8', '#DAA520', '#8FBC8F'][i];
            document.body.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 800);
        }
    });

    // ============ 🌊 RIPPLE EFFECT ============
    function createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 1000);
    }

    // ============ 💕 DOUBLE TAP — FLOATING HEARTS ============
    document.addEventListener('dblclick', (e) => {
        if (e.target.closest('.navbar, a, button')) return;
        for (let i = 0; i < 8; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = ['💕', '💖', '💗', '🌸', '✨', '🌷', '💜', '🌹'][i];
            heart.style.left = (e.clientX - 10 + (Math.random() - 0.5) * 60) + 'px';
            heart.style.top = (e.clientY) + 'px';
            heart.style.animationDelay = (Math.random() * 0.3) + 's';
            heart.style.fontSize = (16 + Math.random() * 14) + 'px';
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 2500);
        }
    });

    // ============ LOVE NOTES FLIP CARDS with petal burst ============
    document.querySelectorAll('.love-note').forEach(note => {
        note.addEventListener('click', () => {
            const wasFlipped = note.classList.contains('flipped');
            note.classList.toggle('flipped');
            if (!wasFlipped) {
                const rect = note.getBoundingClientRect();
                const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
                for (let i = 0; i < 12; i++) {
                    const p = document.createElement('div');
                    p.className = 'note-petal-burst';
                    const angle = (Math.PI * 2 * i) / 12;
                    const dist = 40 + Math.random() * 60;
                    p.style.left = cx + 'px'; p.style.top = cy + 'px';
                    p.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
                    p.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
                    p.style.background = ['#F0D4D8', '#E6E0F3', '#B76E79', '#B8A9C9', '#FFD700', '#C9A0A0'][i % 6];
                    document.body.appendChild(p);
                    setTimeout(() => p.remove(), 800);
                }
            }
        });
    });

    // ============ BIRTHDAY CAKE INTERACTION ============
    const cake = document.getElementById('birthday-cake');
    const flame = document.getElementById('flame');
    if (cake && flame) {
        cake.addEventListener('click', () => {
            if (flame.classList.contains('out')) { flame.classList.remove('out'); return; }
            flame.classList.add('out');
            launchConfetti();
            for (let i = 0; i < 10; i++) {
                const heart = document.createElement('div');
                heart.className = 'floating-heart';
                heart.textContent = ['🎂', '🎉', '🎈', '💖', '✨', '🎁', '🌸', '💕', '🥳', '🎊'][i];
                const rect = cake.getBoundingClientRect();
                heart.style.left = (rect.left + rect.width / 2 - 10 + (Math.random() - 0.5) * 80) + 'px';
                heart.style.top = rect.top + 'px';
                heart.style.animationDelay = (Math.random() * 0.5) + 's';
                heart.style.fontSize = (18 + Math.random() * 16) + 'px';
                document.body.appendChild(heart);
                setTimeout(() => heart.remove(), 3000);
            }
            setTimeout(() => flame.classList.remove('out'), 4000);
        });
    }

    function launchConfetti() {
        const colors = ['#B76E79', '#B8A9C9', '#F0D4D8', '#E6E0F3', '#DAA520', '#FFD700', '#9E5A64', '#7B68AE', '#C9A0A0', '#8FBC8F'];
        for (let i = 0; i < 80; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            const size = 6 + Math.random() * 10;
            piece.style.width = size + 'px';
            piece.style.height = size * (0.4 + Math.random() * 0.6) + 'px';
            piece.style.left = (10 + Math.random() * 80) + 'vw';
            piece.style.top = (20 + Math.random() * 30) + 'vh';
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            piece.style.animationDuration = (2 + Math.random() * 2.5) + 's';
            piece.style.animationDelay = (Math.random() * 0.6) + 's';
            document.body.appendChild(piece);
            setTimeout(() => piece.remove(), 5500);
        }
    }

    // ============ ✍️ TYPEWRITER EFFECT (Wish Letter) ============
    const wishLetter = document.querySelector('.wish-letter');
    if (wishLetter) {
        const paragraphs = wishLetter.querySelectorAll('p');
        const originalTexts = [];
        paragraphs.forEach(p => { originalTexts.push(p.textContent); p.textContent = ''; p.style.visibility = 'hidden'; });
        let letterStarted = false;
        const letterObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !letterStarted) {
                letterStarted = true;
                typewriteAllParagraphs(paragraphs, originalTexts);
                letterObserver.unobserve(wishLetter);
            }
        }, { threshold: 0.3 });
        letterObserver.observe(wishLetter);
    }

    function typewriteAllParagraphs(paragraphs, texts) {
        let pIndex = 0;
        function typeParagraph() {
            if (pIndex >= paragraphs.length) return;
            const p = paragraphs[pIndex], text = texts[pIndex];
            p.style.visibility = 'visible';
            let charIndex = 0;
            const speed = pIndex === 0 ? 50 : 25;
            function typeChar() {
                if (charIndex <= text.length) {
                    p.textContent = text.substring(0, charIndex);
                    charIndex++;
                    setTimeout(typeChar, speed);
                } else { pIndex++; setTimeout(typeParagraph, 300); }
            }
            typeChar();
        }
        typeParagraph();
    }

    // ============ 🌊 PARALLAX ON MOUSE MOVE (Hero page) ============
    const heroPage = document.querySelector('.hero-page');
    const heroBgSketches = document.querySelector('.hero-bg-sketches');
    if (heroPage && heroBgSketches) {
        heroPage.addEventListener('mousemove', (e) => {
            const rect = heroPage.getBoundingClientRect();
            const xPercent = (e.clientX - rect.left) / rect.width - 0.5;
            const yPercent = (e.clientY - rect.top) / rect.height - 0.5;
            heroBgSketches.querySelectorAll('svg').forEach((svg, i) => {
                const depth = (i + 1) * 8;
                svg.style.transform = `translate(${xPercent * depth}px, ${yPercent * depth}px)`;
            });
            const mainFlower = heroPage.querySelector('.hero-flower-main');
            if (mainFlower) mainFlower.style.transform = `translate(${xPercent * -12}px, ${yPercent * -8}px)`;
        });
    }

    // ============ 🎵 3D TILT ON HOVER ============
    document.querySelectorAll('.timeline-card, .gallery-frame').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            card.style.transform = `perspective(600px) rotateX(${(y - 0.5) * 8}deg) rotateY(${(x - 0.5) * -8}deg) translateY(-5px)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });

    // ============ ✨ MAGNETIC HOVER on CTA Buttons ============
    document.querySelectorAll('.hero-enter-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.05)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });

    // ============ 📜 SCROLL PROGRESS BAR ============
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = (scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0) + '%';
    });


    // ============ 🔤 SHIMMER HOVER on titles ============
    document.querySelectorAll('.section-title, .wish-title').forEach(title => title.classList.add('shimmer-hover'));

    // ============ 📸 GALLERY LIGHTBOX ============
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const frame = item.querySelector('.gallery-frame');
            if (!frame) return;
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `<div class="lightbox-content">${frame.innerHTML}<p class="lightbox-caption">${item.querySelector('.gallery-caption')?.textContent || ''}</p><button class="lightbox-close">✕</button></div>`;
            document.body.appendChild(lightbox);
            requestAnimationFrame(() => lightbox.classList.add('open'));
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                    lightbox.classList.remove('open');
                    setTimeout(() => lightbox.remove(), 400);
                }
            });
        });
    });



    // ============ 🎵 AMBIENT MUSIC TOGGLE ============
    const musicToggle = document.getElementById('music-toggle');
    if (musicToggle) {
        let audioCtx, masterGain, isPlaying = false, melodyTimeout = null;

        // Note frequencies (Hz)
        const NOTE = {
            C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00,
            A4: 440.00, Bb4: 466.16, B4: 493.88,
            C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99,
            A3: 220.00, C3: 130.81, E3: 164.81, F3: 174.61, G3: 196.00,
            Bb3: 233.08, D3: 146.83
        };

        // Happy Birthday melody: [frequency, duration in beats, rest after in beats]
        const melody = [
            // "Happy birthday to you"
            [NOTE.C4, 0.75], [NOTE.C4, 0.25], [NOTE.D4, 1], [NOTE.C4, 1], [NOTE.F4, 1], [NOTE.E4, 2],
            // "Happy birthday to you"
            [NOTE.C4, 0.75], [NOTE.C4, 0.25], [NOTE.D4, 1], [NOTE.C4, 1], [NOTE.G4, 1], [NOTE.F4, 2],
            // "Happy birthday dear [name]"
            [NOTE.C4, 0.75], [NOTE.C4, 0.25], [NOTE.C5, 1], [NOTE.A4, 1], [NOTE.F4, 0.75], [NOTE.F4, 0.25], [NOTE.E4, 1], [NOTE.D4, 2],
            // "Happy birthday to you"
            [NOTE.Bb4, 0.75], [NOTE.Bb4, 0.25], [NOTE.A4, 1], [NOTE.F4, 1], [NOTE.G4, 1], [NOTE.F4, 2],
        ];

        // Chord progression (root notes for ambient pad)
        const chords = [
            [[NOTE.F3, NOTE.A3, NOTE.C4], 4],  // F major
            [[NOTE.F3, NOTE.A3, NOTE.C4], 4],  // F major
            [[NOTE.C3, NOTE.E3, NOTE.G3], 4],  // C major
            [[NOTE.F3, NOTE.A3, NOTE.C4], 4],  // F major
            [[NOTE.F3, NOTE.A3, NOTE.C4], 2],  // F
            [[NOTE.C3, NOTE.E3, NOTE.G3], 2],  // C
            [[NOTE.F3, NOTE.A3, NOTE.C4], 4],  // F
            [[NOTE.C3, NOTE.E3, NOTE.G3], 2],  // C
            [[NOTE.F3, NOTE.A3, NOTE.C4], 2],  // F
            [[NOTE.F3, NOTE.A3, NOTE.C4], 4],  // F
            [[NOTE.Bb3, NOTE.D4, NOTE.F4], 2], // Bb
            [[NOTE.F3, NOTE.A3, NOTE.C4], 2],  // F
            [[NOTE.C3, NOTE.E3, NOTE.G3], 2],  // C
            [[NOTE.F3, NOTE.A3, NOTE.C4], 2],  // F
        ];

        // Create a simple convolver for reverb
        function createReverb(ctx, duration, decay) {
            const sampleRate = ctx.sampleRate;
            const length = sampleRate * duration;
            const impulse = ctx.createBuffer(2, length, sampleRate);
            for (let ch = 0; ch < 2; ch++) {
                const data = impulse.getChannelData(ch);
                for (let i = 0; i < length; i++) {
                    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
                }
            }
            const convolver = ctx.createConvolver();
            convolver.buffer = impulse;
            return convolver;
        }

        // Play a single music-box note
        function playNote(freq, startTime, duration, ctx, dest, volume = 0.12) {
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();

            // Music box: sine + soft triangle harmonic
            osc1.type = 'sine';
            osc1.frequency.value = freq;
            osc2.type = 'triangle';
            osc2.frequency.value = freq * 2; // octave harmonic for sparkle

            const gain2 = ctx.createGain();
            gain2.gain.value = 0.15; // subtle harmonic

            osc1.connect(gain);
            osc2.connect(gain2);
            gain2.connect(gain);
            gain.connect(dest);

            // Envelope: quick attack, gentle decay
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(volume * 0.6, startTime + duration * 0.3);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 0.95);
            gain.gain.setValueAtTime(0, startTime + duration);

            osc1.start(startTime);
            osc1.stop(startTime + duration);
            osc2.start(startTime);
            osc2.stop(startTime + duration);
        }

        // Play a soft ambient pad chord
        function playPadChord(notes, startTime, duration, ctx, dest) {
            notes.forEach(freq => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq;
                osc.connect(gain);
                gain.connect(dest);

                // Soft swell envelope
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.025, startTime + duration * 0.3);
                gain.gain.linearRampToValueAtTime(0.02, startTime + duration * 0.7);
                gain.gain.linearRampToValueAtTime(0, startTime + duration);

                osc.start(startTime);
                osc.stop(startTime + duration + 0.1);
            });
        }

        function playMelody() {
            if (!isPlaying || !audioCtx) return;

            const tempo = 0.45; // seconds per beat (gentle, slow tempo)
            let t = audioCtx.currentTime + 0.1;

            // Schedule melody notes
            melody.forEach(([freq, dur]) => {
                playNote(freq, t, dur * tempo * 0.9, audioCtx, masterGain);
                t += dur * tempo;
            });

            // Schedule pad chords
            let ct = audioCtx.currentTime + 0.1;
            chords.forEach(([notes, dur]) => {
                playPadChord(notes, ct, dur * tempo, audioCtx, masterGain);
                ct += dur * tempo;
            });

            // Total melody duration
            const totalBeats = melody.reduce((sum, [, d]) => sum + d, 0);
            const totalDuration = totalBeats * tempo;

            // Loop with a gentle pause
            melodyTimeout = setTimeout(() => {
                if (isPlaying) playMelody();
            }, (totalDuration + 1.5) * 1000); // 1.5s pause between loops
        }

        function startMusic() {
            if (isPlaying) return;
            if (!audioCtx || audioCtx.state === 'closed') {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                masterGain = audioCtx.createGain();
                const reverb = createReverb(audioCtx, 2.5, 3);
                const reverbGain = audioCtx.createGain();
                reverbGain.gain.value = 0.4;
                masterGain.connect(audioCtx.destination);
                masterGain.connect(reverb);
                reverb.connect(reverbGain);
                reverbGain.connect(audioCtx.destination);
                masterGain.gain.value = 0.8;
            }
            if (audioCtx.state === 'suspended') audioCtx.resume();
            isPlaying = true;
            musicToggle.classList.add('playing');
            playMelody();
        }

        function stopMusic() {
            if (!isPlaying) return;
            isPlaying = false;
            musicToggle.classList.remove('playing');
            if (melodyTimeout) { clearTimeout(melodyTimeout); melodyTimeout = null; }
            // Close the audio context to stop all scheduled sounds immediately
            if (audioCtx) {
                audioCtx.close();
                audioCtx = null;
                masterGain = null;
            }
        }

        function toggleMusic(e) {
            e.preventDefault();
            e.stopPropagation();
            if (isPlaying) {
                stopMusic();
            } else {
                startMusic();
            }
        }

        musicToggle.addEventListener('click', toggleMusic);
    }

    // ============ 🌸 LOVE GARDEN QUIZ ============
    const quizContainer = document.getElementById('quiz-container');
    if (quizContainer) {
        const quizQuestions = [
            {
                q: "🌷 If our love were a flower, which would it be?",
                options: ["A rose — classic & timeless", "A sunflower — always facing the light", "A cherry blossom — beautiful & precious", "A wildflower — free & untamed"],
                correct: 0,
                response: "Yes! Just like a rose — our love is classic, deep, and only gets more beautiful with time! 🌹"
            },
            {
                q: "🌿 What makes a garden grow?",
                options: ["Sunshine & rain", "Patience & care", "Love & laughter", "All of the above"],
                correct: 3,
                response: "Exactly! Our garden needs sunshine AND rain, patience AND care, love AND laughter! 💕"
            },
            {
                q: "🌸 Which season best represents us?",
                options: ["Spring — new beginnings", "Summer — warm & bright", "Autumn — cozy & golden", "Every season with you is perfect"],
                correct: 3,
                response: "Every season is perfect when we're together! You're my spring, summer, autumn, and winter! 🌈"
            },
            {
                q: "🌻 Complete this: 'You are my...'",
                options: ["Sunshine on a rainy day", "Favorite notification", "Best adventure partner", "All of the above, always"],
                correct: 3,
                response: "You're everything and more! My sunshine, my favorite notification, and my greatest adventure! ✨"
            },
            {
                q: "🌺 What's the secret ingredient in our garden?",
                options: ["Late-night conversations", "Silly inside jokes", "Comfortable silences", "The love that grows every day"],
                correct: 3,
                response: "It's the ever-growing love! But honestly, all the little things make our garden magical! 💖"
            }
        ];

        let currentQuestion = 0;
        let score = 0;

        function renderQuestion() {
            const q = quizQuestions[currentQuestion];
            document.getElementById('quiz-question').textContent = q.q;
            document.getElementById('quiz-progress-bar').style.width = ((currentQuestion / quizQuestions.length) * 100) + '%';

            const optionsContainer = document.getElementById('quiz-options');
            optionsContainer.innerHTML = '';

            q.options.forEach((opt, i) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-option';
                btn.textContent = opt;
                btn.addEventListener('click', () => selectAnswer(i));
                optionsContainer.appendChild(btn);
            });

            document.getElementById('quiz-card').style.display = 'block';
            document.getElementById('quiz-result').style.display = 'none';
        }

        function selectAnswer(index) {
            const q = quizQuestions[currentQuestion];
            const options = document.querySelectorAll('.quiz-option');

            options.forEach((opt, i) => {
                opt.disabled = true;
                if (i === q.correct) opt.classList.add('correct');
                if (i === index && i !== q.correct) opt.classList.add('wrong');
            });

            if (index === q.correct) score++;

            // Show response toast
            const toast = document.createElement('div');
            toast.className = 'quiz-toast';
            toast.textContent = q.response;
            quizContainer.appendChild(toast);
            requestAnimationFrame(() => toast.classList.add('show'));

            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);

                currentQuestion++;
                if (currentQuestion < quizQuestions.length) {
                    renderQuestion();
                } else {
                    showQuizResult();
                }
            }, 2500);
        }

        function showQuizResult() {
            document.getElementById('quiz-card').style.display = 'none';
            document.getElementById('quiz-progress-bar').style.width = '100%';
            const resultDiv = document.getElementById('quiz-result');
            resultDiv.style.display = 'block';

            const percent = (score / quizQuestions.length) * 100;
            let title, text, icon;

            if (percent >= 80) {
                icon = '💐'; title = "Garden Master!";
                text = `You got ${score}/${quizQuestions.length}! You truly understand the garden of our love! You make everything bloom! 🌹💕`;
            } else if (percent >= 60) {
                icon = '🌻'; title = "Blooming Beautifully!";
                text = `You got ${score}/${quizQuestions.length}! Our garden is growing wonderfully! Keep nurturing it! 🌸`;
            } else {
                icon = '🌱'; title = "A Garden in Progress!";
                text = `You got ${score}/${quizQuestions.length}! Every great garden starts with a seed! Our love will keep it growing! 💕`;
            }

            resultDiv.querySelector('.quiz-result-icon').textContent = icon;
            resultDiv.querySelector('.quiz-result-title').textContent = title;
            resultDiv.querySelector('.quiz-result-text').textContent = text;

            // Celebration confetti on perfect score
            if (percent >= 80) {
                launchConfetti();
            }
        }

        document.getElementById('quiz-restart')?.addEventListener('click', () => {
            currentQuestion = 0;
            score = 0;
            renderQuestion();
        });

        renderQuestion();
    }

    // ============ 🌈 FLOATING LOVE FORTUNE ============
    const fortuneMessages = [
        "💕 You are deeply loved today and always",
        "🌸 Something beautiful is about to happen",
        "✨ You radiate pure magic wherever you go",
        "🌹 The universe planned us perfectly",
        "💜 Your smile is my favorite thing",
        "🦋 Today is going to be extraordinary",
        "🌻 You deserve all the flowers in the world",
        "💗 I'm so grateful the stars aligned for us"
    ];

    let lastFortuneTime = 0;
    function spawnRandomFortune() {
        const now = Date.now();
        if (now - lastFortuneTime < 15000) return;
        lastFortuneTime = now;

        const fortune = document.createElement('div');
        fortune.className = 'floating-fortune';
        fortune.textContent = fortuneMessages[Math.floor(Math.random() * fortuneMessages.length)];
        fortune.style.left = (10 + Math.random() * 80) + 'vw';
        document.body.appendChild(fortune);
        setTimeout(() => fortune.remove(), 8000);
    }

    // Spawn a fortune every 20 seconds
    setInterval(spawnRandomFortune, 20000);
    // And one after 5 seconds for first impression
    setTimeout(spawnRandomFortune, 5000);

});
