import React, { FC, useContext } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ECountry, TCategory, TRest } from '../../utils/typesFromBackend'
import * as categoriesAPI from '../../utils/api/category-api'
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

interface ICategories {
  token: string
  rest: TRest
  t: (arg0: string) => string
  language: ECountry
}
const Categories: FC<ICategories> = ({ token, rest, t, language }) => {
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

  const [data, setData] = React.useState<TCategory[]>([])
  const [nameCategories, setNameCategories] = React.useState<INameCategories[]>(
    []
  )
  const [isLoading, setIsLoading] = React.useState(false)
  const location = useLocation()

  React.useEffect(() => {
    categoriesAPI
      .getListCategories(rest._id)
      .then((res: TCategory[]) => {
        const objectNames: { [key: string]: boolean } = {}
        const resultArrayNameCategories: INameCategories[] = []
        res.forEach((category: TCategory) => {
          if (typeof category.category_id === 'string') {
            if (!objectNames[category.category_id]) {
              objectNames[category.category_id] = true
            }
          }
        })
        for (const key of Object.keys(objectNames)) {
          const value = res.find((category) => category._id === key)
          if (value != null) {
            resultArrayNameCategories.push({
              text: value.title[language] as string,
              value: key
            })
          }
        }
        setNameCategories(resultArrayNameCategories)
        res.forEach((category) => {
          if (typeof category.category_id === 'string') {
            const searchCategory = res.find(
              (item) => item._id === category.category_id
            )
            if (searchCategory != null) {
              category.category_id = searchCategory
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

  const columns: ColumnsType<TCategory> = [
    {
      title: `${t('name')}`,
      dataIndex: 'title',
      key: 'title',
      render: (title, category) => (
        <Link to={`/${rest.pathRest}/category/:${category._id}`}>
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
      dataIndex: 'category_id',
      key: 'category_id',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      render: (category_id) =>
        category_id !== null ? <p>{category_id.title[language]}</p> : '',
      filters: [...nameCategories],
      onFilter: (value: string | number | boolean, record) => {
        if (
          typeof record.category_id !== 'string' &&
          record.category_id !== null
        ) {
          return record.category_id._id === value
        }
        return false
      }
    },
    {
      title: '',
      dataIndex: 'operation',
      render: (_, record: { _id: React.Key }) =>
        data.length >= 1 ? (
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          <Popconfirm
            title={t('change-active')}
            onConfirm={() => handleToggleActive(record)}
          >
            <a>.&nbsp;.&nbsp;.</a>
          </Popconfirm>
        ) : null
    },
    {
      title: '',
      dataIndex: 'operation',
      render: (_, record: { _id: React.Key }) =>
        data.length >= 1 ? (
          <Popconfirm
            title={t('Delete-category-permanently')}
            onConfirm={() => handleDeleteCategory(record)}
          >
            <DeleteTwoTone />
          </Popconfirm>
        ) : null
    }
  ]
  function handleToggleActive(category: any): void {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    categoriesAPI
      .updateCategory({ ...category, active: !category.active }, token)
      .then((resCategory) => {
        const result: TCategory[] = []
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
  function handleDeleteCategory(category: any): void {
    categoriesAPI
      .deleteCategory(category._id, token)
      .then(() => {
        const resultArray: TCategory[] = []
        data.forEach((item) => {
          if (category._id !== item._id) {
            resultArray.push(item)
          }
        })
        const objectNames: { [key: string]: boolean } = {}
        const resultArrayNameCategories: INameCategories[] = []
        resultArray.forEach((category: TCategory) => {
          if (category.category_id !== null) {
            if (typeof category.category_id !== 'string') {
              if (!objectNames[category.category_id._id]) {
                objectNames[category.category_id._id] = true
              }
            }
          }
        })
        for (const key of Object.keys(objectNames)) {
          const value = resultArray.find((category) => category._id === key)
          if (value != null) {
            resultArrayNameCategories.push({
              text: value.title[language] as string,
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
      {isLoading ? (
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
              to={`/${rest.pathRest}/add/category`}
              data-test-id='btn-add-category'
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
            <Table columns={columns} dataSource={data}/>
          </ConfigProvider>
        </div>
      ) : (
        ''
      )}
    </>
  )
}
export default Categories
