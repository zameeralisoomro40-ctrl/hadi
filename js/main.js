/**
 * HADI Hotel & Restaurant - Customer Website Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Current Cart State
    let cart = [];
    let appliedDiscount = 0; // percentage, e.g. 10
    let currentCategory = 'all';
    let searchQuery = '';

    // Load Cart from sessionStorage if available
    try {
        const savedCart = sessionStorage.getItem('hadi_customer_cart');
        if (savedCart) cart = JSON.parse(savedCart);
    } catch (e) {
        cart = [];
    }

    // DOM Elements
    const siteHeader = document.getElementById('siteHeader');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const menuGridContainer = document.getElementById('menuGridContainer');
    const menuSearchInput = document.getElementById('menuSearchInput');
    const categoryTabs = document.querySelectorAll('.category-tab');
    
    // Cart Elements
    const openCartBtn = document.getElementById('openCartBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartItemsList = document.getElementById('cartItemsList');
    const cartCountBadge = document.getElementById('cartCountBadge');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTax = document.getElementById('cartTax');
    const cartDiscount = document.getElementById('cartDiscount');
    const discountLine = document.getElementById('discountLine');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Checkout Modal Elements
    const checkoutModal = document.getElementById('checkoutModal');
    const closeCheckoutModalBtn = document.getElementById('closeCheckoutModalBtn');
    const checkoutForm = document.getElementById('checkoutForm');
    const checkoutFinalAmount = document.getElementById('checkoutFinalAmount');
    const applyPromoBtn = document.getElementById('applyPromoBtn');
    const promoCodeInput = document.getElementById('promoCode');

    // Order Success Modal
    const orderSuccessModal = document.getElementById('orderSuccessModal');
    const successOrderId = document.getElementById('successOrderId');
    const successDoneBtn = document.getElementById('successDoneBtn');

    // Reservation Form
    const reservationForm = document.getElementById('reservationForm');
    const resDateInput = document.getElementById('resDate');

    // Rooms & Reviews Containers
    const roomsGridContainer = document.getElementById('roomsGridContainer');
    const reviewsContainer = document.getElementById('reviewsContainer');
    const reviewModal = document.getElementById('reviewModal');
    const openReviewModalBtn = document.getElementById('openReviewModalBtn');
    const closeReviewModalBtn = document.getElementById('closeReviewModalBtn');
    const reviewForm = document.getElementById('reviewForm');

    // Set minimum date for reservation as today
    if (resDateInput) {
        const todayStr = new Date().toISOString().split('T')[0];
        resDateInput.min = todayStr;
        resDateInput.value = todayStr;
    }

    // Synchronize restaurant settings
    function syncSettings() {
        if (!window.HadiStore) return;
        const settings = window.HadiStore.getSettings();
        if (settings) {
            const phoneEl = document.getElementById('contactPhone');
            const addressEl = document.getElementById('contactAddress');
            const emailEl = document.getElementById('contactEmail');
            if (phoneEl) {
                phoneEl.textContent = settings.phone;
                phoneEl.href = `tel:${settings.phone.replace(/\s+/g, '')}`;
            }
            if (addressEl) addressEl.textContent = `${settings.address}, ${settings.city}`;
            if (emailEl) {
                emailEl.textContent = settings.email;
                emailEl.href = `mailto:${settings.email}`;
            }
        }
    }

    // ==========================================
    // NAVIGATION & SCROLL EVENTS
    // ==========================================
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            siteHeader.classList.add('scrolled');
        } else {
            siteHeader.classList.remove('scrolled');
        }
    });

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            const icon = mobileMenuToggle.querySelector('i');
            if (navMenu.classList.contains('open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu on link click
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                const icon = mobileMenuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // ==========================================
    // MENU RENDERING & FILTERING
    // ==========================================
    function renderMenu() {
        if (!menuGridContainer || !window.HadiStore) return;

        const allItems = window.HadiStore.getMenu();
        const filtered = allItems.filter(item => {
            const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  (item.badge && item.badge.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        });

        if (filtered.length === 0) {
            menuGridContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
                    <i class="fa-solid fa-utensils" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                    <h3 style="color: #ffffff; margin-bottom: 0.5rem;">No Dishes Found</h3>
                    <p>Try searching for something else or browse another category.</p>
                </div>
            `;
            return;
        }

        menuGridContainer.innerHTML = filtered.map(item => `
            <div class="menu-card" data-id="${item.id}">
                <div class="menu-card-img-wrap">
                    <img src="${item.image}" alt="${item.name}" class="menu-card-img" loading="lazy">
                    ${item.badge ? `<span class="menu-badge">${item.badge}</span>` : ''}
                    <div class="veg-indicator ${item.isVeg ? 'veg' : 'non-veg'}" title="${item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}"></div>
                </div>
                <div class="menu-card-body">
                    <div class="menu-card-meta">
                        <div class="menu-rating">
                            <i class="fa-solid fa-star"></i>
                            <span>${item.rating} (${item.reviewsCount})</span>
                        </div>
                        <span style="color: var(--text-muted); font-size: 0.78rem;">
                            <i class="fa-regular fa-clock"></i> ${item.prepTime || '20 min'}
                        </span>
                    </div>

                    <h3 class="menu-card-title">${item.name}</h3>
                    <p class="menu-card-desc">${item.description}</p>

                    <div class="menu-specs">
                        <span><i class="fa-solid fa-fire text-gold"></i> ${item.calories || '550 kcal'}</span>
                        <span><i class="fa-solid fa-bowl-rice text-gold"></i> Freshly Served</span>
                    </div>

                    <div class="menu-card-footer">
                        <div class="price-box">
                            <span class="current-price">Rs. ${item.price.toLocaleString()}</span>
                            ${item.originalPrice ? `<span class="original-price">Rs. ${item.originalPrice.toLocaleString()}</span>` : ''}
                        </div>

                        ${item.isAvailable ? `
                            <button class="btn-add-cart" onclick="window.addToCart('${item.id}')">
                                <i class="fa-solid fa-plus"></i> Add
                            </button>
                        ` : `
                            <span style="font-size: 0.8rem; color: var(--crimson); font-weight: 700;">Sold Out</span>
                        `}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Category Tabs click
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentCategory = tab.dataset.category;
            renderMenu();
        });
    });

    // Search Input
    if (menuSearchInput) {
        menuSearchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim();
            renderMenu();
        });
    }

    // ==========================================
    // CART OPERATIONS
    // ==========================================
    window.addToCart = function(itemId) {
        const item = window.HadiStore.getMenu().find(m => m.id === itemId);
        if (!item || !item.isAvailable) return;

        const existing = cart.find(c => c.id === itemId);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: 1
            });
        }

        saveCart();
        updateCartUI();
        showToast(`Added "${item.name}" to cart!`, 'success');
        openCart();
    };

    window.updateCartQty = function(itemId, delta) {
        const item = cart.find(c => c.id === itemId);
        if (!item) return;

        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(c => c.id !== itemId);
        }

        saveCart();
        updateCartUI();
    };

    window.removeFromCart = function(itemId) {
        cart = cart.filter(c => c.id !== itemId);
        saveCart();
        updateCartUI();
        showToast('Item removed from cart', 'info');
    };

    function saveCart() {
        try {
            sessionStorage.setItem('hadi_customer_cart', JSON.stringify(cart));
        } catch (e) {}
    }

    function calculateCartTotals() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = Math.round(subtotal * 0.05); // 5% GST
        const discountAmount = appliedDiscount > 0 ? Math.round(subtotal * (appliedDiscount / 100)) : 0;
        const total = subtotal + tax - discountAmount;
        return { subtotal, tax, discountAmount, total };
    }

    function updateCartUI() {
        // Update badge count
        const totalItemsCount = cart.reduce((sum, i) => sum + i.quantity, 0);
        if (cartCountBadge) {
            cartCountBadge.textContent = totalItemsCount;
            cartCountBadge.style.display = totalItemsCount > 0 ? 'flex' : 'none';
        }

        if (!cartItemsList) return;

        if (cart.length === 0) {
            cartItemsList.innerHTML = `
                <div class="cart-empty-state">
                    <i class="fa-solid fa-bag-shopping"></i>
                    <h4 style="color: #ffffff; margin-bottom: 0.3rem;">Your Cart is Empty</h4>
                    <p style="font-size: 0.88rem;">Explore our royal menu and add your favorite dishes.</p>
                </div>
            `;
            if (cartSubtotal) cartSubtotal.textContent = 'Rs. 0';
            if (cartTax) cartTax.textContent = 'Rs. 0';
            if (cartTotal) cartTotal.textContent = 'Rs. 0';
            if (checkoutBtn) checkoutBtn.disabled = true;
            if (discountLine) discountLine.style.display = 'none';
            return;
        }

        if (checkoutBtn) checkoutBtn.disabled = false;

        cartItemsList.innerHTML = cart.map(item => `
            <div class="cart-item-row">
                <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">Rs. ${(item.price * item.quantity).toLocaleString()}</div>
                </div>
                <div class="cart-qty-ctrl">
                    <button class="qty-btn" onclick="window.updateCartQty('${item.id}', -1)">-</button>
                    <span class="qty-num">${item.quantity}</span>
                    <button class="qty-btn" onclick="window.updateCartQty('${item.id}', 1)">+</button>
                </div>
                <button class="cart-remove-btn" onclick="window.removeFromCart('${item.id}')" title="Remove item">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `).join('');

        const totals = calculateCartTotals();
        if (cartSubtotal) cartSubtotal.textContent = `Rs. ${totals.subtotal.toLocaleString()}`;
        if (cartTax) cartTax.textContent = `Rs. ${totals.tax.toLocaleString()}`;
        
        if (discountLine && cartDiscount) {
            if (totals.discountAmount > 0) {
                discountLine.style.display = 'flex';
                cartDiscount.textContent = `-Rs. ${totals.discountAmount.toLocaleString()}`;
            } else {
                discountLine.style.display = 'none';
            }
        }

        if (cartTotal) cartTotal.textContent = `Rs. ${totals.total.toLocaleString()}`;
        if (checkoutFinalAmount) checkoutFinalAmount.textContent = `Rs. ${totals.total.toLocaleString()}`;
    }

    function openCart() {
        if (cartDrawer && cartOverlay) {
            cartDrawer.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeCart() {
        if (cartDrawer && cartOverlay) {
            cartDrawer.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (openCartBtn) openCartBtn.addEventListener('click', openCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    // ==========================================
    // CHECKOUT MODAL & ORDER PLACEMENT
    // ==========================================
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showToast('Your cart is empty!', 'error');
                return;
            }
            closeCart();
            const totals = calculateCartTotals();
            if (checkoutFinalAmount) checkoutFinalAmount.textContent = `Rs. ${totals.total.toLocaleString()}`;
            if (checkoutModal) {
                checkoutModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    if (closeCheckoutModalBtn && checkoutModal) {
        closeCheckoutModalBtn.addEventListener('click', () => {
            checkoutModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Promo Code Application
    if (applyPromoBtn && promoCodeInput) {
        applyPromoBtn.addEventListener('click', () => {
            const code = promoCodeInput.value.trim().toUpperCase();
            if (code === 'HADI10') {
                appliedDiscount = 10;
                updateCartUI();
                showToast('Promo code HADI10 applied: 10% OFF!', 'success');
            } else {
                showToast('Invalid promo code. Try HADI10', 'error');
            }
        });
    }

    // Checkout Form Submission
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (cart.length === 0) {
                showToast('Cannot submit empty order', 'error');
                return;
            }

            const totals = calculateCartTotals();
            const orderData = {
                customerName: document.getElementById('custName').value.trim(),
                customerPhone: document.getElementById('custPhone').value.trim(),
                orderType: document.getElementById('orderType').value,
                address: document.getElementById('custAddress').value.trim(),
                paymentMethod: document.getElementById('paymentMethod').value,
                notes: document.getElementById('orderNotes').value.trim(),
                items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
                subtotal: totals.subtotal,
                tax: totals.tax,
                discount: totals.discountAmount,
                total: totals.total
            };

            const createdOrder = window.HadiStore.createOrder(orderData);

            // Reset cart
            cart = [];
            appliedDiscount = 0;
            saveCart();
            updateCartUI();

            // Close checkout modal
            if (checkoutModal) checkoutModal.classList.remove('active');

            // Show Success Modal
            if (successOrderId) successOrderId.textContent = `#${createdOrder.id}`;
            if (orderSuccessModal) orderSuccessModal.classList.add('active');

            checkoutForm.reset();
        });
    }

    if (successDoneBtn && orderSuccessModal) {
        successDoneBtn.addEventListener('click', () => {
            orderSuccessModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // ==========================================
    // TABLE RESERVATION FORM
    // ==========================================
    if (reservationForm) {
        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const resData = {
                guestName: document.getElementById('resName').value.trim(),
                phone: document.getElementById('resPhone').value.trim(),
                date: document.getElementById('resDate').value,
                time: document.getElementById('resTime').value,
                guests: parseInt(document.getElementById('resGuests').value, 10),
                seatingArea: document.getElementById('resArea').value,
                occasion: document.getElementById('resOccasion').value.trim() || 'General Dining'
            };

            const newRes = window.HadiStore.createReservation(resData);
            reservationForm.reset();
            if (resDateInput) resDateInput.value = new Date().toISOString().split('T')[0];

            showToast(`Table reserved successfully! Tracking ID: #${newRes.id}`, 'success');
        });
    }

    // ==========================================
    // ROOMS RENDERING
    // ==========================================
    function renderRooms() {
        if (!roomsGridContainer || !window.HadiStore) return;
        const rooms = window.HadiStore.getRooms();

        roomsGridContainer.innerHTML = rooms.map(room => `
            <div class="room-card">
                <div class="room-img-wrap">
                    <img src="${room.image}" alt="${room.name}" class="room-img" loading="lazy">
                    <div class="room-price-badge">
                        <strong>Rs. ${room.pricePerNight.toLocaleString()}</strong>
                        <small> / Night</small>
                    </div>
                </div>
                <div class="room-body">
                    <div style="font-size: 0.8rem; color: var(--gold-light); font-weight: 700; margin-bottom: 0.2rem;">
                        <i class="fa-solid fa-star"></i> 5.0 Star Suite • ${room.size}
                    </div>
                    <h3 class="room-title">${room.name}</h3>
                    <p class="room-desc">${room.description}</p>
                    
                    <div class="room-amenities">
                        ${room.amenities.map(a => `<span class="amenity-pill"><i class="fa-solid fa-check text-gold" style="font-size: 0.65rem;"></i> ${a}</span>`).join('')}
                    </div>

                    <a href="https://wa.me/923007654321?text=Hello%20HADI%20Hotel,%20I%20am%20interested%20in%20booking%20the%20${encodeURIComponent(room.name)}" target="_blank" class="btn-outline" style="width: 100%; justify-content: center;">
                        <i class="fa-solid fa-calendar-check"></i> Inquire & Book Suite
                    </a>
                </div>
            </div>
        `).join('');
    }

    // ==========================================
    // REVIEWS RENDERING & SUBMISSION
    // ==========================================
    function renderReviews() {
        if (!reviewsContainer || !window.HadiStore) return;
        const reviews = window.HadiStore.getReviews();

        reviewsContainer.innerHTML = reviews.map(rev => `
            <div class="review-card">
                <div>
                    <div class="review-stars">
                        ${Array.from({ length: rev.rating || 5 }).map(() => '<i class="fa-solid fa-star"></i>').join('')}
                    </div>
                    <p class="review-quote">"${rev.comment}"</p>
                </div>
                <div class="review-author-wrap">
                    <img src="${rev.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}" alt="${rev.author}" class="review-avatar">
                    <div>
                        <div class="author-name">${rev.author}</div>
                        <div class="author-role">${rev.role || 'Valued Guest'} • ${rev.date || 'Recent'}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    if (openReviewModalBtn && reviewModal) {
        openReviewModalBtn.addEventListener('click', () => {
            reviewModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeReviewModalBtn && reviewModal) {
        closeReviewModalBtn.addEventListener('click', () => {
            reviewModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newRev = {
                author: document.getElementById('revAuthor').value.trim(),
                rating: parseInt(document.getElementById('revRating').value, 10),
                role: document.getElementById('revRole').value.trim() || 'Verified Diner',
                comment: document.getElementById('revComment').value.trim(),
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
            };

            window.HadiStore.addReview(newRev);
            renderReviews();
            reviewForm.reset();
            if (reviewModal) reviewModal.classList.remove('active');
            document.body.style.overflow = '';
            showToast('Thank you! Your review has been published.', 'success');
        });
    }

    // ==========================================
    // TOAST NOTIFICATIONS
    // ==========================================
    function showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let iconHtml = '<i class="fa-solid fa-circle-info"></i>';
        if (type === 'success') iconHtml = '<i class="fa-solid fa-circle-check"></i>';
        if (type === 'error') iconHtml = '<i class="fa-solid fa-circle-exclamation"></i>';

        toast.innerHTML = `
            ${iconHtml}
            <span>${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    // Listen for storage updates across tabs or admin edits
    window.addEventListener('hadi_store_update', (e) => {
        renderMenu();
        renderReviews();
        syncSettings();
    });

    // Initialize all renders
    renderMenu();
    renderRooms();
    renderReviews();
    updateCartUI();
    syncSettings();
});
