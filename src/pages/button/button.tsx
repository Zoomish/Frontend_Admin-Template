import React, { FC, useContext } from 'react'
import * as buttonApi from '../../utils/api/button-api'
import * as restApi from '../../utils/api/rest-api'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import { ECountry, TButton, TRest } from '../../utils/typesFromBackend'
import { Button, Form, Input, Popconfirm, Select, Modal } from 'antd'
import { NotificationContext } from '../../components/notification-provider/notification-provider'

interface IButtonPage {
  token: string
  rest: TRest
  language: ECountry
  t: (arg0: string) => string
}
const ButtonPage: FC<IButtonPage> = ({ token, rest, t, language }) => {
  const { openNotification } = useContext(NotificationContext)
  const pathname = useLocation().pathname
  const match = useRouteMatch(pathname)
  const buttonId = Object.keys(match?.params as string)[0]
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const [isLoading, setIsLoading] = React.useState(false)
  const [oneButton, setOneButton] = React.useState<any>()
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const history = useHistory()
  const [form] = Form.useForm()

  const languageButton: Record<string, string> = {}

  for (const lang of rest ? rest.languages : []) {
    languageButton[lang] = oneButton ? oneButton.title[lang] || '' : ''
  }

  React.useEffect(() => {
    buttonApi
      .getButton(buttonId)
      .then((button: any) => {
        setOneButton(button)

        form.setFieldsValue({ title: button.title[language] })

        form.setFieldsValue({ active: button.active })
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
    const newLanguageButton: any = {}
    newLanguageButton.active = true
    newLanguageButton.title = { ...languageButton }

    newLanguageButton.title[language] = values.title.trim()

    newLanguageButton._id = buttonId

    if (newLanguageButton.title[language] === '') {
      setIsModalVisible(true)
      return
    }

    buttonApi
      .updateButton(newLanguageButton, token)
      .then((res: TButton) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (res._id) {
          history.push(`/${rest.pathRest}/buttons`)
        } else {
          openNotification(t('something-went-wrong'), 'topRight')
        }
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  const confirm = (): void => {
    restApi
      .getRest(rest._id)
      .then((res: TRest) => {
        const arrayButtons: TButton[] = []
        res.buttons_ids.forEach((element) => {
          if (element._id !== buttonId) {
            arrayButtons.push(element)
          }
          restApi
            .updateRest({ ...res, buttons_ids: arrayButtons }, token)
            .then((res) => {
              // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
              if (res._id) {
                buttonApi
                  .deleteButton(buttonId, token)
                  .then((res) => history.push(`/${rest.pathRest}/buttons`))
                  .catch((e) => openNotification(e, 'topRight'))
              } else {
                openNotification(t('something-went-wrong'), 'topRight')
              }
            })
            .catch((e) => openNotification(e, 'topRight'))
        })
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
        {t('edit-button')}
      </h4>
      {isLoading && (
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
            <Input data-test-id='button-update-input' />
          </Form.Item>
          <Form.Item label={t('condition')} name='active'>
            <Select data-test-id='button-update-select'>
              <Select.Option value={true} key={'Активно'}>
                {t('active')}
              </Select.Option>
              <Select.Option
                value={false}
                key={'Не активно'}
                data-test-id='button-update-checkbox-false'
              >
                {t('inactive')}
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
            <Button
              type='primary'
              htmlType='submit'
              data-test-id='button-update-button'
            >
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
              <Button htmlType='button' data-test-id='button-delete-button'>
                {t('delete')}
              </Button>
            </Popconfirm>
          </Form.Item>
        </Form>
      )}
    </>
  )
}
export default ButtonPage
