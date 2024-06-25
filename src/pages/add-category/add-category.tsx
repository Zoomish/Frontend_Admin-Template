import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { TCategory, TRest } from '../../utils/typesFromBackend'
import * as categoriesAPI from '../../utils/api/category-api'
import { Button, Form, Input, Select, Modal } from 'antd'
import Checkbox, { CheckboxChangeEvent } from 'antd/es/checkbox'
import { NotificationContext } from '../../components/notification-provider/notification-provider'

interface IAddCategory {
  token: string
  rest: TRest
  t: (arg0: string) => string
  selectedLanguages: string[]
  language: string
}
const AddCategory: FC<IAddCategory> = ({
  token,
  rest,
  t,
  selectedLanguages,
  language
}) => {
  const { openNotification } = useContext(NotificationContext)

  const [allCategories, setAllCategories] = React.useState<TCategory[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [sortValue, SetSortValue] = React.useState<String | Number>(1000)
  const [checkedIsNoImagesCategory, setCheckedIsNoImagesCategory] =
    React.useState(false)
  const [isModalVisible, setIsModalVisible] = React.useState(false)

  const history = useHistory()

  const languageCategory = {}

  React.useEffect(() => {
    categoriesAPI
      .getListCategories(rest._id)
      .then((res: TCategory[]) => {
        /* res.sort((a, b) => a.title.localeCompare(b.title)) */
        setAllCategories(res)
        form.setFieldsValue({ category_id: 'Не выбрана' })
        form.setFieldsValue({ sort: 1000 })
        setIsLoading(true)
      })
      .catch(() => {
        openNotification(t('something-went-wrong'), 'topRight')
      })
  }, [])

  const [form] = Form.useForm()

  const layout = {
    labelCol: { span: 8 },
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
      SetSortValue(sort)
    } else {
      form.setFieldsValue({ sort: sortValue })
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onFinish = (values: any) => {
    const newLanguageCategory: any = { ...values }
    newLanguageCategory.active = true
    newLanguageCategory.title = { ...languageCategory }
    newLanguageCategory.noImagesCategory = checkedIsNoImagesCategory
    newLanguageCategory.rest_id = rest._id
    for (const lang of selectedLanguages) {
      newLanguageCategory.title[lang] = values.title.trim()
    }

    if (values.category_id === 'Не выбрана') {
      newLanguageCategory.category_id = null
    }

    if (newLanguageCategory.title[language] === '') {
      setIsModalVisible(true)
      return
    }
    categoriesAPI
      .createCategory(newLanguageCategory, token)
      .then((res: TCategory) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (res._id) {
          // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
          history.push(`/${rest.pathRest}/categories`)
        }
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onChangeIsNoImagesCategory = (e: CheckboxChangeEvent) => {
    setCheckedIsNoImagesCategory(!checkedIsNoImagesCategory)
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
        {isLoading ? `${t('add-category')}` : ''}
      </h4>
      {isLoading ? (
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
            <Input data-test-id='add-category-title'/>
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
          <Form.Item
            label={t('category-with-not-images')}
            name='noImagesCategory'
          >
            <Checkbox
              onChange={onChangeIsNoImagesCategory}
              checked={checkedIsNoImagesCategory}
            ></Checkbox>
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type='primary' htmlType='submit' data-test-id='btn-create-category'>
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
export default AddCategory
