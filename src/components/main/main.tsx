/* eslint-disable @typescript-eslint/consistent-type-assertions */
import React, { useState, useEffect, FC, useContext } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { Layout } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import Sidebar from '../sidebar/sidebar'
import Menu from '../../pages/menu/menu'
import fullscreenIcon from '../../assets/images/fullscreen.svg'
import Dish from '../../pages/dish/dish'
import Categories from '../../pages/categories/categories'
import Category from '../../pages/category/category'
import Modifier from '../../pages/modifier/modifier'
import Modifiers from '../../pages/modifiers/modifiers'
import GroupModifier from '../../pages/group-modifier/group-modifier'
import GroupModifiers from '../../pages/group-modifiers/group-modifiers'
import AddGroupModifier from '../../pages/add-group-modifier/add-group-modifier'
import AddCategory from '../../pages/add-category/add-category'
import AddModifier from '../../pages/add-modifier/add-modifier'
import AddDish from '../../pages/add-dish/add-dish'
import Orders from '../../pages/orders/orders'
import Order from '../../pages/order/order'
import Sales from '../../pages/sales/sales'
import AddSale from '../../pages/add-sale/add-sale'
import Sale from '../../pages/sale/sale'
import Payments from '../../pages/payments/payments'
import AddPayment from '../../pages/add-payment/add-payment'
import OnlinePayment from '../../pages/online-payment/online-payment'
import Payment from '../../pages/payment/payment'
import OrderTypes from '../../pages/order-types/order-types'
import OrderType from '../../pages/order-type/order-type'
import AddOrderType from '../../pages/add-order-type/add-order-type'
import OrderStatuses from '../../pages/order-statuses/order-statuses'
import OrderStatus from '../../pages/order-status/order-status'
import AddOrderStatus from '../../pages/add-order-status/add-order-status'
import Buttons from '../../pages/buttons/buttons'
import ButtonPage from '../../pages/button/button'
import AddButton from '../../pages/add-button/add-button'
import CustomInputs from '../../pages/custom-inputs/custom-inputs'
import CustomInput from '../../pages/custom-input/custom-input'
import AddCustomInput from '../../pages/add-custom-input/add-custom-input'
import Telegram from '../../pages/telegram/telegram'
import QrCode from '../../pages/qr-code/qr-code'
import Personalitzatsiya from '../../pages/personalitzatsiya/personalitzatsiya'
import Autorization from '../../pages/autorization/autorization'
import Settings from '../../pages/settings/settings'
import Terms from '../../pages/terms/terms'
import Logo from '../../pages/logo/logo'
import LoaderImage from '../../pages/loader-image/loader-image'
import BackgroundImage from '../../pages/background-image/background-image'
import ProtectedRoute from '../protected-route/protected-route'
import { NotificationProvider } from '../notification-provider/notification-provider'
import { ECountry, TRest } from '../../utils/typesFromBackend'
import NotFound from '../../pages/not-found/not-found'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n/i18n'
import * as restApi from '../../utils/api/rest-api'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import ChangeLanguage from '../../pages/change-language/change-language'
import ChoiseLanguage from '../choise-language/choise-language'
import SocialNetWorks from '../../pages/social-netwoks/social-netwoks'
import SocialNetWork from '../../pages/social-network/social-network'
import AddSocialNetWork from '../../pages/add-social-network/add-social-network'
import Iiko from '../../pages/iiko/iiko'
import IikoTerminal from '../../pages/iiko-terminal/iiko-terminal'

const { Header, Sider, Content } = Layout

interface IMain {
  token: string
  pathRest: string
  setToken: (token: any) => void
}

