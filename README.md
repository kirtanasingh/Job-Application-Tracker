# 💼 JobTrack — Job Application Tracker

[![Angular](https://img.shields.io/badge/Angular-19.0-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![Entity Framework Core](https://img.shields.io/badge/EF%20Core-8.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://learn.microsoft.com/ef/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

**JobTrack** is a modern, full-stack job application tracker built with **Angular 19+**, **ASP.NET Core 8 Web API**, and **Entity Framework Core**. It empowers job seekers to track their application statuses, interview rounds, and offers in a real-time dashboard.

---

## ✨ Features

- 🔐 **User Authentication**: Secure Account Registration & Sign-In using SHA-256 password hashing and JWT sessions.
- 📋 **Complete CRUD Operations**: Create, Read, Update, and Delete job applications with zero-latency optimistic UI.
- 📊 **Real-Time Analytics Dashboard**: Summary metric cards (Total, Applied, Shortlisted, Interview, Selected, Rejected) & visual progress distribution chart.
- 🔍 **Live Search & Filters**: Search applications by company, role, or location with instant status and job type filtering.
- ⚡ **Interactive Modals**: Modern reactive forms with inline validation for Company, Role, Date, Type, Status, Salary, URL, and Notes.
- 🎨 **Modern Dark Dashboard UI**: Custom responsive CSS design system with glassmorphism card components and status badge pipes.

---

## 🏗️ Project Architecture

```text
JobTrack/
├── frontend/                     # Angular Single Page Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/             # Models, Services, Auth Guards
│   │   │   ├── shared/           # Navbar, StatCard, StatusBadge Pipe
│   │   │   ├── features/
│   │   │   │   ├── auth/         # Login & Register components
│   │   │   │   ├── dashboard/    # Analytics & Summary view
│   │   │   │   └── applications/ # Table list & Reactive CRUD form modal
│   │   │   ├── app.routes.ts     # Route configuration
│   │   │   ├── app.config.ts     # App providers (Zoneless, HttpClient, Router)
│   │   │   └── app.ts            # Root AppComponent
│   │   └── styles.css            # Global CSS design system
│   └── package.json
│
├── backend/                      # ASP.NET Core Web API
│   ├── Controllers/
│   │   ├── AuthController.cs     # User Registration & Login endpoints
│   │   └── JobsController.cs     # User-scoped CRUD job application endpoints
│   ├── Models/
│   │   ├── User.cs               # User entity
│   │   └── JobApplication.cs     # Job application entity
│   ├── Data/
│   │   └── JobDbContext.cs       # Entity Framework Core DbContext
│   ├── DTOs/                     # Data Transfer Objects
│   ├── Services/
│   │   └── AuthService.cs        # Hashing & JWT Token Generation
│   ├── Program.cs                # Swagger, CORS, & EF Core configuration
│   ├── appsettings.json          # Database connection strings
│   └── JobTrack.csproj
│
├── .gitignore                    # Git ignore rules for .NET and Angular
└── README.md                     # Documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0 or later
- **.NET SDK**: 8.0 or later
- **npm**: v9.0 or later

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/JobTrack.git
cd JobTrack
```

---

### 2. Run the ASP.NET Core Backend

```bash
cd backend
dotnet restore
dotnet run --urls "http://localhost:5000"
```

* ⚡ **Swagger UI Docs**: [http://localhost:5000/swagger](http://localhost:5000/swagger)

---

### 3. Run the Angular Frontend

Open a second terminal window:

```bash
cd frontend
npm install
npm start
```

* 🖥️ **Web Application**: [http://localhost:4200](http://localhost:4200)

---

## 🛠️ API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user account |
| `POST` | `/api/auth/login` | Authenticate user and return JWT session |
| `GET` | `/api/jobs` | Get all job applications for logged-in user |
| `GET` | `/api/jobs/{id}` | Get single job application details |
| `POST` | `/api/jobs` | Create a new job application |
| `PUT` | `/api/jobs/{id}` | Update an existing job application |
| `DELETE` | `/api/jobs/{id}` | Delete a job application |

## Results
<img width="353" height="410" alt="image" src="https://github.com/user-attachments/assets/2ca29b52-d6a5-4c5a-a977-93fc43167a7d" />

<img width="723" height="360" alt="image" src="https://github.com/user-attachments/assets/d4a4741f-359c-4b30-bcaf-5b648b6328fb" />

<img width="470" height="424" alt="image" src="https://github.com/user-attachments/assets/8d558d2e-9794-47dd-abb5-5259343fdabf" />

<img width="739" height="381" alt="image" src="https://github.com/user-attachments/assets/fad2c241-cf7b-47c7-9d0a-c3769e7d31ab" />


---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
