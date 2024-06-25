import React, { FC, useContext } from 'react'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import {
  ECountry,
  TCategoryModifier,
  TRest
} from '../../utils/typesFromBackend'
import * as categoriesModifiersApi from '../../utils/api/category-modifier-api'
import { Button, Checkbox, Form, Input, Select, Modal } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { NotificationContext } from '../../components/notification-provider/notification-provider'

interface IGroupModifier {
  token: string
  rest: TRest
  t: (arg0: string) => string
  language: ECountry
}
const GroupModifier: FC<IGroupModifier> = ({ token, rest, t, language }) => {
  const { openNotification } = useContext(NotificationContext)
  const pathname = useLocation().pathname
  const match = useRouteMatch(pathname)
  const groupModifierId = Object.keys(match?.params as string)[0]
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const [category, setCategory] = React.useState<TCategoryModifier>(
    {} as TCategoryModifier
  )
  const [allCategories, setAllCategories] = React.useState<TCategoryModifier[]>(
    []
  )
  const [oneGroupModifier, setOneGroupModifier] = React.useState<any>()
  const [isCategory, setIsCategory] = React.useState(false)
  const [
    checkedIsGroupModifierCategoryRadio,
    setCheckedIsGroupModifierCategoryRadio
  ] = React.useState(false)
  const [checkedIsGroupModifierRequired, setCheckedIsGroupModifierRequired] =
    React.useState(false)
  const [isModalVisible, setIsModalVisible] = React.useState(false)

  const languageGroupModifier: Record<string, string> = {}

  for (const lang of rest ? rest.languages : []) {
    languageGroupModifier[lang] = oneGroupModifier
      ? oneGroupModifier.title[lang] || ''
      : ''
  }

  React.useEffect(() => {
    Promise.all([
      categoriesModifiersApi.getCategoryModifier(groupModifierId),
      categoriesModifiersApi.getListCategoriesModifiers(rest._id)
    ])
      .then(([res, categories]: [TCategoryModifier, TCategoryModifier[]]) => {
        setCategory(res)
        setOneGroupModifier(res)
        const arrayCategories: TCategoryModifier[] = []
        categories.forEach((category: TCategoryModifier) => {
          if (category._id !== groupModifierId) {
            arrayCategories.push(category)
          }
        })
        arrayCategories.sort((a, b) =>
          (a.title[language] as string).localeCompare(
            b.title[language] as string
          )
        )
        setAllCategories(arrayCategories)
        form.setFieldsValue({ title: res.title[language] })
        form.setFieldsValue({ sort: res.sort.toString() })
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (typeof res.categoryModifiers_id === 'string') {
          form.setFieldsValue({
            categoryModifiers_id: res.categoryModifiers_id
          })
        } else {
          form.setFieldsValue({ categoryModifiers_id: 'Не выбрана' })
        }
        setCheckedIsGroupModifierCategoryRadio(res.isGroupModifierCategoryRadio)
        setCheckedIsGroupModifierRequired(res.isGroupModifierRequired)
        form.setFieldsValue({
          isGroupModifierCategoryRadio: res.isGroupModifierCategoryRadio
        })
        form.setFieldsValue({
          isGroupModifierRequired: res.isGroupModifierRequired
        })
        setIsCategory(true)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }, [language])

  const [form] = Form.useForm()
  const history = useHistory()
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
      category.sort = Number(sort)
      setCategory({ ...category })
    } else {
      form.setFieldsValue({ sort: category.sort })
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onFinish = (values: any) => {
    const newLanguageGroupModifier: any = { ...values }
    newLanguageGroupModifier.title = { ...languageGroupModifier }
    newLanguageGroupModifier.title[language] = values.title.trim()
    newLanguageGroupModifier._id = category._id
    newLanguageGroupModifier.isGroupModifierCategoryRadio =
      checkedIsGroupModifierCategoryRadio
    newLanguageGroupModifier.isGroupModifierRequired =
      checkedIsGroupModifierRequired

    if (values.categoryModifiers_id === 'Не выбрана') {
      newLanguageGroupModifier.categoryModifiers_id = null
    }

    if (newLanguageGroupModifier.title[language] === '') {
      setIsModalVisible(true)
      return
    }

    categoriesModifiersApi
      .updateCategoryModifier(newLanguageGroupModifier, token)
      .then((res: TCategoryModifier) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (res._id) {
          // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
          history.push(`/${rest.pathRest}/group-modifiers`)
        }
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onChangeIsGroupModifierCategoryRadio = (e: CheckboxChangeEvent) => {
    setCheckedIsGroupModifierCategoryRadio(!checkedIsGroupModifierCategoryRadio)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onChangeIsGroupModifierRequired = (e: CheckboxChangeEvent) => {
    setCheckedIsGroupModifierRequired(!checkedIsGroupModifierRequired)
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
        {isCategory ? category.title[language] : ''}
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
            <Input />
          </Form.Item>
          <Form.Item label={t('parent-category')} name='categoryModifiers_id'>
            <Select>
              <Select.Option value={'Не выбрана'} key={'Не выбрана'}>
                {t('not-selected')}
              </Select.Option>
              {allCategories.map((category) => (
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
            label={t('single-modifier-selection')}
            name='isGroupModifierCategoryRadio'
          >
            <Checkbox
              onChange={onChangeIsGroupModifierCategoryRadio}
              checked={checkedIsGroupModifierCategoryRadio}
            ></Checkbox>
          </Form.Item>
          <Form.Item
            label={t('required-selection-modifier-in-group')}
            name='isGroupModifierRequired'
          >
            <Checkbox
              onChange={onChangeIsGroupModifierRequired}
              checked={checkedIsGroupModifierRequired}
            ></Checkbox>
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type='primary' htmlType='submit'>
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
export default GroupModifier
