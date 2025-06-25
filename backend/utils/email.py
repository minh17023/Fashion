import os
from email.message import EmailMessage
from aiosmtplib import send
from dotenv import load_dotenv

load_dotenv()  # Load biến môi trường từ .env

MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
MAIL_FROM = os.getenv("MAIL_FROM")
MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
MAIL_SERVER = os.getenv("MAIL_SERVER")


async def send_login_notification(to_email: str, username: str):
    message = EmailMessage()
    message["From"] = MAIL_FROM
    message["To"] = to_email
    message["Subject"] = "Thông báo đăng nhập"
    message.set_content(
        f"Xin chào {username},\n\nTài khoản của bạn vừa đăng nhập thành công vào hệ thống.\n\nNếu không phải bạn, vui lòng đổi mật khẩu ngay."
    )

    await send(
        message,
        hostname=MAIL_SERVER,
        port=MAIL_PORT,
        start_tls=True,
        username=MAIL_USERNAME,
        password=MAIL_PASSWORD,
    )
