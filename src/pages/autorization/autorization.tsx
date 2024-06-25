/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Button, Form, Input } from 'antd'
import { Dispatch, FC, SetStateAction, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import * as autorizationApi from '../../utils/api/autorization-api'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import * as validateTokenApi from '../../utils/api/validate-token-api'
import { getRest } from '../../utils/api/rest-api'
import { testIdRest } from '../../utils/const'

interface IAutorization {
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>
  setRest: (rest: any) => void
  setToken: (token: any) => void
  t: (arg0: string) => string
}

const Autorization: FC<IAutorization> = ({
  setIsLoggedIn,
  setRest,
  t,
  setToken
}) => {
  const storedInitialRoute = localStorage.getItem('initialRoute')
  const { openNotification } = useContext(NotificationContext)
  const history = useHistory()
  const pathRest = window.location.href
    .replace(/http:\/\/|https:\/\//, '')
    .split(/\./)[0]

  useEffect(() => {
    const tokenDetailsString = localStorage.getItem('token')
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (tokenDetailsString) {
      validateTokenApi
        .validateToken(pathRest, tokenDetailsString)
        .then((res) => {
          if (res.message === 'valid') {
            if (window.location.href.includes('http://localhost:3000')) {
              getRest(testIdRest).then((rest) => {
                setRest({ ...rest, pathRest: 'admin' })
                setIsLoggedIn(true)
                if (storedInitialRoute) {
                  if (storedInitialRoute === '/') {
                    history.push('/admin/menu')
                  } else {
                    history.push(storedInitialRoute)
                    localStorage.removeItem('initialRoute')
                  }
                } else {
                  history.push('/admin/menu')
                }
              })
            } else {
              getRest(pathRest).then((rest) => {
                setRest({ ...rest, pathRest: 'admin' })
                setIsLoggedIn(true)
                if (storedInitialRoute) {
                  history.push(storedInitialRoute)
                  localStorage.removeItem('initialRoute')
                } else {
                  history.push('/admin/menu')
                }
              })
            }
          }
        })
        .catch((e) => openNotification(e, 'topRight'))
    }
  }, [])

  const onFinish = (values: any) => {
    if (window.location.href.includes('http://localhost:3000')) {
      const isLocal = true
      autorizationApi
        .autorization(values, isLocal)
        .then((res) => {
          localStorage.setItem('token', res.authToken)
          setToken(res.authToken)
          getRest(testIdRest).then((rest) => {
            setRest({ ...rest, pathRest: 'admin' })
            setIsLoggedIn(true)
            if (storedInitialRoute) {
              history.push(storedInitialRoute)
              /* if (storedInitialRoute === '/') {
                history.push(
                  window.localStorage.getItem('initialRoute') ?? '/admin/menu'
                )
              } else {
                history.push(storedInitialRoute)
                localStorage.removeItem('initialRoute')
              } */
            } else {
              history.push('/admin/menu')
            }
          })
        })
        .catch((e) => openNotification(e, 'topRight'))
    } else {
      autorizationApi
        .autorization(values)
        .then((res) => {
          localStorage.setItem('token', res.authToken)
          setToken(res.authToken)
          getRest(pathRest).then((rest) => {
            setRest({ ...rest, pathRest: 'admin' })
            setIsLoggedIn(true)
            if (storedInitialRoute) {
              history.push(storedInitialRoute)
              localStorage.removeItem('initialRoute')
            } else {
              history.push('/admin/menu')
            }
          })
        })
        .catch((e) => openNotification(e, 'topRight'))
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    openNotification(t('something-went-wrong'), 'topRight')
  }

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 }
  }

  return (
    <Form
      {...layout}
      name='basic'
      style={{ maxWidth: 600 }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete='off'
    >
      <Form.Item
        label={t('login')}
        name='login'
        rules={[{ required: true, message: t('enter-your-username') }]}
      >
        <Input data-test-id='login' />
      </Form.Item>

      <Form.Item
        label={t('password')}
        name='password'
        rules={[{ required: true, message: t('enter-your-password') }]}
      >
        <Input.Password data-test-id='password'/>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type='primary' htmlType='submit' data-test-id='btn-login'>
          {t('send')}
        </Button>
      </Form.Item>
    </Form>
  )
}
export default Autorization
