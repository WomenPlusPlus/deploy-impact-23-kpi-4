import { notification } from 'antd'

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export const useNotifications = () => {
  const [notificationsApi, contextHolder] = notification.useNotification()

  const openNotificationWithIcon = (type: NotificationType, title: string, description: string) => {
    notificationsApi[type]({
      message: title,
      description: description,
    })
  }

  return {
    openNotificationWithIcon,
    contextHolder
  }
}