
from getpass import getpass

from app.database import SessionLocal
from app.models import User
from app.auth import hash_password


def create_admin():
    db = SessionLocal()

    try:
        email = input("Admin email: ").strip().lower()

        existing_user = db.query(User).filter(
            User.email == email
        ).first()

        if existing_user:
            print("This email is already registered.")
            return

        name = input("Admin name: ").strip()
        password = getpass("Admin password (minimum 8 characters): ")

        if len(name) < 2:
            print("Name must contain at least 2 characters.")
            return

        if len(password) < 8:
            print("Password must contain at least 8 characters.")
            return

        admin = User(
            name=name,
            email=email,
            hashed_password=hash_password(password),
            role="admin",
        )

        db.add(admin)
        db.commit()

        print("Admin account created successfully.")

    finally:
        db.close()


if __name__ == "__main__":
    create_admin()
