import React, { FC, useContext } from 'react'
import { TRest } from '../../utils/typesFromBackend'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import { Button, Checkbox, Form, Input } from 'antd'
import * as restApi from '../../utils/api/rest-api'
import * as iikoApi from '../../utils/api/iiko-api'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import IikoIntegrationStepTwo from '../iiko-integration-step-two/iiko-integration-step-two'

export interface IOrganization {
  id: string
  name: string
}

interface IIiko {
  token: string
  rest: TRest
  t: (arg0: string) => string
  language: string
}

const Iiko: FC<IIiko> = ({ token, rest, t, language }) => {
  const [stepOne, setStepOne] = React.useState(true)
  const [organizations, setOrganizations] = React.useState<IOrganization[]>([])
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const [, setRestData] = React.useState<TRest>({} as TRest)
  const [checked, setChecked] = React.useState(false)
  const { openNotification } = useContext(NotificationContext)
  const [form] = Form.useForm()

  React.useEffect(() => {
    restApi
      .getRest(rest._id)
      .then((res: TRest) => {
        setRestData(res)
        setChecked(rest.isIntegrationWithIiko)
        form.setFieldsValue({ NameIiko: rest.NameIiko })
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

  const onChangeCheckBox = (e: CheckboxChangeEvent): void => {
    setChecked(!checked)
  }

  const onFinish = (values: any): void => {
    checked
      ? (values.isIntegrationWithIiko = true)
      : (values.isIntegrationWithIiko = false)
    iikoApi
      .updateIikoDetails(values.NameIiko, values.isIntegrationWithIiko, token)
      .then((res) => {
        setOrganizations(res.organizations)
        setStepOne(false)
      })
      .catch((e) => openNotification(e.message, 'topLeft'))
  }

  return (
    <>
      {stepOne ? (
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
            {t('setting-iiko')}
          </h4>
          <Form
            {...layout}
            onFinish={onFinish}
            validateMessages={validateMessages}
            name='iiko'
            form={form}
            style={{ paddingTop: '1.5rem' }}
          >
            <Form.Item
              label={t('NameIiko')}
              rules={[{ required: true }]}
              name='NameIiko'
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={t('isIntegrationWithIiko')}
              name='isIntegrationWithIiko'
            >
              <Checkbox
                onChange={onChangeCheckBox}
                checked={checked}
              ></Checkbox>
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Button type='primary' htmlType='submit'>
                {t('save')}
              </Button>
            </Form.Item>
          </Form>
        </>
      ) : (
        <IikoIntegrationStepTwo token={token} t={t} language={language} organizations={organizations}/>
      )}
    </>
  )
}

export default Iiko
