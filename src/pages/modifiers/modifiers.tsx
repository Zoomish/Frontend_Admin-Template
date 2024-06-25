import React, { FC, useContext } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  ECountry,
  TCategoryModifier,
  TModifier,
  TRest
} from '../../utils/typesFromBackend'
import * as modifiersAPI from '../../utils/api/modifier-api'
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

interface IModifiers {
  token: string
  rest: TRest
  t: (arg0: string) => string
  language: ECountry
}

const Modifiers: FC<IModifiers> = ({ token, rest, t, language }) => {
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

  const [data, setData] = React.useState<TModifier[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [nameCategories, setNameCategories] = React.useState<INameCategories[]>(
    []
  )
  const [allModifiersCategories, setAllModifiersCategories] = React.useState<
  TCategoryModifier[]
  >([])
  const location = useLocation()

  React.useEffect(() => {
    Promise.all([
      modifiersAPI.getListModifiers(rest._id),
      categoriesModifiersApi.getListCategoriesModifiers(rest._id)
    ])
      .then(
        ([arrayModifiers, arrayModifiersCategories]: [
          TModifier[],
          TCategoryModifier[]
        ]) => {
          setData(arrayModifiers)
          const objectNames: { [key: string]: boolean } = {}
          const resultArrayNameCategories: INameCategories[] = []
          arrayModifiers.forEach((modifier: TModifier) => {
            if (typeof modifier.categoryModifier === 'string') {
              if (!objectNames[modifier.categoryModifier]) {
                objectNames[modifier.categoryModifier] = true
              }
            }
          })
          for (const key of Object.keys(objectNames)) {
            const value = arrayModifiersCategories.find(
              (category) => category._id === key
            )
            if (value != null) {
              resultArrayNameCategories.push({
                text: value.title[language] ?? '',
                value: key
              })
            }
          }
          setNameCategories(resultArrayNameCategories)
          setAllModifiersCategories(arrayModifiersCategories)
          setIsLoading(true)
        }
      )
      .catch((e) => openNotification(e, 'topRight'))
    const currentPath = location.pathname
    window.localStorage.setItem('initialRoute', currentPath)
  }, [])

  const columns: ColumnsType<TModifier> = [
    {
      title: `${t('name')}`,
      dataIndex: 'title',
      key: 'title',
      render: (title, modifier) => (
        <Link to={`/${rest.pathRest}/modifier/:${modifier._id}`}>
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
            title={t('Delete-modifier-permanently')}
            onConfirm={() => handleDeleteModifier(record)}
          >
            <DeleteTwoTone />
          </Popconfirm>
            )
          : null
    }
  ]

  function handleToggleActive (modifier: any): void {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    modifiersAPI
      .updateModifier({ ...modifier, active: !modifier.active }, token)
      .then((modifier) => {
        const result: TModifier[] = []
        data.forEach((item) => {
          if (item._id === modifier._id) {
            item.active = modifier.active
          }
          result.push(item)
        })
        setData([...result])
      })
      .catch((e) => openNotification(e, 'topRight'))
  }
  function handleDeleteModifier (modifier: any): void {
    modifiersAPI
      .deleteModifier(modifier._id, token)
      .then(() => {
        const resultArray: TModifier[] = []
        data.forEach((item) => {
          if (modifier._id !== item._id) {
            resultArray.push(item)
          }
        })
        const objectNames: { [key: string]: boolean } = {}
        const resultArrayNameCategories: INameCategories[] = []
        resultArray.forEach((mod: TModifier) => {
          if (mod.categoryModifier !== null) {
            if (typeof mod.categoryModifier === 'string') {
              if (!objectNames[mod.categoryModifier]) {
                objectNames[mod.categoryModifier] = true
              }
            }
          }
        })
        for (const key of Object.keys(objectNames)) {
          const value = allModifiersCategories.find(
            (category) => category._id === key
          )
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
                {t('modifiers')}
              </h2>
              <p style={{ marginBottom: '0' }}>{t('your-list-modifiers')}</p>
            </div>
            <NavLink
              to={`/${rest.pathRest}/add/modifier`}
              data-test-id="modifiers-create-button"
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
export default Modifiers
