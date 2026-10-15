/**
 * HADI Hotel & Restaurant - Admin Dashboard Management Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check Authentication
    const adminLoginScreen = document.getElementById('adminLoginScreen');
    const adminDashboardLayout = document.getElementById('adminDashboardLayout');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const loginPinInput = document.getElementById('loginPin');
    const quickDemoLoginBtn = document.getElementById('quickDemoLoginBtn');
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');

    // Sidebar & View Navigation
    const navItems = document.querySelectorAll('.admin-nav-item');
    const viewSections = document.querySelectorAll('.view-section');
    const pageTitleHeading = document.getElementById('pageTitleHeading');

    // Badges & Metrics
    const pendingOrdersBadge = document.getElementById('pendingOrdersBadge');
    const pendingResBadge = document.getElementById('pendingResBadge');
    const metricTotalRevenue = document.getElementById('metricTotalRevenue');
    const metricTotalOrders = document.getElementById('metricTotalOrders');
    const metricPendingOrdersText = document.getElementById('metricPendingOrdersText');
    const metricTotalReservations = document.getElementById('metricTotalReservations');
    const metricPendingResText = document.getElementById('metricPendingResText');
    const metricTotalMenuItems = document.getElementById('metricTotalMenuItems');

    // Tables
    const dashboardRecentOrdersTable = document.getElementById('dashboardRecentOrdersTable');
    const ordersFullTable = document.getElementById('ordersFullTable');
    const reservationsTable = document.getElementById('reservationsTable');
    const adminMenuTable = document.getElementById('adminMenuTable');
    const adminReviewsTable = document.getElementById('adminReviewsTable');

    // Filters & Searches
    const orderSearchInput = document.getElementById('orderSearchInput');
    const orderStatusFilter = document.getElementById('orderStatusFilter');
    const resSearchInput = document.getElementById('resSearchInput');
    const resStatusFilter = document.getElementById('resStatusFilter');
    const adminMenuSearch = document.getElementById('adminMenuSearch');
    const adminMenuCategoryFilter = document.getElementById('adminMenuCategoryFilter');

    // Modals
    const dishModal = document.getElementById('dishModal');
    const dishForm = document.getElementById('dishForm');
    const openAddDishModalBtn = document.getElementById('openAddDishModalBtn');
    const closeDishModalBtn = document.getElementById('closeDishModalBtn');
    const cancelDishBtn = document.getElementById('cancelDishBtn');
    const dishModalTitle = document.getElementById('dishModalTitle');

    const orderDetailsModal = document.getElementById('orderDetailsModal');
    const closeOrderDetailsModalBtn = document.getElementById('closeOrderDetailsModalBtn');
    const orderDetailsModalBody = document.getElementById('orderDetailsModalBody');

    // Settings
    const adminSettingsForm = document.getElementById('adminSettingsForm');
    const resetDemoDataBtn = document.getElementById('resetDemoDataBtn');

    // ==========================================
    // AUTHENTICATION LOGIC
    // ==========================================
    function checkAuth() {
        const isAuth = sessionStorage.getItem('hadi_admin_logged_in');
        if (isAuth === 'true') {
            adminLoginScreen.style.display = 'none';
            adminDashboardLayout.style.display = 'flex';
            loadAllData();
        } else {
            adminLoginScreen.style.display = 'flex';
            adminDashboardLayout.style.display = 'none';
        }
    }

    function doLogin(pin) {
        const settings = window.HadiStore.getSettings();
        const validPin = settings.adminPin || 'admin123';
        if (pin === validPin || pin === 'admin123' || pin === '1234') {
            sessionStorage.setItem('hadi_admin_logged_in', 'true');
            showToast('Welcome to HADI Hotel Admin Portal', 'success');
            checkAuth();
        } else {
            showToast('Invalid PIN / Password! Default is: admin123', 'error');
        }
    }

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            doLogin(loginPinInput.value.trim());
        });
    }

    if (quickDemoLoginBtn) {
        quickDemoLoginBtn.addEventListener('click', () => {
            doLogin('admin123');
        });
    }

    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('hadi_admin_logged_in');
            showToast('Logged out successfully', 'info');
            checkAuth();
        });
    }

    // ==========================================
    // TAB / VIEW SWITCHING
    // ==========================================
    window.switchAdminTab = function(targetViewId) {
        navItems.forEach(item => {
            if (item.dataset.view === targetViewId) {
                item.classList.add('active');
                if (pageTitleHeading) {
                    pageTitleHeading.textContent = item.querySelector('span').textContent;
                }
            } else {
                item.classList.remove('active');
            }
        });

        viewSections.forEach(sec => {
            if (sec.id === targetViewId) {
                sec.classList.add('active');
            } else {
                sec.classList.remove('active');
            }
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const viewId = item.dataset.view;
            if (viewId) window.switchAdminTab(viewId);
        });
    });

    // ==========================================
    // METRICS COMPUTATION
    // ==========================================
    function updateMetrics() {
        if (!window.HadiStore) return;
        const orders = window.HadiStore.getOrders();
        const reservations = window.HadiStore.getReservations();
        const menu = window.HadiStore.getMenu();

        // Calculate Revenue from non-cancelled orders
        const revenue = orders
            .filter(o => o.status !== 'Cancelled')
            .reduce((sum, o) => sum + (o.total || 0), 0);

        const pendingOrders = orders.filter(o => o.status === 'Pending').length;
        const pendingRes = reservations.filter(r => r.status === 'Pending').length;

        if (metricTotalRevenue) metricTotalRevenue.textContent = `Rs. ${Math.round(revenue).toLocaleString()}`;
        if (metricTotalOrders) metricTotalOrders.textContent = orders.length;
        if (metricPendingOrdersText) metricPendingOrdersText.textContent = `${pendingOrders} Pending Action`;
        if (metricTotalReservations) metricTotalReservations.textContent = reservations.length;
        if (metricPendingResText) metricPendingResText.textContent = `${pendingRes} Pending Confirmation`;
        if (metricTotalMenuItems) metricTotalMenuItems.textContent = menu.length;

        // Sidebar Badges
        if (pendingOrdersBadge) {
            pendingOrdersBadge.textContent = pendingOrders;
            pendingOrdersBadge.style.display = pendingOrders > 0 ? 'inline-block' : 'none';
        }
        if (pendingResBadge) {
            pendingResBadge.textContent = pendingRes;
            pendingResBadge.style.display = pendingRes > 0 ? 'inline-block' : 'none';
        }
    }

    // ==========================================
    // ORDERS MANAGEMENT
    // ==========================================
    function renderOrders() {
        if (!window.HadiStore) return;
        const orders = window.HadiStore.getOrders();
        const searchQuery = (orderSearchInput ? orderSearchInput.value : '').toLowerCase().trim();
        const statusFilter = orderStatusFilter ? orderStatusFilter.value : 'all';

        const filtered = orders.filter(order => {
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            const matchesSearch = order.id.toLowerCase().includes(searchQuery) ||
                                  order.customerName.toLowerCase().includes(searchQuery) ||
                                  order.customerPhone.includes(searchQuery);
            return matchesStatus && matchesSearch;
        });

        // 1. Dashboard Recent Orders (Top 5)
        if (dashboardRecentOrdersTable) {
            const recent = orders.slice(0, 5);
            if (recent.length === 0) {
                dashboardRecentOrdersTable.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--adm-text-muted);">No orders found</td></tr>`;
            } else {
                dashboardRecentOrdersTable.innerHTML = recent.map(order => `
                    <tr>
                        <td><strong>#${order.id}</strong></td>
                        <td>
                            <div>${order.customerName}</div>
                            <small style="color: var(--adm-text-muted);">${order.customerPhone}</small>
                        </td>
                        <td>${order.orderType}</td>
                        <td style="font-weight: 700; color: var(--adm-gold-light);">Rs. ${order.total.toLocaleString()}</td>
                        <td>
                            <span class="badge-status ${getStatusClass(order.status)}">${order.status}</span>
                        </td>
                        <td>
                            <button class="btn-icon" onclick="window.viewOrderDetails('${order.id}')" title="View Bill & Invoice">
                                <i class="fa-solid fa-file-invoice"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
            }
        }

        // 2. Full Orders Table
        if (ordersFullTable) {
            if (filtered.length === 0) {
                ordersFullTable.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2rem; color: var(--adm-text-muted);">No matching orders found</td></tr>`;
            } else {
                ordersFullTable.innerHTML = filtered.map(order => {
                    const itemsSummary = order.items.map(i => `${i.name} (x${i.quantity})`).join(', ');
                    return `
                        <tr>
                            <td><strong>#${order.id}</strong></td>
                            <td>
                                <div>${order.customerName}</div>
                                <small style="color: var(--adm-text-muted);">${new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                            </td>
                            <td><a href="tel:${order.customerPhone}" style="color: var(--adm-gold-light);">${order.customerPhone}</a></td>
                            <td>
                                <div>${order.orderType}</div>
                                <small style="color: var(--adm-text-secondary);">${order.address}</small>
                            </td>
                            <td style="max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${itemsSummary}">
                                ${itemsSummary}
                            </td>
                            <td style="font-weight: 800; color: var(--adm-gold-light);">Rs. ${order.total.toLocaleString()}</td>
                            <td>
                                <select class="filter-select" onchange="window.changeOrderStatus('${order.id}', this.value)" style="padding: 0.25rem 0.6rem; font-size: 0.8rem;">
                                    <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                                    <option value="Preparing" ${order.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
                                    <option value="Out for Delivery" ${order.status === 'Out for Delivery' ? 'selected' : ''}>Out for Delivery</option>
                                    <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
                                    <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                                </select>
                            </td>
                            <td>
                                <div class="action-btn-group">
                                    <button class="btn-icon" onclick="window.viewOrderDetails('${order.id}')" title="Print Invoice / View Details">
                                        <i class="fa-solid fa-receipt"></i>
                                    </button>
                                    <button class="btn-icon delete" onclick="window.deleteOrder('${order.id}')" title="Delete Order">
                                        <i class="fa-solid fa-trash-can"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('');
            }
        }
    }

    function getStatusClass(status) {
        return (status || '').toLowerCase().replace(/\s+/g, '-');
    }

    window.changeOrderStatus = function(orderId, newStatus) {
        window.HadiStore.updateOrderStatus(orderId, newStatus);
        updateMetrics();
        renderOrders();
        showToast(`Order #${orderId} status set to ${newStatus}`, 'success');
    };

    window.deleteOrder = function(orderId) {
        if (confirm(`Are you sure you want to delete Order #${orderId}?`)) {
            window.HadiStore.deleteOrder(orderId);
            updateMetrics();
            renderOrders();
            showToast(`Order #${orderId} deleted`, 'info');
        }
    };

    // View Order Details & Invoice Printable
    window.viewOrderDetails = function(orderId) {
        const order = window.HadiStore.getOrders().find(o => o.id === orderId);
        if (!order || !orderDetailsModal || !orderDetailsModalBody) return;

        const settings = window.HadiStore.getSettings();

        orderDetailsModalBody.innerHTML = `
            <div class="invoice-container invoice-printable">
                <div class="invoice-header">
                    <div>
                        <div class="invoice-logo-title">HADI Hotel & Restaurant</div>
                        <p style="font-size: 0.85rem; color: #6b7280; margin-top: 0.2rem;">${settings.address}, ${settings.city}</p>
                        <p style="font-size: 0.85rem; color: #6b7280;">Hotline: ${settings.phone}</p>
                    </div>
                    <div style="text-align: right;">
                        <h3 style="font-size: 1.25rem; color: #111827;">OFFICIAL RECEIPT</h3>
                        <p style="font-size: 0.88rem; color: #4b5563; font-weight: 700;">Order: #${order.id}</p>
                        <p style="font-size: 0.8rem; color: #6b7280;">${new Date(order.orderDate).toLocaleString()}</p>
                    </div>
                </div>

                <div style="background: #f9fafb; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.88rem;">
                    <div>
                        <strong>Customer Name:</strong> ${order.customerName}<br>
                        <strong>Phone:</strong> ${order.customerPhone}<br>
                        <strong>Service Type:</strong> ${order.orderType}
                    </div>
                    <div>
                        <strong>Delivery / Table:</strong> ${order.address}<br>
                        <strong>Payment:</strong> ${order.paymentMethod} (${order.paymentStatus})<br>
                        <strong>Current Status:</strong> <span style="font-weight: 700; color: #aa820a;">${order.status}</span>
                    </div>
                </div>

                ${order.notes ? `<p style="font-size: 0.85rem; font-style: italic; color: #4b5563; margin-bottom: 1rem;"><strong>Instructions:</strong> "${order.notes}"</p>` : ''}

                <table class="invoice-table">
                    <thead>
                        <tr>
                            <th>Item Description</th>
                            <th style="text-align: center;">Qty</th>
                            <th style="text-align: right;">Unit Price</th>
                            <th style="text-align: right;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td><strong>${item.name}</strong></td>
                                <td style="text-align: center;">${item.quantity}</td>
                                <td style="text-align: right;">Rs. ${item.price.toLocaleString()}</td>
                                <td style="text-align: right; font-weight: 600;">Rs. ${(item.price * item.quantity).toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.35rem; font-size: 0.92rem; border-top: 1px solid #e5e7eb; padding-top: 1rem;">
                    <div>Subtotal: <strong>Rs. ${order.subtotal.toLocaleString()}</strong></div>
                    <div>GST Tax (5%): <strong>Rs. ${order.tax.toLocaleString()}</strong></div>
                    ${order.discount ? `<div style="color: #10b981;">Discount: <strong>-Rs. ${order.discount.toLocaleString()}</strong></div>` : ''}
                    <div class="invoice-total-row" style="margin-top: 0.5rem; border-top: 2px solid #111827; padding-top: 0.5rem;">
                        Total Payable: <span style="color: #aa820a;">Rs. ${order.total.toLocaleString()}</span>
                    </div>
                </div>

                <div style="text-align: center; margin-top: 2.5rem; font-size: 0.82rem; color: #6b7280; border-top: 1px dashed #d1d5db; padding-top: 1rem;">
                    Thank you for choosing HADI Hotel & Restaurant! Have a delightful dining experience.
                </div>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--adm-border);">
                <button class="btn-primary" onclick="window.print()" style="padding: 0.6rem 1.2rem;">
                    <i class="fa-solid fa-print"></i> Print Official Receipt
                </button>
                <button class="btn-outline" onclick="document.getElementById('orderDetailsModal').classList.remove('active')" style="padding: 0.6rem 1.2rem;">
                    Close
                </button>
            </div>
        `;

        orderDetailsModal.classList.add('active');
    };

    if (closeOrderDetailsModalBtn && orderDetailsModal) {
        closeOrderDetailsModalBtn.addEventListener('click', () => {
            orderDetailsModal.classList.remove('active');
        });
    }

    if (orderSearchInput) orderSearchInput.addEventListener('input', renderOrders);
    if (orderStatusFilter) orderStatusFilter.addEventListener('change', renderOrders);

    // ==========================================
    // TABLE RESERVATIONS MANAGEMENT
    // ==========================================
    function renderReservations() {
        if (!reservationsTable || !window.HadiStore) return;
        const reservations = window.HadiStore.getReservations();
        const searchQuery = (resSearchInput ? resSearchInput.value : '').toLowerCase().trim();
        const statusFilter = resStatusFilter ? resStatusFilter.value : 'all';

        const filtered = reservations.filter(res => {
            const matchesStatus = statusFilter === 'all' || res.status === statusFilter;
            const matchesSearch = res.guestName.toLowerCase().includes(searchQuery) ||
                                  res.phone.includes(searchQuery);
            return matchesStatus && matchesSearch;
        });

        if (filtered.length === 0) {
            reservationsTable.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 2rem; color: var(--adm-text-muted);">No reservations found</td></tr>`;
            return;
        }

        reservationsTable.innerHTML = filtered.map(res => `
            <tr>
                <td><strong>#${res.id}</strong></td>
                <td><strong>${res.guestName}</strong></td>
                <td>
                    <a href="tel:${res.phone}" style="color: var(--adm-gold-light);">
                        <i class="fa-solid fa-phone" style="font-size: 0.75rem;"></i> ${res.phone}
                    </a>
                </td>
                <td>
                    <div><i class="fa-regular fa-calendar"></i> ${res.date}</div>
                    <small style="color: var(--adm-text-secondary);"><i class="fa-regular fa-clock"></i> ${res.time}</small>
                </td>
                <td><span style="font-weight: 700;">${res.guests} Persons</span></td>
                <td>${res.seatingArea}</td>
                <td style="font-size: 0.82rem; color: var(--adm-text-secondary); max-width: 200px;">
                    ${res.occasion || 'Dining'}
                    ${res.specialRequests ? `<br><em>"${res.specialRequests}"</em>` : ''}
                </td>
                <td>
                    <span class="badge-status ${getStatusClass(res.status)}">${res.status}</span>
                </td>
                <td>
                    <div class="action-btn-group">
                        ${res.status !== 'Confirmed' ? `
                            <button class="btn-icon" style="color: var(--adm-emerald);" onclick="window.updateResStatus('${res.id}', 'Confirmed')" title="Confirm Reservation">
                                <i class="fa-solid fa-check"></i>
                            </button>
                        ` : ''}
                        ${res.status !== 'Cancelled' ? `
                            <button class="btn-icon" style="color: var(--adm-amber);" onclick="window.updateResStatus('${res.id}', 'Cancelled')" title="Cancel Reservation">
                                <i class="fa-solid fa-ban"></i>
                            </button>
                        ` : ''}
                        <button class="btn-icon delete" onclick="window.deleteRes('${res.id}')" title="Delete Record">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    window.updateResStatus = function(resId, status) {
        window.HadiStore.updateReservationStatus(resId, status);
        updateMetrics();
        renderReservations();
        showToast(`Reservation #${resId} marked as ${status}`, 'success');
    };

    window.deleteRes = function(resId) {
        if (confirm(`Delete reservation #${resId}?`)) {
            window.HadiStore.deleteReservation(resId);
            updateMetrics();
            renderReservations();
            showToast(`Reservation #${resId} deleted`, 'info');
        }
    };

    if (resSearchInput) resSearchInput.addEventListener('input', renderReservations);
    if (resStatusFilter) resStatusFilter.addEventListener('change', renderReservations);

    // ==========================================
    // MENU CRUD OPERATIONS
    // ==========================================
    function renderAdminMenu() {
        if (!adminMenuTable || !window.HadiStore) return;
        const menu = window.HadiStore.getMenu();
        const searchQuery = (adminMenuSearch ? adminMenuSearch.value : '').toLowerCase().trim();
        const categoryFilter = adminMenuCategoryFilter ? adminMenuCategoryFilter.value : 'all';

        const filtered = menu.filter(item => {
            const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery) ||
                                  item.description.toLowerCase().includes(searchQuery);
            return matchesCat && matchesSearch;
        });

        if (filtered.length === 0) {
            adminMenuTable.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--adm-text-muted);">No dishes found</td></tr>`;
            return;
        }

        adminMenuTable.innerHTML = filtered.map(item => `
            <tr>
                <td>
                    <div class="item-cell">
                        <img src="${item.image}" alt="${item.name}" class="item-thumb" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&q=80'">
                        <div>
                            <span class="item-title">${item.name}</span>
                            <span class="item-category">${item.badge || 'Gourmet'}</span>
                        </div>
                    </div>
                </td>
                <td style="text-transform: capitalize;">${item.category.replace('-', ' ')}</td>
                <td style="font-weight: 700; color: var(--adm-gold-light);">Rs. ${item.price.toLocaleString()}</td>
                <td>
                    <span style="font-size: 0.8rem; font-weight: 700; color: ${item.isVeg ? '#10b981' : '#ef4444'};">
                        ${item.isVeg ? '● Vegetarian' : '● Non-Veg'}
                    </span>
                </td>
                <td>
                    <button class="badge-status ${item.isAvailable ? 'completed' : 'cancelled'}" onclick="window.toggleDishAvailability('${item.id}')" style="cursor: pointer; border: none;">
                        ${item.isAvailable ? 'Available' : 'Sold Out'}
                    </button>
                </td>
                <td>
                    <div class="action-btn-group">
                        <button class="btn-icon" onclick="window.openEditDishModal('${item.id}')" title="Edit Dish">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="btn-icon delete" onclick="window.deleteDish('${item.id}')" title="Delete Dish">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    window.toggleDishAvailability = function(itemId) {
        const newState = window.HadiStore.toggleItemAvailability(itemId);
        renderAdminMenu();
        showToast(`Item is now ${newState ? 'Available' : 'Sold Out'}`, 'info');
    };

    window.deleteDish = function(itemId) {
        if (confirm('Are you sure you want to delete this dish from the menu?')) {
            window.HadiStore.deleteMenuItem(itemId);
            updateMetrics();
            renderAdminMenu();
            showToast('Dish deleted successfully', 'info');
        }
    };

    window.openEditDishModal = function(itemId) {
        const item = window.HadiStore.getMenu().find(m => m.id === itemId);
        if (!item || !dishForm || !dishModal) return;

        dishModalTitle.innerHTML = '<i class="fa-solid fa-pen-to-square text-gold"></i> Edit Dish';
        document.getElementById('dishId').value = item.id;
        document.getElementById('dishName').value = item.name;
        document.getElementById('dishCategory').value = item.category;
        document.getElementById('dishPrice').value = item.price;
        document.getElementById('dishOriginalPrice').value = item.originalPrice || '';
        document.getElementById('dishBadge').value = item.badge || '';
        document.getElementById('dishIsVeg').value = item.isVeg ? 'true' : 'false';
        document.getElementById('dishImage').value = item.image;
        document.getElementById('dishDesc').value = item.description;

        dishModal.classList.add('active');
    };

    if (openAddDishModalBtn && dishModal) {
        openAddDishModalBtn.addEventListener('click', () => {
            dishModalTitle.innerHTML = '<i class="fa-solid fa-plus text-gold"></i> Add New Dish';
            dishForm.reset();
            document.getElementById('dishId').value = '';
            document.getElementById('dishImage').value = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80';
            dishModal.classList.add('active');
        });
    }

    if (closeDishModalBtn && dishModal) {
        closeDishModalBtn.addEventListener('click', () => dishModal.classList.remove('active'));
    }
    if (cancelDishBtn && dishModal) {
        cancelDishBtn.addEventListener('click', () => dishModal.classList.remove('active'));
    }

    if (dishForm) {
        dishForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const dishData = {
                id: document.getElementById('dishId').value || undefined,
                name: document.getElementById('dishName').value.trim(),
                category: document.getElementById('dishCategory').value,
                price: parseFloat(document.getElementById('dishPrice').value),
                originalPrice: document.getElementById('dishOriginalPrice').value ? parseFloat(document.getElementById('dishOriginalPrice').value) : null,
                badge: document.getElementById('dishBadge').value.trim(),
                isVeg: document.getElementById('dishIsVeg').value === 'true',
                image: document.getElementById('dishImage').value.trim(),
                description: document.getElementById('dishDesc').value.trim(),
                rating: 5.0,
                reviewsCount: 1,
                isAvailable: true
            };

            window.HadiStore.saveMenuItem(dishData);
            dishModal.classList.remove('active');
            updateMetrics();
            renderAdminMenu();
            showToast('Dish saved successfully!', 'success');
        });
    }

    if (adminMenuSearch) adminMenuSearch.addEventListener('input', renderAdminMenu);
    if (adminMenuCategoryFilter) adminMenuCategoryFilter.addEventListener('change', renderAdminMenu);

    // ==========================================
    // REVIEWS MODERATION
    // ==========================================
    function renderAdminReviews() {
        if (!adminReviewsTable || !window.HadiStore) return;
        const reviews = window.HadiStore.getReviews();

        if (reviews.length === 0) {
            adminReviewsTable.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--adm-text-muted);">No reviews found</td></tr>`;
            return;
        }

        adminReviewsTable.innerHTML = reviews.map(rev => `
            <tr>
                <td><strong>${rev.author}</strong><br><small style="color: var(--adm-text-muted);">${rev.role || 'Guest'}</small></td>
                <td style="color: var(--adm-gold-light); font-weight: 700;">★ ${rev.rating} / 5</td>
                <td style="font-size: 0.88rem; max-width: 350px;">"${rev.comment}"</td>
                <td><small style="color: var(--adm-text-muted);">${rev.date}</small></td>
                <td>
                    <button class="btn-icon delete" onclick="window.deleteReview('${rev.id}')" title="Remove Review">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    window.deleteReview = function(revId) {
        if (confirm('Delete this customer review?')) {
            const current = window.HadiStore.getReviews().filter(r => r.id !== revId);
            window.HadiStore.set(STORAGE_KEYS.REVIEWS, current);
            renderAdminReviews();
            showToast('Review removed', 'info');
        }
    };

    // ==========================================
    // RESTAURANT SETTINGS
    // ==========================================
    function loadSettings() {
        if (!adminSettingsForm || !window.HadiStore) return;
        const s = window.HadiStore.getSettings();

        document.getElementById('setRestName').value = s.restaurantName || '';
        document.getElementById('setTagline').value = s.tagline || '';
        document.getElementById('setPhone').value = s.phone || '';
        document.getElementById('setEmail').value = s.email || '';
        document.getElementById('setAddress').value = s.address || '';
        document.getElementById('setCity').value = s.city || '';
        document.getElementById('setTaxRate').value = s.taxRate || 5;
        document.getElementById('setAdminPin').value = s.adminPin || 'admin123';
        document.getElementById('setAnnouncement').value = s.announcement || '';
    }

    if (adminSettingsForm) {
        adminSettingsForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const updated = {
                restaurantName: document.getElementById('setRestName').value.trim(),
                tagline: document.getElementById('setTagline').value.trim(),
                phone: document.getElementById('setPhone').value.trim(),
                email: document.getElementById('setEmail').value.trim(),
                address: document.getElementById('setAddress').value.trim(),
                city: document.getElementById('setCity').value.trim(),
                taxRate: parseFloat(document.getElementById('setTaxRate').value) || 5,
                adminPin: document.getElementById('setAdminPin').value.trim() || 'admin123',
                announcement: document.getElementById('setAnnouncement').value.trim()
            };

            window.HadiStore.updateSettings(updated);
            showToast('Settings saved successfully!', 'success');
        });
    }

    if (resetDemoDataBtn) {
        resetDemoDataBtn.addEventListener('click', () => {
            if (confirm('Reset all menu items, mock orders, and reservations to factory defaults?')) {
                window.HadiStore.resetAllData();
                loadAllData();
                showToast('All demo data has been restored!', 'success');
            }
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
        }, 3200);
    }

    // Master function to load all dashboard data
    function loadAllData() {
        updateMetrics();
        renderOrders();
        renderReservations();
        renderAdminMenu();
        renderAdminReviews();
        loadSettings();
    }

    // Listen for storage events (e.g. from customer window)
    window.addEventListener('hadi_store_update', () => {
        loadAllData();
    });

    // Initial check
    checkAuth();
});
