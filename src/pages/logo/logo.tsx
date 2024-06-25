import { Button, Form, message, UploadProps, Alert } from 'antd'
import ImgCrop from 'antd-img-crop'
import Upload, { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload'
import { useLocation } from 'react-router'
import React, { FC, useContext } from 'react'
import * as imageAPI from '../../utils/api/image-api'
import * as restApi from '../../utils/api/rest-api'
import { PlusOutlined } from '@ant-design/icons'
import { TRest } from '../../utils/typesFromBackend'
import { BASE_URL_CDN } from '../../utils/const'
import { NotificationContext } from '../../components/notification-provider/notification-provider'

interface ILogo {
  token: string
  rest: TRest
  t: (arg0: string) => string
}

interface IFileList {
  url: string
  name: string
  uid: string
}

const Logo: FC<ILogo> = ({ token, rest, t }) => {
  const { openNotification } = useContext(NotificationContext)
  const [loading, setLoading] = React.useState(false)
  const [isLoadingRest, setIsLoadingRest] = React.useState(false)
  const [fileList, setFileList] = React.useState<IFileList[]>([])
  const [isChangeImageSale, setIsChangeImageSale] = React.useState(false)
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const [restData, setRestData] = React.useState<TRest>({} as TRest)
  const [showAlert, setShowAlert] = React.useState(false)
  const [form] = Form.useForm()
  const location = useLocation()

  React.useEffect(() => {
    restApi
      .getRest(rest._id)
      .then((res: TRest) => {
        setRestData(res)
        if (res.logoPath !== null) {
          if (res.logoPath.length > 0) {
            setFileList([
              {
                url: `${BASE_URL_CDN}/${res.logoPath}`,
                name: res.logoPath,
                uid: '0'
              }
            ])
            setLoading(true)
          }
        }
        setIsLoadingRest(true)
      })
      .catch((e) => openNotification(e, 'topRight'))
    const currentPath = location.pathname
    window.localStorage.setItem('initialRoute', currentPath)
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
  const getBase64 = (img: RcFile, callback: (url: string) => void) => {
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
      setIsChangeImageSale(true)
      form.setFieldsValue({ image: null })
    } else {
      setLoading(true)
    }
    getBase64(info.file.originFileObj as RcFile, (url) => {
      const result = [{ url, name: rest._id, uid: '0' }]
      setFileList([...result])
      setIsChangeImageSale(true)
      form.setFieldsValue({ image: info.file.originFileObj })
    })
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onFinish = (values: any) => {
    values._id = rest._id
    if (isChangeImageSale) {
      if (values.image === null) {
        restApi
          .updateRest({ ...restData, logoPath: '' }, token)
          .then((res: TRest) => {
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            if (res._id) {
              // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
              setShowAlert(true)
              setTimeout(() => setShowAlert(false), 5000)
            } else {
              openNotification(t('something-went-wrong'), 'topRight')
            }
          })
          .catch((e) => openNotification(e, 'topRight'))
      } else {
        const formData = new FormData()
        formData.append('image', values.image)
        imageAPI
          .createImage(formData, token)
          .then((res) => {
            restApi
              .updateRest({ ...restData, logoPath: res.file_name }, token)
              .then((res: TRest) => {
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                if (res._id) {
                  // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
                  setShowAlert(true)
                  setTimeout(() => setShowAlert(false), 5000)
                } else {
                  openNotification(t('something-went-wrong'), 'topRight')
                }
              })
              .catch((e) => openNotification(e, 'topRight'))
          })
          .catch((e) => openNotification(e, 'topRight'))
      }
    } else {
      openNotification(t('you-not-change-logo'), 'topRight')
    }
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
        {t('edit-logo')}
      </h4>
      {isLoadingRest
        ? (
        <Form
          {...layout}
          onFinish={onFinish}
          validateMessages={validateMessages}
          name='category'
          form={form}
          style={{ paddingTop: '1.5rem' }}
        >
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
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
            <Button type='primary' htmlType='submit'>
              {t('save')}
            </Button>
          </Form.Item>
        </Form>
          )
        : (
            ''
          )}
      {showAlert
        ? (
        <Alert type='success' message='Изменения успешно применены!' />
          )
        : (
            ''
          )}
    </>
  )
}
export default Logo
