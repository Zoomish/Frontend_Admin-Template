import { Button, Form, Input, Select, Modal } from 'antd'
import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import * as orderStatusApi from '../../utils/api/order-status-api'
import * as restApi from '../../utils/api/rest-api'
import { ECountry, TOrderStatus, TRest } from '../../utils/typesFromBackend'
import { NotificationContext } from '../../components/notification-provider/notification-provider'

interface IAddOrderStatus {
  token: string
  rest: TRest
  t: (arg0: string) => string
  selectedLanguages: string[]
  language: ECountry
}

const AddOrderStatus: FC<IAddOrderStatus> = ({
  token,
  rest,
  t,
  selectedLanguages,
  language
}) => {
  const { openNotification } = useContext(NotificationContext)

  const history = useHistory()
  const [form] = Form.useForm()
  const [isLoading, setIsLoading] = React.useState(false)
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const [restData, setRestData] = React.useState<TRest>({} as TRest)
  const [isModalVisible, setIsModalVisible] = React.useState(false)

  const languageOrderStatus = {}

  React.useEffect(() => {
    restApi
      .getRest(rest._id)
      .then((res: TRest) => {
        setRestData(res)
        form.setFieldsValue({ isEndedStatus: false })
        setIsLoading(true)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }, [])

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
    newLanguageOrderStatus.title = { ...languageOrderStatus }
    for (const lang of selectedLanguages) {
      newLanguageOrderStatus.title[lang] = values.title.trim()
    }

    newLanguageOrderStatus.active = true

    if (newLanguageOrderStatus.title[language] === '') {
      setIsModalVisible(true)
      return
    }

    orderStatusApi
      .createOrderStatus(newLanguageOrderStatus, token)
      .then((res: TOrderStatus) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (res._id) {
          restApi
            .updateRest(
              {
                ...restData,
                orderStatus_ids: [...restData.orderStatus_ids, res]
              },
              token
            )
            .then((rest) => {
              // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
              if (rest._id) {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                history.push(`/${rest.pathRest}/order-statuses`)
              } else {
                openNotification(t('something-went-wrong'), 'topRight')
              }
            })
            .catch((e) => openNotification(e, 'topRight'))
        }
      })
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
        {t('add-order-status')}
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
            <Input data-test-id='order-status-create-input-title'/>
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
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type='primary' htmlType='submit' data-test-id='order-status-create-button'>
              {t('save')}
            </Button>
          </Form.Item>
        </Form>
      ) : (
        ''
      )}
    </>
  )
}
export default AddOrderStatus
