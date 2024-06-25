import React, { FC, useContext } from 'react'
import * as orderStatusApi from '../../utils/api/order-status-api'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import { ECountry, TOrderStatus, TRest } from '../../utils/typesFromBackend'
import { Button, Form, Input, Popconfirm, Select, Modal } from 'antd'
import { NotificationContext } from '../../components/notification-provider/notification-provider'

interface IOrderStatus {
  token: string
  rest: TRest
  t: (arg0: string) => string
  language: ECountry
}

const OrderStatus: FC<IOrderStatus> = ({ token, rest, t, language }) => {
  const { openNotification } = useContext(NotificationContext)
  const pathname = useLocation().pathname
  const match = useRouteMatch(pathname)
  const orderStatusId = Object.keys(match?.params as string)[0]
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const [isLoading, setIsLoading] = React.useState(false)
  const [oneOrderStatus, setOneOrderStatus] = React.useState<any>()
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const history = useHistory()
  const [form] = Form.useForm()

  const languageOrderStatus: Record<string, string> = {}

  for (const lang of rest ? rest.languages : []) {
    languageOrderStatus[lang] = oneOrderStatus
      ? oneOrderStatus.title[lang] || ''
      : ''
  }

  React.useEffect(() => {
    orderStatusApi
      .getOrderStatus(orderStatusId)
      .then((orderStatus: any) => {
        setOneOrderStatus(orderStatus)
        form.setFieldsValue({ title: orderStatus.title[language] })
        form.setFieldsValue({ active: orderStatus.active })
        form.setFieldsValue({ isEndedStatus: orderStatus.isEndedStatus })
        setIsLoading(true)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }, [language])

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 }
  }

  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: '${label} ' + `${t('it-is-necessary-to-fill-in')}!`
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onFinish = (values: any) => {
    const newLanguageOrderStatus: any = { ...values }
    newLanguageOrderStatus._id = orderStatusId
    newLanguageOrderStatus.title = { ...languageOrderStatus }
    newLanguageOrderStatus.title[language] = values.title.trim()

    if (newLanguageOrderStatus.title[language] === '') {
      setIsModalVisible(true)
      return
    }

    orderStatusApi
      .updateOrderStatus(newLanguageOrderStatus, token)
      .then((res: TOrderStatus) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (res._id) {
          history.push(`/${rest.pathRest}/order-statuses`)
        } else {
          openNotification(t('something-went-wrong'), 'topRight')
        }
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  function confirm(): void {
    orderStatusApi
      .deleteOrderStatus(orderStatusId, token)
      .then((res) => history.push(`/${rest.pathRest}/order-statuses`))
      .catch((e) => openNotification(e, 'topRight'))
  }

  const handleModalClose = (): void => {
    setIsModalVisible(false)
  }

  return (
    <>
      <Modal
        title={t('alert')}
        open={isModalVisible}
        closable={false}
        footer={[
          <Button key='ok' type='primary' onClick={handleModalClose}>
            {t('close')}
          </Button>
        ]}
      >
        {t('field_must_not_empty')}
      </Modal>
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
        {t('edit-order-status')}
      </h4>
      {isLoading ? (
        <Form
          {...layout}
          onFinish={onFinish}
          validateMessages={validateMessages}
          name='payment'
          form={form}
          style={{ paddingTop: '1.5rem' }}
        >
          <Form.Item
            label={t('name')}
            rules={[{ required: true }]}
            name='title'
          >
            <Input data-test-id='order-status-update-input-title'/>
          </Form.Item>
          <Form.Item label={t('condition')} name='active'>
            <Select data-test-id='order-status-update-select'>
              <Select.Option value={true} key={'Активно'}>
                {t('active')}
              </Select.Option>
              <Select.Option value={false} key={'Не активно'} data-test-id='order-status-update-select-false'>
                {t('inactive')}
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label={t('status-final')} name='isEndedStatus'>
            <Select>
              <Select.Option value={true} key={'Завершающий'}>
                {t('final')}
              </Select.Option>
              <Select.Option value={false} key={'Незавершающий'}>
                {t('not-final')}
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
            <Button type='primary' htmlType='submit' data-test-id='order-status-update-button'>
              {t('save')}
            </Button>
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
            <Popconfirm
              title={t('you-sure-want-delete')}
              onConfirm={confirm}
              okText={t('yes')}
              cancelText={t('no')}
            >
              <Button htmlType='button' data-test-id='order-status-delete-button'>{t('delete')}</Button>
            </Popconfirm>
          </Form.Item>
        </Form>
      ) : (
        ''
      )}
    </>
  )
}
export default OrderStatus
