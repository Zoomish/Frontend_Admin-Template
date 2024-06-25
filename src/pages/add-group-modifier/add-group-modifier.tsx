import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import {
  ECountry,
  TCategoryModifier,
  TRest
} from '../../utils/typesFromBackend'
import * as categoriesModifiersApi from '../../utils/api/category-modifier-api'
import { Button, Form, Input, Select, Modal } from 'antd'
import Checkbox, { CheckboxChangeEvent } from 'antd/es/checkbox'
import { NotificationContext } from '../../components/notification-provider/notification-provider'

interface IAddGroupModifier {
  token: string
  rest: TRest
  t: (arg0: string) => string
  selectedLanguages: string[]
  language: ECountry
}

const AddGroupModifier: FC<IAddGroupModifier> = ({
  token,
  rest,
  t,
  selectedLanguages,
  language
}) => {
  const { openNotification } = useContext(NotificationContext)

  const [allCategories, setAllCategories] = React.useState<TCategoryModifier[]>(
    []
  )
  const [isLoading, setIsLoading] = React.useState(false)
  const [sortValue, SetSortValue] = React.useState<String | Number>(1000)
  const [
    checkedIsGroupModifierCategoryRadio,
    setCheckedIsGroupModifierCategoryRadio
  ] = React.useState(false)
  const [checkedIsGroupModifierRequired, setCheckedIsGroupModifierRequired] =
    React.useState(false)
  const [isModalVisible, setIsModalVisible] = React.useState(false)

  const history = useHistory()

  const languageGroupModifier = {}

  React.useEffect(() => {
    categoriesModifiersApi
      .getListCategoriesModifiers(rest._id)
      .then((res: TCategoryModifier[]) => {
        res.sort((a, b) =>
          (a.title[language] as string).localeCompare(
            b.title[language] as string
          )
        )
        setAllCategories(res)
        form.setFieldsValue({ categoryModifiers_id: 'Не выбрана' })
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
    const newLanguageGroupModifier: any = { ...values }
    newLanguageGroupModifier.active = true
    newLanguageGroupModifier.rest_id = rest._id
    newLanguageGroupModifier.title = { ...languageGroupModifier }
    newLanguageGroupModifier.isGroupModifierCategoryRadio =
      checkedIsGroupModifierCategoryRadio
    newLanguageGroupModifier.isGroupModifierRequired =
      checkedIsGroupModifierRequired
    for (const lang of selectedLanguages) {
      newLanguageGroupModifier.title[lang] = values.title.trim()
    }

    newLanguageGroupModifier.active = true
    if (values.categoryModifiers_id === 'Не выбрана') {
      newLanguageGroupModifier.categoryModifiers_id = null
    }

    if (newLanguageGroupModifier.title[language] === '') {
      setIsModalVisible(true)
      return
    }

    categoriesModifiersApi
      .createCategoryModifier(newLanguageGroupModifier, token)
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
        {isLoading ? `${t('add-group-modifier')}` : ''}
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
            <Input data-test-id="group-modifiers-create-input-title"/>
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
            <Button type='primary' htmlType='submit' data-test-id="group-modifiers-create-button">
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
export default AddGroupModifier
