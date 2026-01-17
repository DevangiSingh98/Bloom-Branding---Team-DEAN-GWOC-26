# 🌸 Bloom Branding

> **We build brands that bloom.**

Bloom Branding is a premium creative agency platform designed to help modern businesses grow through strategic storytelling, high-impact digital experiences, and bold brand identities.

---

## ✨ Features

- **Dynamic Hero Section**: Interactive magazine animations and smooth parallax scrolling.
- **Project Portfolio**: A curated showcase of "Selected Work" with detailed category filtering.
- **Admin Dashboard**: A robust backend management system to control site content dynamically.
- **Custom Chatbot**: Built-in support for client inquiries and FAQs.
- **Testimonial Showcases**: Interactive "Client Love" marquee for social proof.
- **Responsive Design**: Tailored experiences for all devices, emphasizing premium aesthetics.
- **Integrated Admin Tools**: Direct terminal links to admin endpoints for developers.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Vanilla CSS (Custom Brand Tokens)
- **Animations**: Framer Motion & GSAP
- **Icons**: Lucide React
- **Services**: Firebase (Auth/Hosting)

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT & BcryptJS

---

## 📁 Project Structure

```text
blooms-branding/
├── backend/
│   ├── config/             # Database connection logic
│   ├── controllers/        # Business logic for API endpoints
│   ├── middleware/         # Auth & validation middleware
│   ├── models/             # Mongoose schemas (Hero, Project, Testimonial, etc.)
│   ├── routes/             # API route definitions
│   └── server.js           # Main entry point
├── frontend/
│   ├── public/             # Static assets (logos, images)
│   ├── src/
│   │   ├── components/     # Reusable UI elements (Navbar, Footer, Chatbot)
│   │   ├── context/        # Global state (ContentContext)
│   │   ├── pages/          # Full page views (Home, About, Work, Admin)
│   │   ├── App.jsx         # Component routing
│   │   └── main.jsx        # React DOM mounting
│   └── vite.config.js      # Build configuration & dev tools
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd blooms-branding
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   # Create a .env file with MONGODB_URI and PORT
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   # Create a .env file with VITE_API_URL
   npm run dev
   ```

### 🛠 Developer Experience
When running `npm run dev` in the frontend, the terminal will automatically display both the **Main Site** and **Admin Dashboard** URLs for quick access:

- `➜  Main Site: https://bloom-branding-3bdab.web.app/`
- `➜  Admin: https://bloom-branding-3bdab.web.app/admin`

---

## 📫 Contact
**Bloom Branding**  
[Instagram](https://www.instagram.com/bloom.branding_/?hl=en)
