
import smtplib
from email.message import EmailMessage
from html import escape
from urllib.parse import urlencode
from app.config import settings
def send_password_reset_email(
    recipient_email: str,
    reset_token: str,
) -> None:
    if not settings.MAIL_USERNAME or not settings.MAIL_PASSWORD:
        raise RuntimeError(
            "Gmail SMTP credentials are not configured."
        )
    sender_email = settings.MAIL_FROM or settings.MAIL_USERNAME
    frontend_url = settings.FRONTEND_URL.rstrip("/")
    query_string = urlencode({"token": reset_token})
    reset_link = f"{frontend_url}/reset-password?{query_string}"
    safe_reset_link = escape(reset_link, quote=True)
    message = EmailMessage()
    message["Subject"] = "CourierConnect - Reset Your Password"
    message["From"] = sender_email
    message["To"] = recipient_email
    message.set_content(
        "You requested to reset your CourierConnect password.\n\n"
        f"Open this link to reset your password:\n{reset_link}\n\n"
        "This link expires in 15 minutes and can only be used once.\n"
        "If you did not request this, you can ignore this email."
    )
    message.add_alternative(
        f"""
        <html>
          <body style="font-family: Arial, sans-serif; color: #102A43;">
            <h2>Reset your CourierConnect password</h2>
            <p>You requested to reset your password.</p>
            <p>
              <a href="{safe_reset_link}"
                 style="display:inline-block;padding:12px 20px;
                 background:#0F766E;color:#ffffff;
                 text-decoration:none;border-radius:6px;">
                Reset Password
              </a>
            </p>
            <p>This link expires in 15 minutes and can only be used once.</p>
            <p>If you did not request this, you can ignore this email.</p>
          </body>
        </html>
        """,
        subtype="html",
    )

    with smtplib.SMTP(
        "smtp.gmail.com",
        587,
        timeout=20,
    ) as server:
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(
            settings.MAIL_USERNAME,
            settings.MAIL_PASSWORD,
        )
        server.send_message(message)
