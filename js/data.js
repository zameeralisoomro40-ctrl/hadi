/**
 * HADI Hotel & Restaurant - Central Data Store & State Management
 * Persistent storage using localStorage with rich initial seed data.
 */

const STORAGE_KEYS = {
    MENU: 'hadi_menu_items_v1',
    ORDERS: 'hadi_orders_v1',
    RESERVATIONS: 'hadi_reservations_v1',
    ROOMS: 'hadi_rooms_v1',
    REVIEWS: 'hadi_reviews_v1',
    SETTINGS: 'hadi_settings_v1',
    AUTH: 'hadi_admin_session_v1'
};

// Initial Menu Seed Data with High-Quality Food Imagery
const DEFAULT_MENU = [
    {
        id: 'item-1',
        name: 'Royal Mutton Dum Biryani',
        category: 'biryani',
        price: 950,
        originalPrice: 1150,
        rating: 4.9,
        reviewsCount: 142,
        badge: "Chef's Special",
        isAvailable: true,
        description: 'Slow-cooked aromatic long-grain basmati rice layered with tender marinated mutton cuts, saffron, and royal Awadhi spices. Served with mint raita and mirchi ka salan.',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
        calories: '680 kcal',
        prepTime: '25-30 min',
        isVeg: false
    },
    {
        id: 'item-2',
        name: 'HADI Signature Murgh Makhani (Butter Chicken)',
        category: 'main-course',
        price: 850,
        originalPrice: 980,
        rating: 4.95,
        reviewsCount: 198,
        badge: 'Bestseller',
        isAvailable: true,
        description: 'Tender tandoori chicken tikka simmered in a velvety, buttery tomato gravy infused with dried fenugreek leaves and fresh dairy cream.',
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
        calories: '540 kcal',
        prepTime: '20 min',
        isVeg: false
    },
    {
        id: 'item-3',
        name: 'Sizzling Charcoal BBQ Platter',
        category: 'bbq',
        price: 1850,
        originalPrice: 2200,
        rating: 5.0,
        reviewsCount: 220,
        badge: 'Family Special',
        isAvailable: true,
        description: 'A royal grand platter featuring Seekh Kababs, Malai Boti, Reshmi Kabab, Fish Tikka, and Mutton Chops on a bed of sizzling onions with garlic naan and signature dips.',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
        calories: '1100 kcal',
        prepTime: '30 min',
        isVeg: false
    },
    {
        id: 'item-4',
        name: 'Paneer Tikka Shahi Shashlik',
        category: 'starters',
        price: 620,
        originalPrice: 720,
        rating: 4.8,
        reviewsCount: 88,
        badge: 'Vegetarian',
        isAvailable: true,
        description: 'Fresh farm cottage cheese cubes skewered with crisp bell peppers, onions, and tomatoes, marinated in royal ajwain spices and smoked in a clay tandoor.',
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
        calories: '420 kcal',
        prepTime: '18 min',
        isVeg: true
    },
    {
        id: 'item-5',
        name: 'Crispy Golden Prawns Tempura',
        category: 'starters',
        price: 1100,
        originalPrice: 1250,
        rating: 4.85,
        reviewsCount: 76,
        badge: 'Seafood',
        isAvailable: true,
        description: 'Jumbo Arabian Sea prawns dipped in a light seasoned batter, fried to golden crispy perfection. Served with sweet chili and homemade wasabi mayo.',
        image: 'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=800&q=80',
        calories: '390 kcal',
        prepTime: '15 min',
        isVeg: false
    },
    {
        id: 'item-6',
        name: 'Traditional Mutton Rogan Josh',
        category: 'main-course',
        price: 1050,
        originalPrice: 1200,
        rating: 4.9,
        reviewsCount: 115,
        badge: 'Royal Classic',
        isAvailable: true,
        description: 'Authentic Kashmiri delicacy cooked with tender mutton cuts in an exquisite gravy of Kashmiri chilies, aromatic fennel seeds, and whole spices.',
        image: 'https://images.unsplash.com/photo-1545247181-516773ca838b?auto=format&fit=crop&w=800&q=80',
        calories: '590 kcal',
        prepTime: '25 min',
        isVeg: false
    },
    {
        id: 'item-7',
        name: 'Handi Chicken Karahi Lazeez',
        category: 'main-course',
        price: 890,
        originalPrice: 990,
        rating: 4.88,
        reviewsCount: 164,
        badge: 'Popular',
        isAvailable: true,
        description: 'Fresh chicken cooked in a traditional clay handi with crushed tomatoes, julienned ginger, green chilies, and freshly roasted cumin and coriander seeds.',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
        calories: '510 kcal',
        prepTime: '22 min',
        isVeg: false
    },
    {
        id: 'item-8',
        name: 'Dal Makhani Bukhara',
        category: 'main-course',
        price: 520,
        originalPrice: 590,
        rating: 4.82,
        reviewsCount: 94,
        badge: 'Vegetarian',
        isAvailable: true,
        description: 'Slow-simmered black lentils and kidney beans cooked overnight with butter, rich cream, and mild spices for an unmistakably creamy texture.',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
        calories: '450 kcal',
        prepTime: '15 min',
        isVeg: true
    },
    {
        id: 'item-9',
        name: 'Tandoori Garlic Butter Naan Basket',
        category: 'biryani',
        price: 240,
        originalPrice: 280,
        rating: 4.92,
        reviewsCount: 310,
        badge: 'Sides',
        isAvailable: true,
        description: 'Assortment of artisan clay-oven baked breads including Garlic Butter Naan, Roghani Naan, and Cheese Stuffed Kulcha.',
        image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80',
        calories: '320 kcal',
        prepTime: '10 min',
        isVeg: true
    },
    {
        id: 'item-10',
        name: 'HADI Royal Gourmet Burger',
        category: 'continental',
        price: 680,
        originalPrice: 780,
        rating: 4.75,
        reviewsCount: 132,
        badge: 'Chef Special',
        isAvailable: true,
        description: 'Juicy 100% prime beef patty, caramelized onions, melted aged cheddar, smoked barbecue glaze, and crisp lettuce on a toasted brioche bun with French fries.',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
        calories: '750 kcal',
        prepTime: '20 min',
        isVeg: false
    },
    {
        id: 'item-11',
        name: 'Shahi Zafrani Kheer & Gulab Jamun',
        category: 'desserts',
        price: 380,
        originalPrice: 450,
        rating: 4.95,
        reviewsCount: 205,
        badge: 'Sweet Treat',
        isAvailable: true,
        description: 'Creamy saffron rice pudding topped with pistachios, silver leaf, and warm soft melt-in-mouth milk dumplings soaked in rose cardamom syrup.',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
        calories: '380 kcal',
        prepTime: '10 min',
        isVeg: true
    },
    {
        id: 'item-12',
        name: 'Signature Mint Margarita & Royal Mojito',
        category: 'beverages',
        price: 280,
        originalPrice: 350,
        rating: 4.9,
        reviewsCount: 180,
        badge: 'Refreshing',
        isAvailable: true,
        description: 'Fresh crushed garden mint, zesty Persian limes, black salt, and sparkling soda blended with crushed ice for the ultimate refreshment.',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
        calories: '120 kcal',
        prepTime: '5 min',
        isVeg: true
    }
];

