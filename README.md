# TaskFlow

A full-stack task management system built with a Java Spring Boot backend and a Next.js frontend, featuring authentication, containerized deployment, and CI/CD.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Backend   | Java 17 · Spring Boot 3 · Spring Security (JWT) · H2/PostgreSQL |
| Frontend  | Next.js 15 · React · TypeScript · CSS Modules |
| DevOps    | Docker Compose · GitHub Actions CI      |

## Features

- 🔐 **User Authentication** — Register, Login, JWT-based stateless sessions
- 📋 **Kanban Dashboard** — Visual task management with Todo / In Progress / Done columns
- 🔍 **Search & Filter** — Filter tasks by status, priority, or title/description keyword
- 📊 **Stats Overview** — Real-time counters for each task stage
- ✏️ **Full CRUD** — Create, edit, update status, and delete tasks
- 🐳 **Dockerized** — One-command startup with Docker Compose (Next.js + Spring Boot + PostgreSQL)
- ⚡ **CI/CD** — Automated build & test pipeline via GitHub Actions

## Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- Docker & Docker Compose (optional, for containerized run)

### Run with Docker Compose

```bash
git clone https://github.com/abhishekh002/taskflow.git
cd taskflow
docker-compose up --build
```
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

### Run Locally (without Docker)

**Backend**
```bash
cd backend
mvn spring-boot:run
```
> Uses H2 in-memory database by default. Access H2 console at http://localhost:8080/h2-console

**Frontend**
```bash
cd frontend
npm install
npm run dev
```
> Open http://localhost:3000

## Project Structure

```
taskflow/
├── backend/                   # Spring Boot 3 REST API
│   ├── src/main/java/com/taskflow/
│   │   ├── config/            # Security, JWT, CORS
│   │   ├── controller/        # Auth & Task REST controllers
│   │   ├── model/             # JPA entities & enums
│   │   ├── repository/        # Spring Data JPA repositories
│   │   ├── request/           # Request DTOs
│   │   ├── response/          # Response DTOs
│   │   └── service/           # Business logic
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                  # Next.js 15 application
│   ├── src/
│   │   ├── app/               # Pages (landing, login, register, dashboard)
│   │   ├── components/        # Shared UI components (Navbar)
│   │   ├── context/           # React Context (AuthContext)
│   │   └── services/          # API client with JWT injection
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .github/workflows/ci.yml   # CI/CD pipeline
└── README.md
```

## API Endpoints

| Method  | Endpoint                | Auth? | Description                  |
|---------|-------------------------|-------|------------------------------|
| POST    | `/api/auth/register`    | No    | Register a new user          |
| POST    | `/api/auth/login`       | No    | Login and receive JWT        |
| GET     | `/api/auth/me`          | Yes   | Get current user info        |
| GET     | `/api/tasks`            | Yes   | List tasks (filter/search)   |
| POST    | `/api/tasks`            | Yes   | Create a new task            |
| PUT     | `/api/tasks/:id`        | Yes   | Update a task                |
| PATCH   | `/api/tasks/:id/status` | Yes   | Update task status only      |
| DELETE  | `/api/tasks/:id`        | Yes   | Delete a task                |

## Author

**Abhishekh**
- GitHub: [@abhishekh002](https://github.com/abhishekh002)
- LinkedIn: [abhishekh31](https://linkedin.com/in/abhishekh31)

## License

MIT
