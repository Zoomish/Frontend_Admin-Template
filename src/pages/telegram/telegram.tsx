import React, { FC, useContext } from 'react'
import * as restApi from '../../utils/api/rest-api'
import { NAME_TELEGRAM_BOT } from '../../utils/const'
import { TRest } from '../../utils/typesFromBackend'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import { useLocation } from 'react-router'

interface ITelegram {
  rest: TRest
  t: (arg0: string) => string
}

const Telegram: FC<ITelegram> = ({ rest, t }) => {
  const { openNotification } = useContext(NotificationContext)
  const [isLoading, setIsLoading] = React.useState(false)
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const [restData, setRestData] = React.useState<TRest>({} as TRest)
  const location = useLocation()

  React.useEffect(() => {
    restApi
      .getRest(rest._id)
      .then((res: TRest) => {
        setRestData(res)
        setIsLoading(true)
      })
      .catch((e) => openNotification(e, 'topRight'))
    const currentPath = location.pathname
    window.localStorage.setItem('initialRoute', currentPath)
  }, [])

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            marginBottom: '1rem',
            alignItems: 'center',
            outline: 'none',
            padding: '0'
          }}
        >
          <div style={{ display: 'block', marginRight: 'auto' }}>
            <h2 style={{ fontWeight: 600, marginBottom: '40px' }}>
              {t('telegram-bot')}
            </h2>
            <p>{t('how-does-it-work')}</p>
            <a
              href='https://easyqr.ru/blog/telegram-i-easy-qr/'
              target={'_blank'}
              rel='noreferrer'
            >
              {t('instrucions-add-telegram-bot')}
            </a>
            {isLoading
              ? (
              <>
                <div
                  style={{
                    display: 'flex',
                    marginBottom: '40px',
                    marginTop: '40px'
                  }}
                >
                  <p>{t('nickname-bot')}</p>
                  <p style={{ marginLeft: '10px' }}>{NAME_TELEGRAM_BOT}</p>
                </div>
                <div style={{ display: 'flex', marginBottom: '40px' }}>
                  <p>{t('administrator-password')}</p>
                  <p style={{ marginLeft: '10px' }}>{restData.adminCode}</p>
                </div>
                <div style={{ display: 'flex', marginBottom: '40px' }}>
                  <p>{t('waiter-password')}</p>
                  <p style={{ marginLeft: '10px' }}>{restData.waiterCode}</p>
                </div>
              </>
                )
              : (
                  ''
                )}
          </div>
        </div>
      </div>
    </>
  )
}
export default Telegram
