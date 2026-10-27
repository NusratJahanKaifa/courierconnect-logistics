# CourierConnect — Courier & Logistics Management Platform

A courier and logistics management platform built with React, Vite, Tailwind CSS, FastAPI, SQLAlchemy, and SQLite. The system provides parcel booking, shipment tracking, user authentication, and role-based access for regular users and administrators.

## Features

### Authentication & Security
- User registration and login
- Password hashing
- JWT-based authentication
- Role-based access control for users and administrators
- Protected frontend routes
- Session expiration handling
- Forgot-password and reset-password flow

### Parcel Management
- Book new parcels
- Generate unique tracking numbers
- View parcel details
- Update parcel information
- Track shipment status
- Public parcel tracking
- Search and filter parcels
- Sort and paginate parcel lists
- Admin-only parcel deletion

### User Management
- Admin-only user management
- Search users by name or email
- Paginated user list
- View account roles and registration dates

### User Interface
- Responsive layouts
- Admin and user dashboards
- Loading, error, and empty states
- Toast notifications
- Parcel status indicators
- Search and pagination controls

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
- Python
- FastAPI
- SQLAlchemy
- SQLite
- JWT authentication
- Password hashing
- Pydantic validation

## Project Structure

```text
courier-logistics/
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── parcels.py
│   │   │   └── users.py
│   │   ├── auth.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── email_utils.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── schemas.py
│   ├── requirements.txt
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── utils/
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## Requirements

Install the following before running the project:

- Python 3.10 or newer
- Node.js and npm
- Git (optional)

## Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd courier-logistics
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual repository URL.

### 2. Set Up the Backend

Open a terminal in the project root:

```bash
cd backend
python -m venv venv
```

Activate the virtual environment on Windows Git Bash:

```bash
source venv/Scripts/activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the `backend` directory:

```env
DATABASE_URL=sqlite:///./courier.db
SECRET_KEY=replace_with_a_long_random_secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

FRONTEND_URL=http://localhost:5173

MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM=
```

**Security:** Replace the example `SECRET_KEY` with a strong, private value. Never commit your real `.env` file or email credentials to GitHub.

Start the backend:

```bash
uvicorn app.main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

Interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

### 3. Set Up the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Main API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/login` | Log in |
| GET | `/auth/me` | Get the current user's profile |
| POST | `/auth/forgot-password` | Request a password reset |
| POST | `/auth/reset-password` | Reset the password |
| POST | `/parcels/` | Book a parcel |
| GET | `/parcels/` | List parcels with search and filters |
| GET | `/parcels/track/{tracking_number}` | Public parcel tracking |
| GET | `/parcels/{parcel_id}` | Get a parcel's details |
| PUT | `/parcels/{parcel_id}` | Update parcel information |
| DELETE | `/parcels/{parcel_id}` | Delete a parcel (admin only) |
| GET | `/users/` | List users (admin only) |

Some endpoints require a valid JWT access token and appropriate permissions.

For request schemas, query parameters, and response details, open the Swagger documentation at `/docs`.

## User Roles

### Regular User
- Register and log in
- Book parcels
- View their own parcels
- Search and filter their parcel list
- Track a parcel using its tracking number

### Administrator
- View parcel records across users
- Update parcel statuses
- Delete parcels
- Search and paginate users

## Password Reset Email

The password-reset flow requires valid SMTP email settings for email delivery.

For Gmail, configure an App Password in the backend `.env` file when available. Do not use or publish your normal Gmail password. If email credentials are not configured, email delivery may fail.

## Security Notes

- Keep secret keys and email credentials private.
- Do not commit `.env` files containing secrets.
- Use a strong secret key outside development.
- Configure production CORS origins before deployment.
- Use HTTPS and secure deployment settings in production.
- Do not publish administrator credentials in a public repository.

## Project Links

- **GitHub Repository:** Add your repository URL here.
- **Live Frontend:** Add your deployed frontend URL here.
- **Backend API:** Add your deployed backend URL here.
- **API Documentation:** Add your deployed `/docs` URL here.

## License

Add your preferred license if you plan to distribute this project publicly.
