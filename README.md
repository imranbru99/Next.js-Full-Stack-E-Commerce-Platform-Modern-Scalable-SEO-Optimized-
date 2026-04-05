# Next.js Full-Stack E-Commerce Platform
### Modern • Scalable • SEO-Optimized • POS Integrated

A premium, production-ready e-commerce solution built with the latest **Next.js 16** (App Router), **Prisma**, and **MySQL**. This platform features a high-performance storefront, a comprehensive admin dashboard, and a professional-grade Point of Sale (POS) system for in-store sales management.

---

## 🚀 Key Features

### 🛒 High-Performance Storefront
* **Dynamic Product Routing:** SEO-optimized pages with dynamic metadata for better search engine ranking.
* **Advanced Variant Selection:** Intuitive UI for selecting product colors and sizes with real-time stock feedback.
* **Persistent Shopping Cart:** Efficient cart management that stays synced across sessions.
* **Seamless Guest Checkout:** Optimized flow for users to complete orders without mandatory registration.

### 💼 Powerful Admin Dashboard
* **Inventory Control:** Complete management for categories, subcategories, and complex product structures.
* **Dual-Level Stock Sync:** Automatic inventory deduction at both the **Product** (master total) and **Variant** (specific size/color) levels to prevent overselling.
* **Order Management:** Real-time tracking of order statuses from `PENDING` to `PROCESSING` and `DELIVERED`.
* **Dynamic Store Settings:** Manage branding, currency symbols, and global SEO tags directly from the UI.

### 🖥️ Professional POS System (Terminal)
* **Lightning-Fast Search:** Quick product lookup via name, slug, or barcode scanning support.
* **In-Store Checkout:** Integrated guest checkout flow for physical store transactions.
* **Thermal Invoice Printing:** Professional receipt generation optimized for 80mm thermal printers with custom CSS.
* **Atomic Transactions:** Powered by Prisma `$transaction` to ensure data integrity during high-speed sales.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router & Proxy/Middleware)
* **Language:** TypeScript
* **Database:** MySQL (Relational)
* **ORM:** [Prisma](https://www.prisma.io/)
* **Styling:** Tailwind CSS (Mobile-responsive & Modern)
* **Icons:** Lucide React
* **Deployment:** Vercel Optimized

---

## 📦 Getting Started

### Prerequisites
* Node.js 18+ 
* MySQL Database (Laragon, XAMPP, or Cloud)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/imranbru99/Next.js-Full-Stack-E-Commerce-Platform-Modern-Scalable-SEO-Optimized-.git](https://github.com/imranbru99/Next.js-Full-Stack-E-Commerce-Platform-Modern-Scalable-SEO-Optimized-.git)
    cd Next.js-Full-Stack-E-Commerce-Platform-Modern-Scalable-SEO-Optimized-
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and add your credentials:
    ```env
    DATABASE_URL="mysql://username:password@localhost:3306/your_db_name"
    NEXTAUTH_SECRET="your_secret_key"
    NEXTAUTH_URL="http://localhost:3000"
    ```

4.  **Sync Database Schema:**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

---

## 📁 Database Architecture

The core logic handles complex relational data:
* **Product:** Master record containing global stock, SEO tags, and base pricing.
* **Variant:** Specific SKU records for Color/Size combinations with independent inventory.
* **Order/OrderItem:** Relational tracking of sales linked directly to specific variants.
* **StoreSettings:** Global configuration model for branding and store-wide rules.

---

## 🚢 Deployment (Vercel)

1.  Connect your GitHub repository to **Vercel**.
2.  Add the `DATABASE_URL` to Environment Variables.
3.  The `postinstall` script in `package.json` ensures `prisma generate` runs on every deploy.
4.  Standard Build Command: `npm run build`.

---

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developed By

**Imran Ahmed** *Senior Full-Stack Developer | 9+ Years Experience* Specializing in AI-Driven Solutions, Scalable E-Commerce Architectures, and Modern Web Systems.

---

### 🛠️ NEED A FIX? CONTACT ME:
* 🌐 **Portfolio:** [imrandev.space](https://imrandev.space)
* 📧 **Email:** [me@imrandev.space](mailto:me@imrandev.space)
* 📞 **WhatsApp:** [+8801576918420](https://wa.me/8801576918420)

**Note:** This platform was specifically designed to bridge the gap between online digital storefronts and physical retail management through a unified real-time database.
