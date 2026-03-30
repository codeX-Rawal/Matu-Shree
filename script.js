// Custom Cursor
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate(${mouseX - 6}px, ${mouseY - 6}px)`;
  });

  function animateFollower() {
    followerX += (mouseX - followerX - 18) * 0.12;
    followerY += (mouseY - followerY - 18) * 0.12;
    follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.querySelectorAll('a, button, .cat-card, .product-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform += ' scale(1.8)';
      follower.style.opacity = '0';
    });
    el.addEventListener('mouseleave', () => {
      follower.style.opacity = '0.6';
    });
  });

  // Navbar scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Mobile Nav
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });
  function closeMobileNav() {
    mobileNav.classList.remove('open');
  }

  // Scroll Reveal
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  reveals.forEach(el => observer.observe(el));

  // Staggered reveal for grids
  document.querySelectorAll('.products-grid .product-card, .categories-grid .cat-card, .testimonials-slider .testimonial-card, .process-steps .process-step, .orders-metrics .metric-card, .orders-table .order-row, .billing-panel').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1}s`;
  });

  // Cart button interaction
  document.querySelectorAll('.btn-cart').forEach(btn => {
    btn.addEventListener('click', function() {
      this.textContent = '✓ Added';
      this.style.background = 'var(--gold-dark)';
      setTimeout(() => {
        this.textContent = 'Add to Cart';
        this.style.background = '';
      }, 2000);
    });
  });

  // Form submit
  function handleFormSubmit(e) {
    e.preventDefault();
    const btn = document.querySelector('.btn-submit');
    btn.textContent = 'Sending...';
    setTimeout(() => {
      btn.textContent = '✓ Enquiry Sent! We\'ll contact you soon.';
      btn.style.background = '#4CAF50';
      setTimeout(() => {
        btn.textContent = 'Send Enquiry →';
        btn.style.background = '';
      }, 4000);
    }, 1200);
  }

  // Smooth anchor
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Admin gate for Orders section
  const adminToggle = document.getElementById('adminToggle');
  const ADMIN_KEY = 'isAdminMatu';
  const ADMIN_USER_KEY = 'adminUserMatu';
  const ADMIN_EMAIL = 'admin@matushree.com';
  const ADMIN_PASS = 'matu@123';

  function setAdmin(on) {
    document.body.classList.toggle('admin', on);
    localStorage.setItem(ADMIN_KEY, on ? '1' : '0');
    if (adminToggle) {
      adminToggle.textContent = on ? 'Admin ✓' : 'Admin';
      adminToggle.classList.toggle('active', on);
    }
  }
  setAdmin(localStorage.getItem(ADMIN_KEY) === '1');
  if (adminToggle) {
    adminToggle.addEventListener('click', () => {
      if (document.body.classList.contains('admin')) {
        setAdmin(false);
        return;
      }
      const code = prompt('Enter admin passcode to view Orders & Billing');
      if (code && code.trim().toLowerCase() === 'matuadmin') {
        setAdmin(true);
      } else {
        alert('Invalid passcode');
      }
    });
  }

  // Email/password login
  const loginForm = document.getElementById('loginForm');
  const loginStatus = document.getElementById('loginStatus');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim().toLowerCase();
      const pass = document.getElementById('loginPass').value;
      if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
        localStorage.setItem(ADMIN_USER_KEY, email);
        setAdmin(true);
        if (loginStatus) loginStatus.textContent = 'Login successful. Admin unlocked.';
      } else {
        if (loginStatus) loginStatus.textContent = 'Invalid credentials.';
      }
    });
  }

  // Track order (mock client-side)
  const trackForm = document.getElementById('trackForm');
  const trackStatus = document.getElementById('trackStatus');
  const orderMap = {
    'ms-1048': { status: 'Dispatched', eta: 'Arriving in 2-3 days', last: 'Jodhpur Hub' },
    'ms-1047': { status: 'In Production', eta: '5-7 days', last: 'Finishing & polish' },
    'ms-1046': { status: 'Pending Payment', eta: 'Awaiting advance', last: 'Billing desk' }
  };
  if (trackForm) {
    trackForm.addEventListener('submit', e => {
      e.preventDefault();
      const orderId = document.getElementById('orderIdInput').value.trim().toLowerCase();
      const phone = document.getElementById('phoneInput').value.trim();
      if (!orderId || !phone) return;
      const info = orderMap[orderId] || { status: 'Queued', eta: 'We will confirm soon', last: 'Front desk' };
      trackStatus.textContent = `Status: ${info.status} • ${info.eta}. Last update: ${info.last}.`;
    });
  }

  // Cart mock data
  const cartItemsEl = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');
  const cartData = [
    { name: 'Heritage Sofa (3-seater)', note: 'Hand-carved teak, sand beige', price: 42000 },
    { name: 'Maharaja King Bed', note: 'Sheesham, storage', price: 78000 }
  ];
  function renderCart() {
    if (!cartItemsEl) return;
    cartItemsEl.innerHTML = '';
    let total = 0;
    cartData.forEach(item => {
      total += item.price;
      const row = document.createElement('div');
      row.className = 'cart-row';
      row.innerHTML = `<div><h4>${item.name}</h4><span>${item.note}</span></div><div class="cart-price">₹${item.price.toLocaleString('en-IN')}</div>`;
      cartItemsEl.appendChild(row);
    });
    if (cartTotalEl) cartTotalEl.textContent = `₹${total.toLocaleString('en-IN')}`;
  }
  renderCart();

  // Bill calculator
  const billAmount = document.getElementById('billAmount');
  const billGst = document.getElementById('billGst');
  const billTotal = document.getElementById('billTotal');
  const billHistoryEl = document.getElementById('billHistory');
  const billStoreKey = 'billStore';

  function loadBills() {
    try { return JSON.parse(localStorage.getItem(billStoreKey) || '[]'); }
    catch { return []; }
  }
  function saveBills(arr) { localStorage.setItem(billStoreKey, JSON.stringify(arr)); }

  function renderBills() {
    if (!billHistoryEl) return;
    const bills = loadBills();
    billHistoryEl.innerHTML = bills.length ? '' : '<span class="card-sub">No bills yet.</span>';
    bills.forEach(b => {
      const div = document.createElement('div');
      div.className = 'bill-card';
      div.innerHTML = `<strong>${b.client}</strong> — ${b.order} • ₹${b.total.toLocaleString('en-IN')}<br><span>${b.date}</span>`;
      billHistoryEl.appendChild(div);
    });
  }

  function updateBillTotal() {
    if (!billAmount || !billGst || !billTotal) return;
    const amount = parseFloat(billAmount.value || 0);
    const gst = parseFloat(billGst.value || 0);
    const total = amount + (amount * gst) / 100;
    billTotal.textContent = `₹${Math.round(total).toLocaleString('en-IN')}`;
  }
  if (billAmount) billAmount.addEventListener('input', updateBillTotal);
  if (billGst) billGst.addEventListener('input', updateBillTotal);
  updateBillTotal();

  // Bill actions (mock)
  const billMessage = document.getElementById('billMessage');
  const btnGenerateBill = document.getElementById('btnGenerateBill');
  const btnCopySummary = document.getElementById('btnCopySummary');
  const btnExportBills = document.getElementById('btnExportBills');
  const btnClearBills = document.getElementById('btnClearBills');
  function buildSummary() {
    const client = document.getElementById('billClient')?.value || 'Client';
    const order = document.getElementById('billOrder')?.value || 'MS-XXXX';
    return `${client} | ${order} | Total ${billTotal ? billTotal.textContent : ''}`;
  }
  if (btnGenerateBill) {
    btnGenerateBill.addEventListener('click', () => {
      const bill = {
        client: document.getElementById('billClient')?.value || 'Client',
        order: document.getElementById('billOrder')?.value || 'MS-XXXX',
        date: document.getElementById('billDate')?.value || new Date().toISOString().slice(0,10),
        total: parseInt((billTotal?.textContent || '0').replace(/[^0-9]/g,''),10) || 0
      };
      const bills = loadBills();
      bills.unshift(bill);
      saveBills(bills.slice(0,50));
      renderBills();
      if (billMessage) billMessage.textContent = 'Bill saved locally. Use Export JSON to download.';
    });
  }
  if (btnCopySummary && navigator.clipboard) {
    btnCopySummary.addEventListener('click', () => {
      navigator.clipboard.writeText(buildSummary());
      if (billMessage) billMessage.textContent = 'Summary copied to clipboard.';
    });
  }
  if (btnExportBills) {
    btnExportBills.addEventListener('click', () => {
      const data = JSON.stringify(loadBills(), null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bills.json';
      a.click();
      URL.revokeObjectURL(url);
    });
  }
  if (btnClearBills) {
    btnClearBills.addEventListener('click', () => {
      saveBills([]);
      renderBills();
      if (billMessage) billMessage.textContent = 'Cleared saved bills.';
    });
  }
  renderBills();

  // Revenue preferences (mock)
  const gstType = document.getElementById('gstType');
  const payoutCycle = document.getElementById('payoutCycle');
  const bankLast4 = document.getElementById('bankLast4');
  const revenueNote = document.getElementById('revenueNote');
  const btnSaveRevenue = document.getElementById('btnSaveRevenue');
  const btnResetRevenue = document.getElementById('btnResetRevenue');
  function updateRevenueNote() {
    if (!revenueNote || !gstType || !payoutCycle || !bankLast4) return;
    revenueNote.textContent = `Current: ${payoutCycle.value} • ${gstType.options[gstType.selectedIndex].text} • Bank ••••${bankLast4.value || 'xxxx'}`;
  }
  if (btnSaveRevenue) btnSaveRevenue.addEventListener('click', updateRevenueNote);
  if (btnResetRevenue) btnResetRevenue.addEventListener('click', () => {
    if (gstType) gstType.value = 'regular';
    if (payoutCycle) payoutCycle.value = 'weekly';
    if (bankLast4) bankLast4.value = '9210';
    updateRevenueNote();
  });
  updateRevenueNote();
