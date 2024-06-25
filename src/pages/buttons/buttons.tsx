import React, { FC, useContext } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ECountry, TButton, TRest } from '../../utils/typesFromBackend'
import * as restApi from '../../utils/api/rest-api'
import * as buttonApi from '../../utils/api/button-api'
import Table, { ColumnsType } from 'antd/es/table'
import { ConfigProvider, Popconfirm } from 'antd'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import RU from 'antd/es/locale/ru_RU'
import KZ from 'antd/es/locale/kk_KZ'
import EN from 'antd/es/locale/en_US'

interface IButtons {
  token: string
  rest: TRest
  t: (arg0: string) => string
  language: ECountry
}
const Buttons: FC<IButtons> = ({ token, rest, t, language }) => {
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
  const location = useLocation()

  const [dataButtons, setDataButtons] = React.useState<TButton[]>([])

  React.useEffect(() => {
    restApi
      .getRest(rest._id)
      .then((res: TRest) => {
        setDataButtons(res.buttons_ids)
      })
      .catch((e) => openNotification(e, 'topRight'))
    const currentPath = location.pathname
    window.localStorage.setItem('initialRoute', currentPath)
  }, [])

  function handleToggleActive (button: any): void {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    buttonApi
      .updateButton({ ...button, active: !button.active }, token)
      .then((res: TButton) => {
        const arrayButtons: TButton[] = []
        dataButtons.forEach((element) => {
          if (element._id === res._id) {
            arrayButtons.push(res)
          } else {
            arrayButtons.push(element)
          }
        })
        setDataButtons(arrayButtons)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  const columns: ColumnsType<TButton> = [
    {
      title: `${t('name')}`,
      dataIndex: 'title',
      key: 'title',
      render: (title, orderStatus) => (
        <Link to={`/${rest.pathRest}/button/:${orderStatus._id}`}>
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
      title: '',
      dataIndex: 'operation',
      render: (_, record: { _id: React.Key }) =>
        dataButtons.length >= 1
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
            {t('your-custom-buttons')}
          </h2>
          <p style={{ marginBottom: '0' }}>
            {t('your-list-configured-buttons')}
          </p>
        </div>
        <NavLink
          to={`/${rest.pathRest}/add/button`}
          data-test-id='button-create-button'
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
        <Table columns={columns} dataSource={dataButtons} />
      </ConfigProvider>
    </div>
  )
}
export default Buttons
