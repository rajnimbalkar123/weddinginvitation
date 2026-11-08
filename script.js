// ==========================================
// 1. Envelope & Interactive Diya Lighting
// ==========================================
const openingScreen = document.getElementById('openingScreen');
const openInviteButton = document.getElementById('openInviteButton');
const envelopeOpenCard = document.getElementById('envelopeOpenCard');

function lightDiya(diyaId) {
    const diya = document.getElementById(diyaId);
    if (!diya.classList.contains('lit')) {
        diya.classList.remove('unlit');
        diya.classList.add('lit');
        diya.querySelector('.diya-text').textContent = 'शुभ मंगलम्';
        showToast('दीपक प्रज्वलित हुआ! शुभ मंगलम्।');
    }
}

function openInvitationExperience() {
    if (openingScreen.classList.contains('opening') || openingScreen.classList.contains('is-open')) return;



    toggleMantra(true);
    openingScreen.classList.add('opening');
    openInviteButton.disabled = true;
    openInviteButton.textContent = 'निमंत्रण उघडत आहे …';

    setTimeout(() => {
        openingScreen.classList.add('is-open');
        document.body.classList.remove('invite-locked');
    }, 1200);

    setTimeout(() => {
        openingScreen.style.display = 'none';
    }, 1900);
}

openInviteButton.addEventListener('click', openInvitationExperience);
envelopeOpenCard.addEventListener('click', openInvitationExperience);
envelopeOpenCard.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openInvitationExperience();
    }
});

// ==========================================
// 2. Audio Controller & Spinning Vinyl Player
// ==========================================
const mantraAudio = document.getElementById('ganeshMantra');
const vinylDisc = document.getElementById('vinylDisc');
const vinylStatus = document.getElementById('vinylStatus');

function updateAudioUI(isPlaying) {
    if (isPlaying) {
        vinylDisc.classList.add('spinning');
        vinylStatus.textContent = 'Playing ♫';
    } else {
        vinylDisc.classList.remove('spinning');
        vinylStatus.textContent = 'Paused';
    }
}

mantraAudio.addEventListener('play', () => updateAudioUI(true));
mantraAudio.addEventListener('pause', () => updateAudioUI(false));

async function toggleMantra(forcePlay = false) {
    if (!mantraAudio) return;
    if (!forcePlay && !mantraAudio.paused) {
        mantraAudio.pause();
        return;
    }
    try {
        await mantraAudio.play();
    } catch (err) {
        updateAudioUI(false);
    }
}

// ==========================================
// 3. Day / Night Ambience Mode
// ==========================================
function toggleAmbience() {
    const isNight = document.body.classList.toggle('night-mode');
    const btn = document.getElementById('ambienceToggle');
    btn.textContent = isNight ? '🌙' : '☀️';
    showToast(isNight ? 'Night Mode' : 'Light Mode');
}

