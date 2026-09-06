# 🎨 Vinyas Studio

Vinyas is a premium, immersive Art & Craft Marketplace built for digital artists. It features a unique 3D corridor gallery, editorial design aesthetic, and a full-featured e-commerce system.

---

## ✨ Features

- **3D Portfolio**: Immersive 1st-person corridor gallery.
- **E-Commerce**: Full shop with product categories, cart, and Razorpay integration.
- **Admin Dashboard**: Comprehensive management of products, orders, and journal posts.
- **Editorial Design**: Neo-brutalist aesthetic with custom typography and animations.
- **Authentication**: Secure Google OAuth and Credentials-based login.

---

## 🚀 Quick Start

### 1. Setup

```bash
npm install
cp .env.example .env
# Fill in your DATABASE_URL and secrets in .env
```

### 2. Database

```bash
npx prisma generate
npx prisma db push
npm run seed
```

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the studio.

---

## 🔐 Admin Access

To access the admin panel at `/admin`, you **must** login first at `/login`.

**Default Admin Credentials:**

- **Email**: `admin@Vinyas.com`
- **Password**: `admin123`

For more details, see the [Admin Guide](./docs/ADMIN_GUIDE.md).

---

## 📚 Documentation

Detailed guides are located in the `docs/` folder (local only):

- [**Admin Guide**](./docs/ADMIN_GUIDE.md): Login flow, troubleshooting, and management.
- [**Development Guide**](./docs/DEVELOPMENT.md): Tech stack, project structure, and deployment.
- [**Design Guide**](./docs/DESIGN_GUIDE.md): Theme system, design tokens, and components.

---

## 🛠️ Scripts

- `npm run dev`: Start development server.
- `npm run build`: Build for production.
- `npm run start`: Start production server.
- `npm run seed`: Seed database with test data.

---

**Happy coding! 🚀**
