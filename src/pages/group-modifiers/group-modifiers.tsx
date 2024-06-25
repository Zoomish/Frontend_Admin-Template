import React, { FC, useContext } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  ECountry,
  TCategoryModifier,
  TRest
} from '../../utils/typesFromBackend'
import * as categoriesModifiersApi from '../../utils/api/category-modifier-api'
import Table, { ColumnsType } from 'antd/es/table'
import { ConfigProvider, Popconfirm } from 'antd'
import { DeleteTwoTone } from '@ant-design/icons'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import RU from 'antd/es/locale/ru_RU'
import KZ from 'antd/es/locale/kk_KZ'
import EN from 'antd/es/locale/en_US'

interface INameCategories {
  text: string
  value: string
}

interface IGroupModifiers {
  token: string
  rest: TRest
  t: (arg0: string) => string
  language: ECountry
}

const GroupModifiers: FC<IGroupModifiers> = ({ token, rest, t, language }) => {
  const [localeForTable, setLocaleForTable] = React.useState(EN)

  React.useEffect(() => {
    switch (language) {
      case 'RU':
        setLocaleForTable(RU)
        break
      case 'EN':
        setLocaleForTable(EN)
        break
      case 'KZ':
        setLocaleForTable(KZ)
        break
      default:
        setLocaleForTable(EN)
        break
    }
  }, [language])

  const { openNotification } = useContext(NotificationContext)

  const [data, setData] = React.useState<TCategoryModifier[]>([])
  const [nameCategories, setNameCategories] = React.useState<INameCategories[]>(
    []
  )
  const [isLoading, setIsLoading] = React.useState(false)

  const location = useLocation()

  React.useEffect(() => {
    categoriesModifiersApi
      .getListCategoriesModifiers(rest._id)
      .then((res: TCategoryModifier[]) => {
        const objectNames: { [key: string]: boolean } = {}
        const resultArrayNameCategories: INameCategories[] = []
        res.forEach((category: TCategoryModifier) => {
          if (typeof category.categoryModifiers_id === 'string') {
            if (!objectNames[category.categoryModifiers_id]) {
              objectNames[category.categoryModifiers_id] = true
            }
          }
        })
        for (const key of Object.keys(objectNames)) {
          const value = res.find((category) => category._id === key)
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          if (value) {
            resultArrayNameCategories.push({
              text: value.title[language] ?? '',
              value: key
            })
          }
        }
        setNameCategories(resultArrayNameCategories)
        res.forEach((category) => {
          if (typeof category.categoryModifiers_id === 'string') {
            const searchCategory = res.find(
              (item) => item._id === category.categoryModifiers_id
            )
            if (searchCategory != null) {
              category.categoryModifiers_id = searchCategory
            }
          }
        })
        setData(res)
        setIsLoading(true)
      })
      .catch(() => {
        openNotification(t('something-went-wrong'), 'topRight')
      })
    const currentPath = location.pathname
    window.localStorage.setItem('initialRoute', currentPath)
  }, [])

  const columns: ColumnsType<TCategoryModifier> = [
    {
      title: `${t('name')}`,
      dataIndex: 'title',
      key: 'title',
      render: (title, category) => (
        <Link to={`/${rest.pathRest}/group-modifier/:${category._id}`}>
          {' '}
          {title[language]}
        </Link>
      ),
      sorter: (a, b) =>
        (a.title[language] as string).localeCompare(b.title[language] as string)
    },
    {
      title: `${t('activity')}`,
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
      title: `${t('parent-category')}`,
      dataIndex: 'categoryModifiers_id',
      key: 'categoryModifiers_id',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      render: (categoryModifiers_id) => {
        if (
          categoryModifiers_id !== null &&
          categoryModifiers_id !== 'Не выбрана'
        ) {
          return <p>{categoryModifiers_id.title[language]}</p>
        } else if (categoryModifiers_id === 'Не выбрана') {
          return <p>Не выбрана</p>
        } else {
          return ''
        }
      },
      filters: [...nameCategories],
      onFilter: (value: string | number | boolean, record) => {
        if (
          typeof record.categoryModifiers_id !== 'string' &&
          record.categoryModifiers_id !== null
        ) {
          return record.categoryModifiers_id._id === value
        }
        return false
      }
    },
    {
      title: '',
      dataIndex: 'operation',
      render: (_, record: { _id: React.Key }) =>
        data.length >= 1
          ? (
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          <Popconfirm
            title={t('change-active')}
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
            title={t('Delete-modifiers-category-permanently')}
            onConfirm={() => handleDeleteCategory(record)}
          >
            <DeleteTwoTone />
          </Popconfirm>
            )
          : null
    }
  ]
  function handleToggleActive (category: any): void {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    categoriesModifiersApi
      .updateCategoryModifier({ ...category, active: !category.active }, token)
      .then((resCategory) => {
        const result: TCategoryModifier[] = []
        data.forEach((item) => {
          if (item._id === resCategory._id) {
            item.active = resCategory.active
          }
          result.push(item)
        })
        setData([...result])
      })
      .catch((e) => openNotification(e, 'topRight'))
  }
  function handleDeleteCategory (category: any): void {
    categoriesModifiersApi
      .deleteCategoryModifier(category._id, token)
      .then(() => {
        const resultArray: TCategoryModifier[] = []
        data.forEach((item) => {
          if (category._id !== item._id) {
            resultArray.push(item)
          }
        })
        const objectNames: { [key: string]: boolean } = {}
        const resultArrayNameCategories: INameCategories[] = []
        resultArray.forEach((category: TCategoryModifier) => {
          if (category.categoryModifiers_id !== null) {
            if (typeof category.categoryModifiers_id !== 'string') {
              if (!objectNames[category.categoryModifiers_id._id]) {
                objectNames[category.categoryModifiers_id._id] = true
              }
            }
          }
        })
        for (const key of Object.keys(objectNames)) {
          const value = resultArray.find((category) => category._id === key)
          if (value != null) {
            resultArrayNameCategories.push({
              text: value.title[language] ?? '',
              value: key
            })
          }
        }
        setNameCategories(resultArrayNameCategories)
        setData(resultArray)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }
  return (
    <>
      {isLoading
        ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              marginBottom: '1rem',
              alignItems: 'center',
              outline: 'none',
              padding: '0'
            }}
          >
            <div style={{ display: 'block', marginRight: 'auto' }}>
              <h2 style={{ fontWeight: 600, marginBottom: '0' }}>
                {t('categories')}
              </h2>
              <p style={{ marginBottom: '0' }}>{t('your-list-categories')}</p>
            </div>
            <NavLink
              to={`/${rest.pathRest}/add/group-modifier`}
              data-test-id="group-modifiers-create-button"
              style={{
                color: '#fff',
                backgroundColor: '#2bc155',
                borderColor: '#2bc155',
                width: '145px',
                height: '61px',
                borderRadius: '0.375rem',
                fontWeight: '500',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {t('add')}
            </NavLink>
          </div>
          <ConfigProvider locale={localeForTable}>
            <Table columns={columns} dataSource={data} />
          </ConfigProvider>
        </div>
          )
        : (
            ''
          )}
    </>
  )
}
export default GroupModifiers
