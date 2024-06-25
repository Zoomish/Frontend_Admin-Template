/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { FC, useContext } from 'react'
import { Button, Checkbox, Form, Tooltip, Alert } from 'antd'
import * as restApi from '../../utils/api/rest-api'
import * as colorApi from '../../utils/api/color-api'
import { TColor, TRest } from '../../utils/typesFromBackend'
import { useColor } from 'react-color-palette'
import 'react-color-palette/lib/css/styles.css'
import PopoverPicker from '../../components/popover-picker/popover-picker'
import { hex2rgb, rgb2hsv } from '../../utils/helpers'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { ModalWithPicture } from '../../components/modals/modal'
import textImage from '../../assets/images/personalizatsiyaImages/text.jpg'
import buttonText from '../../assets/images/personalizatsiyaImages/buttonText.jpg'
import buttonBackground from '../../assets/images/personalizatsiyaImages/buttonBackground.jpg'
import auxiliaryBackground from '../../assets/images/personalizatsiyaImages/auxiliaryBackground.jpg'
import dishWeight from '../../assets/images/personalizatsiyaImages/dishWeight.jpg'
import auxiliaryLines from '../../assets/images/personalizatsiyaImages/auxiliaryLines.jpg'
import orderCrearedBackground from '../../assets/images/personalizatsiyaImages/orderCrearedBackground.jpg'
import menuBackground from '../../assets/images/personalizatsiyaImages/menuBackground.jpg'
import popupBackground from '../../assets/images/personalizatsiyaImages/popupBackground.jpg'
import leftMenuBackground from '../../assets/images/personalizatsiyaImages/leftMenuBackground.jpg'
import buttonBorderBackground from '../../assets/images/personalizatsiyaImages/borderButtonColor.jpg'
import InputBorderBackground from '../../assets/images/personalizatsiyaImages/borderInputColor.jpg'
import auxiliaryElements from '../../assets/images/personalizatsiyaImages/auxiliaryElements.jpg'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import { useLocation } from 'react-router'

interface IPersonalitzatsiya {
  token: string
  rest: TRest
  t: (arg0: string) => string
}

