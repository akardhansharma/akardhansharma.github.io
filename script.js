// ─── Nav scroll & hamburger ───────────────────────────────────────────────────
var nav        = document.getElementById('nav');
var hamburger  = document.getElementById('hamburger');
var mobileMenu = document.getElementById('mobile-menu');
var navLinks   = document.querySelectorAll('.nav-link[data-sec]');
 
window.addEventListener('scroll', function () {
  nav.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveLink();
});
 
hamburger.addEventListener('click', function () {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
 
// ─── Smooth scroll ────────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    var href   = a.getAttribute('href');
    var target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    var top = target.getBoundingClientRect().top + window.scrollY - (nav.offsetHeight + 16);
    window.scrollTo({ top: top, behavior: 'smooth' });
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});
 
// ─── Active nav link ──────────────────────────────────────────────────────────
function updateActiveLink() {
  var scrollY = window.scrollY + nav.offsetHeight + 48;
  document.querySelectorAll('section[id]').forEach(function (sec) {
    var id     = sec.getAttribute('id');
    var top    = sec.offsetTop;
    var bottom = top + sec.offsetHeight;
    navLinks.forEach(function (link) {
      if (link.dataset.sec === id) {
        link.classList.toggle('active', scrollY >= top && scrollY < bottom);
      }
    });
  });
}
 
// ─── Scroll-triggered animations ─────────────────────────────────────────────
var observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
 
document.querySelectorAll('.anim, .anim-left, .anim-right, .anim-scale').forEach(function (el) {
  observer.observe(el);
});
 
// ─── Counter animation ────────────────────────────────────────────────────────
function animateCounter(el) {
  var raw = el.dataset.count;
  if (!raw) return;
  var hasPlus   = raw.indexOf('+')  !== -1;
  var hasDollar = raw.indexOf('$')  !== -1;
  var hasM      = raw.indexOf('M')  !== -1;
  var hasK      = raw.indexOf('K')  !== -1;
  var hasPct    = raw.indexOf('%')  !== -1;
  var isFloat   = raw.indexOf('.') !== -1;
  var num    = parseFloat(raw.replace(/[^0-9.]/g, ''));
  var dur    = 1500;
  var start  = null;
 
  function fmt(v) {
    var s = isFloat ? v.toFixed(1) : Math.round(v).toString();
    if (hasDollar) s = '$' + s;
    if (hasM)  s += 'M';
    if (hasK)  s += 'K';
    if (hasPct) s += '%';
    if (hasPlus) s += '+';
    return s;
  }
 
  function step(ts) {
    if (!start) start = ts;
    var p     = Math.min((ts - start) / dur, 1);
    var eased = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(eased * num);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
 
var counterObs = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
 
document.querySelectorAll('[data-count]').forEach(function (el) {
  counterObs.observe(el);
});
 
// ─── Skills tabs ──────────────────────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var tab = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(function (b)  { b.classList.remove('active'); });
    document.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('active'); });
    btn.classList.add('active');
    var panel = document.querySelector('.tab-panel[data-panel="' + tab + '"]');
    if (!panel) return;
    panel.classList.add('active');
    panel.querySelectorAll('.anim, .anim-scale').forEach(function (el) {
      el.classList.remove('show');
      setTimeout(function () { el.classList.add('show'); }, 50);
    });
  });
});
 
// ─── Projects filter ──────────────────────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var filter = btn.dataset.filter;
    document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    document.querySelectorAll('.proj-card').forEach(function (card) {
      var show = filter === 'all' || card.dataset.cat === filter;
      card.style.transition = 'opacity .3s, transform .3s';
      if (show) {
        card.style.display = '';
        setTimeout(function () { card.style.opacity = '1'; card.style.transform = ''; }, 10);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(function () { card.style.display = 'none'; }, 310);
      }
    });
  });
});
 
// ─── Contact form ─────────────────────────────────────────────────────────────
var form       = document.getElementById('contact-form');
var submitBtn  = form ? form.querySelector('.form-submit') : null;
var formFields = document.getElementById('form-fields');
var formSucc   = document.getElementById('form-success');
var globalErr  = document.getElementById('global-err');
 
function setErr(id, msg) {
  var errEl   = document.getElementById('err-' + id);
  var inputEl = document.getElementById(id);
  if (errEl)   { errEl.textContent = msg; errEl.classList.add('show'); }
  if (inputEl) inputEl.classList.add('err');
}
function clearErr(id) {
  var errEl   = document.getElementById('err-' + id);
  var inputEl = document.getElementById(id);
  if (errEl)   { errEl.textContent = ''; errEl.classList.remove('show'); }
  if (inputEl) inputEl.classList.remove('err');
}
 
['name','email','subject','message'].forEach(function (id) {
  var el = document.getElementById(id);
  if (el) el.addEventListener('input', function () { clearErr(id); });
});
 
function validate() {
  var ok      = true;
  var name    = (document.getElementById('name')    || {}).value || '';
  var email   = (document.getElementById('email')   || {}).value || '';
  var subject = (document.getElementById('subject') || {}).value || '';
  var message = (document.getElementById('message') || {}).value || '';
  if (!name.trim())    { setErr('name',    'Name is required.');    ok = false; }
  if (!email.trim())   { setErr('email',   'Email is required.');   ok = false; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr('email','Enter a valid email.'); ok = false; }
  if (!subject.trim()) { setErr('subject', 'Subject is required.'); ok = false; }
  if (!message.trim()) { setErr('message', 'Message is required.'); ok = false; }
  return ok;
}
 
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    globalErr.style.display = 'none';
    if (!validate()) return;
 
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
 
    fetch('https://formspree.io/f/xzzeqrog', {
      method:  'POST',
      body:    new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
    .then(function (res) {
      if (res.ok) {
        formFields.style.display = 'none';
        formSucc.classList.add('show');
      } else {
        globalErr.textContent    = 'Something went wrong. Please try again.';
        globalErr.style.display  = 'block';
      }
    })
    .catch(function () {
      globalErr.textContent   = 'Network error. Please try again.';
      globalErr.style.display = 'block';
    })
    .finally(function () {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    });
  });
}
