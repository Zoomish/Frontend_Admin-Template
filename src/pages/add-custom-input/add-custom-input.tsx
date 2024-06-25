import { Button, Checkbox, Form, Input, Modal } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import * as customInputApi from '../../utils/api/custom-input-api'
import * as restApi from '../../utils/api/rest-api'
import { ECountry, TCustomInput, TRest } from '../../utils/typesFromBackend'
import { NotificationContext } from '../../components/notification-provider/notification-provider'

interface IAddCustomInput {
  token: string
  rest: TRest
  t: (arg0: string) => string
  selectedLanguages: string[]
  language: ECountry
}

const AddCustomInput: FC<IAddCustomInput> = ({
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
  const [checked, setChecked] = React.useState(false)
  const [isModalVisible, setIsModalVisible] = React.useState(false)

  const languageCustomInput = {}

  React.useEffect(() => {
    restApi
      .getRest(rest._id)
      .then((res: TRest) => {
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
  const onChangeCheckBox = (e: CheckboxChangeEvent) => {
    setChecked(!checked)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onFinish = (values: any) => {
    const newLanguageCustomInput: any = { ...values }
    newLanguageCustomInput.label = { ...languageCustomInput }
    newLanguageCustomInput.placeholder = { ...languageCustomInput }
    newLanguageCustomInput.required = checked
    for (const lang of selectedLanguages) {
      newLanguageCustomInput.label[lang] = values.label.trim()
      newLanguageCustomInput.placeholder[lang] = values.placeholder.trim()
    }

    if (newLanguageCustomInput.label[language] === '') {
      setIsModalVisible(true)
      return
    }

    if (newLanguageCustomInput.placeholder[language] === '') {
      setIsModalVisible(true)
      return
    }

    customInputApi
      .createCustomInput(newLanguageCustomInput, token)
      .then((res: TCustomInput) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (res._id) {
          const arrayCustomInputs: TCustomInput[] = []
          if (restData.customInput_ids !== null) {
            restData.customInput_ids?.forEach((input) => {
              arrayCustomInputs.push(input)
            })
          }
          arrayCustomInputs.push(res)
          restApi
            .updateRest(
              { ...restData, customInput_ids: arrayCustomInputs },
              token
            )
            .then((rest) => {
              // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
              if (rest._id) {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                history.push(`/${rest.pathRest}/custom-inputs`)
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
        {t('add-custom-input')}
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
            <Input data-test-id='custom-inputs-create-input-title'/>
          </Form.Item>
          <Form.Item
            label={t('placeholder')}
            rules={[{ required: true }]}
            name='placeholder'
          >
            <Input data-test-id='custom-inputs-create-input-placeholder'/>
          </Form.Item>
          <Form.Item
            label={t('label')}
            rules={[{ required: true }]}
            name='label'
          >
            <Input data-test-id='custom-inputs-create-input-label'/>
          </Form.Item>
          <Form.Item label={t('it-required')} name='required'>
            <Checkbox onChange={onChangeCheckBox} checked={checked}></Checkbox>
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type='primary' htmlType='submit' data-test-id='custom-inputs-create-button'>
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
export default AddCustomInput