// Luxury Hotel Rooms Seed Data
const DEFAULT_ROOMS = [
    {
        id: 'room-1',
        name: 'Presidential Royal Suite',
        type: 'Suite',
        pricePerNight: 18500,
        rating: 5.0,
        capacity: '2-4 Guests',
        size: '850 sq ft',
        description: 'Unmatched luxury featuring panoramic city views, master king bedroom, living lounge, Italian marble bathroom with Jacuzzi, and 24/7 dedicated butler service.',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        amenities: ['King Bed', 'Jacuzzi', 'City View', 'Free Wi-Fi', 'Complimentary Breakfast', '24/7 Butler Service']
    },
    {
        id: 'room-2',
        name: 'Executive Deluxe Room',
        type: 'Deluxe',
        pricePerNight: 9500,
        rating: 4.85,
        capacity: '2 Guests',
        size: '480 sq ft',
        description: 'Sophisticated modern comfort with fine wood furnishings, plush queen bedding, high-speed ergonomic workspace, smart TV, and complimentary luxury minibar.',
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
        amenities: ['Queen Bed', 'Workspace', 'Smart TV', 'Free Wi-Fi', 'Complimentary Breakfast', 'Mini Bar']
    },
    {
        id: 'room-3',
        name: 'Royal Family Suite',
        type: 'Family',
        pricePerNight: 13500,
        rating: 4.9,
        capacity: '4-5 Guests',
        size: '720 sq ft',
        description: 'Spacious interconnecting rooms designed for family luxury. Includes two bedrooms, private balcony, dining area, and round-the-clock room dining service.',
        image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
        amenities: ['2 Bedrooms', 'Balcony', 'Dining Table', 'Smart TV', 'Complimentary Breakfast', 'Kids Friendly']
    }
];