function printPatrika() {

    const imageUrl = './assets/images/wedding_card.jpg';

    const printWindow = window.open('', '_blank');

    if (!printWindow) {
        alert('Please allow pop-ups to print the invitation.');
        return;
    }

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>सुप्रिया आणि गौरव - शुभविवाह पत्रिका</title>
<base href="https://weddinginvitation.rajnimbalkar.workers.dev/">
            <style>
                @page {
                    size: A4;
                    margin: 10mm;
                }

                html, body {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height: 100%;
                }

                body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                img {
                    max-width: 100%;
                    max-height: 277mm;
                    width: auto;
                    height: auto;
                    object-fit: contain;
                }

                @media print {
                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            </style>
        </head>

        <body>
            <img id="printImage" src="${imageUrl}">
        </body>
        </html>
    `);

    printWindow.document.close();

    const img = printWindow.document.getElementById('printImage');

    img.onload = function() {
        printWindow.focus();
        printWindow.print();
    };

    img.onerror = function() {
        alert('Wedding Patrika image could not be loaded.');
        printWindow.close();
    };

    if (img.complete && img.naturalWidth > 0) {
        printWindow.focus();
        printWindow.print();
    }
}
// ==========================================
// 4. Live Countdown Timer (Target: 02 Dec 2026)
// ==========================================

const weddingDate = new Date("2026-12-10T12:20:00+05:30").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const diff = weddingDate - now;

    if (diff <= 0) {
        document.getElementById('दिवस').textContent = '00';
        document.getElementById('तास').textContent = '00';
        document.getElementById('मिनिटे').textContent = '00';
        document.getElementById('सेकंद').textContent = '00';
        return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('दिवस').textContent = String(d).padStart(2, '0');
    document.getElementById('तास').textContent = String(h).padStart(2, '0');
    document.getElementById('मिनिटे').textContent = String(m).padStart(2, '0');
    document.getElementById('सेकंद').textContent = String(s).padStart(2, '0');
}
setInterval(updateCountdown, 1000);
updateCountdown();

// ==========================================
// 5. Double Particle Engine + Floating Cartoon Couple
// ==========================================
const canvas = document.getElementById('petalsCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

const coupleImg = new Image();
coupleImg.src = './assets/images/couple-cartoon.webp';

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor(isGoldDust = false) {
        this.isGoldDust = isGoldDust;
        this.reset(true);
    }
    reset(initial = false) {
        this.x = Math.random() * canvas.width;
        this.y = initial ? Math.random() * canvas.height : -20;

        if (this.isGoldDust) {
            this.size = Math.random() * 2.5 + 1;
            this.speedY = Math.random() * 0.8 + 0.3;
            this.speedX = Math.random() * 0.8 - 0.4;
            this.opacity = Math.random() * 0.7 + 0.3;
        } else {
            this.size = Math.random() * 7 + 5;
            this.speedY = Math.random() * 1.3 + 0.8;
            this.speedX = Math.random() * 1.2 - 0.6;
            this.rotation = Math.random() * 360;
            this.spin = Math.random() * 2 - 1;
            this.opacity = Math.random() * 0.6 + 0.3;
        }
    }
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        if (!this.isGoldDust) this.rotation += this.spin;
        if (this.y > canvas.height + 20) this.reset();
    }
    draw() {
        ctx.save();
        if (this.isGoldDust) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(245, 218, 140, ${this.opacity})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#d9b46c';
            ctx.fill();
        } else {
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(185, 42, 60, ${this.opacity})`;
            ctx.fill();
        }
        ctx.restore();
    }
}

class FloatingCouple {
    constructor() {
        this.reset(true);
    }
    reset(initial = false) {
        this.size = Math.random() * 25 + 65;
        this.x = Math.random() * (canvas.width - this.size - 40) + 20;
        this.y = initial ? Math.random() * canvas.height : canvas.height + 40;
        this.speedY = Math.random() * 0.7 + 0.5;
        this.sway = Math.random() * 0.02 + 0.01;
        this.swayCount = Math.random() * Math.PI * 2;
        this.opacity = 0;
        this.maxOpacity = Math.random() * 0.3 + 0.55;
    }
    update() {
        this.y += this.speedY;
        this.swayCount += this.sway;
        this.x += Math.sin(this.swayCount) * 0.7;

        if (this.y > canvas.height * 0.75) {
            if (this.opacity < this.maxOpacity) this.opacity += 0.015;
        } else if (this.y < canvas.height * 0.35) {
            this.opacity -= 0.012;
        }

        if (this.y < -this.size || this.opacity <= 0) {
            this.reset();
        }
    }
    draw() {
        if (!coupleImg.complete || this.opacity <= 0) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.opacity);
        ctx.shadowBlur = 14;
        ctx.shadowColor = 'rgba(217, 180, 108, 0.45)';
        ctx.drawImage(coupleImg, this.x, this.y, this.size, this.size);
        ctx.restore();
    }
}

const countPetals = window.innerWidth < 768 ? 16 : 28;
const countGold = window.innerWidth < 768 ? 20 : 35;

for (let i = 0; i < countPetals; i++) particles.push(new Particle(false));
for (let i = 0; i < countGold; i++) particles.push(new Particle(true));

const floatingCouples = [new FloatingCouple(), new FloatingCouple()];

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let p of particles) {
        p.update();
        p.draw();
    }

    for (let c of floatingCouples) {
        c.update();
        c.draw();
    }

    requestAnimationFrame(animateParticles);
}
animateParticles();

// Screen Tap: Phool-Varsha
window.addEventListener('click', (e) => {
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input') || e.target.closest('textarea')) return;

    for (let i = 0; i < 6; i++) {
        const burst = new Particle(Math.random() > 0.5);
        burst.x = e.clientX + (Math.random() * 40 - 20);
        burst.y = e.clientY + (Math.random() * 40 - 20);
        burst.speedY = Math.random() * 2 + 1;
        burst.speedX = Math.random() * 3 - 1.5;
        particles.push(burst);
        setTimeout(() => {
            const idx = particles.indexOf(burst);
            if (idx !== -1) particles.splice(idx, 1);
        }, 2200);
    }

    const tapCouple = new FloatingCouple();
    tapCouple.size = 55;
    tapCouple.x = e.clientX - 27;
    tapCouple.y = e.clientY - 27;
    tapCouple.opacity = 0.95;
    tapCouple.speedY = 1.6;
    floatingCouples.push(tapCouple);

    setTimeout(() => {
        const idx = floatingCouples.indexOf(tapCouple);
        if (idx !== -1) floatingCouples.splice(idx, 1);
    }, 2200);
});

