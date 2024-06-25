import { Button, Checkbox, Form, Input, Select, Alert, Modal } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import * as restApi from '../../utils/api/rest-api'
import * as paymentApi from '../../utils/api/payment-api'
import { ECountry, TPayment, TRest } from '../../utils/typesFromBackend'
import { NotificationContext } from '../../components/notification-provider/notification-provider'

interface IAddPayment {
  token: string
  rest: TRest
  t: (arg0: string) => string
  selectedLanguages: string[]
  language: ECountry
}

const { Option } = Select

const AddPayment: FC<IAddPayment> = ({
  token,
  rest,
  t,
  selectedLanguages,
  language
}) => {
  const { openNotification } = useContext(NotificationContext)
  const history = useHistory()
  const [isOnlinePayment, setIsOnlinePayment] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const [restData, setRestData] = React.useState<TRest>({} as TRest)
  const [selectedOption, setSelectedOption] = React.useState<
    string | undefined
  >(undefined)
  const [alert, setAlert] = React.useState(false)
  const [paymentTypes, setPaymentTypes] = React.useState<string[]>([])
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const [form] = Form.useForm()

  const languagePayment = {}

  React.useEffect(() => {
    restApi
      .getRest(rest._id)
      .then((res: TRest) => {
        setPaymentTypes(res.paymentTypes)
        setRestData(res)
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
  const onChangeIsOnlinePayment = (e: CheckboxChangeEvent) => {
    if (!e.target.checked) {
      setSelectedOption(undefined)
    }
    setIsOnlinePayment(e.target.checked)
  }

  const handleSelectChange = (value: any): void => {
    // Обновляем выбранный элемент
    setSelectedOption(value)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onFinish = (values: any) => {
    const newLanguagePayment: any = { ...values }
    newLanguagePayment.title = { ...languagePayment }
    newLanguagePayment.active = true
    for (const lang of selectedLanguages) {
      newLanguagePayment.title[lang] = values.title.trim()
    }

    if (isOnlinePayment && selectedOption) {
      newLanguagePayment.onlineNamePayment = selectedOption
      if (restData.paymentPublicID) {
        newLanguagePayment.paymentPublicID = values.paymentPublicID
      } else {
        openNotification(t('first-set-up-online-payment'), 'topRight')
        return
      }
    } else {
      newLanguagePayment.paymentPublicID = null
    }

    if (isOnlinePayment && !selectedOption) {
      return setAlert(true)
    }

    if (newLanguagePayment.title[language] === '') {
      setIsModalVisible(true)
      return
    }

    paymentApi
      .createPayment(newLanguagePayment, token)
      .then((res: TPayment) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (res._id) {
          restApi
            .updateRest(
              { ...restData, payments_ids: [...restData.payments_ids, res] },
              token
            )
            .then((rest) => {
              // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
              if (rest._id) {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                history.push(`/${rest.pathRest}/payments`)
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
        {t('add-payment-method')}
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
            <Input data-test-id='payment-create-input-title'/>
          </Form.Item>
          <Form.Item label={t('it-online-payment')}>
            <Checkbox
              onChange={onChangeIsOnlinePayment}
              checked={isOnlinePayment}
            ></Checkbox>
            {isOnlinePayment && paymentTypes ? (
              <Select
                placeholder={t('choosing-a-payment-method')}
                onChange={handleSelectChange}
                value={selectedOption}
              >
                {paymentTypes.map((option) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            ) : (
              ''
            )}
          </Form.Item>
          {isOnlinePayment ? (
            <Form.Item
              label='paymentPublicID'
              rules={[{ required: true }]}
              name='paymentPublicID'
            >
              <Input />
            </Form.Item>
          ) : (
            ''
          )}
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type='primary' htmlType='submit' data-test-id="payment-create-button">
              {t('save')}
            </Button>
          </Form.Item>
        </Form>
      ) : (
        ''
      )}
      {alert && (
        <Alert
          message={t('add-payment-alert-warning')}
          type='warning'
          showIcon
        />
      )}
    </>
  )
}
export default AddPayment
