/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Button, Form, Popconfirm, Select, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import React, { FC, useContext } from 'react'
import { Link, useLocation, useRouteMatch } from 'react-router-dom'
import {
  ECountry,
  TCategoryModifier,
  TDish,
  TModifier,
  TRest
} from '../../utils/typesFromBackend'
import { DeleteTwoTone } from '@ant-design/icons'
import * as modifierAPI from '../../utils/api/modifier-api'
import * as dishAPI from '../../utils/api/dish-api'
import { cloneDeep } from '../../utils/helpers'
import { NotificationContext } from '../notification-provider/notification-provider'

interface IModifiersForDish {
  data: TModifier[]
  dataAllCategoriesModifiers: TCategoryModifier[]
  token: string
  rest: TRest
  t: (arg0: string) => string
  language: ECountry
}
interface INameCategories {
  text: string
  value: string
}

const ModifiersForDish: FC<IModifiersForDish> = ({
  data,
  dataAllCategoriesModifiers,
  token,
  rest,
  t,
  language
}) => {
  const { openNotification } = useContext(NotificationContext)
  // const { dishId } = useParams<{ dishId: string }>()
  const pathname = useLocation().pathname
  const match = useRouteMatch(pathname)
  const dishId = Object.keys(match?.params as string)[0]
  const [allModifiers, setAllModifiers] = React.useState<TModifier[]>([])
  const [filteredModifiers, setFileterdModifiers] = React.useState<TModifier[]>(
    []
  )
  const [allCategoryModifiers, setAllCategoryModifiers] = React.useState<
  TCategoryModifier[]
  >([])
  const [modifersInDish, setModifersInDish] = React.useState<TModifier[]>([])
  const [nameCategories, setNameCategories] = React.useState<INameCategories[]>(
    []
  )

  React.useEffect(() => {
    localStorage.setItem('value', 'modifiers-for-dish')
  }, [language])

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const [dish, setDish] = React.useState<TDish>({} as TDish)
  React.useEffect(() => {
    dishAPI
      .getDish(dishId)
      .then((dishFromMenu: TDish) => {
        setDish(dishFromMenu)
        setAllModifiers(data)
        setModifersInDish(dishFromMenu.modifiers_ids)
        setAllCategoryModifiers(allCategoryModifiers)
        const arrayModifiers: TModifier[] = []
        data.forEach((modifier) => {
          let flag = false
          dishFromMenu.modifiers_ids.forEach((modifierInDish) => {
            if (modifierInDish._id === modifier._id) {
              flag = true
            }
          })
          if (!flag) {
            arrayModifiers.push(modifier)
          }
        })
        setFileterdModifiers(
          arrayModifiers.sort((a, b) =>
            (a.title[language] as string).localeCompare(
              b.title[language] as string
            )
          )
        )
        const objectNames: { [key: string]: boolean } = {}
        const resultArrayNameCategories: INameCategories[] = []
        dishFromMenu.modifiers_ids.forEach((modifier: TModifier) => {
          if (!objectNames[modifier.categoryModifier]) {
            objectNames[modifier.categoryModifier] = true
          }
        })
        for (const key of Object.keys(objectNames)) {
          const searchCategoryModifier = dataAllCategoriesModifiers.find(
            (category) => category._id === key
          )
          if (searchCategoryModifier != null) {
            const title = searchCategoryModifier.title
            resultArrayNameCategories.push({
              text: title[language] ?? '',
              value: key
            })
          }
        }
        setNameCategories(resultArrayNameCategories)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }, [data])

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 }
  }
  const [form] = Form.useForm()

  const onFinish = (values: any): void => {
    const modifiersIds: string[] = []
    const groupModifiersIds: string[] = []
    dish.modifiers_ids.forEach((item) => {
      modifiersIds.push(item._id)
    })

    dish.groupModifiers_ids.forEach((item) => {
      groupModifiersIds.push(item._id)
    })
    modifiersIds.push(values.modifier_id)
    const object: any = cloneDeep(dish)
    /* object.groupModifiers_ids.map((modifier: any) => {
      return (result2 = object.groupModifiers_ids.push(modifier._id))
    }) */
    object.modifiers_ids = modifiersIds
    object.groupModifiers_ids = groupModifiersIds
    object.category_id = [object.category_id._id]
    dishAPI
      .updateDish(object, token)
      .then((res: TDish) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (res._id) {
          setDish(res)
          const array: TModifier[] = []
          filteredModifiers.forEach((modifier) => {
            if (modifier._id !== values.modifier_id) {
              array.push(modifier)
            }
          })
          array.sort((a, b) =>
            (a.title[language] as string).localeCompare(
              b.title[language] as string
            )
          )
          form.resetFields()
          setFileterdModifiers([...array])
          setModifersInDish(res.modifiers_ids)
        } else {
          openNotification(t('something-went-wrong'), 'topRight')
        }
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  function handleToggleActive (modifier: any) {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    modifier.active = !modifier.active
    modifierAPI
      .updateModifier(modifier, token)
      .then((resModifier: TModifier) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (resModifier._id) {
          const searchModifierInDish = modifersInDish.find(
            (modifierInDish) => modifierInDish._id === resModifier._id
          )
          if (searchModifierInDish != null) {
            searchModifierInDish.active = resModifier.active
          }
          setModifersInDish([...modifersInDish])
          dish.modifiers_ids = [...modifersInDish]
          setDish(dish)
          const searchModifierInAllModifiers = allModifiers.find(
            (mod) => mod._id === resModifier._id
          )
          if (searchModifierInAllModifiers != null) {
            searchModifierInAllModifiers.active = resModifier.active
          }
          setAllModifiers([...allModifiers])
        } else {
          openNotification(t('something-went-wrong'), 'topRight')
        }
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  function handleDeleteModifierFromDish (modifier: any): void {
    const modifiersIds: string[] = []
    const groupModifiersIds: string[] = []
    dish.modifiers_ids.forEach((item) => {
      if (item._id !== modifier._id) {
        modifiersIds.push(item._id)
      }
    })

    dish.groupModifiers_ids.forEach((item) => {
      groupModifiersIds.push(item._id)
    })

    const object: any = cloneDeep(dish)
    object.modifiers_ids = modifiersIds
    object.groupModifiers_ids = groupModifiersIds
    object.category_id = [object.category_id._id]
    dishAPI
      .updateDish(object, token)
      .then((res: TDish) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (res._id) {
          setDish(res)
          setModifersInDish(res.modifiers_ids)
          const arrayModifiers: TModifier[] = []
          allModifiers.forEach((modifier) => {
            let flag = false
            res.modifiers_ids.forEach((modifierInDish) => {
              if (modifierInDish._id === modifier._id) {
                flag = true
              }
            })
            if (!flag) {
              arrayModifiers.push(modifier)
            }
          })
          arrayModifiers.sort((a, b) =>
            (a.title[language] as string).localeCompare(
              b.title[language] as string
            )
          )
          setFileterdModifiers(arrayModifiers)
        } else {
          openNotification(t('something-went-wrong'), 'topRight')
        }
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  const columns: ColumnsType<TModifier> = [
    {
      title: `${t('name')}`,
      dataIndex: 'title',
      key: 'title',
      render: (title, modifier) => (
        <Link to={`/${rest.pathRest}/modifier/:${modifier._id}`}>
          {' '}
          {title[language]}
        </Link>
      ),
      sorter: (a, b) =>
        (a.title[language] as string).localeCompare(b.title[language] as string)
    },
    {
      title: `${t('price')}`,
      dataIndex: 'price',
      key: 'price',
      // defaultSortOrder: 'descend',
      sorter: (a, b) => a.price - b.price
    },
    {
      title: `${t('parent-group')}`,
      dataIndex: 'categoryModifier',
      key: 'categoryModifier',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      render: (categoryModifier) => {
        let titleCategory = ''
        if (categoryModifier !== null) {
          const category = nameCategories.find(
            (category) => category.value === categoryModifier
          )
          if (category != null) {
            titleCategory = category.text
          }
        }
        return <p>{titleCategory}</p>
      },
      filters: [...nameCategories],
      onFilter: (value: string | number | boolean, record) =>
        record.categoryModifier === value
    },
    {
      title: `${t('condition')}`,
      dataIndex: 'active',
      key: 'active',
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      render: (active) => (active ? <p>{t('yes')}</p> : <p>{t('no')}</p>),
      filters: [
        { text: `${t('yes')}`, value: true },
        { text: `${t('no')}`, value: false }
      ],
      onFilter: (value: string | number | boolean, record) =>
        record.active === value
    },
    {
      title: '',
      dataIndex: 'operation',
      render: (_, record: { _id: React.Key }) =>
        data.length >= 1
          ? (
          <Popconfirm
            title={t('change-modifier-activity')}
            onConfirm={() => handleToggleActive(record)}
          >
            <a>.&nbsp;.&nbsp;.</a>
          </Popconfirm>
            )
          : null
    },
    {
      title: '',
      dataIndex: 'operation',
      render: (_, record: { _id: React.Key }) =>
        data.length >= 1
          ? (
          <Popconfirm
            title={t('delete-modifier-from-dish')}
            onConfirm={() => handleDeleteModifierFromDish(record)}
          >
            <DeleteTwoTone />
          </Popconfirm>
            )
          : null
    }
  ]

  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: t('you-nedd-choose-modifier-for-dish')
  }

  return (
    <>
      <Form
        {...layout}
        onFinish={onFinish}
        name='dish'
        form={form}
        validateMessages={validateMessages}
        style={{ paddingTop: '1.5rem' }}
      >
        <Form.Item
          label={t('select-modifier-for-add-in-dish')}
          name='modifier_id'
          rules={[{ required: true }]}
        >
          <Select data-test-id="modifiers-select">
            {filteredModifiers.map((modifier) => (
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              <Select.Option value={modifier._id} key={modifier._id} data-test-id={`modifiers-select-${modifier.title[language]}`}>
                {modifier.title[language]}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type='primary' htmlType='submit' data-test-id="modifiers-add-button">
            {t('add-in-dish')}
          </Button>
        </Form.Item>
      </Form>
      <Table columns={columns} dataSource={modifersInDish} />
    </>
  )
}
export default ModifiersForDish
