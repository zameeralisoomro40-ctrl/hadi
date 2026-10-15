# HADI Hotel & Restaurant - Modern Luxury Website & Admin Portal 👑

A five-star, fully responsive, modern web application for **HADI Hotel & Restaurant**, built with pure **HTML5, CSS3, and Modern JavaScript (ES6+)**.

---

## 🌟 Key Features

### 🍽️ 1. Customer-Facing Website (`index.html`)
- **Royal Modern Aesthetic**: Deep obsidian background with imperial gold gradients, frosted glassmorphism cards, and smooth micro-animations.
- **Top Announcement Bar**: Displays daily operating hours, emergency customer helpline, and promotional discount coupon (`HADI10`).
- **Sticky Glassmorphism Header**: Brand crown logo, smooth scroll navigation, interactive cart button with real-time badge count, and mobile hamburger menu.
- **Hero Showcase**: Immersive headline, floating satisfaction metrics (`4.9 ★ Rating`, `15+ Years Excellence`), and quick action buttons.
- **Value Perks Strip**: 100% Halal certified ingredients, royal master chefs, VIP rooftop dining, and 24/7 express room delivery.
- **Our Story / Heritage**: Visual introduction to HADI Hotel & Restaurant's Awadhi and Mughlai culinary lineage.
- **Live Interactive Menu**:
  - Filter by categories: *All, Biryani & Rice, Charcoal BBQ, Royal Gravies, Starters, Continental, Desserts, Beverages*.
  - Instant live search bar.
  - Dietary markers: Vegetarian (green dot) & Non-Vegetarian (red dot).
  - High-resolution dish photos, calorie counts, preparation time, star ratings, and prices with strikethrough original prices.
  - One-click **"Add to Cart"** button.
- **Interactive Slide-In Cart & Checkout**:
  - Slide-in side drawer with live items list, quantity counters (+ / -), and delete button.
  - Automatic calculation of subtotal, 5% GST tax, and net total.
  - Promo coupon support: Enter **`HADI10`** to unlock **10% OFF**.
  - Service selection: **Dine-in, Home Delivery, Takeaway, Room Service**.
  - Payment method choices: Cash on Delivery / Counter Pay, Credit/Debit Card, Online Transfer (JazzCash/EasyPaisa/Bank).
  - Special cooking instructions field.
  - Confirmation modal displaying generated tracking ID (e.g., `#ORD-9421`).
- **Table Reservation System**:
  - Booking form with date picker (validates against past dates), time slot, guest count (2 to 12+), seating area (*Royal Dining Hall, Rooftop VIP Sky Lounge, Private VIP Booth, Garden Terrace*), and celebration occasion.
  - Real-time submission saving into the system with instant booking reference ID.
- **Palatial Hotel Rooms & Suites**:
  - Presidential Royal Suite, Executive Deluxe Room, and Royal Family Suite.
  - Includes room dimensions, guest capacity, amenities pills, and direct WhatsApp inquiry link.
- **Ambience & Photo Gallery**:
  - Interactive photo grid showcasing dining hall, sizzlers, rooftop night view, and suite interiors.
- **Guest Testimonials & Reviews**:
  - Verified diner ratings and quotes.
  - Interactive **"Share Your Review"** modal to submit fresh reviews directly on the site.
- **Location & Contact**:
  - Embedded Google Map, daily hours (11:00 AM - 02:00 AM), direct phone calling, and floating WhatsApp quick chat button.

---

### 🛡️ 2. Admin Management Dashboard (`admin.html`)
- **Security Access Gateway**:
  - Protected with Master PIN / Password.
  - Default PIN: **`admin123`**
  - Includes a convenient **1-Click Quick Demo Login** button for instant testing.
- **Dashboard Overview**:
  - Key performance metrics: Total Revenue, Active Orders, Table Bookings, and Live Menu Items.
  - Recent incoming orders table with live status changer.
- **Live Orders Management**:
  - Filter orders by status: *All, Pending, Preparing, Out for Delivery, Completed, Cancelled*.
  - Search by Order ID, customer name, or phone number.
  - Change order status in real-time.
  - View full itemized bill & customer details.
  - **Print Official Customer Receipt / Invoice**: One-click printable thermal/standard receipt formatted with HADI Hotel header, tax calculation, and order timestamp.
  - Delete order records.
- **Table Reservations Manager**:
  - View all table bookings with guest name, phone, date, time, guest count, and seating area.
  - One-click **"Confirm"** and **"Cancel"** actions.
  - Direct telephone call link for each guest.
- **Menu Catalogue Manager (CRUD)**:
  - **Add New Dish**: Modal to input dish title, category, price, discount price, dietary type (Veg/Non-Veg), promotional badge, image URL, and description.
  - **Edit Dish**: Update existing dish details.
  - **Toggle Availability**: Instantly mark dishes as **"Available"** or **"Sold Out"** on the customer website.
  - **Delete Dish**: Remove items with confirmation prompt.
- **Guest Reviews Moderation**:
  - Review submitted testimonials and remove inappropriate feedback.
- **Restaurant & System Settings**:
  - Update Restaurant Name, Tagline, Hotline Phone, Secondary Reception Phone, Email, Physical Address, and City.
  - Customize GST Tax percentage (default: 5%).
  - Change the Admin Security PIN.
  - Update the Top Banner promotional announcement text.
  - **"Reset All Data to Demo Defaults"** button to restore seed data anytime.

---

## 📂 Project Structure

```
c:\Users\OM C\Desktop\zameer\
├── index.html          # Main Customer Website
├── admin.html          # Admin Management Portal
├── css/
│   ├── style.css       # Main Customer Luxury Styling & Responsive Design
│   └── admin.css       # Admin Dashboard Layout, Tables, Badges & Print Invoice
├── js/
│   ├── data.js         # Central State Store & LocalStorage Persistence
│   ├── main.js         # Customer Website Dynamic Logic, Cart & Modals
│   └── admin.js        # Admin Panel Interactivity, Orders & Menu Management
└── README.md           # Documentation & Guide
```

---

## 🚀 How to Run the Website

No complex build tools or Node.js servers are required!

1. Open File Explorer to:
   `c:\Users\OM C\Desktop\zameer`
2. **Double-click `index.html`** to open the customer-facing restaurant website in any web browser (Chrome, Edge, Firefox, Safari).
3. **Double-click `admin.html`** (or click the "Admin Panel" link in the top bar of the website) to open the Admin Portal.
4. Log in with PIN: **`admin123`** (or click the **"1-Click Quick Demo Login"** button).

---

## 💡 Real-Time Synchronization
The website and admin panel share `localStorage`. Any changes made in the Admin Panel (adding a dish, updating prices, toggling item availability, or changing restaurant contact info) instantly appear on the customer website! Similarly, orders placed or tables booked on `index.html` immediately show up in `admin.html`.
