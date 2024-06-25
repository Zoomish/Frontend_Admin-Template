import { ConfigProvider, Popconfirm } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import React, { FC, useContext } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import * as restApi from '../../utils/api/rest-api'
import * as customInputApi from '../../utils/api/custom-input-api'
import { ECountry, TCustomInput, TRest } from '../../utils/typesFromBackend'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import RU from 'antd/es/locale/ru_RU'
import KZ from 'antd/es/locale/kk_KZ'
import EN from 'antd/es/locale/en_US'

interface ICustomInputs {
  token: string
  rest: TRest
  t: (arg0: string) => string
  language: ECountry
}

const CustomInputs: FC<ICustomInputs> = ({ token, rest, t, language }) => {
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

  const [dataCustomInputs, setDataCustomInputs] = React.useState<
  TCustomInput[]
  >([])
  const location = useLocation()

  React.useEffect(() => {
    restApi
      .getRest(rest._id)
      .then((res: TRest) => {
        if (res.customInput_ids != null) {
          setDataCustomInputs(res.customInput_ids)
        }
      })
      .catch((e) => openNotification(e, 'topRight'))
    const currentPath = location.pathname
    window.localStorage.setItem('initialRoute', currentPath)
  }, [])

  function handleToggleActive (customInput: any): void {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    customInputApi
      .updateCustomInput(
        { ...customInput, required: !customInput.required },
        token
      )
      .then((res: TCustomInput) => {
        const arrayPayments: TCustomInput[] = []
        dataCustomInputs.forEach((element) => {
          if (element._id === res._id) {
            arrayPayments.push(res)
          } else {
            arrayPayments.push(element)
          }
        })
        setDataCustomInputs(arrayPayments)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  const columns: ColumnsType<TCustomInput> = [
    {
      title: `${t('name')}`,
      dataIndex: 'name',
      key: 'name',
      render: (name, customInput) => {
        return (
          <Link to={`/${rest.pathRest}/custom-input/:${customInput._id}`}>
            {' '}
            {name}
          </Link>
        )
      },
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: `${t('input-placeholder')}`,
      dataIndex: 'placeholder',
      key: 'placeholder',
      render: (placeholder, customInput) => (
        <Link to={`/${rest.pathRest}/custom-input/:${customInput._id}`}>
          {' '}
          {placeholder[language]}
        </Link>
      ),
      sorter: (a, b) =>
        (a.placeholder[language] as string).localeCompare(
          b.placeholder[language] as string
        )
    },
    {
      title: `${t('label-field')}`,
      dataIndex: 'label',
      key: 'label',
      render: (label, customInput) => (
        <Link to={`/${rest.pathRest}/custom-input/:${customInput._id}`}>
          {' '}
          {label[language]}
        </Link>
      ),
      sorter: (a, b) =>
        (a.label[language] as string).localeCompare(b.label[language] as string)
    },
    {
      title: `${t('input-field-required')}`,
      dataIndex: 'required',
      key: 'required',
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      render: (required) => (required ? <p>{t('yes')}</p> : <p>{t('no')}</p>),
      filters: [
        { text: `${t('yes')}`, value: true },
        { text: `${t('no')}`, value: false }
      ],
      onFilter: (value: string | number | boolean, record) =>
        record.required === value
    },
    {
      title: '',
      dataIndex: 'operation',
      render: (_, record: { _id: React.Key }) =>
        dataCustomInputs.length >= 1
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
            {t('additional-fields-order')}
          </h2>
          <p style={{ marginBottom: '0' }}>
            {t('your-list-additonal-fields-order')}
          </p>
        </div>
        <NavLink
          to={`/${rest.pathRest}/add/custom-input`}
          data-test-id='custom-inputs-create-button'
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
        <Table columns={columns} dataSource={dataCustomInputs} />
      </ConfigProvider>
    </div>
  )
}
export default CustomInputs
