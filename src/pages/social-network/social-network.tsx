/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import {
  Button,
  Checkbox,
  Form,
  Input,
  Select,
  Popconfirm,
  message,
  UploadProps
} from 'antd'
import ImgCrop from 'antd-img-crop'
import { PlusOutlined } from '@ant-design/icons'
import Upload, { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import React, { FC, useContext } from 'react'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import * as restApi from '../../utils/api/rest-api'
import { TRest, TSocialNetworks } from '../../utils/typesFromBackend'
import * as socialNetwoksApi from '../../utils/api/social-networks-api'
import * as imageAPI from '../../utils/api/image-api'
import { BASE_URL_CDN } from '../../utils/const'

interface ISocialNetwork {
  token: string
  rest: TRest
  t: (arg0: string) => string
  language: string
}

interface IFileList {
  url: string
  name: string
  uid: string
}

const { Option } = Select

const SocialNetWork: FC<ISocialNetwork> = ({ token, rest, t }) => {
  const { openNotification } = useContext(NotificationContext)
  const [checked, setChecked] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [isChangeImage, setIsChangeImage] = React.useState(false)
  const [fileList, setFileList] = React.useState<IFileList[]>([])
  const [selectedOption, setSelectedOption] = React.useState<string[]>([])
  const pathname = useLocation().pathname
  const match = useRouteMatch(pathname)
  const socailId = Object.keys(match?.params as string)[0]
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const [restData, setRestData] = React.useState<TRest>({} as TRest)
  const [isLoading, setIsLoading] = React.useState(false)
  /* const [alert, setAlert] = React.useState(false) */
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
    Promise.all([
      restApi.getRest(rest._id),
      socialNetwoksApi.getSocialNetwork(socailId)
    ])
      .then(([rest, social]: [TRest, any]) => {
        setRestData(rest)
        setChecked(social.active)
        setSelectedOption(social.title)
        form.setFieldsValue({ link: social.link })
        /* form.setFieldsValue({ active: social.active }) */
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (social.image) {
          if (social.image.length > 0) {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            setFileList([
              {
                url: `${BASE_URL_CDN}/${social.image}`,
                name: social.title,
                uid: '0'
              }
            ])
            setLoading(true)
          }
        }
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

  const onChangeCheckBox = (e: CheckboxChangeEvent): void => {
    setChecked(!checked)
  }

  const handleSelectChange = (value: any): void => {
    setSelectedOption(value)
  }

  const getBase64 = (img: RcFile, callback: (url: string) => void): void => {
    const reader = new FileReader()
    // eslint-disable-next-line n/no-callback-literal
    reader.addEventListener('load', () => callback(reader.result as string))
    reader.readAsDataURL(img)
  }

  const beforeUpload = (file: RcFile): boolean => {
    const isJpgOrPngOrWebp =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/webp'
    if (!isJpgOrPngOrWebp) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      message.error(t('you-can-upload-file'))
    }
    const isLt4M = file.size / 1024 / 1024 < 4
    if (!isLt4M) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      message.error(t('image-must-be-less'))
    }
    return isJpgOrPngOrWebp && isLt4M
  }

  const handleChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === 'removed') {
      setLoading(false)
      setFileList([])
      setIsChangeImage(true)
      form.setFieldsValue({ image: null })
    } else {
      setLoading(true)
    }
    getBase64(info.file.originFileObj as RcFile, (url) => {
      const result = [{ url, name: rest._id, uid: '0' }]
      setFileList([...result])
      setIsChangeImage(true)
      form.setFieldsValue({ image: info.file.originFileObj })
    })
  }

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj as RcFile)
        reader.onload = () => resolve(reader.result as string)
      })
    }
    const image = new Image()
    image.src = src
    const imgWindow = window.open(src)
    imgWindow?.document.write(image.outerHTML)
  }

  const onFinish = (values: any) => {
    values.title = selectedOption
    checked ? (values.active = true) : (values.active = false)
    values._id = socailId
    if (isChangeImage && fileList.length !== 0) {
      const formData = new FormData()
      formData.append('image', values.image)
      imageAPI
        .createImage(formData, token)
        .then((res) => {
          values.image = res.file_name
          socialNetwoksApi
            .updateSocial(values, token)
            .then((res: TSocialNetworks) => {
              // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
              if (res._id) {
                const result: TSocialNetworks[] = []
                restData.social_ids.forEach((social) => {
                  if (social._id === res._id) {
                    result.push(res)
                  } else {
                    result.push(social)
                  }
                })
                restApi
                  .updateRest({ ...restData, social_ids: result }, token)
                  .then((rest) => {
                    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
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
        })
        .catch((e) => openNotification(e, 'topRight'))
    } else {
      socialNetwoksApi
        .updateSocial(values, token)
        .then((res: TSocialNetworks) => {
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          if (res._id) {
            const result: TSocialNetworks[] = []
            restData.social_ids.forEach((social) => {
              if (social._id === res._id) {
                result.push(res)
              } else {
                result.push(social)
              }
            })
            restApi
              .updateRest({ ...restData, social_ids: result }, token)
              .then((rest) => {
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
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
  }

  const confirm = () => {
    socialNetwoksApi
      .deleteSocialNetwork(socailId, token)
      .then((res) => history.push(`/${rest.pathRest}/social-networks`))
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
        {t('editing-social-network')}
      </h4>
      {isLoading
        ? (
        <Form
          {...layout}
          onFinish={onFinish}
          validateMessages={validateMessages}
          name='payment'
          form={form}
          style={{ paddingTop: '1.5rem' }}
        >
          <Form.Item label={t('name')}>
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
          <Form.Item
            label={t('image')}
            valuePropName='fileList'
            name='image'
            getValueFromEvent={({ file }) => file.originFileObj}
          >
            <ImgCrop rotate>
              <Upload
                action='/upload.do'
                listType='picture-card'
                onChange={handleChange}
                fileList={fileList}
                beforeUpload={beforeUpload}
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onPreview={onPreview}
              >
                {loading
                  ? (
                      ''
                    )
                  : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>{t('download')}</div>
                  </div>
                    )}
              </Upload>
            </ImgCrop>
          </Form.Item>
          <Form.Item label={t('link')} rules={[{ required: true }]} name='link'>
            <Input />
          </Form.Item>
          <Form.Item label={t('activity')} name='active'>
            <Checkbox onChange={onChangeCheckBox} checked={checked}></Checkbox>
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
            <Button type='primary' htmlType='submit'>
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
              <Button htmlType='button'>{t('delete')}</Button>
            </Popconfirm>
          </Form.Item>
        </Form>
          )
        : (
            ''
          )}
    </>
  )
}

export default SocialNetWork
