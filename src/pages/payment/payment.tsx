import React, { FC, useContext } from 'react'
import * as restApi from '../../utils/api/rest-api'
import * as paymentApi from '../../utils/api/payment-api'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import { ECountry, TPayment, TRest } from '../../utils/typesFromBackend'
import {
  Button,
  Checkbox,
  Form,
  Input,
  Popconfirm,
  Select,
  Alert,
  Modal
} from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { NotificationContext } from '../../components/notification-provider/notification-provider'

interface IPayment {
  token: string
  rest: TRest
  t: (arg0: string) => string
  language: ECountry
}

const { Option } = Select

const Payment: FC<IPayment> = ({ token, rest, t, language }) => {
  const { openNotification } = useContext(NotificationContext)
  const pathname = useLocation().pathname
  const match = useRouteMatch(pathname)
  const paymentId = Object.keys(match?.params as string)[0]
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const [restData, setRestData] = React.useState<TRest>({} as TRest)
  const [isLoading, setIsLoading] = React.useState(false)
  const [onePayment, setOnePayment] = React.useState<any>()
  const [selectedOption, setSelectedOption] = React.useState<
    string | undefined
  >(undefined)
  const [alert, setAlert] = React.useState(false)
  const [paymentTypes, setPaymentTypes] = React.useState<string[]>([])
  const history = useHistory()
  const [form] = Form.useForm()
  const [isOnlinePayment, setIsOnlinePayment] = React.useState(false)
  const [isModalVisible, setIsModalVisible] = React.useState(false)

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onChangeIsOnlinePayment = (e: CheckboxChangeEvent) => {
    if (!e.target.checked) {
      setSelectedOption(undefined)
    }
    setIsOnlinePayment(!isOnlinePayment)
  }

  const languagePayment: Record<string, string> = {}

  for (const lang of rest ? rest.languages : []) {
    languagePayment[lang] = onePayment ? onePayment.title[lang] || '' : ''
  }

  React.useEffect(() => {
    Promise.all([restApi.getRest(rest._id), paymentApi.getPayment(paymentId)])
      .then(([rest, payment]: [TRest, any]) => {
        setOnePayment(payment)
        setPaymentTypes(rest.paymentTypes)
        setRestData(rest)
        form.setFieldsValue({ title: payment.title[language] })
        form.setFieldsValue({ paymentPublicID: payment.paymentPublicID })
        form.setFieldsValue({ active: payment.active })
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (payment.paymentPublicID) {
          setIsOnlinePayment(true)
        }

        setIsLoading(true)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }, [language])

  React.useEffect(() => {
    if (onePayment) {
      setSelectedOption(onePayment.onlineNamePayment)
    }
  }, [onePayment])

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 }
  }

  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: '${label} ' + `${t('it-is-necessary-to-fill-in')}!`
  }

  const handleSelectChange = (value: any): void => {
    // Обновляем выбранный элемент
    setSelectedOption(value)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onFinish = (values: any) => {
    const newLanguagePayment: any = { ...values }
    newLanguagePayment._id = paymentId
    newLanguagePayment.title = { ...languagePayment }
    newLanguagePayment.title[language] = values.title.trim()

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
      .updatePayment(newLanguagePayment, token)
      .then((res: TPayment) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (res._id) {
          const result: TPayment[] = []
          restData.payments_ids.forEach((pay) => {
            if (pay._id === res._id) {
              result.push(res)
            } else {
              result.push(pay)
            }
          })
          restApi
            .updateRest({ ...restData, payments_ids: result }, token)
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

  function confirm(): void {
    paymentApi
      .deletePayment(paymentId, token)
      .then((res) => history.push(`/${rest.pathRest}/payments`))
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
        {t('edit-payment-method')}
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
            <Input data-test-id='payment-update-input-title'/>
          </Form.Item>
          <Form.Item label={t('condition')} name='active'>
            <Select data-test-id='payment-update-select'>
              <Select.Option value={true} key={'Активно'}>
                {t('active')}
              </Select.Option>
              <Select.Option value={false} key={'Не активно'} data-test-id='payment-update-checkbox-false'>
                {t('inactive')}
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label={t('it-online-payment')} name='isOnline'>
            <Checkbox
              onChange={onChangeIsOnlinePayment}
              checked={isOnlinePayment}
            ></Checkbox>
            {isOnlinePayment && paymentTypes ? (
              <Select
                placeholder={t('choosing-a-payment-method')}
                onChange={handleSelectChange}
                value={selectedOption}
                defaultValue={selectedOption}
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
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
            <Button type='primary' htmlType='submit' data-test-id='payment-update-button'>
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
              <Button htmlType='button' data-test-id='payment-delete-button'>{t('delete')}</Button>
            </Popconfirm>
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
export default Payment
