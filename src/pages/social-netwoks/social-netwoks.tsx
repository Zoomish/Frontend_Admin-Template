/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { FC, useContext } from 'react'
import { ConfigProvider, Popconfirm } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { TRest, TSocialNetworks } from '../../utils/typesFromBackend'
import * as restApi from '../../utils/api/rest-api'
import * as socialNetwoksApi from '../../utils/api/social-networks-api'
import imageNoPhoto from '../../assets/images/no_photo.png'
import { BASE_URL_CDN } from '../../utils/const'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import RU from 'antd/es/locale/ru_RU'
import KZ from 'antd/es/locale/kk_KZ'
import EN from 'antd/es/locale/en_US'

interface ISocialNetworks {
  token: string
  rest: TRest
  t: (arg0: string) => string
  language: string
}

const SocialNetWorks: FC<ISocialNetworks> = ({ token, rest, t, language }) => {
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
  const [dataSocialNetworks, setDataSocialNetworks] = React.useState<
  TSocialNetworks[]
  >([])
  const location = useLocation()

  React.useEffect(() => {
    restApi
      .getRest(rest._id)
      .then((res: TRest) => {
        setDataSocialNetworks(res.social_ids)
      })
      .catch((e) => openNotification(e, 'topRight'))
    const currentPath = location.pathname
    window.localStorage.setItem('initialRoute', currentPath)
  }, [])

  const columns: ColumnsType<TSocialNetworks> = [
    {
      title: `${t('image')}`,
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
    },
    {
      title: `${t('name')}`,
      dataIndex: 'title',
      key: 'title',
      render: (title, socialNetwork) => (
        <Link to={`/${rest.pathRest}/social-network/:${socialNetwork._id}`}>
          {' '}
          {title}
        </Link>
      ),
      sorter: (a, b) => a.title.localeCompare(b.title)
    },
    {
      title: `${t('activity')}`,
      dataIndex: 'active',
      key: 'active',
      render: (active, socialNetwork) => <p>{active ? t('yes') : t('no')}</p>,
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
        dataSocialNetworks.length >= 1
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

  function handleToggleActive (social: any): void {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    socialNetwoksApi
      .updateSocial({ ...social, active: !social.active }, token)
      .then((res: TSocialNetworks) => {
        const arraySocialNetworks: TSocialNetworks[] = []
        dataSocialNetworks.forEach((element: TSocialNetworks) => {
          if (element._id === res._id) {
            arraySocialNetworks.push(res)
          } else {
            arraySocialNetworks.push(element)
          }
        })
        setDataSocialNetworks(arraySocialNetworks)
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
          <h2 style={{ fontWeight: 600, marginBottom: '0' }}>
            {t('social-networks')}
          </h2>
        </div>
        <NavLink
          to={`/:${rest.pathRest}/add-social-network`}
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
        <Table columns={columns} dataSource={dataSocialNetworks} />
      </ConfigProvider>
    </div>
  )
}

export default SocialNetWorks
