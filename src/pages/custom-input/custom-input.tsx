import React, { FC, useContext } from 'react'
import * as customInputApi from '../../utils/api/custom-input-api'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import { TCustomInput, TRest } from '../../utils/typesFromBackend'
import { Button, Checkbox, Form, Input, Popconfirm, Modal } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { NotificationContext } from '../../components/notification-provider/notification-provider'

interface ICustomInput {
  token: string
  rest: TRest
  t: (arg0: string) => string
  language: string
}

const CustomInput: FC<ICustomInput> = ({ token, rest, t, language }) => {
  const { openNotification } = useContext(NotificationContext)
  const pathname = useLocation().pathname
  const match = useRouteMatch(pathname)
  const customInputId = Object.keys(match?.params as string)[0]
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const [isLoading, setIsLoading] = React.useState(false)
  const [oneCustomInput, setOneCustomInput] = React.useState<any>()
  const history = useHistory()
  const [form] = Form.useForm()
  const [checked, setChecked] = React.useState(false)
  const [isModalVisible, setIsModalVisible] = React.useState(false)

  const languageCustomInputLabel: Record<string, string> = {}
  const languageCustomInputPlaceholder: Record<string, string> = {}

  for (const lang of rest ? rest.languages : []) {
    languageCustomInputLabel[lang] = oneCustomInput
      ? oneCustomInput.label[lang] || ''
      : ''
    languageCustomInputPlaceholder[lang] = oneCustomInput
      ? oneCustomInput.placeholder[lang] || ''
      : ''
  }

  React.useEffect(() => {
    customInputApi
      .getCustomInput(customInputId)
      .then((customInput: any) => {
        setOneCustomInput(customInput)
        form.setFieldsValue({ name: customInput.name })
        form.setFieldsValue({ label: customInput.label[language] })
        form.setFieldsValue({ placeholder: customInput.placeholder[language] })
        form.setFieldsValue({ required: customInput.required })
        setChecked(customInput.required)
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
    const newLanguageOrderType: any = { ...values }
    newLanguageOrderType.label = { ...languageCustomInputLabel }
    newLanguageOrderType.placeholder = { ...languageCustomInputPlaceholder }
    newLanguageOrderType.placeholder[language] = values.placeholder.trim()
    newLanguageOrderType.label[language] = values.label.trim()
    newLanguageOrderType._id = customInputId
    newLanguageOrderType.required = checked

    if (newLanguageOrderType.label[language] === '') {
      setIsModalVisible(true)
      return
    }

    if (newLanguageOrderType.placeholder[language] === '') {
      setIsModalVisible(true)
      return
    }

    customInputApi
      .updateCustomInput(newLanguageOrderType, token)
      .then((res: TCustomInput) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (res._id) {
          history.push(`/${rest.pathRest}/custom-inputs`)
        } else {
          openNotification(t('something-went-wrong'), 'topRight')
        }
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  function confirm(): void {
    customInputApi
      .deleteCustomInput(customInputId, token)
      .then((res) => history.push(`/${rest.pathRest}/custom-inputs`))
      .catch((e) => openNotification(e, 'topRight'))
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onChangeCheckBox = (e: CheckboxChangeEvent) => {
    setChecked(!checked)
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
        {t('edit-custom-input')}
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
            label={t('name-field')}
            rules={[{ required: true }]}
            name='name'
          >
            <Input data-test-id='custom-inputs-update-input-title'/>
          </Form.Item>
          <Form.Item
            label={t('placeholder')}
            rules={[{ required: true }]}
            name='placeholder'
          >
            <Input data-test-id='custom-inputs-update-input-label'/>
          </Form.Item>
          <Form.Item
            label={t('label')}
            rules={[{ required: true }]}
            name='label'
          >
            <Input data-test-id='custom-inputs-update-input-placeholder'/>
          </Form.Item>
          <Form.Item label={t('it-required')} name='required'>
            <Checkbox onChange={onChangeCheckBox} checked={checked} data-test-id="custom-inputs-update-checkbox"></Checkbox>
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
            <Button type='primary' htmlType='submit' data-test-id='custom-inputs-update-button'>
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
              <Button htmlType='button' data-test-id='custom-inputs-delete-button'>{t('delete')}</Button>
            </Popconfirm>
          </Form.Item>
        </Form>
      ) : (
        ''
      )}
    </>
  )
}
export default CustomInput
