import { FC, ReactElement, createContext } from 'react'
import { notification } from 'antd'
import type { NotificationPlacement } from 'antd/es/notification/interface'

interface NotificationContextProps {
  openNotification: (name: string, placement: NotificationPlacement) => void
}

export const NotificationContext = createContext<NotificationContextProps>({
  openNotification: () => {}
})

interface INotificationProvider {
  children: ReactElement
}
export const NotificationProvider: FC<INotificationProvider> = ({ children }) => {
  const [api, contextHolder] = notification.useNotification()

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const openNotification = (name: string, placement: NotificationPlacement) => {
    api.info({
      message: '',
      description: `${name}!`,
      placement
    })
  }

  return (
    <NotificationContext.Provider value={{ openNotification }}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  )
}
