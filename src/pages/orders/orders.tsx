import React, { FC } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ECountry, TOrder, TRest } from '../../utils/typesFromBackend'
import * as ordersApi from '../../utils/api/order-api'
import * as restApi from '../../utils/api/rest-api'
import Table, { ColumnsType } from 'antd/es/table'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import RU from 'antd/es/locale/ru_RU'
import KZ from 'antd/es/locale/kk_KZ'
import EN from 'antd/es/locale/en_US'
import { ConfigProvider } from 'antd'

interface INameCategories {
  text: string
  value: string
}
interface IOrders {
  token: string
  rest: TRest
  t: (arg0: string) => string
  language: ECountry
}

const Orders: FC<IOrders> = ({ token, rest, t, language }) => {
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

  const { openNotification } = React.useContext(NotificationContext)
  //
  const [orders, setOrders] = React.useState<TOrder[]>([])
  const [nameStatus, setNameStatus] = React.useState<INameCategories[]>([])
  const [nameType, setNameType] = React.useState<INameCategories[]>([])
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const [restData, setRestData] = React.useState<TRest>({} as TRest)
  const [isLoading, setIsLoading] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const location = useLocation()

  const handlePageSizeChange = (current: number, size: number): void => {
    setPageSize(size)
    localStorage.setItem('pageSize', size.toString()) // Сохраняем выбранное значение в localStorage
  }

  const handlePageChange = (page: number): void => {
    setCurrentPage(page)
    localStorage.setItem('currentPage', page.toString())
  }

  React.useEffect(() => {
    const storedPage = localStorage.getItem('currentPage')
    if (storedPage !== null && storedPage !== undefined) {
      setCurrentPage(Number(storedPage))
    }
    const storedPageSize: string | null = localStorage.getItem('pageSize')
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (storedPageSize) {
      setPageSize(Number(storedPageSize))
    }
  }, [])

  React.useEffect(() => {
    Promise.all([
      ordersApi.getListOrders(rest._id, token),
      restApi.getRest(rest._id)
    ])
      .then(([listOrders, rest]: [TOrder[], TRest]) => {
        setOrders(listOrders)
        setRestData(rest)
        const arrayNameStatus: INameCategories[] = []
        const arrayNameType: INameCategories[] = []
        rest.orderType_ids.forEach((type) => {
          arrayNameType.push({
            text: type.title[language] ?? '',
            value: type._id
          })
        })
        rest.orderStatus_ids.forEach((status) => {
          arrayNameStatus.push({
            text: status.title[language] ?? '',
            value: status._id
          })
        })
        setNameStatus(arrayNameStatus)
        setNameType(arrayNameType)
        setIsLoading(true)
      })
      .catch((e) => openNotification(e, 'topRight'))
    const currentPath = location.pathname
    window.localStorage.setItem('initialRoute', currentPath)
  }, [])

  const ordersWithNumericDate = orders.map((order) => ({
    ...order,
    numericCreationDate: parseInt(order.creation_date)
  }))

  const sortedOrders = ordersWithNumericDate.sort(
    (a, b) => b.numericCreationDate - a.numericCreationDate
  )

  const columns: ColumnsType<TOrder> = [
    {
      title: `${t('order-number')}`,
      dataIndex: 'incomingOrderId',
      key: 'incomingOrderId',
      render: (incomingOrderId, order) => (
        <Link to={`/${rest.pathRest}/order/:${order._id}`}>
          {incomingOrderId}
        </Link>
      )
    },
    {
      title: `${t('order-creation-date')}`,
      dataIndex: 'creation_date',
      key: 'creation_date',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      render: (creation_date, order) => {
        const date = new Date(Number(creation_date))
        return (
          <Link to={`/${rest.pathRest}/order/:${order._id}`}>
            <p>{date.toLocaleDateString('ru-RU')}</p>
          </Link>
        )
      }
    },
    {
      title: `${t('date-delivery-or-pickup')}`,
      dataIndex: 'datetime',
      key: 'datetime',
      render: (datetime, order) => {
        if (datetime !== 'yes') {
          const date = new Date(Number(datetime))
          return (
            <Link to={`/${rest.pathRest}/order/:${order._id}`}>
              <p>{date.toLocaleDateString('ru-RU')}</p>
            </Link>
          )
        }
      }
    },
    {
      title: `${t('place')}`,
      dataIndex: 'orderType_id',
      key: 'orderType_id',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      render: (orderType_id, order) => {
        const orderTypeText = restData.orderType_ids.find(
          (type) => type._id === orderType_id
        )
        if (orderTypeText != null) {
          return (
            <Link to={`/${rest.pathRest}/order/:${order._id}`}>
              <p>{orderTypeText.title[language]}</p>
            </Link>
          )
        }
      },
      filters: [...nameType],
      onFilter: (value: string | number | boolean, record) => {
        if (
          typeof record.orderType_id === 'string' &&
          record.orderType_id !== null
        ) {
          return record.orderType_id === value
        }
        return false
      }
    },
    {
      title: `${t('status')}`,
      dataIndex: 'orderStatusId',
      key: 'orderStatusId',
      render: (orderStatusId, order) => {
        const orderStatus = restData.orderStatus_ids.find(
          (type) => type._id === orderStatusId
        )
        if (orderStatus != null) {
          return (
            <Link to={`/${rest.pathRest}/order/:${order._id}`}>
              <p>{orderStatus.title[language]}</p>
            </Link>
          )
        }
      },
      filters: [...nameStatus],
      onFilter: (value: string | number | boolean, record) => {
        if (
          typeof record.orderStatusId === 'string' &&
          record.orderStatusId !== null
        ) {
          return record.orderStatusId === value
        }
        return false
      }
    },
    {
      title: `${t('cost')}`,
      dataIndex: 'orderPrice',
      key: 'orderPrice',
      render: (orderPrice) => (
        <p>
          {orderPrice}&nbsp;{restData.currentCurrency}
        </p>
      ),
      sorter: (a, b) => a.orderPrice - b.orderPrice
    }
  ]

  return (
    <>
      {isLoading && (
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
                {t('orders')}
              </h2>
              <p style={{ marginBottom: '0' }}>{t('your-list-orders')}</p>
            </div>
          </div>
          <ConfigProvider locale={localeForTable}>
            <Table
              columns={columns}
              dataSource={sortedOrders}
              pagination={{
                current: currentPage,
                pageSize,
                onChange: handlePageChange,
                onShowSizeChange: handlePageSizeChange
              }}
            />
          </ConfigProvider>
        </div>
      )}
    </>
  )
}
export default Orders
