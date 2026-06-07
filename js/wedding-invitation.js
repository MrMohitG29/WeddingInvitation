/* ══════════════════════════════════════════════════════════════
   Mohit & Rupanjana — Wedding Invitation
   Main JavaScript
   ══════════════════════════════════════════════════════════════ */

// ─── Ganesh Intro ─────────────────────────────────────────────────────────────
function closeGanesh() {
  var el = document.getElementById('ganesh-intro');
  el.style.transition = 'opacity .5s ease';
  el.style.opacity = '0';
  setTimeout(function() { el.style.display = 'none'; }, 1000);
}

// ─── Scroll Reveal ────────────────────────────────────────────────────────────
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: .1 });
reveals.forEach(el => revealObserver.observe(el));

// ─── Countdown Timer ──────────────────────────────────────────────────────────
function updateCountdown() {
  const now = new Date();
  let yr = now.getFullYear();
  let weddingDate = new Date(yr, 0, 29, 20, 0, 0);
  if (now > weddingDate) weddingDate = new Date(yr + 1, 0, 29, 20, 0, 0);
  const diff = weddingDate - now;
  if (diff <= 0) {
    ['days', 'hours', 'mins', 'secs'].forEach(k => {
      document.getElementById('cd-' + k).textContent = '0';
    });
    return;
  }
  document.getElementById('cd-days').textContent  = Math.floor(diff / 86400000);
  document.getElementById('cd-hours').textContent = Math.floor((diff % 86400000) / 3600000);
  document.getElementById('cd-mins').textContent  = Math.floor((diff % 3600000) / 60000);
  document.getElementById('cd-secs').textContent  = Math.floor((diff % 60000) / 1000);
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ─── RSVP Radio Button Highlight ──────────────────────────────────────────────
document.querySelectorAll('.rsvp-rl').forEach(label => {
  label.querySelector('input').addEventListener('change', function() {
    document.querySelectorAll('.rsvp-rl').forEach(x => x.classList.remove('sel'));
    label.classList.add('sel');
  });
});

// ─── RSVP Form Submit ─────────────────────────────────────────────────────────
function submitRSVP() {
  const name = document.getElementById('rsvpName').value.trim();
  const att  = document.querySelector('input[name="att"]:checked');
  if (!name) {
    alert('Please enter your name — we need to know who to save gulab jamuns for! 😄');
    return;
  }
  if (!att) {
    alert("Let us know if you're coming! The gulab jamun count depends on it.");
    return;
  }
  const msgs = {
    yes:   `Yay, ${name}! 🎊 We're so excited. Get ready to dance!`,
    maybe: `No pressure, ${name}! 😊 We'll keep a gulab jamun warm just in case.`,
    no:    `We'll miss you, ${name}! 😢 We'll save you a mithai box at least.`
  };
  document.getElementById('rsvpForm').style.display = 'none';
  document.getElementById('rsvpMsg').textContent = msgs[att.value];
  document.getElementById('rsvpSuccess').style.display = 'block';
}

// ─── Language Switcher ────────────────────────────────────────────────────────
(function() {
  var currentLang = 'en';

  function toggleLangMenu() {
    document.getElementById('langDropdown').classList.toggle('open');
  }
  window.toggleLangMenu = toggleLangMenu;

  // Close dropdown when clicking outside the FAB
  document.addEventListener('click', function(e) {
    if (!e.target.closest('#langFab')) {
      document.getElementById('langDropdown').classList.remove('open');
    }
  });

  function setLang(lang) {
    if (lang === currentLang) {
      document.getElementById('langDropdown').classList.remove('open');
      return;
    }
    currentLang = lang;
    document.getElementById('langDropdown').classList.remove('open');

    var labels = { en: 'English', hi: '\u0939\u093f\u0902\u0926\u0940', bn: '\u09ac\u09be\u0982\u09b2\u09be' };
    document.getElementById('langBtnLabel').textContent = labels[lang];

    document.querySelectorAll('.lang-opt').forEach(function(btn, i) {
      btn.classList.toggle('active', i === (lang === 'en' ? 0 : lang === 'hi' ? 1 : 2));
    });

    document.body.classList.remove('lang-en', 'lang-hi', 'lang-bn');
    document.body.classList.add('lang-' + lang);
    document.documentElement.lang = lang;

    var translations = JSON.parse(document.getElementById('i18n-data').textContent);
    var translatableEls = document.querySelectorAll('[data-i18n]');

    // Fade out, swap content, fade back in
    translatableEls.forEach(function(el) { el.style.opacity = '0'; });

    setTimeout(function() {
      translatableEls.forEach(function(el) {
        var key = el.getAttribute('data-i18n');
        if (translations[key] && translations[key][lang] !== undefined) {
          el.innerHTML = translations[key][lang];
        }
      });

      // Update input placeholders
      var nameInput = document.getElementById('rsvpName');
      var namePlaceholders = {
        en: 'Your Full Name',
        hi: '\u0906\u092a\u0915\u093e \u092a\u0942\u0930\u093e \u0928\u093e\u092e',
        bn: '\u0986\u09aa\u09a8\u09be\u09b0 \u09aa\u09c1\u09b0\u09cb \u09a8\u09be\u09ae'
      };
      if (nameInput) nameInput.placeholder = namePlaceholders[lang];

      var contactInput = document.getElementById('rsvpContact');
      var contactPlaceholders = {
        en: 'Mobile Number / Email',
        hi: '\u092e\u094b\u092c\u093e\u0907\u0932 \u0928\u0902\u092c\u0930 / \u0908\u092e\u0947\u0932',
        bn: '\u09ae\u09cb\u09ac\u09be\u0987\u09b2 \u09a8\u09ae\u09cd\u09ac\u09b0 / \u0987\u09ae\u09c7\u0987\u09b2'
      };
      if (contactInput) contactInput.placeholder = contactPlaceholders[lang];

      var guestsInput = document.getElementById('rsvpGuests');
      var guestsPlaceholders = {
        en: 'Number of Guests (including yourself)',
        hi: '\u092e\u0947\u0939\u092e\u093e\u0928\u094b\u0902 \u0915\u0940 \u0938\u0902\u0916\u094d\u092f\u093e (\u0906\u092a \u0938\u0939\u093f\u0924)',
        bn: '\u0985\u09a4\u09bf\u09a5\u09bf\u09b0 \u09b8\u0982\u0996\u09cd\u09af\u09be (\u0986\u09aa\u09a8\u09bf \u09b8\u09b9)'
      };
      if (guestsInput) guestsInput.placeholder = guestsPlaceholders[lang];

      translatableEls.forEach(function(el) {
        el.style.opacity = '1';
        el.style.transition = 'opacity 0.25s';
      });
    }, 200);
  }
  window.setLang = setLang;
})();
