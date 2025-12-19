# DigiWagon Task - Product Management System

A full-stack web application for product management with user authentication, built with Node.js, Express, React, and MySQL.

## 🚀 Tech Stack

### Backend

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** MySQL with Sequelize ORM
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Zod
- **Password Hashing:** bcryptjs
- **API Documentation:** Swagger/OpenAPI

### Frontend

- **Framework:** React 18 with Vite
- **UI Library:** Material UI (MUI)
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Routing:** React Router v6

---

## 📋 Prerequisites

- Node.js (v18 or higher)
- MySQL Server (v8.0 or higher)
- pnpm or npm package manager

---

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd DigiWagon-Task
```

### 2. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE digiwagon_db;
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
pnpm install

# Configure environment variables
# Copy .env.example to .env and update the values
cp .env.example .env
```

Update the `.env` file with your MySQL credentials:

```env
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=digiwagon_db
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

Run database migrations and seed:

```bash
# Run migrations to create tables
pnpm run db:migrate

# Seed the database with admin user
pnpm run db:seed
```

Start the backend server:

```bash
# Development mode (with hot reload)
pnpm run dev

# Production mode
pnpm start
```

The backend will be running at `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
pnpm install

# Configure environment variables (optional)
cp .env.example .env
```

Start the frontend development server:

```bash
pnpm run dev
```

The frontend will be running at `http://localhost:5173`

---

## 🔐 Default Credentials

After seeding the database, you can login with:

| Role  | Email               | Password |
| ----- | ------------------- | -------- |
| Admin | admin@digiwagon.com | admin123 |

New users can register through the application and will be assigned the "user" role by default.

---

## 📚 API Documentation

Once the backend is running, access the Swagger API documentation at:

```
http://localhost:5000/api-docs
```

### API Endpoints

| Method | Endpoint             | Description              | Access  |
| ------ | -------------------- | ------------------------ | ------- |
| POST   | `/api/auth/login`    | User login               | Public  |
| POST   | `/api/auth/register` | User registration        | Public  |
| GET    | `/api/auth/me`       | Get current user profile | Private |
| POST   | `/api/products`      | Create a new product     | User    |
| GET    | `/api/products`      | Get all products         | Admin   |
| GET    | `/api/products/my`   | Get user's products      | User    |
| GET    | `/api/products/:id`  | Get product by ID        | Private |
| DELETE | `/api/products/:id`  | Delete a product         | Admin   |

---

## 🗂️ Project Structure

```
DigiWagon-Task/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & Swagger configuration
│   │   ├── controllers/     # Route controllers (MVC)
│   │   ├── database/
│   │   │   ├── migrations/  # Sequelize migrations
│   │   │   └── seeders/     # Database seeders
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Sequelize models
│   │   ├── routes/          # API routes
│   │   ├── validations/     # Zod validation schemas
│   │   └── server.js        # Application entry point
│   ├── .env.example
│   ├── .sequelizerc
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React Context providers
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Application entry point
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🔄 Database Commands

```bash
# Run all pending migrations
pnpm run db:migrate

# Seed the database
pnpm run db:seed

# Reset database (undo all migrations, re-migrate, and re-seed)
pnpm run db:reset
```

---

## 👥 User Roles & Permissions

| Feature           | User | Admin |
| ----------------- | ---- | ----- |
| Login/Register    | ✅   | ✅    |
| Submit Products   | ✅   | ❌    |
| View Own Products | ✅   | ❌    |
| View All Products | ❌   | ✅    |
| Delete Products   | ❌   | ✅    |

---

## 🧪 Testing the Application

1. **Start both servers** (backend on port 5000, frontend on port 5173)

2. **Admin Flow:**

   - Login with admin credentials
   - View all submitted products
   - Delete products as needed

3. **User Flow:**
   - Register a new account or login
   - Submit products with variants (name + amount)
   - Each product requires at least one variant

---

## 📝 Environment Variables

### Backend (.env)

| Variable       | Description         | Default               |
| -------------- | ------------------- | --------------------- |
| NODE_ENV       | Environment mode    | development           |
| PORT           | Server port         | 5000                  |
| DB_HOST        | MySQL host          | localhost             |
| DB_PORT        | MySQL port          | 3306                  |
| DB_NAME        | Database name       | digiwagon_db          |
| DB_USER        | MySQL username      | root                  |
| DB_PASSWORD    | MySQL password      | -                     |
| JWT_SECRET     | JWT signing secret  | -                     |
| JWT_EXPIRES_IN | JWT expiration time | 7d                    |
| CORS_ORIGIN    | Allowed CORS origin | http://localhost:5173 |

### Frontend (.env)

| Variable     | Description     | Default               |
| ------------ | --------------- | --------------------- |
| VITE_API_URL | Backend API URL | http://localhost:5000 |

---

This project is for demonstration purposes as part of the DigiWagon task assessment.
