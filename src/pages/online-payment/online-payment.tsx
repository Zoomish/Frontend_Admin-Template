import { Button, Form, Input, Radio, Alert } from 'antd'
import { useLocation } from 'react-router'
import React, { FC, useContext } from 'react'
import * as restApi from '../../utils/api/rest-api'
import { TRest } from '../../utils/typesFromBackend'
import { NotificationContext } from '../../components/notification-provider/notification-provider'

interface IOnlinePayment {
  token: string
  rest: TRest
  t: (arg0: string) => string
}
const OnlinePayment: FC<IOnlinePayment> = ({ token, rest, t }) => {
  const { openNotification } = useContext(NotificationContext)

  const [isLoading, setIsLoading] = React.useState(false)
  const [showAlert, setShowAlert] = React.useState(false)
  const [form] = Form.useForm()
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 }
  }
  const location = useLocation()

  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: '${label} ' + `${t('it-is-necessary-to-fill-in')}!`
  }

  React.useEffect(() => {
    restApi
      .getRest(rest._id)
      .then((res: TRest) => {
        if (res.paymentPublicID != null) {
          if (res.paymentPublicID.length > 0) {
            form.setFieldsValue({ paymentPublicID: res.paymentPublicID })
          }
        }
        form.setFieldsValue({ singleMessagePayment: res.singleMessagePayment })
        setIsLoading(true)
      })
      .catch((e) => openNotification(e, 'topRight'))
    const currentPath = location.pathname
    window.localStorage.setItem('initialRoute', currentPath)
  }, [])

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onFinish = (values: any) => {
    values._id = rest._id
    restApi
      .updateRest(values, token)
      .then((res: TRest) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (res._id) {
          // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
          setShowAlert(true)
          setTimeout(() => setShowAlert(false), 5000)
        }
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  return (
    <>
      <h4
        style={{
          marginBottom: '15px',
          marginTop: '0',
          color: '#000',
          fontSize: '1.75rem',
          fontWeight: '600',
          padding: '15px'
        }}
      >
        {t('setting-payment')}
      </h4>
      <p>{t('How-does-it-work')}</p>
      <a href='https://easyqr.ru/blog/payment/'>
        {t('Instructions-for-setting-up-online-payment')}
      </a>
      {isLoading
        ? (
        <Form
          {...layout}
          onFinish={onFinish}
          validateMessages={validateMessages}
          name='modifier'
          form={form}
          style={{ paddingTop: '1.5rem' }}
        >
          <Form.Item
            label='Public ID'
            rules={[{ required: true }]}
            name='paymentPublicID'
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t('what-kind-of-payment')}
            name='singleMessagePayment'
          >
            <Radio.Group style={{ display: 'flex', flexDirection: 'column' }}>
              <Radio value={false}>{t('One-stage-online-payment')}</Radio>
              <Radio value={true}> {t('Two-stage-online-payment')}</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
            <Button type='primary' htmlType='submit'>
              {t('save')}
            </Button>
          </Form.Item>
        </Form>
          )
        : (
            ''
          )}
      {showAlert
        ? (
        <Alert type='success' message='Изменения успешно применены!' />
          )
        : (
            ''
          )}
    </>
  )
}
export default OnlinePayment
