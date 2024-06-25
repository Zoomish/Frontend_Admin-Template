import React, { FC, useContext } from 'react'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import { Alert, Button, Checkbox, Form, Select, Spin } from 'antd'
import { useHistory } from 'react-router-dom'
import * as iikoApi from '../../utils/api/iiko-api'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { IOrganization } from '../iiko/iiko'

interface IIikoIntegrationStepTwo {
  token: string
  t: (arg0: string) => string
  language: string
  organizations: IOrganization[]
}

const IikoIntegrationStepTwo: FC<IIikoIntegrationStepTwo> = ({
  token,
  t,
  language,
  organizations
}) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const [checkedIsCourier, setCheckedIsCourier] = React.useState(false)
  const [checkedIsTableSchema, setCheckedIsTableSchema] = React.useState(false)
  const [isRequest, setIsRequest] = React.useState(false)
  const [selectedOption, setSelectedOption] = React.useState('')
  const [showAlert, setShowAlert] = React.useState(false)
  const { openNotification } = useContext(NotificationContext)
  const [form] = Form.useForm()
  const history = useHistory()

  const { Option } = Select

  React.useEffect(() => {
    setSelectedOption(organizations[0].id)
  }, [])

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 }
  }

  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: '${label} ' + `${t('it-is-necessary-to-fill-in')}!`
  }

  const onChangeCheckBoxIsCourier = (e: CheckboxChangeEvent): void => {
    setCheckedIsCourier(!checkedIsCourier)
  }

  const onChangeCheckBoxIsTableSchema = (e: CheckboxChangeEvent): void => {
    setCheckedIsTableSchema(!checkedIsTableSchema)
  }

  const handleSelectChange = (value: any): void => {
    setSelectedOption(value)
  }

  const onFinish = (values: any): void => {
    const findOganization = organizations.find(
      (org) => org.id === selectedOption
    )
    checkedIsCourier ? (values.IsCourier = true) : (values.IsCourier = false)
    checkedIsTableSchema
      ? (values.IsTableSchema = true)
      : (values.IsTableSchema = false)
    setIsRequest(true)
    iikoApi
      .integrationStepTwo(
        findOganization?.name ?? '',
        values.IsCourier,
        values.IsTableSchema,
        token
      )
      .then((res) => {
        setShowAlert(true)
        console.log(res)
      })
      .catch((e) =>
        openNotification('Произошла ошибка при импорте меню', 'topLeft')
      )
      .finally(() => setIsRequest(false))
  }

  return (
    <>
      {isRequest ? (
        <Spin size='large' />
      ) : (
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
            {t('Iiko-step-two')}
          </h4>
          {
            <Form
              {...layout}
              onFinish={onFinish}
              validateMessages={validateMessages}
              name='iiko'
              form={form}
              style={{ paddingTop: '1.5rem' }}
            >
              <Form.Item label={t('OrganizationName')}>
                <Select
                  onChange={handleSelectChange}
                  value={selectedOption}
                  defaultValue={selectedOption}
                >
                  {organizations.map((option) => (
                    <Option key={option.id} value={option.id}>
                      {option.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label={t('IsCourier')} name='IsCourier'>
                <Checkbox
                  onChange={onChangeCheckBoxIsCourier}
                  checked={checkedIsCourier}
                ></Checkbox>
              </Form.Item>
              <Form.Item label={t('IsTableSchema')} name='IsTableSchema'>
                <Checkbox
                  onChange={onChangeCheckBoxIsTableSchema}
                  checked={checkedIsTableSchema}
                ></Checkbox>
              </Form.Item>
              <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                <Button type='primary' htmlType='submit'>
                  {t('save')}
                </Button>
              </Form.Item>
            </Form>
          }
          {showAlert ? (
            <Alert type='success' message='Меню успешно импортировалось!' />
          ) : (
            ''
          )}
          {showAlert ? (
            <Button onClick={() => history.push('/iiko-terminal')}>
              Настроить терминал
            </Button>
          ) : (
            ''
          )}
        </>
      )}
    </>
  )
}

export default IikoIntegrationStepTwo
