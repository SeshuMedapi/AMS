from django.conf import settings
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from api.exception.app_exception import *
import logging, time

class EmailService():
    logger = logging.getLogger('app_log')

    def __init__(self, host, username, password) -> None:
        self.host = host
        self.username = username
        self.password = password

    mail = None
    host = None
    username = None
    password = None

    def send_smtp_email(self, to_email, content, subject):
        msg = MIMEMultipart()
        msg['From'] = self.username
        msg['To'] = to_email
        msg['Subject'] = subject
        
        msg.attach(MIMEText(content, 'html'))
        
        try:
            with smtplib.SMTP(settings.SMTP_EMAIL_HOST, settings.SMTP_EMAIL_PORT) as server:
                if self.password and len(self.password) > 0:
                    if settings.SMTP_EMAIL_USE_TLS:
                        server.starttls()
                    server.login(self.username, self.password)
                server.sendmail(self.username, to_email, msg.as_string())
                self.logger.info(f"Email sent to {to_email} successfully.")
        except Exception as e:
            self.logger.error(f"Failed to send email to {to_email}: {e}")
            raise EmailException(f"Failed to send email to {to_email}: {e}")
