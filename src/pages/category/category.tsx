import React, { FC, useContext } from 'react'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import { ECountry, TCategory, TRest } from '../../utils/typesFromBackend'
import * as categoriesAPI from '../../utils/api/category-api'
import { Button, Form, Input, Radio, Select, Modal } from 'antd'
import { NotificationContext } from '../../components/notification-provider/notification-provider'

interface ICategory {
  token: string
  rest: TRest
  t: (arg0: string) => string
  language: ECountry
}
const Category: FC<ICategory> = ({ token, rest, t, language }) => {
  const { openNotification } = useContext(NotificationContext)
  const pathname = useLocation().pathname
  const match = useRouteMatch(pathname)
  const categoryId = Object.keys(match?.params as string)[0]
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const [category, setCategory] = React.useState<TCategory>({} as TCategory)
  const [oneCategory, setOneCategory] = React.useState<any>()
  const [allCategories, setAllCategories] = React.useState<TCategory[]>([])
  const [isCategory, setIsCategory] = React.useState(false)
  const [isModalVisible, setIsModalVisible] = React.useState(false)

  const languageCategory: Record<string, string> = {}

  for (const lang of rest ? rest.languages : []) {
    languageCategory[lang] = oneCategory ? oneCategory.title[lang] || '' : ''
  }

  React.useEffect(() => {
    Promise.all([
      categoriesAPI.getCategory(categoryId),
      categoriesAPI.getListCategories(rest._id)
    ])
      .then(([res, categories]) => {
        setOneCategory(res)
        setCategory(res)
        const arrayCategories: TCategory[] = []
        categories.forEach((category: TCategory) => {
          if (category._id !== categoryId) {
            arrayCategories.push(category)
          }
        })
        /* arrayCategories.sort((a, b) => a.title.localeCompare(b.title)) */
        setAllCategories(arrayCategories)
        form.setFieldsValue({ title: res.title[language] })
        form.setFieldsValue({ sort: res.sort.toString() })
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (res.noImagesCategory) {
          form.setFieldsValue({ noImagesCategory: 'true' })
        } else {
          form.setFieldsValue({ noImagesCategory: 'false' })
        }
        if (typeof res.category_id === 'string') {
          form.setFieldsValue({ category_id: res.category_id })
        } else {
          form.setFieldsValue({ category_id: 'Не выбрана' })
        }
        setIsCategory(true)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }, [language])

  const [form] = Form.useForm()
  const history = useHistory()
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 }
  }

  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: '${label} ' + `${t('it-is-necessary-to-fill-in')}!`
  }

  function handleChangeSort(e: React.ChangeEvent<HTMLInputElement>): void {
    const sort = e.target.value
    if (sort === '' || sort.match(/^\d{1,}$/) != null) {
      form.setFieldsValue({ sort })
      category.sort = Number(sort)
      setCategory({ ...category })
    } else {
      form.setFieldsValue({ sort: category.sort })
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onFinish = (values: any) => {
    const newLanguageCategory: any = { ...values }
    newLanguageCategory.active = true
    newLanguageCategory._id = category._id
    newLanguageCategory.title = { ...languageCategory }

    newLanguageCategory.title[language] = values.title.trim()
    if (values.category_id === 'Не выбрана') {
      newLanguageCategory.category_id = null
    }

    if (newLanguageCategory.title[language] === '') {
      setIsModalVisible(true)
      return
    }

    categoriesAPI
      .updateCategory(newLanguageCategory, token)
      .then((res: TCategory) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (res.rest_id) {
          // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
          history.push(`/${rest.pathRest}/categories`)
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
        {category?.title ? category.title[language] : ''}
      </h4>
      {isCategory ? (
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
            <Input data-test-id='category-update-input'/>
          </Form.Item>
          <Form.Item label={t('parent-category')} name='category_id'>
            <Select>
              <Select.Option value={'Не выбрана'} key={'Не выбрана'}>
                {t('not-selected')}
              </Select.Option>
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
          <Form.Item label={t('hide-image')} name='noImagesCategory'>
            <Radio.Group>
              <Radio value='true' data-test-id='category-update-radio-true'> {t('yes')} </Radio>
              <Radio value='false'> {t('no')} </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
            <Button type='primary' htmlType='submit' data-test-id='category-update-button'>
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
export default Category
