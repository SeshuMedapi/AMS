import logging
from api.api_models.notification import Notification

class NotificationService():
    logger = logging.getLogger("app_log")

    def get_notification(self,page, user):
        notifications_per_page = 10 
        start_index = (int(page) - 1) * notifications_per_page
        end_index = start_index + notifications_per_page
        notifications = Notification.objects.filter(user=user,deactive=False,read=False).order_by('-datetime')[start_index:end_index]
        return notifications

    def read_notification(self,notification_id):
        notification = Notification.objects.get(id=notification_id)
        notification.read = True
        notification.save()

    def read_all_notification(self, user):
        notifications = Notification.objects.filter(user=user)
        for notification in notifications:
            notification.read = True
            notification.save()

    def deactivate_notification(self,notification_id):
        notification = Notification.objects.get(id=notification_id)
        notification.deactive = True
        notification.save()

    def deactivate_all_notification(self, user):
        notifications = Notification.objects.filter(user=user)
        for notification in notifications:
            notification.deactive = True
            notification.save()

