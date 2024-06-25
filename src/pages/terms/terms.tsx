import { Button, Form, Input, Alert } from 'antd'
import React, { FC, useContext } from 'react'
import { TRest, TTerm } from '../../utils/typesFromBackend'
import * as restApi from '../../utils/api/rest-api'
import * as termAPI from '../../utils/api/term-api'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import { useLocation } from 'react-router'

interface ITerms {
  token: string
  rest: TRest
  t: (arg0: string) => string
}

const Terms: FC<ITerms> = ({ token, rest, t }) => {
  const { openNotification } = useContext(NotificationContext)
  const [form] = Form.useForm()
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const [dataTerm, setDataTerm] = React.useState<TTerm>({} as TTerm)
  const [isLoading, setIsLoading] = React.useState(false)
  const [showAlert, setShowAlert] = React.useState(false)
  const location = useLocation()

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 }
  }

  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: '${label} ' + `${t('it-is-necessary-to-fill-in')}!`
  }

  React.useEffect(() => {
    restApi
      .getRest(rest._id)
      .then((res: TRest) => {
        setDataTerm(res.terms_ids)
        form.setFieldsValue({ juryAddress: res.terms_ids.juryAddress })
        form.setFieldsValue({ physicalAddress: res.terms_ids.physicalAddress })
        form.setFieldsValue({ emailAddress: res.terms_ids.emailAddress })
        form.setFieldsValue({ phoneNumber: res.terms_ids.phoneNumber })
        form.setFieldsValue({ shortName: res.terms_ids.shortName })
        form.setFieldsValue({ webSite: res.terms_ids.webSite })
        form.setFieldsValue({ bankDetails: res.terms_ids.bankDetails })
        form.setFieldsValue({ juryName: res.terms_ids.juryName })
        form.setFieldsValue({ INN: res.terms_ids.INN })
        form.setFieldsValue({ OGRN: res.terms_ids.OGRN })
        form.setFieldsValue({ addr_index: res.terms_ids.addr_index })
        setIsLoading(true)
      })
      .catch((e) => openNotification(e, 'topRight'))
    const currentPath = location.pathname
    window.localStorage.setItem('initialRoute', currentPath)
  }, [])
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onFinish = (values: any) => {
    values._id = dataTerm._id
    termAPI
      .updateTerm(values, token)
      .then((res: TTerm) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (res._id) {
          // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
          setShowAlert(true)
          setTimeout(() => setShowAlert(false), 5000)
        } else {
          openNotification(t('something-went-wrong'), 'topRight')
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
        {t('data-user-agreement')}
      </h4>
      {isLoading
        ? (
        <Form
          {...layout}
          onFinish={onFinish}
          validateMessages={validateMessages}
          name='term'
          form={form}
          style={{ paddingTop: '1.5rem' }}
        >
          <Form.Item label={t('legal-address')} name='juryAddress'>
            <Input />
          </Form.Item>
          <Form.Item label={t('physical-address')} name='physicalAddress'>
            <Input />
          </Form.Item>
          <Form.Item label={t('email-address')} name='emailAddress'>
            <Input />
          </Form.Item>
          <Form.Item label={t('contact-phone-number')} name='phoneNumber'>
            <Input />
          </Form.Item>
          <Form.Item label={t('abbreviated-name')} name='shortName'>
            <Input />
          </Form.Item>
          <Form.Item label={t('website-address')} name='webSite'>
            <Input />
          </Form.Item>
          <Form.Item label={t('bank-name')} name='bankDetails'>
            <Input />
          </Form.Item>
          <Form.Item label={t('legal-name')} name='juryName'>
            <Input />
          </Form.Item>
          <Form.Item label={t('INN')} name='INN'>
            <Input />
          </Form.Item>
          <Form.Item label={t('OGRN')} name='OGRN'>
            <Input />
          </Form.Item>
          <Form.Item label={t('postal-code')} name='addr_index'>
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
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
export default Terms
