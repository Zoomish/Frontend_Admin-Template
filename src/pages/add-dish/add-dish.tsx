import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import * as dishAPI from '../../utils/api/dish-api'
import { TCategory, TDish, TRest, ECountry } from '../../utils/typesFromBackend'
import {
  Form,
  Input,
  Button,
  Radio,
  Select,
  Upload,
  message,
  Modal
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { UploadChangeParam } from 'antd/es/upload'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
import ImgCrop from 'antd-img-crop'
import * as categoriesAPI from '../../utils/api/category-api'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import * as imageAPI from '../../utils/api/image-api'

interface IFileList {
  url: string
  name: string
  uid: string
}

interface IAddDish {
  token: string
  rest: TRest
  t: (arg0: string) => string
  selectedLanguages: string[]
  language: ECountry
}

const AddDish: FC<IAddDish> = ({
  token,
  rest,
  t,
  selectedLanguages,
  language
}) => {
  const { openNotification } = useContext(NotificationContext)
  const [form] = Form.useForm()
  const history = useHistory()
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 }
  }

  const [isDishLoading, setIsDishLoading] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [fileList, setFileList] = React.useState<IFileList[]>([])
  const [allCategories, setAllCategories] = React.useState<TCategory[]>([])
  const [priceValue, setPriceValue] = React.useState(0)
  const [weightValue, setWeightValue] = React.useState(0)
  const [sortValue, SetSortValue] = React.useState(1000)
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const [title, setTitle] = React.useState('')
  const { TextArea } = Input

  const languageDish = {}

  React.useEffect(() => {
    categoriesAPI
      .getListCategories(rest._id)
      .then((res: TCategory[]) => {
        res.sort((a, b) =>
          (a.title[language] as string).localeCompare(
            b.title[language] as string
          )
        )
        setAllCategories(res)
        form.setFieldsValue({ title: '' })
        form.setFieldsValue({ price: 0 })
        form.setFieldsValue({ sort: 1000 })
        form.setFieldsValue({ unit: 'гр' })
        form.setFieldsValue({ weight: 0 })
        form.setFieldsValue({ description: '' })
        form.setFieldsValue({ category_id: 'Не выбрана' })
        setIsDishLoading(true)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }, [])

  function handleChangePrice (e: React.ChangeEvent<HTMLInputElement>): void {
    const amount = e.target.value
    if (amount === '' || amount.match(/^\d{1,}(\.\d{0,4})?$/) != null) {
      form.setFieldsValue({ price: amount })
      setPriceValue(Number(amount))
    } else {
      form.setFieldsValue({ price: priceValue })
    }
  }

  function handleChangeWeight (e: React.ChangeEvent<HTMLInputElement>): void {
    const weight = e.target.value
    if (weight === '' || weight.match(/^\d{1,}(\.\d{0,4})?$/) != null) {
      form.setFieldsValue({ weight })
      setWeightValue(Number(weight))
    } else {
      form.setFieldsValue({ weight: weightValue })
    }
  }

  function handleChangeSort (e: React.ChangeEvent<HTMLInputElement>): void {
    const sort = e.target.value
    if (sort === '' || sort.match(/^\d{1,}$/) != null) {
      form.setFieldsValue({ sort })
      SetSortValue(Number(sort))
    } else {
      form.setFieldsValue({ sort: sortValue })
    }
  }

  function handleChangeTitle (e: React.ChangeEvent<HTMLInputElement>): void {
    setTitle(e.target.value)
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

  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: '${label} ' + `${t('it-is-necessary-to-fill-in')}!`
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onFinish = (values: any) => {
    const newLanguageDish: any = { ...values }
    newLanguageDish.title = { ...languageDish }
    newLanguageDish.description = { ...languageDish }
    for (const lang of selectedLanguages) {
      newLanguageDish.title[lang] = values.title.trim()
      newLanguageDish.description[lang] = values.description || ''
    }
    newLanguageDish.modifiers_ids = []
    newLanguageDish.rest_id = rest._id
    newLanguageDish.active = true
    newLanguageDish.groupModifiers_ids = []
    if (newLanguageDish.category_id === 'Не выбрана') {
      newLanguageDish.category_id = null
    }

    if (newLanguageDish.title[language] === '') {
      setIsModalVisible(true)
      return
    }
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!newLanguageDish.image) {
      dishAPI
        .createDish(newLanguageDish, token)
        .then((res: TDish) => {
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          if (res._id) {
            // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
            history.push(`/${rest.pathRest}/menu`)
          }
        })
        .catch((e) => openNotification(e, 'topRight'))
    } else {
      const formData = new FormData()
      formData.append('image', values.image)
      imageAPI
        .createImage(formData, token)
        .then((res) => {
          newLanguageDish.image = res.file_name
          dishAPI
            .createDish(newLanguageDish, token)
            .then((res: TDish) => {
              // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
              if (res._id) {
                // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
                history.push(`/${rest.pathRest}/menu`)
              }
            })
            .catch((e) => openNotification(e, 'topRight'))
        })
        .catch((e) => openNotification(e, 'topRight'))
    }
  }

  const handleModalClose = (): void => {
    setIsModalVisible(false)
  }

  return (
    <>
      {
        <Modal
        title={t('alert')}
        visible={isModalVisible}
        footer={[
          <Button key='ok' type='primary' onClick={handleModalClose}>
            {t('close')}
          </Button>
        ]}
      >
        {t('field_must_not_empty')}
      </Modal>
      }
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
        {isDishLoading ? `${t('add-dish')}` : ''}
      </h4>
      {isDishLoading
        ? (
        <Form
          {...layout}
          onFinish={onFinish}
          validateMessages={validateMessages}
          name='dish'
          form={form}
          style={{ paddingTop: '1.5rem' }}
        >
          <Form.Item
            label={t('name')}
            rules={[{ required: true }]}
            name='title'
          >
            <Input onChange={handleChangeTitle} data-test-id="dish-create-input-title" />
          </Form.Item>
          <Form.Item
            label={t('price')}
            rules={[{ required: true }]}
            name='price'
          >
            <Input onChange={handleChangePrice} data-test-id="dish-create-input-price"/>
          </Form.Item>
          <Form.Item label={t('unit')} name='unit'>
            <Radio.Group>
              <Radio value='гр'> {t('gr')} </Radio>
              <Radio value='мл'> {t('ml')} </Radio>
              <Radio value='шт'> {t('pc')} </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label={t('weight')} name='weight' data-test-id="dish-create-input-weight">
            <Input onChange={handleChangeWeight} />
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
          <Form.Item
            label={t('parent-category')}
            name='category_id'
            required={true}
          >
            <Select data-test-id="dish-create-select">
              <Select.Option value={'Не выбрана'} key={'Не выбрана'}>
                {t('not-selected')}
              </Select.Option>
              {allCategories.map((category) => (
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                <Select.Option value={category._id} key={category._id} data-test-id={`dish-create-select-${category.title[language]}`}>
                  {category.title[language]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label={t('sorting')}
            rules={[{ required: true }]}
            name='sort'
          >
            <Input onChange={handleChangeSort} />
          </Form.Item>
          <Form.Item label={t('description')} name='description'>
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
            <Button type='primary' htmlType='submit' data-test-id="dish-create-button">
              {t('save')}
            </Button>
          </Form.Item>
        </Form>
          )
        : (
            ''
          )}
    </>
  )
}
export default AddDish
