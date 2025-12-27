<div align="center">
  <img src="frontend/public/book-icon.svg" alt="Logo" width="100" />
  <h1>Novela</h1>
  <h3>Full-Stack E-Commerce Platform</h3>
  <p><strong>A secure, scalable e-commerce solution built with Spring Boot and React.</strong></p>
</div>

---

## ✨ Overview

**Novela** is a production-ready **Full-Stack E-Commerce Application** designed to simulate real-world retail operations. It features a robust **Java Spring Boot** backend handling complex business logic (inventory, orders, security) and a responsive **React** frontend delivering a modern user experience.

Key architectural highlights include **Stateless JWT Authentication**, and containerized deployment via **Docker**.

## 🚀 Key Features

- 🔐 **Enterprise Security** - Implementation of Spring Security with stateless JWT authentication.
- 📦 **Inventory Management** - Complex relational data modeling (PostgreSQL) for products and categories.
- 🛒 **Stateful Shopping Cart** - Real-time cart synchronization and management.
- 💳 **Order Processing** - Seamless checkout flow with order tracking and history.
- 👤 **User Profiles** - Account management with secure password handling.
- 📱 **Responsive UI** - Mobile-first design using React 19, Tailwind CSS, and Framer Motion.
- 🌙 **Dark Mode** - Built-in theme toggling for accessibility.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| React Router | Navigation |
| Axios | HTTP Client |
| Framer Motion | Animations |
| React Icons | Icon Library |
| React Toastify | Notifications |

### Backend
| Technology | Purpose |
|------------|---------|
| Java 17 | Programming Language |
| Spring Boot 3.2 | Backend Framework |
| Spring Security | Authentication & Authorization |
| Spring Data JPA | Database ORM |
| JWT (JSON Web Tokens) | Stateless Authentication |
| Lombok | Boilerplate Reduction |
| PostgreSQL | Database |

### DevOps & Tools
| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Multi-container Setup |
| Maven | Build Tool |
| Git | Version Control |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)
- **Node.js 18** or higher
- **Java 17** or higher (for manual run)
- **Maven 3.8+** (for manual run)

### Option 1: Using Docker (Recommended)

> **Note:** You need to install [Docker Desktop](https://www.docker.com/products/docker-desktop/) first to run through Docker.

```bash
# Clone the repository
git clone https://github.com/iammanoj807/fullstack-ecommerce-platform.git
cd fullstack-ecommerce-platform

# Start all services with Docker Compose
docker-compose up -d

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8081
# Swagger API Docs: http://localhost:8081/swagger-ui.html
```

### Option 2: Using the Run Script

```bash
# Clone the repository
git clone https://github.com/iammanoj807/fullstack-ecommerce-platform.git
cd fullstack-ecommerce-platform

# Make the script executable
chmod +x run.sh

# Run both frontend and backend
./run.sh
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |

### Books
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Get all books |
| GET | `/api/books/{id}` | Get book by ID |
| GET | `/api/books/category/{category}` | Get books by category |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart/add` | Add item to cart |
| PUT | `/api/cart/update` | Update cart item |
| DELETE | `/api/cart/remove/{id}` | Remove from cart |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get user's orders |
| POST | `/api/orders` | Place new order |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reviews/book/{bookId}` | Get book reviews |
| POST | `/api/reviews` | Add review |

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Made with ❤️ by Manoj Kumar Thapa