const Main: FC<IMain> = ({ token, pathRest, setToken }) => {
  const { openNotification } = useContext(NotificationContext)
  // change to TRest
  const [rest, setRest] = React.useState<TRest>({} as TRest)
  const [language, setLanguage] = useState<ECountry>(
    (localStorage.getItem('language') as ECountry) ?? ECountry.RU
  )
  const [selectedLanguages, setSelectedLanguages] = React.useState<string[]>([])
  const [restData, setRestData] = React.useState<TRest>({} as TRest)
  const { t } = useTranslation()

  function isValidECountry(value: string): value is ECountry {
    return Object.values(ECountry).includes(value as ECountry)
  }

  React.useEffect(() => {
    restApi
      .getRest(rest._id)
      .then((res: TRest) => {
        setRestData(res)
        const languageLocal: string | null = localStorage.getItem('language')
        if (languageLocal !== null && isValidECountry(languageLocal)) {
          changeLanguage(languageLocal)
        } else {
          changeLanguage(res.country)
        }
        setSelectedLanguages(res.languages)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }, [rest])
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-unused-vars
  const changeLanguage = (lng: ECountry) => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    i18n.changeLanguage(lng)
    setLanguage(lng)
    localStorage.removeItem('formData')
  }

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    i18n.changeLanguage(language)
  }, [])
  const [collapse, setCollapse] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    window.innerWidth <= 760 ? setCollapse(true) : setCollapse(false)
  }, [])

  const handleToggle = (event: any): void => {
    event.preventDefault()
    collapse ? setCollapse(false) : setCollapse(true)
  }

  function handleClickFullScreen(): void {
    if (document.fullscreenElement != null) {
      void document.exitFullscreen()
    } else {
      void document.body.requestFullscreen()
    }
  }

  return (
    <NotificationProvider>
      <Router>
        <Layout>
          <Sider
            trigger={null}
            collapsible
            collapsed={collapse}
            style={{ background: '#fff' }}
            width={'17rem'}
          >
            <Sidebar setIsLoggedIn={setIsLoggedIn} pathRest={pathRest} t={t} />
          </Sider>
          <Layout
            style={{
              background: '#fff',
              paddingLeft: '30px',
              paddingRight: '30px'
            }}
          >
            <Header
              className='siteLayoutBackground'
              style={{
                padding: 0,
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              {React.createElement(
                collapse ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  className: 'trigger',
                  onClick: handleToggle,
                  style: { color: '#000' }
                }
              )}
              <ChoiseLanguage
                rest={rest}
                t={t}
                changeLanguage={changeLanguage}
                restData={restData}
              />
              <div
                className='fullscreen-btn'
                onClick={handleClickFullScreen}
                title='На весь экран'
                style={{ cursor: 'pointer' }}
              >
                <img src={fullscreenIcon} alt='На весь экран' />
              </div>
            </Header>
            <Content
              style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 'calc(100vh - 114px)',
                background: '#fff'
              }}
            >
              <Switch>
                <Route path={`/:${pathRest}/autorization`}>
                  <Autorization
                    setIsLoggedIn={setIsLoggedIn}
                    setRest={setRest}
                    t={t}
                    setToken={setToken}
                  />
                </Route>
                <ProtectedRoute
                  path={`/:${pathRest}/menu`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <Menu token={token} rest={rest} t={t} language={language} />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/dish/:dishId`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <Dish token={token} rest={rest} t={t} language={language} />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/categories`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <Categories
                    token={token}
                    rest={rest}
                    t={t}
                    language={language}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/category/:categoryId`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <Category
                    token={token}
                    rest={rest}
                    t={t}
                    language={language}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/modifier/:modifierId`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <Modifier
                    token={token}
                    rest={rest}
                    t={t}
                    language={language}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/modifiers`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <Modifiers
                    token={token}
                    rest={rest}
                    t={t}
                    language={language}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/group-modifier/:groupModifierId`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <GroupModifier
                    token={token}
                    rest={rest}
                    t={t}
                    language={language}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/group-modifiers`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <GroupModifiers
                    token={token}
                    rest={rest}
                    t={t}
                    language={language}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/add/group-modifier`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <AddGroupModifier
                    token={token}
                    rest={rest}
                    t={t}
                    selectedLanguages={selectedLanguages}
                    language={language}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/add/category`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <AddCategory
                    token={token}
                    rest={rest}
                    t={t}
                    selectedLanguages={selectedLanguages}
                    language={language}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/add/modifier`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <AddModifier
                    token={token}
                    rest={rest}
                    t={t}
                    selectedLanguages={selectedLanguages}
                    language={language}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/add/dish`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <AddDish
                    token={token}
                    rest={rest}
                    t={t}
                    selectedLanguages={selectedLanguages}
                    language={language}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/orders`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <Orders token={token} rest={rest} t={t} language={language} />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/${pathRest}/order/:orderId`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <Order token={token} rest={rest} t={t} language={language} />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/sales`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <Sales rest={rest} t={t} language={language} />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/add/sale`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <AddSale
                    token={token}
                    rest={rest}
                    t={t}
                    selectedLanguages={selectedLanguages}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/sale/:saleId`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <Sale token={token} rest={rest} t={t} language={language} />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/online-payment`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <OnlinePayment token={token} rest={rest} t={t} />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/payments`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <Payments
                    token={token}
                    rest={rest}
                    t={t}
                    language={language}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/add/payment`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <AddPayment
                    token={token}
                    rest={rest}
                    t={t}
                    selectedLanguages={selectedLanguages}
                    language={language}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/payment/:paymentId`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <Payment
                    token={token}
                    rest={rest}
                    t={t}
                    language={language}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/order-types`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <OrderTypes
                    token={token}
                    rest={rest}
                    t={t}
                    language={language}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/order-type/:orderTypeId`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <OrderType
                    token={token}
                    rest={rest}
                    t={t}
                    language={language}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/add/order-type`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <AddOrderType
                    token={token}
                    rest={rest}
                    t={t}
                    selectedLanguages={selectedLanguages}
                    language={language}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/order-statuses`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <OrderStatuses
                    token={token}
                    rest={rest}
                    t={t}
                    language={language}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/order-status/:orderStatusId`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <OrderStatus
                    token={token}
                    rest={rest}
                    t={t}
                    language={language}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/add/order-status`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <AddOrderStatus
                    token={token}
                    rest={rest}
                    t={t}
                    selectedLanguages={selectedLanguages}
                    language={language}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/buttons`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <Buttons
                    token={token}
                    rest={rest}
                    t={t}
                    language={language}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/button/:buttonId`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <ButtonPage
                    token={token}
                    rest={rest}
                    t={t}
                    language={language}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/add/button`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <AddButton
                    token={token}
                    rest={rest}
                    t={t}
                    selectedLanguages={selectedLanguages}
                    language={language}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/custom-inputs`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <CustomInputs
                    token={token}
                    rest={rest}
                    t={t}
                    language={language}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/custom-input/:customInputId`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <CustomInput
                    token={token}
                    rest={rest}
                    t={t}
                    language={language}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/add/custom-input`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <AddCustomInput
                    token={token}
                    rest={rest}
                    t={t}
                    selectedLanguages={selectedLanguages}
                    language={language}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/telegram`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <Telegram rest={rest} t={t} />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/qr-code`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <QrCode token={token} rest={rest} t={t} />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/settings`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <Settings
                    token={token}
                    rest={rest}
                    t={t}
                    changeLanguage={changeLanguage}
                    language={language}
                    selectedLanguages={selectedLanguages}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/personalitzatsiya`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <Personalitzatsiya token={token} rest={rest} t={t} />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/terms`}
                  rest={rest}
                  exact
                  isLoggedIn={isLoggedIn}
                >
                  <Terms token={token} rest={rest} t={t} />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/logo`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <Logo token={token} rest={rest} t={t} />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/loader-image`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <LoaderImage token={token} rest={rest} t={t} />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/background-image`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <BackgroundImage token={token} rest={rest} t={t} />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/change-language`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <ChangeLanguage
                    rest={rest}
                    token={token}
                    language={language}
                    selectedLanguages={selectedLanguages}
                    setSelectedLanguages={setSelectedLanguages}
                    restData={restData}
                    setRestData={setRestData}
                    t={t}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/social-networks`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <SocialNetWorks
                    rest={rest}
                    token={token}
                    language={language}
                    t={t}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/add-social-network`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <AddSocialNetWork
                    rest={rest}
                    token={token}
                    language={language}
                    t={t}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/social-network/:socialNetworkId`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <SocialNetWork
                    rest={rest}
                    token={token}
                    language={language}
                    t={t}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/iiko`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <Iiko
                    rest={rest}
                    token={token}
                    language={language}
                    t={t}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/iiko-terminal`}
                  exact
                  isLoggedIn={isLoggedIn}
                  rest={rest}
                >
                  <IikoTerminal token={token} rest={rest} t={t} language={language} />
                </ProtectedRoute>
                <Route path='*'>
                  <NotFound t={t} />
                </Route>
              </Switch>
            </Content>
          </Layout>
        </Layout>
      </Router>
    </NotificationProvider>
  )
}

export default Main
