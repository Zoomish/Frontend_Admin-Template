import { Popconfirm, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import React, { FC, useContext } from 'react'
import { ECountry, TDish, TRest } from '../../utils/typesFromBackend'
import * as dishAPI from '../../utils/api/dish-api'
import { Link, NavLink, useLocation } from 'react-router-dom'
import imageNoPhoto from '../../assets/images/no_photo.png'
import { BASE_URL_CDN } from '../../utils/const'
import { NotificationContext } from '../../components/notification-provider/notification-provider'

interface INameCategories {
  text: string
  value: string
}

interface IMenu {
  token: string
  rest: TRest
  t: (arg0: string) => string
  language: ECountry
}

const Menu: FC<IMenu> = ({ token, rest, t, language }) => {
  const { openNotification } = useContext(NotificationContext)

  const [data, setData] = React.useState<TDish[]>([])
  const [nameCategories, setNameCategories] = React.useState<INameCategories[]>(
    []
  )
  const location = useLocation()

  React.useEffect(() => {
    dishAPI
      .getListDish(rest._id)
      .then((res) => {
        setData(res)
        const objectNames: { [key: string]: boolean } = {}
        const resultArrayNameCategories: INameCategories[] = []
        res.forEach((dish: TDish) => {
          if (!objectNames[dish.category_id.title[language] as string]) {
            objectNames[dish.category_id.title[language] as string] = true
          }
        })
        for (const key of Object.keys(objectNames)) {
          resultArrayNameCategories.push({ text: key, value: key })
        }
        setNameCategories(resultArrayNameCategories)
      })
      .catch((e) => openNotification(e, 'topRight'))
    const currentPath = location.pathname
    window.localStorage.setItem('initialRoute', currentPath)
  }, [])

  const columns: ColumnsType<TDish> = [
    {
      title: `${t('image')}`,
      dataIndex: 'image',
      key: 'image',
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      render: (image) =>
        image ? (
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          <img
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            src={`${BASE_URL_CDN}/${image}`}
            style={{ width: '100px', height: '100px', objectFit: 'contain' }}
          />
        ) : (
          <img
            src={imageNoPhoto}
            style={{ width: '100px', height: '100px', objectFit: 'contain' }}
          />
        )
    },
    {
      title: `${t('name')}`,
      dataIndex: 'title',
      key: 'title',
      render: (title, dish) => (
        <Link to={`/${rest.pathRest}/dish/:${dish._id}`}>
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
      title: `${t('category')}`,
      dataIndex: 'category_id',
      key: 'category_id',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      render: (category_id) => <p>{category_id.title[language]}</p>,
      sorter: (a, b) =>
        (a.category_id.title[language] as string).localeCompare(
          b.category_id.title[language] as string
        ),
      filters: [...nameCategories],
      onFilter: (value: string | number | boolean, record) =>
        record.category_id.title[language] === value
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
    }
  ]
  function handleToggleActive(dish: any): void {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    dishAPI
      .updateDish({ ...dish, active: !dish.active }, token)
      .then((resDish) => {
        const result: TDish[] = []
        data.forEach((item) => {
          if (item._id === resDish._id) {
            item.active = resDish.active
          }
          result.push(item)
        })
        setData([...result])
      })
      .catch((e) => openNotification(e, 'topRight'))
  }
  return (
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
          <h2 style={{ fontWeight: 600, marginBottom: '0' }}>{t('menu')}</h2>
          <p style={{ marginBottom: '0' }}>{t('your-list-of-dishes')}</p>
        </div>
        <NavLink
          to={`/${rest.pathRest}/add/dish`}
          data-test-id="dish-create-button"
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
      <Table columns={columns} dataSource={data} />
    </div>
  )
}
export default Menu
