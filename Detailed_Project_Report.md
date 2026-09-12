# Detailed Project Report: RentEase 
**Furniture & Appliance Rental Platform**

## 1. Introduction & Problem Statement
Students and working professionals frequently relocate for education or jobs and prefer renting furniture and appliances instead of purchasing them. 
**Current challenges faced by renters include:**
- High upfront cost of buying furniture/appliances.
- Difficulty in transporting items during relocation.
- Lack of flexible rental plans and local options.
- Poor maintenance and support services.

**RentEase** solves these problems by providing a flexible, affordable, and highly convenient peer-to-peer (P2P) monthly rental solution.

---

## 2. Primary Objectives
1. Provide affordable monthly rental options with flexible tenure plans (e.g., 3, 6, 12 months).
2. Simplify the furniture & appliance acquisition process through a seamless eCommerce experience.
3. Establish a robust Multi-Vendor architecture where users can list their own unused items to earn passive income.
4. Guarantee maintenance and support for all rented items.

---

## 3. Technology Stack
The platform is built using the modern **MERN** stack for high performance and scalability:
- **Frontend:** React.js (Vite), React Router DOM, Axios, Context API (Theme Management), Glassmorphism UI Design.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (Mongoose ODM).
- **Authentication:** JSON Web Tokens (JWT) & bcrypt password hashing.

---

## 4. System Architecture & Role Management
RentEase enforces a strict, secure Role-Based Access Control (RBAC) system supporting three distinct user types:

### A. Renter (Standard User)
- **Registration & Login**: Secure JWT-based authentication.
- **Browse & Cart**: Can browse categories (Furniture, Appliances), view dynamic stock, and add items to their cart.
- **Checkout**: Can select delivery and pickup dates, provide a delivery address, and proceed through a simulated secure payment gateway.
- **Rental Dashboard**: Can track active rentals, request maintenance, and view their rental history.

### B. Vendor
- **Seamless Onboarding**: Users can click "Become a Vendor" to instantly upgrade their account.
- **Inventory Management**: Vendors can list new products, set monthly rent prices, determine security deposits, and upload images.
- **Vendor Orders Dashboard**: Vendors can track all active rentals that contain their specific products.
- **Maintenance Handling**: If a renter requests maintenance on a vendor's item, the vendor receives the request directly and can mark it as "Resolved" once fixed.

### C. Administrator
- **Global Dashboard**: Access to system-wide analytics (Total Users, Revenue, Active Rentals).
- **Moderation**: Can monitor all orders, handle disputes, and delete any product or rental in the system to ensure platform integrity.

---

## 5. Key Technical Implementations

### Dynamic Cart & Checkout System
The cart automatically calculates the `totalMonthlyRent` (price × quantity × tenure) and `totalSecurityDeposit`. The checkout process captures exact delivery and pickup dates to schedule logistics perfectly.

### Peer-to-Peer Ownership Model
Products in the MongoDB database contain an `owner` reference. When an order is placed, the backend intelligently routes maintenance requests and order details so vendors only see data pertaining to their specific inventory.

### Modern UI/UX Design
The frontend utilizes a custom CSS variables system to implement a highly polished **Glassmorphism** aesthetic. It fully supports real-time Light/Dark mode toggling, smooth hover animations, and toast notifications for a premium user experience.

---

## 6. Future Enhancements
While the core PRD is fully implemented, future iterations of RentEase could include:
1. **Vendor Wallet & Payouts:** Track vendor earnings and automate monthly payouts via Stripe Connect.
2. **Real-time Chat:** Implement Socket.io so renters can chat directly with vendors before placing an order.
3. **Advanced Filtering:** Add price sliders, location-based search, and condition ratings for products.

---

## 7. Conclusion
RentEase successfully bridges the gap between individuals who have unused furniture and professionals who need temporary, affordable living setups. By implementing a robust Multi-Vendor architecture, RentEase scales naturally as a community-driven marketplace while maintaining high standards of quality and maintenance support.
