import { Button, Form, Input, Select, Modal } from 'antd'
import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import * as orderTypeApi from '../../utils/api/order-type-api'
import * as restApi from '../../utils/api/rest-api'
import { ECountry, TOrderType, TRest } from '../../utils/typesFromBackend'
import { NotificationContext } from '../../components/notification-provider/notification-provider'

interface IAddOrderType {
  token: string
  rest: TRest
  t: (arg0: string) => string
  selectedLanguages: string[]
  language: ECountry
}

const AddOrderType: FC<IAddOrderType> = ({
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

  const languageOrderType = {}

  React.useEffect(() => {
    restApi
      .getRest(rest._id)
      .then((res: TRest) => {
        setRestData(res)
        form.setFieldsValue({ isDelivery: false })
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
    const newLanguageOrderType: any = { ...values }
    newLanguageOrderType.title = { ...languageOrderType }
    for (const lang of selectedLanguages) {
      newLanguageOrderType.title[lang] = values.title.trim()
    }

    newLanguageOrderType.active = true

    if (newLanguageOrderType.title[language] === '') {
      setIsModalVisible(true)
      return
    }

    orderTypeApi
      .createOrderType(newLanguageOrderType, token)
      .then((res: TOrderType) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (res._id) {
          restApi
            .updateRest(
              { ...restData, orderType_ids: [...restData.orderType_ids, res] },
              token
            )
            .then((rest) => {
              // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
              if (rest._id) {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                history.push(`/${rest.pathRest}/order-types`)
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
        {t('add-order-type')}
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
            <Input data-test-id='order-types-create-input-title'/>
          </Form.Item>
          <Form.Item label={t('isDelivery')} name='isDelivery'>
            <Select>
              <Select.Option value={true} key={'Активно'}>
                {t('yes')}
              </Select.Option>
              <Select.Option value={false} key={'Не активно'}>
                {t('no')}
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type='primary' htmlType='submit' data-test-id='order-types-create-button'>
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
export default AddOrderType
