# CourierConnect — Courier & Logistics Management Platform

CourierConnect is a courier and logistics management platform built with **React** and **FastAPI**. It allows users to register, book and track parcels, and manage deliveries. Administrators have additional access to manage parcels and users.

## Live Demo

- **Frontend:** https://comforting-axolotl-d296aa.netlify.app/
- **Backend API:** https://courierconnect-logistics.onrender.com
- **API Documentation:** https://courierconnect-logistics.onrender.com/docs
- **GitHub Repository:** https://github.com/NusratJahanKaifa/courierconnect-logistics

## Features

- User registration and login
- JWT-based authentication
- Role-based access for users and administrators
- Parcel booking and tracking
- Parcel management
- User management for administrators
- Password reset functionality
- Search and filtering support

## Technology Stack

### Frontend
- React
- Vite
- React Router
- Tailwind CSS
- DaisyUI
- React Icons
- React Hot Toast

### Backend
- FastAPI
- SQLAlchemy
- Pydantic
- JWT authentication
- SQLite for local development
- PostgreSQL for production database support

## Project Structure

```text
courier-logistics/
├── backend/
│   ├── app/
│   ├── .env.example
│   ├── requirements.txt
│   └── create_admin.py
├── frontend/
│   ├── src/
│   ├── public/
│   └── .env.example
└── README.md
```

## Setup and Installation

### Backend Setup

1. Open a terminal in the `backend` directory.
2. Create a Python virtual environment:

   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment.

   **Windows (Git Bash):**

   ```bash
   source venv/Scripts/activate
   ```

   **Windows (Command Prompt):**

   ```bash
   venv\Scripts\activate
   ```

4. Install the required dependencies:

   ```bash
   pip install -r requirements.txt
   ```

5. Create a `.env` file based on `.env.example`.
6. Configure the required environment variables, including the database URL and secret key.
7. Start the backend development server:

   ```bash
   uvicorn app.main:app --reload
   ```

The backend API will be available at `http://127.0.0.1:8000`.

API documentation: http://127.0.0.1:8000/docs

### Frontend Setup

1. Open another terminal in the `frontend` directory.
2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`.
4. Configure the API base URL:

   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000
   ```

   For the deployed frontend, configure the API base URL to point to the deployed backend.

5. Start the frontend development server:

   ```bash
   npm run dev
   ```

The frontend will be available at http://localhost:5173.

## Environment Variables

Refer to the following example files for configuration:

- `backend/.env.example`
- `frontend/.env.example`

Use your own environment-specific values. Do not commit real `.env` files, passwords, database credentials, JWT secrets, or other sensitive information to version control.

## API Documentation

The deployed API documentation is available at:

https://courierconnect-logistics.onrender.com/docs

Use the interactive Swagger UI to explore and test the available API endpoints.

## Database

- **Local development:** SQLite
- **Production deployment:** PostgreSQL

## Security

- Authentication uses JWT tokens.
- Passwords should be stored as secure hashes.
- Role-based authorization restricts administrator-only operations.
- Secret keys and database credentials should be stored in environment variables.

## License

No license has been specified yet.
