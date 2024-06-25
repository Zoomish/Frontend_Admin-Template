import { ConfigProvider, Popconfirm } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import React, { FC, useContext } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import * as restApi from '../../utils/api/rest-api'
import * as orderTypeApi from '../../utils/api/order-type-api'
import { ECountry, TOrderType, TRest } from '../../utils/typesFromBackend'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import RU from 'antd/es/locale/ru_RU'
import KZ from 'antd/es/locale/kk_KZ'
import EN from 'antd/es/locale/en_US'

interface IOrderTypes {
  token: string
  rest: TRest
  t: (arg0: string) => string
  language: ECountry
}

const OrderTypes: FC<IOrderTypes> = ({ token, rest, t, language }) => {
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
  const [dataOrderTypes, setDataOrderTypes] = React.useState<TOrderType[]>([])
  const location = useLocation()

  React.useEffect(() => {
    restApi
      .getRest(rest._id)
      .then((res: TRest) => {
        setDataOrderTypes(res.orderType_ids)
      })
      .catch((e) => openNotification(e, 'topRight'))
    const currentPath = location.pathname
    window.localStorage.setItem('initialRoute', currentPath)
  }, [])

  function handleToggleActive (orderType: any): void {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    orderTypeApi
      .updateOrderType({ ...orderType, active: !orderType.active }, token)
      .then((res: TOrderType) => {
        const arrayPayments: TOrderType[] = []
        dataOrderTypes.forEach((element) => {
          if (element._id === res._id) {
            arrayPayments.push(res)
          } else {
            arrayPayments.push(element)
          }
        })
        setDataOrderTypes(arrayPayments)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  const columns: ColumnsType<TOrderType> = [
    {
      title: `${t('name')}`,
      dataIndex: 'title',
      key: 'title',
      render: (title, orderType) => (
        <Link to={`/${rest.pathRest}/order-type/:${orderType._id}`}>
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
      title: '',
      dataIndex: 'operation',
      render: (_, record: { _id: React.Key }) =>
        dataOrderTypes.length >= 1
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
    }
  ]
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
          <h2 style={{ fontWeight: 600, marginBottom: '0' }}>
            {t('order-types')}
          </h2>
          <p style={{ marginBottom: '0' }}>{t('your-list-order-types')}</p>
        </div>
        <NavLink
          to={`/${rest.pathRest}/add/order-type`}
          data-test-id='order-types-create-button'
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
        <Table columns={columns} dataSource={dataOrderTypes} />
      </ConfigProvider>
    </div>
  )
}
export default OrderTypes
