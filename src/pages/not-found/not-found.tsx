import { useHistory } from 'react-router'
import styles from './not-found.module.css'
import { Button } from 'antd'
import React, { FC } from 'react'

interface INotFound {
  t: (arg0: string) => string
}
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const NotFound: FC<INotFound> = ({ t }) => {
  const history = useHistory()
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleClick = () => {
    history.push('/')
  }

  React.useEffect(() => {
    window.localStorage.removeItem('initialRoute')
  }, [])

  return (
    <div className={styles.container}>
      <h3>{t('something-went-wrong')}</h3>
      <div>
        <p>{t('404-page-not-found')}</p>
      </div>
      <Button type='primary' onClick={handleClick}>
        {t('go-back-main-page')}
      </Button>
    </div>
  )
}

export default NotFound