const Personalitzatsiya: FC<IPersonalitzatsiya> = ({ token, rest, t }) => {
  const { openNotification } = useContext(NotificationContext)
  const [isLoading, setIsLoading] = React.useState(false)
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const [colorData, setColorData] = React.useState<TColor>({} as TColor)
  const [form] = Form.useForm()
  const [mainTextColor, setMainTextColor] = useColor('hex', '#000000')
  const [mainColor, setMainColor] = useColor('hex', '#000000')
  const [buttonTextColor, setButtonTextColor] = useColor('hex', '#000000')
  const [buttonColor, setButtonColor] = useColor('hex', '#000000')
  const [loght, setLoght] = useColor('hex', '#000000')
  const [textLight, setTextLight] = useColor('hex', '#000000')
  const [stroke, setStroke] = useColor('hex', '#000000')
  const [orderMadeBlock, setOrderMadeBlock] = useColor('hex', '#000000')
  const [backgroundColor, setBackgroundColor] = useColor('hex', '#000000')
  const [popupBackup, setPopupBackup] = useColor('hex', '#000000')
  const [popupInputColor, setPopupInputColor] = useColor('hex', '#000000')
  const [leftMenuBgColor, setLeftMenuBgColor] = useColor('hex', '#000000')
  const [borderButtonColor, setBorderButtonColor] = useColor('hex', '#000000')
  const [borderInputColor, setBorderInputColor] = useColor('hex', '#000000')
  const [checkedViewGrid, setCheckedViewGrid] = React.useState(false)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [showAlert, setShowAlert] = React.useState(false)
  const [modalPath, setModalPath] = React.useState('')
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 14 }
  }
  const location = useLocation()

  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: '${label} ' + `${t('it-is-necessary-to-fill-in')}!`
  }

  React.useEffect(() => {
    restApi
      .getRest(rest._id)
      .then((res: TRest) => {
        setColorData(res.colorsSchema_id)
        setMainTextColor({
          hex: res.colorsSchema_id.mainTextColor,
          rgb: hex2rgb(res.colorsSchema_id.mainTextColor),
          hsv: rgb2hsv(hex2rgb(res.colorsSchema_id.mainTextColor))
        })
        setMainColor({
          hex: res.colorsSchema_id.mainColor,
          rgb: hex2rgb(res.colorsSchema_id.mainColor),
          hsv: rgb2hsv(hex2rgb(res.colorsSchema_id.mainColor))
        })
        setButtonTextColor({
          hex: res.colorsSchema_id.buttonTextColor,
          rgb: hex2rgb(res.colorsSchema_id.buttonTextColor),
          hsv: rgb2hsv(hex2rgb(res.colorsSchema_id.buttonTextColor))
        })
        setButtonColor({
          hex: res.colorsSchema_id.buttonColor,
          rgb: hex2rgb(res.colorsSchema_id.buttonColor),
          hsv: rgb2hsv(hex2rgb(res.colorsSchema_id.buttonColor))
        })
        setLoght({
          hex: res.colorsSchema_id.loght,
          rgb: hex2rgb(res.colorsSchema_id.loght),
          hsv: rgb2hsv(hex2rgb(res.colorsSchema_id.loght))
        })
        setTextLight({
          hex: res.colorsSchema_id.textLight,
          rgb: hex2rgb(res.colorsSchema_id.textLight),
          hsv: rgb2hsv(hex2rgb(res.colorsSchema_id.textLight))
        })
        setStroke({
          hex: res.colorsSchema_id.stroke,
          rgb: hex2rgb(res.colorsSchema_id.stroke),
          hsv: rgb2hsv(hex2rgb(res.colorsSchema_id.stroke))
        })
        setOrderMadeBlock({
          hex: res.colorsSchema_id.orderMadeBlock,
          rgb: hex2rgb(res.colorsSchema_id.orderMadeBlock),
          hsv: rgb2hsv(hex2rgb(res.colorsSchema_id.orderMadeBlock))
        })
        setBackgroundColor({
          hex: res.colorsSchema_id.backgroundColor,
          rgb: hex2rgb(res.colorsSchema_id.backgroundColor),
          hsv: rgb2hsv(hex2rgb(res.colorsSchema_id.backgroundColor))
        })
        setPopupBackup({
          hex: res.colorsSchema_id.popupBackup,
          rgb: hex2rgb(res.colorsSchema_id.popupBackup),
          hsv: rgb2hsv(hex2rgb(res.colorsSchema_id.popupBackup))
        })
        setPopupInputColor({
          hex: res.colorsSchema_id.popupInputColor,
          rgb: hex2rgb(res.colorsSchema_id.popupInputColor),
          hsv: rgb2hsv(hex2rgb(res.colorsSchema_id.popupInputColor))
        })
        setLeftMenuBgColor({
          hex: res.colorsSchema_id.leftMenuBgColor,
          rgb: hex2rgb(res.colorsSchema_id.leftMenuBgColor),
          hsv: rgb2hsv(hex2rgb(res.colorsSchema_id.leftMenuBgColor))
        })
        setBorderButtonColor({
          hex: res.colorsSchema_id.borderButtonColor,
          rgb: hex2rgb(res.colorsSchema_id.borderButtonColor),
          hsv: rgb2hsv(hex2rgb(res.colorsSchema_id.borderButtonColor))
        })
        setBorderInputColor({
          hex: res.colorsSchema_id.borderInputColor,
          rgb: hex2rgb(res.colorsSchema_id.borderInputColor),
          hsv: rgb2hsv(hex2rgb(res.colorsSchema_id.borderInputColor))
        })
        setCheckedViewGrid(res.colorsSchema_id.viewGrid)
        setIsLoading(true)
      })
      .catch((e) => openNotification(e, 'topRight'))
    const currentPath = location.pathname
    window.localStorage.setItem('initialRoute', currentPath)
  }, [])

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onChangeViewGrid = (e: CheckboxChangeEvent) => {
    setCheckedViewGrid(!checkedViewGrid)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onFinish = (values: any) => {
    values._id = colorData._id
    values.viewGrid = checkedViewGrid
    values.mainTextColor = mainTextColor.hex
    values.mainColor = mainColor.hex
    values.buttonTextColor = buttonTextColor.hex
    values.buttonColor = buttonColor.hex
    values.loght = loght.hex
    values.textLight = textLight.hex
    values.stroke = stroke.hex
    values.orderMadeBlock = orderMadeBlock.hex
    values.backgroundColor = backgroundColor.hex
    values.popupBackup = popupBackup.hex
    values.popupInputColor = popupInputColor.hex
    values.leftMenuBgColor = leftMenuBgColor.hex
    values.borderButtonColor = borderButtonColor.hex
    values.borderInputColor = borderInputColor.hex
    colorApi
      .updateColor({ ...colorData, ...values }, token)
      .then((res: TColor) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (res._id) {
          // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
          setShowAlert(true)
          setTimeout(() => setShowAlert(false), 5000)
        } else {
          openNotification(t('something-went-wrong'), 'topRight')
        }
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  const showModal = (modalPath: string) => {
    setIsModalOpen(true)
    setModalPath(modalPath)
  }

  const handleClose = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <h4
        style={{
          marginBottom: '15px',
          marginTop: '0',
          color: '#000',
          fontSize: '1.75rem',
          fontWeight: '600',
          padding: '15px'
        }}
      >
        {t('change-colors')}
      </h4>
      {isLoading
        ? (
        <Form
          {...layout}
          onFinish={onFinish}
          validateMessages={validateMessages}
          name='personalitzatsiya'
          form={form}
          style={{ paddingTop: '1.5rem' }}
        >
          <Form.Item
            style={{ width: '1200px ' }}
            label={
              <div>
                <Tooltip title={t('example-what-this-color-responsible')}>
                  {t('text')}&nbsp;
                  <QuestionCircleOutlined
                    onClick={() => showModal(textImage)}
                  />
                </Tooltip>
                <>
                  <ModalWithPicture
                    handleClose={handleClose}
                    isModalOpen={isModalOpen}
                    modalPath={modalPath}
                  />
                </>
              </div>
            }
            name={'mainTextColor'}
          >
            <PopoverPicker color={mainTextColor} onChange={setMainTextColor} />
          </Form.Item>
          <Form.Item
            style={{ width: '1200px ' }}
            label={
              <div>
                <Tooltip title={t('example-what-this-color-responsible')}>
                  {t('auxiliary-elements')}&nbsp;
                  <QuestionCircleOutlined
                    onClick={() => showModal(auxiliaryElements)}
                  />
                </Tooltip>
                <>
                  <ModalWithPicture
                    handleClose={handleClose}
                    isModalOpen={isModalOpen}
                    modalPath={modalPath}
                  />
                </>{' '}
              </div>
            }
            name={'mainColor'}
          >
            <PopoverPicker color={mainColor} onChange={setMainColor} />
          </Form.Item>
          <Form.Item
            style={{ width: '1200px ' }}
            label={
              <div>
                <Tooltip title={t('example-what-this-color-responsible')}>
                  {t('text-in-buttons')}&nbsp;
                  <QuestionCircleOutlined
                    onClick={() => showModal(buttonText)}
                  />
                </Tooltip>
                <>
                  <ModalWithPicture
                    handleClose={handleClose}
                    isModalOpen={isModalOpen}
                    modalPath={modalPath}
                  />
                </>
              </div>
            }
            name={'buttonTextColor'}
          >
            <PopoverPicker
              color={buttonTextColor}
              onChange={setButtonTextColor}
            />
          </Form.Item>
          <Form.Item
            style={{ width: '1200px ' }}
            label={
              <div>
                <Tooltip title={t('example-what-this-color-responsible')}>
                  {t('background-buttons')}&nbsp;
                  <QuestionCircleOutlined
                    onClick={() => showModal(buttonBackground)}
                  />
                </Tooltip>
                <>
                  <ModalWithPicture
                    handleClose={handleClose}
                    isModalOpen={isModalOpen}
                    modalPath={modalPath}
                  />
                </>
              </div>
            }
            name={'buttonColor'}
          >
            <PopoverPicker color={buttonColor} onChange={setButtonColor} />
          </Form.Item>
          <Form.Item
            style={{ width: '1200px ' }}
            label={
              <div>
                <Tooltip title={t('example-what-this-color-responsible')}>
                  {t('auxiliary-background')}&nbsp;
                  <QuestionCircleOutlined
                    onClick={() => showModal(auxiliaryBackground)}
                  />
                </Tooltip>
                <>
                  <ModalWithPicture
                    handleClose={handleClose}
                    isModalOpen={isModalOpen}
                    modalPath={modalPath}
                  />
                </>
              </div>
            }
            name={'loght'}
          >
            <PopoverPicker color={loght} onChange={setLoght} />
          </Form.Item>
          <Form.Item
            style={{ width: '1200px ' }}
            label={
              <div>
                <Tooltip title={t('example-what-this-color-responsible')}>
                  {t('weight-dish')}&nbsp;
                  <QuestionCircleOutlined
                    onClick={() => showModal(dishWeight)}
                  />
                </Tooltip>
                <>
                  <ModalWithPicture
                    handleClose={handleClose}
                    isModalOpen={isModalOpen}
                    modalPath={modalPath}
                  />
                </>
              </div>
            }
            name={'textLight'}
          >
            <PopoverPicker color={textLight} onChange={setTextLight} />
          </Form.Item>
          <Form.Item
            style={{ width: '1200px ' }}
            label={
              <div>
                <Tooltip title={t('example-what-this-color-responsible')}>
                  {t('auxiliary-lines')}&nbsp;
                  <QuestionCircleOutlined
                    onClick={() => showModal(auxiliaryLines)}
                  />
                </Tooltip>
                <>
                  <ModalWithPicture
                    handleClose={handleClose}
                    isModalOpen={isModalOpen}
                    modalPath={modalPath}
                  />
                </>
              </div>
            }
            name={'stroke'}
          >
            <PopoverPicker color={stroke} onChange={setStroke} />
          </Form.Item>
          <Form.Item
            style={{ width: '1200px ' }}
            label={
              <div>
                <Tooltip title={t('example-what-this-color-responsible')}>
                  {t('background-order-created')}&nbsp;
                  <QuestionCircleOutlined
                    onClick={() => showModal(orderCrearedBackground)}
                  />
                </Tooltip>
                <>
                  <ModalWithPicture
                    handleClose={handleClose}
                    isModalOpen={isModalOpen}
                    modalPath={modalPath}
                  />
                </>
              </div>
            }
            name={'orderMadeBlock'}
          >
            <PopoverPicker
              color={orderMadeBlock}
              onChange={setOrderMadeBlock}
            />
          </Form.Item>
          <Form.Item
            style={{ width: '1200px ' }}
            label={
              <div>
                <Tooltip title={t('example-what-this-color-responsible')}>
                  {t('background-menu')}&nbsp;
                  <QuestionCircleOutlined
                    onClick={() => showModal(menuBackground)}
                  />
                </Tooltip>
                <>
                  <ModalWithPicture
                    handleClose={handleClose}
                    isModalOpen={isModalOpen}
                    modalPath={modalPath}
                  />
                </>
              </div>
            }
            name={'backgroundColor'}
          >
            <PopoverPicker
              color={backgroundColor}
              onChange={setBackgroundColor}
            />
          </Form.Item>
          <Form.Item
            style={{ width: '1200px ' }}
            label={
              <div>
                <Tooltip title={t('example-what-this-color-responsible')}>
                  {t('pop-up-window-background')}&nbsp;
                  <QuestionCircleOutlined
                    onClick={() => showModal(popupBackground)}
                  />
                </Tooltip>
                <>
                  <ModalWithPicture
                    handleClose={handleClose}
                    isModalOpen={isModalOpen}
                    modalPath={modalPath}
                  />
                </>
              </div>
            }
            name={'popupBackup'}
          >
            <PopoverPicker color={popupBackup} onChange={setPopupBackup} />
          </Form.Item>
          <Form.Item
            style={{ width: '1200px ' }}
            label={
              <div>
                <Tooltip title={t('example-what-this-color-responsible')}>
                  {t('text-in-input-field')}&nbsp;
                  <QuestionCircleOutlined
                    onClick={() => showModal(popupBackground)}
                  />
                </Tooltip>
                <>
                  <ModalWithPicture
                    handleClose={handleClose}
                    isModalOpen={isModalOpen}
                    modalPath={modalPath}
                  />
                </>
              </div>
            }
            name={'popupInputColor'}
          >
            <PopoverPicker
              color={popupInputColor}
              onChange={setPopupInputColor}
            />
          </Form.Item>
          <Form.Item
            style={{ width: '1200px ' }}
            label={
              <div>
                <Tooltip title={t('example-what-this-color-responsible')}>
                  {t('left-side-menu')}&nbsp;
                  <QuestionCircleOutlined
                    onClick={() => showModal(leftMenuBackground)}
                  />
                </Tooltip>
                <>
                  <ModalWithPicture
                    handleClose={handleClose}
                    isModalOpen={isModalOpen}
                    modalPath={modalPath}
                  />
                </>
              </div>
            }
            name={'popupInputColor'}
          >
            <PopoverPicker
              color={leftMenuBgColor}
              onChange={setLeftMenuBgColor}
            />
          </Form.Item>
          <Form.Item
            style={{ width: '1200px ' }}
            label={
              <div>
                <Tooltip title={t('example-what-this-color-responsible')}>
                  {t('border-button-color')}&nbsp;
                  <QuestionCircleOutlined
                    onClick={() => showModal(buttonBorderBackground)}
                  />
                </Tooltip>
                <>
                  <ModalWithPicture
                    handleClose={handleClose}
                    isModalOpen={isModalOpen}
                    modalPath={modalPath}
                  />
                </>
              </div>
            }
            name={'popupInputColor'}
          >
            <PopoverPicker
              color={borderButtonColor}
              onChange={setBorderButtonColor}
            />
          </Form.Item>
          <Form.Item
            style={{ width: '1200px ' }}
            label={
              <div>
                <Tooltip title={t('example-what-this-color-responsible')}>
                  {t('border-input-color')}&nbsp;
                  <QuestionCircleOutlined
                    onClick={() => showModal(InputBorderBackground)}
                  />
                </Tooltip>
                <>
                  <ModalWithPicture
                    handleClose={handleClose}
                    isModalOpen={isModalOpen}
                    modalPath={modalPath}
                  />
                </>
              </div>
            }
            name={'popupInputColor'}
          >
            <PopoverPicker
              color={borderInputColor}
              onChange={setBorderInputColor}
            />
          </Form.Item>
          <Form.Item
            style={{ width: '1350px ' }}
            label={t('dishe-two-columns')}
            name='viewGrid'
          >
            <Checkbox
              onChange={onChangeViewGrid}
              checked={checkedViewGrid}
            ></Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              {t('save')}
            </Button>
          </Form.Item>
        </Form>
          )
        : (
            ''
          )}
      {showAlert
        ? (
        <Alert type='success' message='Изменения успешно применены!' />
          )
        : (
            ''
          )}
    </>
  )
}
export default Personalitzatsiya
