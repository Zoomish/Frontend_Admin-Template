import { Dispatch, FC, SetStateAction } from 'react'
import { Menu } from 'antd'
import {
  PercentageOutlined,
  ShoppingCartOutlined,
  MenuUnfoldOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  LogoutOutlined,
  VerticalAlignTopOutlined
} from '@ant-design/icons'
import { useHistory } from 'react-router'

interface ISidebar {
  pathRest: string
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>
  t: (arg0: string) => string
}
const Sidebar: FC<ISidebar> = ({ setIsLoggedIn, pathRest, t }) => {
  const SubMenu = Menu.SubMenu
  const history = useHistory()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUserClick = (): void => {
    history.push(`/${pathRest}/list`)
  }

  const handleOrdersClick = (): void => {
    history.push(`/${pathRest}/orders`)
  }

  const handleSalesClick = (): void => {
    history.push(`/:${pathRest}/sales`)
  }
  const handleInstructionClick = (): void => {
    history.push('/blog')
  }
  const handleRestClick = (): void => {
    // выход в меню
  }
  const handleMenuClick = (): void => {
    history.push(`/${pathRest}/menu`)
  }
  const handleCategoriesClick = (): void => {
    history.push(`/${pathRest}/categories`)
  }
  const handleModifiersClick = (): void => {
    history.push(`/${pathRest}/modifiers`)
  }
  const handleModifiersCategoriesClick = (): void => {
    history.push(`/${pathRest}/group-modifiers`)
  }
  const handleSettingsClick = (): void => {
    history.push(`/${pathRest}/settings`)
  }
  const handlePaymentClick = (): void => {
    history.push(`/${pathRest}/online-payment`)
  }
  const handlePaymentsClick = (): void => {
    history.push(`/${pathRest}/payments`)
  }
  const handleTipsClick = (): void => {
    history.push(`/${pathRest}/tips`)
  }
  const handleQrCodeClick = (): void => {
    history.push(`/${pathRest}/qr-code`)
  }
  const handlePersonalitzatsiyaClick = (): void => {
    history.push(`/${pathRest}/personalitzatsiya`)
  }
  const handleTelegramClick = (): void => {
    history.push(`/${pathRest}/telegram`)
  }
  const handleOrderTypeClick = (): void => {
    history.push(`/${pathRest}/order-types`)
  }
  const handleOrderStatusClick = (): void => {
    history.push(`/${pathRest}/order-statuses`)
  }
  const handleButtonClick = (): void => {
    history.push(`/${pathRest}/buttons`)
  }
  const handleCustomInputClick = (): void => {
    history.push(`/${pathRest}/custom-inputs`)
  }
  const handleTermClick = (): void => {
    history.push(`/${pathRest}/terms`)
  }
  const handleLogoClick = (): void => {
    history.push(`/${pathRest}/logo`)
  }
  const handleLoaderImageClick = (): void => {
    history.push(`/${pathRest}/loader-image`)
  }
  const handleBackgroundImageClick = (): void => {
    history.push(`/${pathRest}/background-image`)
  }
  const handleChangeLanguageClick = (): void => {
    history.push(`/${pathRest}/change-language`)
  }

  const handleSocialNetworksClick = (): void => {
    history.push(`/:${pathRest}/social-networks`)
  }

  const handleIikoClick = (): void => {
    history.push(`/:${pathRest}/iiko`)
  }

  const handleLogout = (): void => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    history.push(`/${pathRest}/autorization`)
  }

  return (
    <>
      <div style={{ height: '32px', margin: '16px' }}></div>
      <Menu
        theme='light'
        mode='inline'
        style={{ textAlign: 'left' }}
        defaultSelectedKeys={['1']}
      >
        <SubMenu
          key='sub1'
          title={
            <>
              <MenuUnfoldOutlined />
              <span>{t('menu')}</span>
            </>
          }
        >
          <Menu.Item key='1' onClick={handleMenuClick}>
            {t('dishes')}
          </Menu.Item>
          <Menu.Item key='2' onClick={handleCategoriesClick}>
            {t('categories')}
          </Menu.Item>
          <Menu.Item key='3' onClick={handleModifiersClick}>
            {t('modifiers')}
          </Menu.Item>
          <Menu.Item key='4' onClick={handleModifiersCategoriesClick}>
            {t('group-modifiers')}
          </Menu.Item>
        </SubMenu>
        <Menu.Item key='5' onClick={handleOrdersClick}>
          <ShoppingCartOutlined />
          <span>{t('orders')}</span>
        </Menu.Item>
        <Menu.Item key='6' onClick={handleSalesClick}>
          <PercentageOutlined />
          <span>{t('sales')}</span>
        </Menu.Item>
        <SubMenu
          key='sub2'
          title={
            <>
              <SettingOutlined />
              <span>{t('settings')}</span>
            </>
          }
        >
          <Menu.Item key='7' onClick={handleSettingsClick}>
            {t('settings')}
          </Menu.Item>
          <Menu.Item key='8' onClick={handlePaymentClick}>
            {t('settings-online-payment')}
          </Menu.Item>
          <Menu.Item key='9' onClick={handlePaymentsClick}>
            {t('settings-types-payment')}
          </Menu.Item>
          <Menu.Item key='17' onClick={handleOrderTypeClick}>
            {t('settings-types-orders')}
          </Menu.Item>
          <Menu.Item key='18' onClick={handleOrderStatusClick}>
            {t('settings-statuses-orders')}
          </Menu.Item>
          <Menu.Item key='19' onClick={handleButtonClick}>
            {t('settings-buttons')}
          </Menu.Item>
          <Menu.Item key='20' onClick={handleCustomInputClick}>
            {t('settings-fields-in-form')}
          </Menu.Item>
          <Menu.Item key='21' onClick={handleTermClick}>
            {t('settings-data-legal-entity')}
          </Menu.Item>
          <Menu.Item key='22' onClick={handleLogoClick}>
            {t('settings-logo')}
          </Menu.Item>
          <Menu.Item key='23' onClick={handleLoaderImageClick}>
            {t('settings-spinner')}
          </Menu.Item>
          <Menu.Item key='24' onClick={handleBackgroundImageClick}>
            {t('settings-background-image')}
          </Menu.Item>
          <Menu.Item key='10' onClick={handleTipsClick}>
            {t('tips')}
          </Menu.Item>
          <Menu.Item key='11' onClick={handleQrCodeClick}>
            {t('generation-qr')}
          </Menu.Item>
          <Menu.Item key='12' onClick={handlePersonalitzatsiyaClick}>
            {t('change-colors')}
          </Menu.Item>
          <Menu.Item key='13' onClick={handleTelegramClick}>
            {t('telegram-bot')}
          </Menu.Item>
          <Menu.Item key='25' onClick={handleChangeLanguageClick}>
            {t('change-language')}
          </Menu.Item>
          <Menu.Item key='26' onClick={handleSocialNetworksClick}>
            {t('social-networks')}
          </Menu.Item>
          <Menu.Item key='27' onClick={handleIikoClick}>
            {t('setting-iiko')}
          </Menu.Item>
        </SubMenu>
        <Menu.Item key='14' onClick={handleInstructionClick}>
          <InfoCircleOutlined />
          <span>{t('manual')}</span>
        </Menu.Item>
        <Menu.Item key='16' onClick={handleRestClick}>
          <VerticalAlignTopOutlined />
          <span> {t('back-menu')}</span>
        </Menu.Item>
        <Menu.Item key='15' onClick={handleLogout}>
          <LogoutOutlined />
          <span>{t('quit')}</span>
        </Menu.Item>
      </Menu>
    </>
  )
}

export default Sidebar