// Initial Seed Orders
const DEFAULT_ORDERS = [
    {
        id: 'ORD-9421',
        customerName: 'Zameer Khan',
        customerPhone: '+92 300 1234567',
        customerEmail: 'zameer@example.com',
        orderType: 'Dine-in (Table 4)',
        address: 'Table #4 - Main Hall',
        items: [
            { id: 'item-1', name: 'Royal Mutton Dum Biryani', price: 950, quantity: 2 },
            { id: 'item-2', name: 'HADI Signature Murgh Makhani', price: 850, quantity: 1 },
            { id: 'item-9', name: 'Tandoori Garlic Butter Naan Basket', price: 240, quantity: 3 }
        ],
        subtotal: 3470,
        tax: 173.5,
        discount: 0,
        total: 3643.5,
        status: 'Preparing',
        paymentMethod: 'Credit Card',
        paymentStatus: 'Paid',
        orderDate: new Date(Date.now() - 35 * 60000).toISOString(),
        notes: 'Please make biryani extra spicy, extra lemons on side.'
    },
    {
        id: 'ORD-9420',
        customerName: 'Sara Ahmed',
        customerPhone: '+92 321 9876543',
        customerEmail: 'sara.ahmed@gmail.com',
        orderType: 'Home Delivery',
        address: 'House 42-B, Gulberg Heights, City',
        items: [
            { id: 'item-3', name: 'Sizzling Charcoal BBQ Platter', price: 1850, quantity: 1 },
            { id: 'item-12', name: 'Signature Mint Margarita', price: 280, quantity: 2 }
        ],
        subtotal: 2410,
        tax: 120.5,
        discount: 241, // 10% promo
        total: 2289.5,
        status: 'Out for Delivery',
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'Pending',
        orderDate: new Date(Date.now() - 70 * 60000).toISOString(),
        notes: 'Ring bell on arrival, deliver hot please.'
    },
    {
        id: 'ORD-9419',
        customerName: 'Muhammad Ali',
        customerPhone: '+92 333 4567890',
        customerEmail: 'ali.m@outlook.com',
        orderType: 'Takeaway',
        address: 'Pickup at Counter',
        items: [
            { id: 'item-10', name: 'HADI Royal Gourmet Burger', price: 680, quantity: 2 },
            { id: 'item-11', name: 'Shahi Zafrani Kheer & Gulab Jamun', price: 380, quantity: 2 }
        ],
        subtotal: 2120,
        tax: 106,
        discount: 0,
        total: 2226,
        status: 'Completed',
        paymentMethod: 'Online Payment',
        paymentStatus: 'Paid',
        orderDate: new Date(Date.now() - 180 * 60000).toISOString(),
        notes: 'Extra tissue papers and cutlery.'
    }
];

