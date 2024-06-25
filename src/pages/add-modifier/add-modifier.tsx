import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import {
  ECountry,
  TCategoryModifier,
  TModifier,
  TRest
} from '../../utils/typesFromBackend'
import * as categoriesModifiersApi from '../../utils/api/category-modifier-api'
import * as modifierAPI from '../../utils/api/modifier-api'
import { Button, Form, Input, Radio, Select, Modal } from 'antd'
import { NotificationContext } from '../../components/notification-provider/notification-provider'

interface IAddModifier {
  token: string
  rest: TRest
  t: (arg0: string) => string
  selectedLanguages: string[]
  language: ECountry
}

const AddModifier: FC<IAddModifier> = ({
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
  const [weightValue, setWeightValue] = React.useState<String | Number>(0)
  const [priceValue, setPriceValue] = React.useState<String | Number>(0)
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const { TextArea } = Input
  const history = useHistory()

  const languageCategory = {}

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
        form.setFieldsValue({ categoryModifier: 'Не выбрана' })
        form.setFieldsValue({ sort: 1000 })
        form.setFieldsValue({ price: 0 })
        form.setFieldsValue({ weight: 0 })
        form.setFieldsValue({ unit: 'гр' })
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
    const newLanguageModifier: any = { ...values }
    newLanguageModifier.active = true
    newLanguageModifier.title = { ...languageCategory }
    newLanguageModifier.description = { ...languageCategory }
    newLanguageModifier.rest_id = rest._id
    for (const lang of selectedLanguages) {
      newLanguageModifier.title[lang] = values.title.trim()
      newLanguageModifier.description[lang] = values.description || ''
    }

    if (values.categoryModifier === 'Не выбрана') {
      newLanguageModifier.categoryModifier = null
    }

    if (newLanguageModifier.title[language] === '') {
      setIsModalVisible(true)
      return
    }

    modifierAPI
      .createModifier(newLanguageModifier, token)
      .then((res: TModifier) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (res._id) {
          // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
          history.push(`/${rest.pathRest}/modifiers`)
        }
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  function handleChangePrice(e: React.ChangeEvent<HTMLInputElement>): void {
    const amount = e.target.value
    if (amount === '' || amount.match(/^\d{1,}(\.\d{0,4})?$/) != null) {
      form.setFieldsValue({ price: amount })
      const price = Number(amount)
      setPriceValue(price)
    } else {
      form.setFieldsValue({ price: priceValue })
    }
  }

  function handleChangeWeight(e: React.ChangeEvent<HTMLInputElement>): void {
    const weight = e.target.value
    if (weight === '' || weight.match(/^\d{1,}(\.\d{0,4})?$/) != null) {
      form.setFieldsValue({ weight })
      const weightVal = Number(weight)
      setWeightValue(weightVal)
    } else {
      form.setFieldsValue({ weight: weightValue })
    }
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
        {isLoading ? `${t('add-modifier')}` : ''}
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
            <Input data-test-id="modifiers-create-input-title"/>
          </Form.Item>
          <Form.Item
            label={t('price')}
            rules={[{ required: true }]}
            name='price'
          >
            <Input onChange={handleChangePrice} data-test-id="modifiers-create-input-price"/>
          </Form.Item>
          <Form.Item label={t('unit')} name='unit'>
            <Radio.Group>
              <Radio value='гр'> {t('gr')} </Radio>
              <Radio value='мл'> {t('ml')} </Radio>
              <Radio value='шт'> {t('pc')} </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label={t('weight')} name='weight'>
            <Input onChange={handleChangeWeight} data-test-id="modifiers-create-input-weight"/>
          </Form.Item>
          <Form.Item label={t('parent-category')} name='categoryModifier'>
            <Select data-test-id="modifiers-create-select">
              <Select.Option value={'Не выбрана'} key={'Не выбрана'}>
                {t('not-selected')}
              </Select.Option>
              {allCategories.map((category) => (
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                <Select.Option value={category._id} key={category._id} data-test-id={`modifiers-create-select-${category.title[language]}`}>
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
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type='primary' htmlType='submit' data-test-id="modifiers-create-button">
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
export default AddModifier
