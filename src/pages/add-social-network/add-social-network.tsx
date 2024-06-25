import { Button, Checkbox, Form, Input, Select, Alert } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import * as restApi from '../../utils/api/rest-api'
import * as socialNetwoksApi from '../../utils/api/social-networks-api'
import { TRest, TSocialNetworks } from '../../utils/typesFromBackend'

interface ISocialNetwork {
  token: string
  rest: TRest
  t: (arg0: string) => string
  language: string
}

const { Option } = Select

const AddSocialNetWork: FC<ISocialNetwork> = ({ token, rest, t, language }) => {
  const { openNotification } = useContext(NotificationContext)
  const [checked, setChecked] = React.useState(true)
  const [selectedOption, setSelectedOption] = React.useState<
  string | undefined
  >(undefined)
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const [restData, setRestData] = React.useState<TRest>({} as TRest)
  const [alert, setAlert] = React.useState(false)
  const [form] = Form.useForm()
  const history = useHistory()
  const options = [
    'vk',
    'facebook',
    'youtube',
    'instagram',
    'twitter',
    'tiktok',
    'whatsapp',
    'ok',
    'telegram',
    'discord',
    'viber'
  ]

  React.useEffect(() => {
    restApi
      .getRest(rest._id)
      .then((res: TRest) => {
        setRestData(res)
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

  const handleSelectChange = (value: any): void => {
    setSelectedOption(value)
  }

  const onFinish = (values: any): void => {
    if (!selectedOption) {
      return setAlert(true)
    } else {
      values.title = selectedOption
      checked ? (values.active = true) : (values.active = false)
    }
    socialNetwoksApi
      .createSocialNetwork(values, token)
      .then((res: TSocialNetworks) => {
        if (res._id) {
          restApi
            .updateRest(
              {
                ...restData,
                social_ids: [...restData.social_ids, res]
              },
              token
            )
            .then((rest) => {
              if (rest._id) {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                history.push(`/${rest.pathRest}/social-networks`)
              } else {
                openNotification(t('something-went-wrong'), 'topRight')
              }
            })
            .catch((e) => openNotification(e, 'topRight'))
        }
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  return (
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
        {t('add-social-network')}
      </h4>
      {
        <Form
          {...layout}
          onFinish={onFinish}
          validateMessages={validateMessages}
          name='payment'
          form={form}
          style={{ paddingTop: '1.5rem' }}
        >
          <Form.Item label={t('social-network')}>
            <Select
              placeholder={t('alert-warning-social-network')}
              onChange={handleSelectChange}
              value={selectedOption}
            >
              {options.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label={t('link')} rules={[{ required: true }]} name='link'>
            <Input />
          </Form.Item>
          <Form.Item label={t('activity')} name='active'>
            <Checkbox onChange={onChangeCheckBox} checked={checked}></Checkbox>
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type='primary' htmlType='submit'>
              {t('save')}
            </Button>
          </Form.Item>
        </Form>
      }
      {alert && (
        <Alert
          message={t('alert-warning-social-network')}
          type='warning'
          showIcon
        />
      )}
    </>
  )
}

export default AddSocialNetWork
