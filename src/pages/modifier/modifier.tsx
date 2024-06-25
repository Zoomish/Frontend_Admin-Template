import React, { FC, useContext } from 'react'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import {
  ECountry,
  TCategoryModifier,
  TModifier,
  TRest
} from '../../utils/typesFromBackend'
import * as modifiersAPI from '../../utils/api/modifier-api'
import * as categoriesModifiersApi from '../../utils/api/category-modifier-api'
import { Button, Form, Input, Popconfirm, Radio, Select, Modal } from 'antd'
import { NotificationContext } from '../../components/notification-provider/notification-provider'

interface IModifier {
  token: string
  rest: TRest
  t: (arg0: string) => string
  language: ECountry
}

const Modifier: FC<IModifier> = ({ token, rest, t, language }) => {
  const { openNotification } = useContext(NotificationContext)
  const pathname = useLocation().pathname
  const match = useRouteMatch(pathname)
  const modifierId = Object.keys(match?.params as string)[0]
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const [modifier, setModifier] = React.useState<TModifier>({} as TModifier)
  const [oneModifier, setOneModifier] = React.useState<any>()
  const [allCategoriesModifiers, setAllCategoriesModifiers] = React.useState<
    TCategoryModifier[]
  >([])
  const [isModifier, setIsModifier] = React.useState(false)
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const { TextArea } = Input
  const [form] = Form.useForm()
  const history = useHistory()
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 }
  }

  const languageModifier: Record<string, string> = {}
  const languageModifierDesc: Record<string, string> = {}

  for (const lang of rest ? rest.languages : []) {
    languageModifier[lang] = oneModifier ? oneModifier.title[lang] || '' : ''
    languageModifierDesc[lang] = oneModifier
      ? oneModifier.description[lang] || ''
      : ''
  }

  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: '${label} ' + `${t('it-is-necessary-to-fill-in')}!`
  }

  function handleChangeSort(e: React.ChangeEvent<HTMLInputElement>): void {
    const sort = e.target.value
    if (sort === '' || sort.match(/^\d{1,}$/) != null) {
      form.setFieldsValue({ sort })
      modifier.sort = Number(sort)
      setModifier({ ...modifier })
    } else {
      form.setFieldsValue({ sort: modifier.sort })
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onFinish = (values: any) => {
    const newLanguageCategory: any = { ...values }
    newLanguageCategory.active = true
    newLanguageCategory._id = modifier._id
    newLanguageCategory.title = { ...languageModifier }
    newLanguageCategory.description = { ...languageModifierDesc }
    newLanguageCategory.title[language] = values.title.trim()
    newLanguageCategory.description[language] = values.description || ''
    if (values.categoryModifier === 'Не выбрана') {
      newLanguageCategory.categoryModifier = null
    }

    if (newLanguageCategory.title[language] === '') {
      setIsModalVisible(true)
      return
    }

    modifiersAPI
      .updateModifier(newLanguageCategory, token)
      .then((res: TModifier) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (res._id) {
          // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
          history.push(`/${rest._id}/modifiers`)
        }
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  React.useEffect(() => {
    Promise.all([
      modifiersAPI.getModifier(modifierId),
      categoriesModifiersApi.getListCategoriesModifiers(rest._id)
    ])
      .then(([res, categories]) => {
        setModifier(res)
        setOneModifier(res)
        setAllCategoriesModifiers(categories)
        form.setFieldsValue({ title: res.title[language] })
        form.setFieldsValue({ price: res.price })
        form.setFieldsValue({ unit: res.unit })
        form.setFieldsValue({ weight: res.weight })
        form.setFieldsValue({ sort: res.sort.toString() })
        form.setFieldsValue({ description: res.description[language] })
        if (res.categoryModifier === null) {
          form.setFieldsValue({ categoryModifier: 'Не выбрана' })
        } else {
          form.setFieldsValue({
            categoryModifier: res.categoryModifier
          })
        }
        if (typeof res.category_id === 'string') {
          form.setFieldsValue({ category_id: res.category_id })
        } else {
          form.setFieldsValue({ category_id: 'Не выбрана' })
        }
        setIsModifier(true)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }, [language])

  function handleChangePrice(e: React.ChangeEvent<HTMLInputElement>): void {
    const amount = e.target.value
    if (amount === '' || amount.match(/^\d{1,}(\.\d{0,4})?$/) != null) {
      form.setFieldsValue({ price: amount })
      modifier.price = Number(amount)
      setModifier({ ...modifier })
    } else {
      form.setFieldsValue({ price: modifier.price })
    }
  }

  function handleChangeWeight(e: React.ChangeEvent<HTMLInputElement>): void {
    const weight = e.target.value
    if (weight === '' || weight.match(/^\d{1,}(\.\d{0,4})?$/) != null) {
      form.setFieldsValue({ weight })
      modifier.weight = Number(weight)
      setModifier({ ...modifier })
    } else {
      form.setFieldsValue({ weight: modifier.weight })
    }
  }

  function confirm(): void {
    modifiersAPI
      .deleteModifier(modifierId, token)
      .then((res) => history.push(`/${rest.pathRest}/modifiers`))
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
        {isModifier && modifier.title ? modifier.title[language] : ''}
      </h4>
      {isModifier ? (
        <Form
          {...layout}
          onFinish={onFinish}
          validateMessages={validateMessages}
          name='modifier'
          form={form}
          style={{ paddingTop: '1.5rem' }}
        >
          <Form.Item
            label={t('name')}
            rules={[{ required: true }]}
            name='title'
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t('price')}
            rules={[{ required: true }]}
            name='price'
          >
            <Input onChange={handleChangePrice} />
          </Form.Item>
          <Form.Item label={t('unit')} name='unit'>
            <Radio.Group>
              <Radio value='гр'> {t('gr')} </Radio>
              <Radio value='мл'> {t('ml')} </Radio>
              <Radio value='шт'> {t('pc')} </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label={t('weight')} name='weight'>
            <Input onChange={handleChangeWeight} />
          </Form.Item>
          <Form.Item label={t('parent-category')} name='categoryModifier'>
            <Select>
              <Select.Option value={'Не выбрана'} key={'Не выбрана'}>
                {t('not-selected')}
              </Select.Option>
              {allCategoriesModifiers.map((category) => (
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
export default Modifier
