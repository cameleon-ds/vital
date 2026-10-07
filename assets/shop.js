/* VITAL — logique boutique partagée : panier, comptes, commandes, tiroir panier, en-tête/pied de page.
   Mode démonstration : tout est stocké dans le navigateur (localStorage). À remplacer par un vrai
   back-end (base de données, authentification, passerelle de paiement) avant la mise en production. */
(function () {
  var V = window.VITAL;
  if (!V) return;
  var esc = V.escapeHtml;

  /* ================= Configuration ================= */
  var CONFIG = {
    currency: '€',
    freeShippingThreshold: 50,           // [à confirmer avec le client]
    shipping: {
      standard: { key: 'standard', label: 'Livraison standard', eta: '2 à 4 jours ouvrés partout en France', price: 5 },
      express:  { key: 'express',  label: 'Livraison express',  eta: 'Sous 24 à 48 h — France métropolitaine', price: 9 },
      pickup:   { key: 'pickup',   label: 'Retrait en pharmacie partenaire', eta: 'Disponible sous 24 h', price: 0 }
    },
    promos: { VITAL10: { percent: 10, label: '−10 %' } },
    statuses: {
      preparation: 'En préparation',
      expediee: 'Expédiée',
      livree: 'Livrée',
      annulee: 'Annulée'
    }
  };
  V.CONFIG = CONFIG;

  /* ================= Stockage ================= */
  function read(key, def) { try { var v = JSON.parse(localStorage.getItem(key)); return v === null || v === undefined ? def : v; } catch (e) { return def; } }
  function write(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
  function remove(key) { try { localStorage.removeItem(key); } catch (e) {} }
  V.store = { read: read, write: write, remove: remove };

  /* ================= Formats / validation ================= */
  function fmtMoney(n) { return (Math.round(n * 100) / 100).toFixed(2).replace('.', ',') + ' ' + CONFIG.currency; }
  function fmtDate(iso, withTime) {
    var d = new Date(iso);
    var opts = { day: 'numeric', month: 'long', year: 'numeric' };
    if (withTime) { opts.hour = '2-digit'; opts.minute = '2-digit'; }
    try { return new Intl.DateTimeFormat('fr-FR', opts).format(d); } catch (e) { return d.toLocaleDateString(); }
  }
  function isEmail(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(s).trim()); }
  function cleanPhone(s) { return String(s).replace(/[\s.\-()]/g, '').replace(/^(\+33|0033)/, '0'); }
  function isPhone(s) { return /^0[1-9]\d{8}$/.test(cleanPhone(s)); }   // numéros français à 10 chiffres
  function fmtPhone(s) { var p = cleanPhone(s); return /^\d{10}$/.test(p) ? p.replace(/(\d{2})(?=\d)/g, '$1 ') : s; }
  function luhn(num) {
    var s = String(num).replace(/\D/g, ''), sum = 0, alt = false;
    if (s.length < 13) return false;
    for (var i = s.length - 1; i >= 0; i--) { var n = parseInt(s.charAt(i), 10); if (alt) { n *= 2; if (n > 9) n -= 9; } sum += n; alt = !alt; }
    return sum % 10 === 0;
  }
  function pwStrength(pw) {
    var l = 0;
    if (pw.length >= 8) l++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) l++;
    if (/\d/.test(pw)) l++;
    if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) l++;
    return pw.length === 0 ? 0 : Math.max(1, l);
  }
  V.fmtMoney = fmtMoney; V.fmtDate = fmtDate; V.isEmail = isEmail; V.isPhone = isPhone; V.fmtPhone = fmtPhone; V.cleanPhone = cleanPhone; V.luhn = luhn; V.pwStrength = pwStrength;

  /* ================= Panier ================= */
  function emitCart() {
    V.updateBadge();
    try { document.dispatchEvent(new CustomEvent('vital:cart')); } catch (e) {}
  }
  function setQty(id, qty) {
    var c = V.getCart();
    qty = Math.min(99, parseInt(qty, 10) || 0);
    if (qty <= 0) delete c[id]; else c[id] = qty;
    write('vital_cart', c); emitCart();
  }
  function removeFromCart(id) { setQty(id, 0); }
  function clearCart() { remove('vital_cart'); remove('vital_promo'); emitCart(); }
  function productById(id) { for (var i = 0; i < V.PRODUCTS.length; i++) if (V.PRODUCTS[i].id === Number(id)) return V.PRODUCTS[i]; return null; }
  function cartLines() {
    var c = V.getCart(), out = [];
    Object.keys(c).forEach(function (k) {
      var p = productById(k);
      if (p) out.push({ product: p, qty: c[k], unit: p.price, total: p.price === null ? null : p.price * c[k] });
    });
    return out;
  }
  function getPromo() { var code = read('vital_promo', ''); return CONFIG.promos[code] ? code : ''; }
  function applyPromo(code) {
    code = String(code || '').trim().toUpperCase();
    if (!code) return { ok: false, msg: 'Saisissez un code promo.' };
    if (!CONFIG.promos[code]) return { ok: false, msg: 'Ce code promo n’est pas valide.' };
    write('vital_promo', code); emitCart();
    return { ok: true, msg: 'Code ' + code + ' appliqué (' + CONFIG.promos[code].label + ').' };
  }
  function clearPromo() { remove('vital_promo'); emitCart(); }
  function computeTotals(lines, deliveryKey) {
    var subtotal = 0, unpriced = 0, count = 0;
    lines.forEach(function (l) { count += l.qty; if (l.total === null) unpriced++; else subtotal += l.total; });
    var code = getPromo(), pct = code ? CONFIG.promos[code].percent : 0;
    var discount = Math.round(subtotal * pct) / 100;
    var net = subtotal - discount;
    var freeShip = net >= CONFIG.freeShippingThreshold;
    var shipping = null, ship = deliveryKey ? CONFIG.shipping[deliveryKey] : null;
    if (ship) shipping = (ship.key === 'standard' && freeShip) ? 0 : ship.price;
    return {
      count: count, subtotal: subtotal, discount: discount, promo: code, net: net, unpriced: unpriced,
      freeShip: freeShip, remainingForFree: Math.max(0, CONFIG.freeShippingThreshold - net),
      shipping: shipping, total: net + (shipping || 0)
    };
  }
  // l'ajout au panier ouvre le tiroir (remplace la version « toast » du catalogue)
  V.addToCart = function (id, qty) {
    var c = V.getCart();
    c[id] = Math.min(99, (c[id] || 0) + (qty || 1));
    write('vital_cart', c); emitCart();
    openDrawer();
  };
  V.setQty = setQty; V.removeFromCart = removeFromCart; V.clearCart = clearCart; V.cartLines = cartLines;
  V.computeTotals = computeTotals; V.applyPromo = applyPromo; V.clearPromo = clearPromo; V.getPromo = getPromo; V.productById = productById;

  /* ================= Favoris ================= */
  function getWish() { return read('vital_wish', []); }
  function toggleWish(slug) {
    var w = getWish(), i = w.indexOf(slug);
    if (i === -1) w.push(slug); else w.splice(i, 1);
    write('vital_wish', w); return i === -1;
  }
  V.getWish = getWish; V.toggleWish = toggleWish;

  /* ================= Comptes ================= */
  function randomSalt() {
    try { var a = new Uint8Array(12); crypto.getRandomValues(a); return Array.prototype.map.call(a, function (b) { return ('0' + b.toString(16)).slice(-2); }).join(''); }
    catch (e) { return String(Math.random()).slice(2); }
  }
  function hashPw(pw, salt) {
    var data = salt + '::' + pw;
    if (window.crypto && crypto.subtle && window.TextEncoder) {
      return crypto.subtle.digest('SHA-256', new TextEncoder().encode(data)).then(function (buf) {
        return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
      });
    }
    return Promise.resolve('x' + btoa(unescape(encodeURIComponent(data))));
  }
  function getUsers() { return read('vital_users', []); }
  function saveUsers(u) { write('vital_users', u); }
  function findUser(email) {
    email = String(email || '').trim().toLowerCase();
    var u = getUsers();
    for (var i = 0; i < u.length; i++) if (u[i].email === email) return u[i];
    return null;
  }
  function currentUser() {
    var s = read('vital_session', null);
    return s && s.email ? findUser(s.email) : null;
  }
  function publicUser(u) { return u ? { email: u.email, firstName: u.firstName, lastName: u.lastName, phone: u.phone, newsletter: !!u.newsletter, addresses: u.addresses || [], createdAt: u.createdAt } : null; }
  function register(d) {
    var email = String(d.email || '').trim().toLowerCase();
    if (findUser(email)) return Promise.resolve({ ok: false, error: 'Un compte existe déjà avec cet e-mail. Connectez-vous ou réinitialisez votre mot de passe.' });
    var salt = randomSalt();
    return hashPw(d.password, salt).then(function (hash) {
      var u = { email: email, firstName: d.firstName.trim(), lastName: d.lastName.trim(), phone: d.phone || '', newsletter: !!d.newsletter, addresses: d.addresses || [], salt: salt, hash: hash, createdAt: new Date().toISOString() };
      var users = getUsers(); users.push(u); saveUsers(users);
      write('vital_session', { email: email });
      emitAuth();
      return { ok: true, user: publicUser(u) };
    });
  }
  function login(email, pw) {
    var u = findUser(email);
    if (!u) return Promise.resolve({ ok: false, error: 'E-mail ou mot de passe incorrect.' });
    return hashPw(pw, u.salt).then(function (hash) {
      if (hash !== u.hash) return { ok: false, error: 'E-mail ou mot de passe incorrect.' };
      write('vital_session', { email: u.email });
      emitAuth();
      return { ok: true, user: publicUser(u) };
    });
  }
  function logout() { remove('vital_session'); emitAuth(); }
  function updateUser(patch) {
    var users = getUsers(), s = read('vital_session', null);
    for (var i = 0; i < users.length; i++) if (s && users[i].email === s.email) { for (var k in patch) users[i][k] = patch[k]; saveUsers(users); emitAuth(); return publicUser(users[i]); }
    return null;
  }
  function changePassword(oldPw, newPw) {
    var u = currentUser();
    if (!u) return Promise.resolve({ ok: false, error: 'Session expirée.' });
    return hashPw(oldPw, u.salt).then(function (h) {
      if (h !== u.hash) return { ok: false, error: 'Le mot de passe actuel est incorrect.' };
      var salt = randomSalt();
      return hashPw(newPw, salt).then(function (nh) { updateUser({ salt: salt, hash: nh }); return { ok: true }; });
    });
  }
  function emitAuth() {
    markUser();
    try { document.dispatchEvent(new CustomEvent('vital:auth')); } catch (e) {}
  }
  V.currentUser = function () { return publicUser(currentUser()); };
  V.register = register; V.login = login; V.logout = logout; V.updateUser = updateUser; V.changePassword = changePassword;
  V.userExists = function (email) { return !!findUser(email); };

  /* Adresses */
  function newId(prefix) { return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  V.newId = newId;
  V.saveAddress = function (addr) {
    var u = currentUser(); if (!u) return null;
    var list = (u.addresses || []).slice();
    if (!addr.id) addr.id = newId('a');
    if (list.length === 0) addr.isDefault = true;
    if (addr.isDefault) list.forEach(function (a) { a.isDefault = false; });
    var idx = -1; list.forEach(function (a, i) { if (a.id === addr.id) idx = i; });
    if (idx === -1) list.push(addr); else list[idx] = addr;
    updateUser({ addresses: list });
    return addr;
  };
  V.deleteAddress = function (id) {
    var u = currentUser(); if (!u) return;
    var list = (u.addresses || []).filter(function (a) { return a.id !== id; });
    if (list.length && !list.some(function (a) { return a.isDefault; })) list[0].isDefault = true;
    updateUser({ addresses: list });
  };
  V.setDefaultAddress = function (id) {
    var u = currentUser(); if (!u) return;
    var list = (u.addresses || []).map(function (a) { a.isDefault = a.id === id; return a; });
    updateUser({ addresses: list });
  };

  /* ================= Commandes ================= */
  function getOrders() { return read('vital_orders', []); }
  function saveOrders(o) { write('vital_orders', o); }
  function nextOrderNumber() {
    var seq = read('vital_order_seq', 1041) + 1; write('vital_order_seq', seq);
    return 'VT-' + new Date().getFullYear() + '-' + String(seq).padStart(5, '0');
  }
  function createOrder(data) {
    var o = {
      id: nextOrderNumber(), date: new Date().toISOString(), status: 'preparation',
      email: String(data.contact.email).trim().toLowerCase(),
      contact: data.contact, address: data.address, delivery: data.delivery, payment: data.payment,
      lines: data.lines, subtotal: data.totals.subtotal, discount: data.totals.discount, promo: data.totals.promo,
      shipping: data.totals.shipping, total: data.totals.total, note: data.note || ''
    };
    var all = getOrders(); all.unshift(o); saveOrders(all);
    write('vital_last_order', o.id);
    return o;
  }
  function getOrder(id) { var a = getOrders(); for (var i = 0; i < a.length; i++) if (a[i].id === id) return a[i]; return null; }
  function ordersForCurrentUser() {
    var u = currentUser(); if (!u) return [];
    return getOrders().filter(function (o) { return o.email === u.email; });
  }
  function canViewOrder(o) {
    if (!o) return false;
    var u = currentUser();
    return (u && u.email === o.email) || read('vital_last_order', '') === o.id;
  }
  function cancelOrder(id) {
    var all = getOrders();
    for (var i = 0; i < all.length; i++) if (all[i].id === id && all[i].status === 'preparation') { all[i].status = 'annulee'; all[i].cancelledAt = new Date().toISOString(); saveOrders(all); return true; }
    return false;
  }
  function rebuyOrder(o) {
    var n = 0;
    o.lines.forEach(function (l) { if (productById(l.id)) { var c = V.getCart(); c[l.id] = Math.min(99, (c[l.id] || 0) + l.qty); write('vital_cart', c); n += l.qty; } });
    emitCart();
    return n;
  }
  function linesFromCart() {
    return cartLines().map(function (l) { return { id: l.product.id, slug: l.product.slug, name: l.product.name, size: l.product.size, image: l.product.image, price: l.product.price, qty: l.qty }; });
  }
  V.createOrder = createOrder; V.getOrder = getOrder; V.ordersForCurrentUser = ordersForCurrentUser; V.canViewOrder = canViewOrder;
  V.cancelOrder = cancelOrder; V.rebuyOrder = rebuyOrder; V.linesFromCart = linesFromCart;

  /* Compte de démonstration (3 commandes d'exemple) */
  V.seedDemo = function () {
    var email = 'demo@vital.fr';
    var done = function () { write('vital_session', { email: email }); emitAuth(); return { ok: true }; };
    if (findUser(email)) return Promise.resolve(done());
    var salt = randomSalt();
    return hashPw('Demo1234', salt).then(function (hash) {
      var addr = { id: 'a-demo1', label: 'Domicile', firstName: 'Camille', lastName: 'Martin', phone: '06 12 34 56 78', address: '12 rue des Lilas', complement: 'Bâtiment B, appt 4', city: 'Lyon', zip: '69003', isDefault: true };
      var users = getUsers();
      users.push({ email: email, firstName: 'Camille', lastName: 'Martin', phone: '06 12 34 56 78', newsletter: true, addresses: [addr], salt: salt, hash: hash, createdAt: new Date(Date.now() - 90 * 864e5).toISOString() });
      saveUsers(users);
      var mk = function (id, daysAgo, status, items, shipKey, payKey) {
        var lines = items.map(function (it) { var p = V.productBySlug(it[0]); return { id: p.id, slug: p.slug, name: p.name, size: p.size, image: p.image, price: p.price, qty: it[1] }; });
        var sub = lines.reduce(function (s, l) { return s + l.price * l.qty; }, 0);
        var ship = shipKey === 'standard' ? (sub >= CONFIG.freeShippingThreshold ? 0 : 5) : CONFIG.shipping[shipKey].price;
        return { id: id, date: new Date(Date.now() - daysAgo * 864e5).toISOString(), status: status, email: email,
          contact: { firstName: 'Camille', lastName: 'Martin', email: email, phone: '06 12 34 56 78' }, address: addr,
          delivery: { key: shipKey, label: CONFIG.shipping[shipKey].label, eta: CONFIG.shipping[shipKey].eta, price: ship },
          payment: payKey === 'card' ? { key: 'card', label: 'Carte bancaire •••• 4242', status: 'Payée' } : { key: 'cod', label: 'Paiement à la livraison', status: status === 'livree' ? 'Payée' : 'À payer à la livraison' },
          lines: lines, subtotal: sub, discount: 0, promo: '', shipping: ship, total: sub + ship, note: '' };
      };
      var demo = [
        mk('VT-2026-01038', 52, 'livree', [['ms-atopic-lotion', 1], ['ms-gel-nettoyant-purifiant', 1]], 'standard', 'card'),
        mk('VT-2026-01039', 16, 'livree', [['vip-skin-serum', 1], ['vip-skin-gel-hydratation-active', 1]], 'standard', 'card'),
        mk('VT-2026-01040', 3, 'expediee', [['ms-fotocontrol-familial', 2]], 'express', 'cod')
      ];
      var all = getOrders().filter(function (o) { return o.email !== email; });
      saveOrders(demo.reverse().concat(all));
      return done();
    });
  };

  /* ================= En-tête / pied de page ================= */
  var ICON = {
    search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
    user: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
    cart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>',
    lock: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>',
    check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    bag: '<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#A9DCDD" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>'
  };
  V.ICON = ICON;

  function headerHtml(active, minimal) {
    if (minimal) {
      return '<header class="s-min"><div class="wrap">' +
        '<a href="index.html" class="logo"><img src="assets/logo.png" alt="VITAL Laboratoires"></a>' +
        '<span class="s-secure">' + ICON.lock + ' Paiement 100 % sécurisé</span>' +
        '<a href="panier.html" class="link-plain">← Retour au panier</a>' +
        '</div></header>';
    }
    function nav(href, label, key) { return '<a href="' + href + '"' + (active === key ? ' class="active"' : '') + '>' + label + '</a>'; }
    return '<header><div class="wrap">' +
      '<a href="index.html" class="logo"><img src="assets/logo.png" alt="VITAL Laboratoires"></a>' +
      '<nav class="main-nav">' + nav('index.html', 'Accueil', 'home') + nav('index.html#categories', 'Catégories', 'cat') + nav('index.html#produits', 'Produits', 'prod') + nav('index.html#apropos', 'À propos', 'about') + nav('#contact', 'Contact', 'contact') + '</nav>' +
      '<div class="header-icons">' +
        '<button aria-label="Rechercher">' + ICON.search + '</button>' +
        '<button aria-label="Mon compte">' + ICON.user + '</button>' +
        '<button aria-label="Panier">' + ICON.cart + '<span class="cart-badge">0</span></button>' +
      '</div></div></header>';
  }
  function footerHtml(minimal) {
    if (minimal) {
      return '<footer style="margin-top:56px"><div class="footer-bottom"><span>© 2026 VITAL Laboratoires. Tous droits réservés.</span><span><a href="panier.html">Panier</a> · <a href="compte.html">Mon compte</a></span></div></footer>';
    }
    var cats = V.CATEGORIES.map(function (c) { return '<a href="index.html?cat=' + c.key + '#produits">' + esc(c.short) + '</a>'; }).join('');
    return '<footer id="contact"><div class="footer-grid">' +
      '<div class="footer-col"><a href="index.html" class="logo"><img src="assets/logo.png" alt="VITAL Laboratoires"></a><p>Soins dermatologiques de la peau : les gammes MS, AWA et VIP Skin pour le visage, le corps et le cuir chevelu.</p></div>' +
      '<div class="footer-col"><div class="head">Navigation</div><a href="index.html">Accueil</a><a href="index.html#categories">Catégories</a><a href="index.html#produits">Tous les produits</a><a href="index.html#apropos">À propos</a></div>' +
      '<div class="footer-col"><div class="head">Gammes</div>' + cats + '</div>' +
      '<div class="footer-col"><div class="head">Mon espace</div><a href="compte.html#connexion">Mon compte</a><a href="compte.html#commandes">Mes commandes</a><a href="panier.html">Mon panier</a><span>contact@vital.com.tn</span></div>' +
      '</div><div class="footer-bottom"><span>© 2026 VITAL Laboratoires. Tous droits réservés.</span><span>Paiement sécurisé · Livraison en France</span></div></footer>';
  }
  V.mountChrome = function (opts) {
    opts = opts || {};
    var top = document.getElementById('site-top');
    if (top) top.innerHTML = (opts.minimal ? '' : '<div class="topbar">Livraison offerte dès ' + CONFIG.freeShippingThreshold + '&nbsp;€ d\'achat — Conseil pharmacien inclus</div>') + headerHtml(opts.active, opts.minimal);
    var foot = document.getElementById('site-footer');
    if (foot) foot.innerHTML = footerHtml(opts.minimal);
    bindHeader();
  };

  function markUser() {
    var u = currentUser();
    document.querySelectorAll('.header-icons button[aria-label="Mon compte"]').forEach(function (b) {
      b.classList.toggle('has-user', !!u);
      b.title = u ? 'Bonjour ' + u.firstName : 'Se connecter';
    });
  }
  /* ================= Menu burger (tablette et mobile) ================= */
  var mmPanel, mmOverlay;
  function mmClose() {
    if (!mmPanel) return;
    mmPanel.classList.remove('open'); mmOverlay.classList.remove('open');
    document.body.classList.remove('mm-lock');
    document.querySelectorAll('header .burger').forEach(function (b) { b.classList.remove('open'); b.setAttribute('aria-expanded', 'false'); });
  }
  function mmOpen(header) {
    var u = V.currentUser();
    var links = '';
    header.querySelectorAll('nav.main-nav a').forEach(function (a, i) {
      links += '<a class="mm-link' + (a.classList.contains('active') ? ' active' : '') + '" style="--i:' + i + ';" href="' + a.getAttribute('href') + '">' + a.textContent + '</a>';
    });
    mmPanel.innerHTML =
      '<nav class="mm-links" aria-label="Menu principal">' + links + '</nav>' +
      '<div class="mm-account">' +
        '<div class="mm-head">' + (u ? 'Bonjour ' + esc(u.firstName) : 'Mon espace') + '</div>' +
        '<a class="mm-link sm" href="compte.html#commandes">Mes commandes</a>' +
        '<a class="btn-primary mm-cta" href="' + (u ? 'compte.html#tableau-de-bord' : 'compte.html#connexion') + '">' + ICON.user + (u ? 'Mon compte' : 'Se connecter') + '</a>' +
      '</div>';
    mmPanel.style.setProperty('--mm-top', Math.max(0, Math.round(header.getBoundingClientRect().bottom)) + 'px');
    mmOverlay.style.setProperty('--mm-top', Math.max(0, Math.round(header.getBoundingClientRect().bottom)) + 'px');
    mmPanel.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', mmClose); });
    void mmPanel.offsetWidth;
    mmPanel.classList.add('open'); mmOverlay.classList.add('open');
    document.body.classList.add('mm-lock');
    header.querySelectorAll('.burger').forEach(function (b) { b.classList.add('open'); b.setAttribute('aria-expanded', 'true'); });
  }
  function initBurger() {
    var header = document.querySelector('header:not(.s-min)');
    if (!header || header.__burger) return;
    var wrap = header.querySelector('.wrap'), nav = header.querySelector('nav.main-nav');
    if (!wrap || !nav) return;
    header.__burger = true;
    if (!mmPanel) {
      mmOverlay = document.createElement('div'); mmOverlay.className = 'mm-overlay';
      mmPanel = document.createElement('aside'); mmPanel.className = 'mm-panel'; mmPanel.id = 'mobile-menu';
      document.body.appendChild(mmOverlay); document.body.appendChild(mmPanel);
      mmOverlay.addEventListener('click', mmClose);
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') mmClose(); });
      window.addEventListener('resize', function () { if (window.innerWidth > 1024) mmClose(); });
    }
    var btn = document.createElement('button');
    btn.className = 'burger'; btn.type = 'button';
    btn.setAttribute('aria-label', 'Menu'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', 'mobile-menu');
    btn.innerHTML = '<span></span><span></span><span></span>';
    btn.addEventListener('click', function () { if (btn.classList.contains('open')) mmClose(); else mmOpen(header); });
    wrap.insertBefore(btn, wrap.firstChild);
  }

  function bindHeader() {
    document.querySelectorAll('.header-icons button').forEach(function (b) {
      if (b.__vbound) return; b.__vbound = true;
      var l = b.getAttribute('aria-label');
      b.addEventListener('click', function () {
        if (l === 'Panier') openDrawer();
        else if (l === 'Mon compte') location.href = V.currentUser() ? 'compte.html#tableau-de-bord' : 'compte.html#connexion';
        else if (l === 'Rechercher') {
          var inp = document.getElementById('search-input');
          if (inp) { document.getElementById('produits').scrollIntoView({ behavior: 'smooth' }); setTimeout(function () { inp.focus(); }, 350); }
          else location.href = 'index.html?focus=search#produits';
        }
      });
    });
    V.updateBadge(); markUser(); initBurger();
  }

  /* ================= Tiroir panier ================= */
  var drawer, overlay;
  function ensureDrawer() {
    if (drawer) return;
    overlay = document.createElement('div'); overlay.className = 's-overlay';
    drawer = document.createElement('aside'); drawer.className = 's-drawer';
    drawer.setAttribute('role', 'dialog'); drawer.setAttribute('aria-modal', 'true'); drawer.setAttribute('aria-label', 'Mon panier');
    document.body.appendChild(overlay); document.body.appendChild(drawer);
    overlay.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });
    drawer.addEventListener('click', function (e) {
      var t = e.target.closest('[data-act]'); if (!t) return;
      var id = t.getAttribute('data-id'), act = t.getAttribute('data-act'), c = V.getCart();
      if (act === 'close') closeDrawer();
      else if (act === 'inc') setQty(id, (c[id] || 0) + 1);
      else if (act === 'dec') setQty(id, (c[id] || 0) - 1);
      else if (act === 'rm') removeFromCart(id);
    });
    document.addEventListener('vital:cart', renderDrawer);
  }
  function shipBarHtml(t) {
    if (!t.subtotal && !t.count) return '';
    var pct = Math.min(100, Math.round((t.net / CONFIG.freeShippingThreshold) * 100));
    if (t.freeShip) return '<div class="s-ship-bar done">Livraison standard offerte ✓<div class="track"><i style="width:100%"></i></div></div>';
    return '<div class="s-ship-bar">Plus que <b>' + fmtMoney(t.remainingForFree) + '</b> pour profiter de la livraison offerte<div class="track"><i style="width:' + pct + '%"></i></div></div>';
  }
  V.shipBarHtml = shipBarHtml;
  function renderDrawer() {
    if (!drawer) return;
    var lines = cartLines(), t = computeTotals(lines, null);
    var body;
    if (!lines.length) {
      body = '<div class="s-empty">' + ICON.bag + '<h3>Votre panier est vide</h3><p>Découvrez nos soins dermatologiques et ajoutez vos produits préférés.</p><a href="index.html#produits" class="btn-primary" data-act="close">Voir les produits</a></div>';
    } else {
      body = shipBarHtml(t) + lines.map(function (l) {
        var p = l.product;
        return '<div class="s-line"><a class="img" href="producto.html?p=' + p.slug + '"><img src="' + p.image + '" alt=""></a>' +
          '<div><a class="nm" href="producto.html?p=' + p.slug + '">' + esc(p.name) + '</a><div class="sb">' + esc(p.size) + '</div>' +
          (l.total === null ? '<span class="nopr">Prix à confirmer</span>' : '<div class="tot">' + fmtMoney(l.total) + '</div>') +
          '<div class="ctl"><div class="s-qty"><button data-act="dec" data-id="' + p.id + '" aria-label="Moins">−</button><span>' + l.qty + '</span><button data-act="inc" data-id="' + p.id + '" aria-label="Plus">+</button></div>' +
          '<button class="rm" data-act="rm" data-id="' + p.id + '">Retirer</button></div></div></div>';
      }).join('');
    }
    var foot = lines.length ?
      '<div class="df"><div class="sub"><span>Sous-total</span><span>' + fmtMoney(t.subtotal) + '</span></div><div class="note">Frais de livraison et codes promo calculés à l’étape suivante.</div>' +
      '<div class="btns"><a href="commande.html" class="btn-primary btn-block">Commander</a><a href="panier.html" class="btn-ghost btn-block">Voir le panier</a></div></div>' : '';
    drawer.innerHTML = '<div class="dh"><h2>Mon panier (' + t.count + ')</h2><button class="x" data-act="close" aria-label="Fermer">&times;</button></div><div class="db">' + body + '</div>' + foot;
  }
  function openDrawer() {
    if (document.body.hasAttribute('data-no-drawer')) return;   // pages panier / commande : pas de tiroir
    ensureDrawer(); renderDrawer();
    requestAnimationFrame(function () { overlay.classList.add('open'); drawer.classList.add('open'); });
  }
  function closeDrawer() { if (drawer) { overlay.classList.remove('open'); drawer.classList.remove('open'); } }
  V.openDrawer = openDrawer; V.closeDrawer = closeDrawer;

  /* ================= Modale / confirmation ================= */
  V.modal = function (opts) {
    var ov = document.createElement('div'); ov.className = 's-modal-ov';
    ov.innerHTML = '<div class="s-modal" role="dialog" aria-modal="true"><h2>' + esc(opts.title || '') + '</h2>' + (opts.html || '') + '<div class="acts"></div></div>';
    var acts = ov.querySelector('.acts');
    (opts.actions || []).forEach(function (a) {
      var b = document.createElement('button');
      b.className = a.cls || 'btn-ghost'; b.textContent = a.label;
      b.addEventListener('click', function () { var r = a.onClick ? a.onClick(ov) : undefined; if (r !== false && !a.keep) close(); });
      acts.appendChild(b);
    });
    if (!(opts.actions || []).length) acts.remove();
    function close() { ov.classList.remove('open'); setTimeout(function () { ov.remove(); }, 200); }
    ov.__close = close;
    document.body.appendChild(ov);
    requestAnimationFrame(function () { ov.classList.add('open'); });
    if (opts.dismissible !== false) ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    return ov;
  };
  V.confirm = function (title, text, okLabel, danger) {
    return new Promise(function (resolve) {
      V.modal({ title: title, html: '<p>' + esc(text) + '</p>', actions: [
        { label: 'Annuler', onClick: function () { resolve(false); } },
        { label: okLabel || 'Confirmer', cls: danger ? 'btn-danger' : 'btn-primary', onClick: function () { resolve(true); } }
      ] });
    });
  };

  /* ================= Utilitaires de pages ================= */
  V.statusBadge = function (key) { return '<span class="s-status ' + key + '">' + esc(CONFIG.statuses[key] || key) + '</span>'; };
  V.qs = function (name) { return new URLSearchParams(location.search).get(name); };
  V.productCardHtml = function (p) {
    var href = 'producto.html?p=' + p.slug;
    return '<div class="s-pcard"><a class="th" href="' + href + '"><img src="' + p.image + '" alt="' + esc(p.name) + '" loading="lazy"></a>' +
      '<div class="bd"><a class="nm" href="' + href + '">' + esc(p.name) + '</a><div class="sz">' + esc(p.size) + '</div>' +
      '<div class="rw"><span class="pr">' + (p.price === null ? '<span class="s-muted">[Prix]</span>' : fmtMoney(p.price)) + '</span>' +
      '<button class="s-add" data-add="' + p.id + '" aria-label="Ajouter ' + esc(p.name) + ' au panier"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></button></div></div></div>';
  };
  V.bindAddButtons = function (root) {
    root.querySelectorAll('[data-add]').forEach(function (b) {
      b.addEventListener('click', function () { V.addToCart(parseInt(b.getAttribute('data-add'), 10), 1); });
    });
  };
  V.lineAddress = function (a) {
    return esc(a.address) + (a.complement ? ', ' + esc(a.complement) : '') + '<br>' + esc(a.zip || '') + ' ' + esc(a.city) + '<br>France';
  };

  /* ================= Initialisation ================= */
  function init() {
    bindHeader();
    // focus de la recherche demandé depuis une autre page
    if (V.qs('focus') === 'search') { var inp = document.getElementById('search-input'); if (inp) setTimeout(function () { inp.focus(); }, 400); }
    document.addEventListener('vital:cart', V.updateBadge);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  // synchronise le badge entre onglets
  window.addEventListener('storage', function (e) { if (e.key === 'vital_cart') { V.updateBadge(); renderDrawer(); } if (e.key === 'vital_session') markUser(); });
})();