// ==========================================
// 6. Interactive 3D Card Tilt
// ==========================================
const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

        const shine = card.querySelector('.shine-fx');
        if (shine) {
            shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.35), transparent 60%)`;
        }
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
});

// ==========================================
// 7. Interactive Baraat Route Animation on Scroll
// ==========================================
const baraatCar = document.getElementById('baraatCar');
const routeSection = document.getElementById('route-timeline');

window.addEventListener('scroll', () => {
    if (!routeSection || !baraatCar) return;
    const rect = routeSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight && rect.bottom > 0) {
        const progress = Math.min(Math.max((windowHeight - rect.top) / (windowHeight + rect.height), 0), 1);
        baraatCar.style.left = `${progress * 85}%`;
    }
});

// ==========================================
// 9. Card Modal & Direct Downloads
// ==========================================
const cards = {
    gold: {
        src: './assets/images/wedding_card.jpg',
        name: 'Supriya & Gaurav Wedding_Invitation card',
        caption: 'शुभ विवाह निमंत्रण पत्र '
    },

};

function downloadCard(which) {
    const card = cards[which];
    const a = document.createElement('a');
    a.href = card.src;
    a.download = card.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('लग्न पत्रिका मिळाली');
}

function openCard(which) {
    const modal = document.getElementById('cardModal');
    document.getElementById('modalImage').src = cards[which].src;
    document.getElementById('modalCaption').textContent = cards[which].caption;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCard() {
    document.getElementById('cardModal').classList.remove('open');
    document.body.style.overflow = '';
}

function modalBackdrop(event) {
    if (event.target === document.getElementById('cardModal')) closeCard();
}
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCard();
});

// ==========================================
// 10. Toast Notification & Web Share
// ==========================================
let toastTimer;

function showToast(message) {
    const el = document.getElementById('toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
}



async function shareInvite() {
    const shortUrl = 'https://tinyurl.com/WeddingSupriya';

    const text = '॥ श्री गणेशाय नमः ॥\n\n' +
        '💐 आपणांस सस्नेह आमंत्रित करीत आहोत! \n\n' +
        '🌸 चि.सौ.कां. सुप्रिया अनिल निंबाळकर आणि चि. गौरव कृष्णदेव शिंदे यांच्या शुभविवाह सोहळ्यास!\n\n' +
        '✨ शुभ विवाह : १० डिसेंबर २०२६ \n\n' +
        '✨ लग्नाचा मुहूर्त  : दुपारी १२.२० मिनटे  \n\n' +
        '📍 पत्ता : श्री स्वामी समर्थ मंगल कार्यालय, सातारा-पंढरपूर रोड, मु.पोस्ट तांदुळवाडी, ता.माळशिरस, जि.सोलापूर.\n\n' +
        '✨ आमची सुंदर डिजिटल लग्नपत्रिका पाहण्यासाठी खालील लिंकवर क्लिक करा!\n\n' +
        '👇 लग्नपत्रिका येथे पहा 👇\n' +
        shortUrl + '\n\n' +
        'आपण उपस्थित राहून वधू-वरांना प्रेमळ आशीर्वाद द्यावेत, ही आग्रहाची विनंती. 🙏';

    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Supriya 卐 Gaurav | Wedding Invitation',
                text: text
            });
        } catch (e) {
            if (e.name !== 'AbortError') copyInvite(text);
        }
    } else {
        copyInvite(text);
    }
}

async function copyInvite(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('निमंत्रण संदेश कॉपी झाला आहे.');
    } catch (e) {
        showToast('निमंत्रण शेअर करण्यासाठी ब्राउझर मेनूमधील शेअर पर्याय निवडा.');
    }
}

// ==========================================
// 11. Scroll Observers (Reveal & Stage Curtains)
// ==========================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// Stage Curtains Open on Scroll
const stageSection = document.getElementById('curtain-stage');
if (stageSection) {
    const curtainObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                stageSection.classList.add('curtains-open');
            }
        });
    }, { threshold: 0.25 });
    curtainObserver.observe(stageSection);
}