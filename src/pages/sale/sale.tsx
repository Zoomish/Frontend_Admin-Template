import {
  Button,
  Form,
  Input,
  Select,
  Upload,
  DatePicker,
  message,
  Popconfirm,
  Modal
} from 'antd'
import ImgCrop from 'antd-img-crop'
import React, { FC, useContext } from 'react'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import * as salesAPI from '../../utils/api/sales-api'
import * as imageAPI from '../../utils/api/image-api'
import { TRest, TSale } from '../../utils/typesFromBackend'
import { PlusOutlined } from '@ant-design/icons'
import type { DatePickerProps } from 'antd'
import 'dayjs/locale/ru'
import locale from 'antd/es/date-picker/locale/ru_RU'
import type { UploadChangeParam } from 'antd/es/upload'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
import { BASE_URL_CDN } from '../../utils/const'
import dayjs from 'dayjs'
import { NotificationContext } from '../../components/notification-provider/notification-provider'

interface IFileList {
  url: string
  name: string
  uid: string
}

interface ISale {
  token: string
  rest: TRest
  t: (arg0: string) => string
  language: string
}

const Sale: FC<ISale> = ({ token, rest, t, language }) => {
  const { openNotification } = useContext(NotificationContext)
  const { TextArea } = Input
  const [title, setTitle] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [isLoadingSale, setIsLoadingSale] = React.useState(false)
  const [fileList, setFileList] = React.useState<IFileList[]>([])
  const [dateStartSales, setDateStartSales] = React.useState('')
  const [dateFinishSales, setDateFinishSales] = React.useState('')
  const [isChangeImageSale, setIsChangeImageSale] = React.useState(false)
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const [saleDataInitial, setSaleDataInitial] = React.useState<TSale>(
    {} as TSale
  )
  const [oneSale, setOneSale] = React.useState<any>()
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const history = useHistory()
  const [form] = Form.useForm()
  const pathname = useLocation().pathname
  const match = useRouteMatch(pathname)
  const saleId = Object.keys(match?.params as string)[0]
  const dateFormat = 'YYYY-MM-DD'

  const languageSale: Record<string, string> = {}

  for (const lang of rest ? rest.languages : []) {
    languageSale[lang] = oneSale ? oneSale.title[lang] || '' : ''
  }

  React.useEffect(() => {
    salesAPI
      .getSale(saleId)
      .then((res: TSale) => {
        setOneSale(res)
        form.setFieldsValue({ title: res.title })
        setTitle(res.title)
        form.setFieldsValue({ action: res.action })
        form.setFieldsValue({ description: res.description })
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (res.image) {
          if (res.image.length > 0) {
            setFileList([
              { url: `${BASE_URL_CDN}/${res.image}`, name: res.title, uid: '0' }
            ])
            setLoading(true)
          }
        }
        setDateFinishSales(res.dateFinishSales)
        setDateStartSales(res.dateStartSales)
        setSaleDataInitial(res)
        setIsLoadingSale(true)
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

  function handleChangeTitle(e: React.ChangeEvent<HTMLInputElement>): void {
    setTitle(e.target.value)
  }

  const onChangeStartDate: DatePickerProps['onChange'] = (date, dateString) => {
    setDateStartSales(dateString)
  }

  const onChangeFinishDate: DatePickerProps['onChange'] = (
    date,
    dateString
  ) => {
    setDateFinishSales(dateString)
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
      form.setFieldsValue({ image: null })
    } else {
      setLoading(true)
    }
    getBase64(info.file.originFileObj as RcFile, (url) => {
      const result = [{ url, name: title, uid: '0' }]
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

  /* const finish = (values: any): void => {
    const newLanguageSale: any = { ...values }
    newLanguageSale._id = saleId
    newLanguageSale.dateStartSales = dateStartSales
    newLanguageSale.dateFinishSales = dateFinishSales
    newLanguageSale.title = { ...languageSale }
    newLanguageSale.description = { ...languageSale }
    newLanguageSale.title[language] = values.title
    newLanguageSale.description[language] = values.description
  } */

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onFinish = (values: any) => {
    if (dateStartSales.length === 0 || dateFinishSales.length === 0) {
      openNotification(t('data-must-fill'), 'topRight')
      return
    }
    values._id = saleId
    values.dateStartSales = dateStartSales
    values.dateFinishSales = dateFinishSales
    if (isChangeImageSale) {
      const formData = new FormData()
      formData.append('image', values.image)
      if (!values.image) {
        setIsModalVisible(true)
        return
      }
      imageAPI
        .createImage(formData, token)
        .then((res) => {
          values.image = res.file_name
          salesAPI
            .updateSale(values, token)
            .then((res: TSale) => {
              // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
              if (res._id) {
                // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
                history.push(`/${rest.pathRest}/sales`)
              }
            })
            .catch((e) => openNotification(e, 'topRight'))
        })
        .catch((e) => openNotification(e, 'topRight'))
    } else {
      values.image = saleDataInitial.image
      salesAPI
        .updateSale(values, token)
        .then((res: TSale) => {
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          if (res._id) {
            // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
            history.push(`/${rest.pathRest}/sales`)
          }
        })
        .catch((e) => openNotification(e, 'topRight'))
    }
  }

  function confirm(): void {
    salesAPI
      .deleteSale(saleId, token)
      .then((res) => history.push(`/${rest.pathRest}/sales`))
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
        {t('stock-picture')}
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
        {t('edit-sale')}
      </h4>
      {isLoadingSale ? (
        <Form
          {...layout}
          onFinish={onFinish}
          validateMessages={validateMessages}
          name='category'
          form={form}
          style={{ paddingTop: '1.5rem' }}
        >
          <Form.Item
            label={t('name')}
            rules={[{ required: true }]}
            name='title'
          >
            <Input onChange={handleChangeTitle} />
          </Form.Item>
          <Form.Item label={t('description-promotion')} name='description'>
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            label={t('image-promotion')}
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
                {loading ? (
                  ''
                ) : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>{t('download')}</div>
                  </div>
                )}
              </Upload>
            </ImgCrop>
          </Form.Item>
          <Form.Item label={t('status')} name='action'>
            <Select>
              <Select.Option value={true} key={'Активно'}>
                {t('active')}
              </Select.Option>
              <Select.Option value={false} key={'Не активно'}>
                {t('inactive')}
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label={t('promotion-start-date')} name='dateStartSales'>
            <DatePicker
              onChange={onChangeStartDate}
              locale={locale}
              defaultValue={dayjs(dateStartSales, dateFormat)}
              format={dateFormat}
            />
          </Form.Item>
          <Form.Item label={t('promotion-finish-date')} name='dateFinishSales'>
            <DatePicker
              onChange={onChangeFinishDate}
              locale={locale}
              defaultValue={dayjs(dateFinishSales, dateFormat)}
            />
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
      ) : (
        ''
      )}
    </>
  )
}
export default Sale
