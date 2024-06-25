import { Button, Form, Input } from 'antd'
import React, { FC, useContext } from 'react'
import * as qrCodeApi from '../../utils/api/qr-code-api'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import { TRest } from '../../utils/typesFromBackend'
import { useLocation } from 'react-router'

interface IQrCode {
  token: string
  rest: TRest
  t: (arg0: string) => string
}

const QrCode: FC<IQrCode> = ({ token, rest, t }) => {
  const { openNotification } = useContext(NotificationContext)
  const [form] = Form.useForm()
  const [code, setCode] = React.useState<any>()
  const [loading, setLoading] = React.useState(false)
  const [numberData, setNumberData] = React.useState(0)
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
    const currentPath = location.pathname
    window.localStorage.setItem('initialRoute', currentPath)
  }, [])

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onFinish = (values: any) => {
    const domainName = window.location.host
    values.qr_color = '#000000'
    values.bg_color = '#21a9cf'
    values.text_color = '#ffffff'
    values.header_color = '#ffffff'
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (values.numberTable) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      values.data = `https://${domainName}/?numberTable=${values.numberTable}`
    } else {
      values.data = `https://${domainName}/`
    }
    qrCodeApi
      .createQrCode(values, token)
      .then((res: any) => {
        setLoading(true)
        setCode(res.data)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  function handleChange (e: React.ChangeEvent<HTMLInputElement>): void {
    const sort = e.target.value
    if (sort === '' || sort.match(/^\d{1,}$/) != null) {
      form.setFieldsValue({ numberTable: sort })
      setNumberData(Number(sort))
    } else {
      form.setFieldsValue({ numberTable: numberData })
    }
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
        {t('creating-qr-code')}
      </h4>
      <Form
        {...layout}
        onFinish={onFinish}
        validateMessages={validateMessages}
        name='qr-code'
        form={form}
        style={{ paddingTop: '1.5rem' }}
      >
        <Form.Item label={t('title-top-code')} name='header_text'>
          <Input placeholder={t('menu')} />
        </Form.Item>
        <Form.Item label={t('title-bottom-code')} name='footer_text'>
          <Input placeholder={t('table-22')} />
        </Form.Item>
        <Form.Item label={t('table-room-number')} name='numberTable'>
          <Input placeholder='22' onChange={handleChange} />
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type='primary' htmlType='submit'>
            {t('create-qr-code')}
          </Button>
        </Form.Item>
      </Form>
      {loading ? <img src={code} /> : ''}
    </>
  )
}
export default QrCode