// Initial Seed Table Reservations
const DEFAULT_RESERVATIONS = [
    {
        id: 'RES-3104',
        guestName: 'Hamza Sheikh',
        phone: '+92 345 1122334',
        email: 'hamza.sheikh@hotmail.com',
        guests: 4,
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
        time: '20:30',
        seatingArea: 'Rooftop VIP Sky Lounge',
        occasion: 'Anniversary Dinner',
        specialRequests: 'Candlelight arrangement and floral table setup please.',
        status: 'Confirmed',
        createdAt: new Date(Date.now() - 120 * 60000).toISOString()
    },
    {
        id: 'RES-3103',
        guestName: 'Dr. Ayesha Malik',
        phone: '+92 312 8899001',
        email: 'ayesha.malik@hospital.org',
        guests: 8,
        date: new Date(Date.now() + 172800000).toISOString().split('T')[0], // day after tomorrow
        time: '19:00',
        seatingArea: 'Royal Dining Hall',
        occasion: 'Family Gathering',
        specialRequests: 'Elderly guests, please reserve quiet corner table.',
        status: 'Pending',
        createdAt: new Date(Date.now() - 240 * 60000).toISOString()
    },
    {
        id: 'RES-3102',
        guestName: 'Bilal Farooq',
        phone: '+92 301 5566778',
        email: 'bilal.f@agency.com',
        guests: 2,
        date: new Date().toISOString().split('T')[0], // today
        time: '21:00',
        seatingArea: 'Private VIP Booth',
        occasion: 'Business Meeting',
        specialRequests: 'Quiet booth with high privacy.',
        status: 'Confirmed',
        createdAt: new Date(Date.now() - 400 * 60000).toISOString()
    }
];

