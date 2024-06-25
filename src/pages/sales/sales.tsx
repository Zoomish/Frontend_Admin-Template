/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { FC, useContext } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ECountry, TRest, TSale } from '../../utils/typesFromBackend'
import * as salesApi from '../../utils/api/sales-api'
import Table, { ColumnsType } from 'antd/es/table'
import imageNoPhoto from '../../assets/images/no_photo.png'
import { BASE_URL_CDN } from '../../utils/const'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import RU from 'antd/es/locale/ru_RU'
import KZ from 'antd/es/locale/kk_KZ'
import EN from 'antd/es/locale/en_US'
import { ConfigProvider } from 'antd'

interface ISales {
  rest: TRest
  t: (arg0: string) => string
  language: ECountry
}

const Sales: FC<ISales> = ({ rest, t, language }) => {
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
  const [sales, setSales] = React.useState<TSale[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const location = useLocation()

  React.useEffect(() => {
    salesApi
      .getListSales(rest._id)
      .then((res: TSale[]) => {
        setSales(res)
        setIsLoading(true)
      })
      .catch((e) => openNotification(e, 'topRight'))
    const currentPath = location.pathname
    window.localStorage.setItem('initialRoute', currentPath)
  }, [])

  const columns: ColumnsType<TSale> = [
    {
      title: `${t('name')}`,
      dataIndex: 'title',
      key: 'title',
      render: (title, sale) => (
        <Link to={`/${rest.pathRest}/sale/:${sale._id}`}> {title}</Link>
      )
    },
    {
      title: `${t('promotion-start-date')}`,
      dataIndex: 'dateStartSales',
      key: 'dateStartSales',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      render: (dateStartSales, sale) => {
        const date = new Date(dateStartSales)
        return (
          <Link to={`/${rest.pathRest}/sale/:${sale._id}`}>
            {' '}
            <p>{date.toLocaleDateString('ru-RU')}</p>
          </Link>
        )
      }
    },
    {
      title: `${t('promotion-finish-date')}`,
      dataIndex: 'dateFinishSales',
      key: 'dateFinishSales',
      render: (dateFinishSales, sale) => {
        const date = new Date(dateFinishSales)
        return (
          <Link to={`/${rest.pathRest}/sale/:${sale._id}`}>
            {' '}
            <p>{date.toLocaleDateString('ru-RU')}</p>
          </Link>
        )
      }
    },
    {
      title: `${t('status')}`,
      dataIndex: 'action',
      key: 'action',
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      render: (action) =>
        action ? <p>{t('active')}</p> : <p>{t('inactive')}</p>,
      filters: [
        { text: `${t('active')}`, value: true },
        { text: `${t('inactive')}`, value: false }
      ],
      onFilter: (value: string | number | boolean, record) =>
        record.action === value
    },
    {
      title: `${t('description-promotion')}`,
      dataIndex: 'description',
      key: 'description',
      render: (description) => <p>{description}</p>
    },
    {
      title: `${t('image-promotion')}`,
      dataIndex: 'image',
      key: 'image',
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      render: (image) =>
        image
          ? (
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          <img
            src={`${BASE_URL_CDN}/${image}`}
            style={{ width: '100px', height: '100px', objectFit: 'contain' }}
          />
            )
          : (
          <img
            src={imageNoPhoto}
            style={{ width: '100px', height: '100px', objectFit: 'contain' }}
          />
            )
    }
  ]
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
                {t('sales')}
              </h2>
              <p style={{ marginBottom: '0' }}>{t('your-list-sales')}</p>
            </div>
            <NavLink
              to={`/${rest.pathRest}/add/sale`}
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
            <Table columns={columns} dataSource={sales} />
          </ConfigProvider>
        </div>
          )
        : (
            ''
          )}
    </>
  )
}
export default Sales
