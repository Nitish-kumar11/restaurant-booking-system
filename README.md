# 🍛 Spice of India — Restaurant Table Booking System

A full-stack **MERN** (MongoDB, Express, React, Node.js) application for booking restaurant tables online, with separate **Customer** and **Admin** portals.

---

## ✨ Features

### Customer Side
- Register / Login (JWT auth)
- Dashboard with booking stats
- 3-step table reservation flow (details → choose table → confirm)
- Live table availability by date & time slot
- View / cancel own bookings
- Edit profile & change password

### Admin Side
- Separate admin login & dashboard
- Stats overview + 7-day bookings chart
- View / confirm / complete / cancel any booking
- Manage tables (add / edit / activate / deactivate)
- Manage customers (view, enable/disable accounts)

---

## 🗂 Project Structure

```
restaurant-booking/
├── backend/                   # Node + Express + MongoDB API
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── seed.js            # Seeds admin/users/tables
│   ├── controllers/           # Route logic
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT protect + adminOnly
│   ├── models/                # User, Table, Booking (Mongoose)
│   ├── routes/                # /api/auth, /tables, /bookings, /admin
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/                  # React app
    ├── public/
    └── src/
        ├── components/
        │   ├── admin/AdminLayout.js   # Admin sidebar + shell
        │   └── user/UserLayout.js     # Customer sidebar + shell
        ├── context/
        │   └── AuthContext.js         # Global auth state
        ├── pages/
        │   ├── auth/      (Login, Register)
        │   ├── user/      (Dashboard, BookTable, MyBookings, Profile)
        │   └── admin/     (Dashboard, Bookings, Tables, Users)
        ├── utils/
        │   └── api.js     # Axios instance with JWT interceptor
        ├── App.js         # Routes
        └── index.js
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB running locally (or a MongoDB Atlas URI)

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` if needed (default works for local MongoDB):
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/restaurant_booking
JWT_SECRET=spiceofindia_jwt_secret_key_2024
JWT_EXPIRE=7d
```

Seed the database with an admin account, sample users, and 12 tables:
```bash
npm run seed
```

Start the backend:
```bash
npm run dev
```
Backend runs on **http://localhost:5000**

### 2. Frontend Setup

Open a **new terminal**:
```bash
cd frontend
npm install
npm start
```
Frontend runs on **http://localhost:3000** (proxies API calls to port 5000 automatically).

---

## 🔑 Demo Login Credentials

| Role  | Email                     | Password   |
|-------|---------------------------|------------|
| Admin | admin@spiceofindia.com    | admin123   |
| User  | arjun@gmail.com           | user123    |
| User  | priya@gmail.com           | user123    |
| User  | rahul@gmail.com           | user123    |

(The login page also has "Demo User" / "Demo Admin" buttons that autofill these.)

---

## 🛠 Tech Stack

- **Frontend:** React 18, React Router v6, Axios, Recharts, react-hot-toast, CSS Modules
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Auth:** JWT (jsonwebtoken) + bcryptjs password hashing

---

## 📡 API Reference

### Auth — `/api/auth`
| Method | Route        | Access  | Description          |
|--------|--------------|---------|-----------------------|
| POST   | /register    | Public  | Create account         |
| POST   | /login       | Public  | Login, get JWT         |
| GET    | /me          | Private | Get current user       |
| PUT    | /profile     | Private | Update name/phone      |
| PUT    | /password    | Private | Change password        |

### Tables — `/api/tables`
| Method | Route | Access  | Description       |
|--------|-------|---------|--------------------|
| GET    | /     | Private | List active tables |

### Bookings — `/api/bookings`
| Method | Route             | Access  | Description                      |
|--------|-------------------|---------|------------------------------------|
| POST   | /                 | Private | Create a booking                   |
| GET    | /my               | Private | Get my bookings                    |
| GET    | /availability     | Private | Check tables free for date+time    |
| PUT    | /:id/cancel       | Private | Cancel my booking                  |

### Admin — `/api/admin` (admin role only)
| Method | Route                    | Description                  |
|--------|--------------------------|-------------------------------|
| GET    | /dashboard               | Stats + chart + recent bookings |
| GET    | /bookings                | All bookings (paginated, filterable) |
| PUT    | /bookings/:id/status     | Update booking status          |
| GET    | /users                   | All customers + booking counts |
| PUT    | /users/:id/toggle        | Enable/disable a customer      |
| GET    | /tables                  | All tables (incl. inactive)    |
| POST   | /tables                  | Create table                   |
| PUT    | /tables/:id              | Update table                   |
| DELETE | /tables/:id              | Deactivate table                |

---

## 📝 Notes for Your Internship Submission

- All passwords are hashed with bcrypt before storing — never stored in plain text.
- Routes are protected with JWT middleware (`protect`) and role-checking (`adminOnly`).
- Table double-booking is prevented server-side (`isTableTaken` check in `bookingController.js`).
- The UI uses CSS Modules (scoped styles) — no class name collisions between pages.
- To reset all data, just re-run `npm run seed` in `/backend`.

### Suggested next steps if you want to extend this further
- Add email/SMS confirmation (e.g. Nodemailer or Twilio)
- Add image uploads for table photos (Multer + Cloudinary)
- Add a Socket.io layer for real-time table-status updates across users
- Add pagination to "My Bookings" once a user has many bookings
- Deploy: backend → Render/Railway, frontend → Vercel/Netlify, DB → MongoDB Atlas
