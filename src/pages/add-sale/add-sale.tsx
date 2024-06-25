import {
  Button,
  Form,
  Input,
  Select,
  Upload,
  DatePicker,
  message,
  Modal
} from 'antd'
import ImgCrop from 'antd-img-crop'
import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import * as salesAPI from '../../utils/api/sales-api'
import * as imageAPI from '../../utils/api/image-api'
import { TRest, TSale } from '../../utils/typesFromBackend'
import { PlusOutlined } from '@ant-design/icons'
import type { DatePickerProps } from 'antd'
import 'dayjs/locale/ru'
import locale from 'antd/es/date-picker/locale/ru_RU'
import type { UploadChangeParam } from 'antd/es/upload'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
import { NotificationContext } from '../../components/notification-provider/notification-provider'

interface IFileList {
  url: string
  name: string
  uid: string
}

interface IAddSale {
  token: string
  rest: TRest
  t: (arg0: string) => string
  selectedLanguages: string[]
}

const AddSale: FC<IAddSale> = ({ token, rest, t, selectedLanguages }) => {
  const { openNotification } = useContext(NotificationContext)
  const { TextArea } = Input
  const [title, setTitle] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [fileList, setFileList] = React.useState<IFileList[]>([])
  const [dateStartSales, setDateStartSales] = React.useState('')
  const [dateFinishSales, setDateFinishSales] = React.useState('')
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const history = useHistory()
  const [form] = Form.useForm()

  /* const languageSale = {} */

  React.useEffect(() => {
    form.setFieldsValue({ title: '' })
    form.setFieldsValue({ action: true })
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
    newLanguageSale.title = { ...languageSale }
    newLanguageSale.description = { ...languageSale }
    newLanguageSale.rest_id = rest._id
    newLanguageSale.dateStartSales = dateStartSales
    newLanguageSale.dateFinishSales = dateFinishSales
    for (const lang of selectedLanguages) {
      newLanguageSale.title[lang] = values.title
      newLanguageSale.description[lang] = values.description
    }
  } */

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onFinish = (values: any) => {
    // values.action = true
    values.rest_id = rest._id
    values.dateStartSales = dateStartSales
    values.dateFinishSales = dateFinishSales
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
          .createSale(values, token)
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
        {t('add-sale')}
      </h4>
      <Form
        {...layout}
        onFinish={onFinish}
        validateMessages={validateMessages}
        name='category'
        form={form}
        style={{ paddingTop: '1.5rem' }}
      >
        <Form.Item label={t('name')} rules={[{ required: true }]} name='title'>
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
        <Form.Item
          label={t('promotion-start-date')}
          rules={[{ required: true }]}
          name='dateStartSales'
        >
          <DatePicker onChange={onChangeStartDate} locale={locale} />
        </Form.Item>
        <Form.Item
          label={t('promotion-finish-date')}
          rules={[{ required: true }]}
          name='dateFinishSales'
        >
          <DatePicker onChange={onChangeFinishDate} locale={locale} />
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
          <Button type='primary' htmlType='submit'>
            {t('save')}
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
export default AddSale
