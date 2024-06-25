import { Button, Form, Popconfirm, Select, Table } from 'antd'
import React, { FC, useContext } from 'react'
import { Link, useLocation, useRouteMatch } from 'react-router-dom'
import {
  ECountry,
  TCategoryModifier,
  TDish,
  TRest
} from '../../utils/typesFromBackend'
import { DeleteTwoTone } from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'
import { cloneDeep } from '../../utils/helpers'
import * as dishAPI from '../../utils/api/dish-api'
import * as categoriesModifiersApi from '../../utils/api/category-modifier-api'
import { NotificationContext } from '../notification-provider/notification-provider'

interface IGroupModifiersForDish {
  dataAllCategoriesModifiers: TCategoryModifier[]
  token: string
  rest: TRest
  t: (arg0: string) => string
  language: ECountry
}

const GroupModifiersForDish: FC<IGroupModifiersForDish> = ({
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
  const [filteredGroupModifiers, setFileterdGroupModifiers] = React.useState<
  TCategoryModifier[]
  >([])
  const [allCategoryModifiers, setAllCategoryModifiers] = React.useState<
  TCategoryModifier[]
  >([])
  const [groupModifersInDish, setGroupModifersInDish] = React.useState<
  TCategoryModifier[]
  >([])
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const [dish, setDish] = React.useState<TDish>({} as TDish)

  React.useEffect(() => {
    localStorage.setItem('value', 'group-modifiers-for-dish')
  }, [language])

  React.useEffect(() => {
    dishAPI
      .getDish(dishId)
      .then((dishFromMenu: TDish) => {
        setDish(dishFromMenu)
        setAllCategoryModifiers(dataAllCategoriesModifiers)
        setGroupModifersInDish(dishFromMenu.groupModifiers_ids)
        const arrayModifiers: TCategoryModifier[] = []
        dataAllCategoriesModifiers.forEach((groupModifier) => {
          let flag = false
          dishFromMenu.groupModifiers_ids.forEach((groupModifierInDish) => {
            if (groupModifierInDish._id === groupModifier._id) {
              flag = true
            }
          })
          if (!flag) {
            arrayModifiers.push(groupModifier)
          }
        })
        setFileterdGroupModifiers(
          arrayModifiers.sort((a, b) =>
            (a.title[language] as string).localeCompare(
              b.title[language] as string
            )
          )
        )
      })
      .catch((e) => openNotification(e, 'topRight'))
  }, [])

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 }
  }
  const [form] = Form.useForm()

  const onFinish = (values: any): void => {
    const groupModifiersIds: string[] = []
    const modifiersIds: string[] = []
    dish.groupModifiers_ids.forEach((item) => {
      groupModifiersIds.push(item._id)
    })

    dish.modifiers_ids.forEach((item) => {
      modifiersIds.push(item._id)
    })
    groupModifiersIds.push(values.category_id)
    const object: any = cloneDeep(dish)
    object.groupModifiers_ids = groupModifiersIds
    object.modifiers_ids = modifiersIds
    object.category_id = [object.category_id._id]
    /* const result: string[] = []
    dish.groupModifiers_ids.forEach((item) => {
      result.push(item._id)
    })
    const resultSearch: any = allCategoryModifiers.find(
      (category) => category._id === values.category_id
    )
    if (resultSearch != null) {
      result.push(resultSearch)
    }
    const object: any = cloneDeep(dish)
    object.groupModifiers_ids = result
    console.log(object) */
    dishAPI
      .updateDish(object, token)
      .then((res: TDish) => {
        setDish(res)
        const array: TCategoryModifier[] = []
        filteredGroupModifiers.forEach((groupModifier) => {
          if (groupModifier._id !== values.category_id) {
            array.push(groupModifier)
          }
        })
        array.sort((a, b) =>
          (a.title[language] as string).localeCompare(
            b.title[language] as string
          )
        )
        form.resetFields()
        setFileterdGroupModifiers([...array])
        setGroupModifersInDish(res.groupModifiers_ids)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  function handleToggleActive (groupModifier: any): void {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    groupModifier.active = !groupModifier.active
    categoriesModifiersApi
      .updateCategoryModifier(groupModifier, token)
      .then((resGroupModifier) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (resGroupModifier._id) {
          const searchModifierInDish = groupModifersInDish.find(
            (modifierInDish) => modifierInDish._id === resGroupModifier._id
          )
          if (searchModifierInDish != null) {
            searchModifierInDish.active = resGroupModifier.active
          }
          setGroupModifersInDish([...groupModifersInDish])
          dish.groupModifiers_ids = [...groupModifersInDish]
          setDish(dish)
          const searchModifierInAllModifiers = allCategoryModifiers.find(
            (mod) => mod._id === resGroupModifier._id
          )
          if (searchModifierInAllModifiers != null) {
            searchModifierInAllModifiers.active = resGroupModifier.active
          }
          setAllCategoryModifiers([...allCategoryModifiers])
        } else {
          openNotification(t('something-went-wrong'), 'topRight')
        }
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  function handleDeleteModifierFromDish (groupModifier: any): void {
    const groupModifiersIds: string[] = []
    const modifiersIds: string[] = []
    dish.groupModifiers_ids.forEach((item) => {
      if (item._id !== groupModifier._id) {
        groupModifiersIds.push(item._id)
      }
    })

    dish.modifiers_ids.forEach((item) => {
      modifiersIds.push(item._id)
    })

    const object: any = cloneDeep(dish)
    object.groupModifiers_ids = groupModifiersIds
    object.modifiers_ids = modifiersIds
    object.category_id = [object.category_id._id]
    dishAPI
      .updateDish(object, token)
      .then((res: TDish) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (res._id) {
          setDish(res)
          setGroupModifersInDish(res.groupModifiers_ids)
          const arrayModifiers: TCategoryModifier[] = []
          allCategoryModifiers.forEach((groupModifier) => {
            let flag = false
            res.groupModifiers_ids.forEach((modifierInDish) => {
              if (modifierInDish._id === groupModifier._id) {
                flag = true
              }
            })
            if (!flag) {
              arrayModifiers.push(groupModifier)
            }
          })
          arrayModifiers.sort((a, b) =>
            (a.title[language] as string).localeCompare(
              b.title[language] as string
            )
          )
          setFileterdGroupModifiers(arrayModifiers)
        } else {
          openNotification(t('something-went-wrong'), 'topRight')
        }
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  const columns: ColumnsType<TCategoryModifier> = [
    {
      title: `${t('name')}`,
      dataIndex: 'title',
      key: 'title',
      render: (title, modifier) => (
        <Link to={`/${rest.pathRest}/group-modifier/:${modifier._id}`}>
          {title[language]}
        </Link>
      ),
      sorter: (a, b) =>
        (a.title[language] as string).localeCompare(b.title[language] as string)
    },
    {
      title: `${t('parent-group')}`,
      dataIndex: 'categoryModifiers_id',
      key: 'categoryModifies_id',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      render: (categoryModifiers_id) => {
        let titleCategory = ''
        if (categoryModifiers_id !== null) {
          const category = allCategoryModifiers.find(
            (category) => category._id === categoryModifiers_id
          )
          if (category != null) {
            titleCategory = category.title[language] as string
          }
        }
        return <p>{titleCategory}</p>
      }
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
        dataAllCategoriesModifiers.length >= 1
          ? (
          <Popconfirm
            title={t('change-group-modifier-activity')}
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
        dataAllCategoriesModifiers.length >= 1
          ? (
          <Popconfirm
            title={t('delete-group-modifier-from-dish')}
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
    required: t('you-nedd-choose-group-modifier-for-dish')
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
          name='category_id'
          rules={[{ required: true }]}
        >
          <Select data-test-id="group-modifiers-select">
            {filteredGroupModifiers.map((modifier) => (
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              <Select.Option value={modifier._id} key={modifier._id} data-test-id={`group-modifiers-select-${modifier.title[language]}`}>
                {modifier.title[language]}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type='primary' htmlType='submit' data-test-id="group-modifiers-add-button">
            {t('add-in-dish')}
          </Button>
        </Form.Item>
      </Form>
      <Table columns={columns} dataSource={groupModifersInDish} />
    </>
  )
}
export default GroupModifiersForDish