// Initial Reviews
const DEFAULT_REVIEWS = [
    {
        id: 'rev-1',
        author: 'Tariq Mehmood',
        rating: 5,
        date: '2 days ago',
        role: 'Verified Diner',
        comment: 'HADI Hotel & Restaurant provides the most exquisite dining experience in town! The Mutton Dum Biryani and Charcoal BBQ Platter are legendary. Ambience is pure 5-star royalty.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    {
        id: 'rev-2',
        author: 'Farah Qureshi',
        rating: 5,
        date: '1 week ago',
        role: 'Hotel & Dining Guest',
        comment: 'We stayed in the Presidential Suite and booked dinner at their rooftop restaurant. The hospitality was royal, staff was extremely courteous, and the Butter Chicken is to die for!',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    {
        id: 'rev-3',
        author: 'Shahid Nadeem',
        rating: 5,
        date: '2 weeks ago',
        role: 'Food Enthusiast',
        comment: 'Top-tier hygiene, fast service, and generous portions. The admin ordering system and live table reservation made organizing our family anniversary totally seamless.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
    }
];

// Restaurant Settings
const DEFAULT_SETTINGS = {
    restaurantName: 'HADI Hotel & Restaurant',
    tagline: 'A Symphony of Royal Flavors & Exquisite Hospitality',
    phone: '+92 300 7654321',
    secondaryPhone: '+92 42 35789000',
    email: 'info@hadihotel.com',
    address: 'Grand Boulevard, Royal Avenue, Luxury Enclave',
    city: 'Lahore, Pakistan',
    currency: 'Rs.',
    taxRate: 5, // 5% GST
    deliveryFee: 150,
    freeDeliveryThreshold: 2500,
    openingHours: '11:00 AM - 02:00 AM Daily',
    announcement: 'Special Offer: Use code HADI10 for 10% OFF on all online orders above Rs. 1500!',
    adminPin: 'admin123',
    acceptingOrders: true,
    acceptingReservations: true
};

// Data Store Class
class HadiDataStore {
    constructor() {
        this.init();
    }

    init() {
        if (!localStorage.getItem(STORAGE_KEYS.MENU)) {
            this.set(STORAGE_KEYS.MENU, DEFAULT_MENU);
        }
        if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
            this.set(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
        }
        if (!localStorage.getItem(STORAGE_KEYS.RESERVATIONS)) {
            this.set(STORAGE_KEYS.RESERVATIONS, DEFAULT_RESERVATIONS);
        }
        if (!localStorage.getItem(STORAGE_KEYS.ROOMS)) {
            this.set(STORAGE_KEYS.ROOMS, DEFAULT_ROOMS);
        }
        if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
            this.set(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
        }
        if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
            this.set(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
        }
    }

    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error reading from localStorage', e);
            return null;
        }
    }

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            // Trigger custom event so other components or open tabs can react
            window.dispatchEvent(new CustomEvent('hadi_store_update', { detail: { key } }));
            return true;
        } catch (e) {
            console.error('Error writing to localStorage', e);
            return false;
        }
    }

    // Menu Methods
    getMenu() {
        return this.get(STORAGE_KEYS.MENU) || [];
    }

    saveMenuItem(item) {
        const menu = this.getMenu();
        if (item.id) {
            // Edit existing
            const index = menu.findIndex(m => m.id === item.id);
            if (index !== -1) {
                menu[index] = { ...menu[index], ...item };
            } else {
                menu.push(item);
            }
        } else {
            // Add new
            item.id = 'item-' + Date.now();
            menu.unshift(item);
        }
        this.set(STORAGE_KEYS.MENU, menu);
        return item;
    }

    deleteMenuItem(id) {
        const menu = this.getMenu().filter(m => m.id !== id);
        this.set(STORAGE_KEYS.MENU, menu);
        return true;
    }

    toggleItemAvailability(id) {
        const menu = this.getMenu();
        const item = menu.find(m => m.id === id);
        if (item) {
            item.isAvailable = !item.isAvailable;
            this.set(STORAGE_KEYS.MENU, menu);
            return item.isAvailable;
        }
        return false;
    }

    // Orders Methods
    getOrders() {
        return this.get(STORAGE_KEYS.ORDERS) || [];
    }

    createOrder(orderData) {
        const orders = this.getOrders();
        const newOrder = {
            id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
            orderDate: new Date().toISOString(),
            status: 'Pending',
            paymentStatus: orderData.paymentMethod === 'Online Payment' ? 'Paid' : 'Pending',
            ...orderData
        };
        orders.unshift(newOrder);
        this.set(STORAGE_KEYS.ORDERS, orders);
        return newOrder;
    }

    updateOrderStatus(orderId, newStatus) {
        const orders = this.getOrders();
        const order = orders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
            if (newStatus === 'Completed') {
                order.paymentStatus = 'Paid';
            }
            this.set(STORAGE_KEYS.ORDERS, orders);
            return true;
        }
        return false;
    }

    deleteOrder(orderId) {
        const orders = this.getOrders().filter(o => o.id !== orderId);
        this.set(STORAGE_KEYS.ORDERS, orders);
        return true;
    }

    // Reservations Methods
    getReservations() {
        return this.get(STORAGE_KEYS.RESERVATIONS) || [];
    }

    createReservation(resData) {
        const reservations = this.getReservations();
        const newReservation = {
            id: 'RES-' + Math.floor(1000 + Math.random() * 9000),
            status: 'Pending',
            createdAt: new Date().toISOString(),
            ...resData
        };
        reservations.unshift(newReservation);
        this.set(STORAGE_KEYS.RESERVATIONS, reservations);
        return newReservation;
    }

    updateReservationStatus(resId, status) {
        const reservations = this.getReservations();
        const res = reservations.find(r => r.id === resId);
        if (res) {
            res.status = status;
            this.set(STORAGE_KEYS.RESERVATIONS, reservations);
            return true;
        }
        return false;
    }

    deleteReservation(resId) {
        const reservations = this.getReservations().filter(r => r.id !== resId);
        this.set(STORAGE_KEYS.RESERVATIONS, reservations);
        return true;
    }

    // Rooms Methods
    getRooms() {
        return this.get(STORAGE_KEYS.ROOMS) || [];
    }

    // Reviews Methods
    getReviews() {
        return this.get(STORAGE_KEYS.REVIEWS) || [];
    }

    addReview(review) {
        const reviews = this.getReviews();
        review.id = 'rev-' + Date.now();
        review.date = 'Just now';
        reviews.unshift(review);
        this.set(STORAGE_KEYS.REVIEWS, reviews);
        return review;
    }

    // Settings Methods
    getSettings() {
        return this.get(STORAGE_KEYS.SETTINGS) || DEFAULT_SETTINGS;
    }

    updateSettings(newSettings) {
        const current = this.getSettings();
        const updated = { ...current, ...newSettings };
        this.set(STORAGE_KEYS.SETTINGS, updated);
        return updated;
    }

    // Reset to defaults
    resetAllData() {
        this.set(STORAGE_KEYS.MENU, DEFAULT_MENU);
        this.set(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
        this.set(STORAGE_KEYS.RESERVATIONS, DEFAULT_RESERVATIONS);
        this.set(STORAGE_KEYS.ROOMS, DEFAULT_ROOMS);
        this.set(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
        this.set(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
        return true;
    }
}

// Global instance
window.HadiStore = new HadiDataStore();
