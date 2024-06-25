/* eslint-disable multiline-ternary */
import React, { FC, useContext } from 'react'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import * as dishAPI from '../../utils/api/dish-api'
import { TCategory, TDish, TRest } from '../../utils/typesFromBackend'
import {
  Form,
  Input,
  Button,
  Radio,
  Select,
  Upload,
  message,
  Popconfirm,
  Modal
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { UploadChangeParam } from 'antd/es/upload'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
import ImgCrop from 'antd-img-crop'
import { BASE_URL_CDN } from '../../utils/const'
import * as imageAPI from '../../utils/api/image-api'
import { NotificationContext } from '../notification-provider/notification-provider'

interface IFileList {
  url: string
  name: string
  uid: string
}
interface IEditorDish {
  allCategories: TCategory[]
  token: string
  rest: TRest
  t: (arg0: string) => string
  language: string
  isFormChanged: boolean
  setIsFormChanged: (arg: any) => void
}

const EditorDish: FC<IEditorDish> = ({
  allCategories,
  token,
  rest,
  t,
  language,
  isFormChanged,
  setIsFormChanged
}) => {
  const { openNotification } = useContext(NotificationContext)
  const [form] = Form.useForm()
  const history = useHistory()
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 }
  }
  // eslint-disable-next-line prefer-regex-literals
  // const { dishId } = useParams<{ dishId: string }>()
  const pathname = useLocation().pathname
  const match = useRouteMatch(pathname)
  const dishId = Object.keys(match?.params as string)[0]
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const [dish, setDish] = React.useState<TDish>({} as TDish)
  const [oneDish, setOneDish] = React.useState<any>()
  const [isDishLoading, setIsDishLoading] = React.useState(false)
  const [isChangeImage, setIsChangeImage] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [fileList, setFileList] = React.useState<IFileList[]>([])
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const { TextArea } = Input
  const [formData, setFormData] = React.useState(() => {
    const storedFormDataString = localStorage.getItem('formDataDish')
    return storedFormDataString ? JSON.parse(storedFormDataString) : null
  })

  const languageDish: Record<string, string> = {}
  const languageDescripDish: Record<string, string> = {}

  for (const lang of rest ? rest.languages : []) {
    languageDish[lang] = oneDish ? oneDish.title[lang] || '' : ''
    languageDescripDish[lang] = oneDish ? oneDish.description[lang] || '' : ''
  }

  const handleFormChange = (): void => {
    const allValues = form.getFieldsValue()
    const updateallValues = { ...allValues, _id: dish._id }
    setFormData(updateallValues)
  }

  React.useEffect(() => {
    if (Object.keys(dish).length > 0 && formData) {
      if (dish._id !== formData._id) {
        localStorage.removeItem('formDataDish')
      }
    }
    localStorage.setItem('formDataDish', JSON.stringify(formData))
  }, [formData])

  React.useEffect(() => {
    dishAPI
      .getDish(dishId)
      .then((res) => {
        setOneDish(res)
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (res.image) {
          if (res.image.length > 0) {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            setFileList([
              {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                url: `${BASE_URL_CDN}/${res.image}`,
                name: res.title[language],
                uid: '0'
              }
            ])
            setLoading(true)
          }
        }
        setDish(res)

        const storedFormDataString = localStorage.getItem('formDataDish')
        const parsedFormData = storedFormDataString
          ? JSON.parse(storedFormDataString)
          : null

        if (parsedFormData && parsedFormData._id === res._id) {
          form.setFieldsValue({
            title: parsedFormData.title
          })
          form.setFieldsValue({
            price: parsedFormData.price
          })
          form.setFieldsValue({
            sort: parsedFormData.sort
          })
          form.setFieldsValue({
            unit: parsedFormData.unit
          })
          form.setFieldsValue({
            weight: parsedFormData.weight
          })
          form.setFieldsValue({
            description: parsedFormData.description
          })
          form.setFieldsValue({
            category_id: parsedFormData.category_id
          })
          form.setFieldsValue({
            image: parsedFormData.image
          })
        } else {
          form.setFieldsValue({
            title: res.title[language]
          })
          form.setFieldsValue({
            price: res.price
          })
          form.setFieldsValue({
            sort: res.sort
          })
          form.setFieldsValue({
            unit: res.unit
          })
          form.setFieldsValue({
            weight: res.weight
          })
          form.setFieldsValue({
            description: res.description[language]
          })
          form.setFieldsValue({
            category_id: res.category_id._id
          })
          form.setFieldsValue({
            image: res.image
          })
        }
        setIsDishLoading(true)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }, [language])

  function handleChangePrice(e: React.ChangeEvent<HTMLInputElement>): void {
    const amount = e.target.value
    if (amount === '' || amount.match(/^\d{1,}(\.\d{0,4})?$/) != null) {
      form.setFieldsValue({ price: amount })
      dish.price = Number(amount)
      setDish({ ...dish })
    } else {
      form.setFieldsValue({ price: dish.price })
    }
  }

  function handleChangeWeight(e: React.ChangeEvent<HTMLInputElement>): void {
    const weight = e.target.value
    if (weight === '' || weight.match(/^\d{1,}(\.\d{0,4})?$/) != null) {
      form.setFieldsValue({ weight })
      dish.weight = Number(weight)
      setDish({ ...dish })
    } else {
      form.setFieldsValue({ weight: dish.weight })
    }
  }

  function handleChangeSort(e: React.ChangeEvent<HTMLInputElement>): void {
    const sort = e.target.value
    if (sort === '' || sort.match(/^\d{1,}$/) != null) {
      form.setFieldsValue({ sort })
      dish.sort = Number(sort)
      setDish({ ...dish })
    } else {
      form.setFieldsValue({ sort: dish.sort })
    }
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
      const result = [{ url, name: oneDish.title[language], uid: '0' }]
      setFileList([...result])
      form.setFieldsValue({ image: info.file.originFileObj })
      setIsChangeImage(true)
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
    newLanguageDish.active = true
    newLanguageDish.title = { ...languageDish }
    newLanguageDish.description = { ...languageDescripDish }

    newLanguageDish.title[language] = values.title.trim()
    newLanguageDish.description[language] = values.description || ''
    newLanguageDish._id = dish._id
    const arrayModifiers: string[] = []
    dish.modifiers_ids.forEach((modifier) => {
      arrayModifiers.push(modifier._id)
    })
    const arrayGroupModifiers: string[] = []
    dish.groupModifiers_ids.forEach((group) => {
      arrayGroupModifiers.push(group._id)
    })
    newLanguageDish.modifiers_ids = arrayModifiers
    newLanguageDish.groupModifiers_ids = arrayGroupModifiers

    if (newLanguageDish.title[language] === '') {
      setIsModalVisible(true)
      return
    }

    if (isChangeImage) {
      const formData = new FormData()
      formData.append('image', newLanguageDish.image)
      imageAPI
        .createImage(formData, token)
        .then((res) => {
          newLanguageDish.image = res.file_name
          dishAPI
            .updateDish(newLanguageDish, token)
            .then((res: TDish) => {
              // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
              if (res.rest_id) {
                // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
                history.push(`/${rest.pathRest}/menu`)
              }
            })
            .catch((e) => openNotification(e, 'topRight'))
        })
        .catch((e) => openNotification(e, 'topRight'))
    } else {
      dishAPI
        .updateDish(newLanguageDish, token)
        .then((res: TDish) => {
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          if (res.rest_id) {
            // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
            history.push(`/${rest.pathRest}/menu`)
          }
        })
        .catch((e) => openNotification(e, 'topRight'))
    }
  }

  function confirm(): void {
    dishAPI
      .deleteDish(dish._id, token)
      .then((res) => history.push(`/${rest.pathRest}/menu`))
      .catch((e) => openNotification(e, 'topRight'))
  }

  const handleModalClose = (): void => {
    setIsModalVisible(false)
  }

  return (
    <>
      {
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
      }
      {isDishLoading ? (
        <Form
          {...layout}
          onFinish={onFinish}
          validateMessages={validateMessages}
          name='dish'
          form={form}
          style={{ paddingTop: '1.5rem' }}
          onValuesChange={handleFormChange}
        >
          <Form.Item
            label={t('name')}
            rules={[{ required: true }]}
            name='title'
          >
            <Input data-test-id="dish-update-input-title"/>
          </Form.Item>
          <Form.Item
            label={t('price')}
            rules={[{ required: true }]}
            name='price'
          >
            <Input onChange={handleChangePrice} data-test-id="dish-update-input-price"/>
          </Form.Item>
          <Form.Item label={t('unit')} name='unit'>
            <Radio.Group>
              <Radio value='гр'> {t('gr')} </Radio>
              <Radio value='мл'> {t('ml')} </Radio>
              <Radio value='шт'> {t('pc')} </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label={t('weight')} name='weight'>
            <Input onChange={handleChangeWeight} data-test-id="dish-update-input-weight"/>
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
          <Form.Item
            required={true}
            label={t('parent-category')}
            name='category_id'
          >
            <Select>
              {allCategories.map((category: any) => (
                <Select.Option value={category._id} key={category._id}>
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
            <Button type='primary' htmlType='submit' data-test-id="dish-update-button-save">
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
              <Button htmlType='button' data-test-id="dish-delete-button">{t('delete')}</Button>
            </Popconfirm>
          </Form.Item>
        </Form>
      ) : (
        ''
      )}
    </>
  )
}
export default EditorDish
