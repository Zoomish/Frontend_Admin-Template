import {
  Button,
  Checkbox,
  DatePickerProps,
  Form,
  Input,
  Select,
  TimePicker,
  Alert
} from 'antd'
import React, { FC, useContext } from 'react'
import { TRest, ECountry } from '../../utils/typesFromBackend'
import * as restApi from '../../utils/api/rest-api'
import * as countryApi from '../../utils/api/country-api'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import 'dayjs/locale/ru'
import dayjs from 'dayjs'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import { useLocation } from 'react-router'

interface ISettings {
  token: string
  rest: TRest
  t: (arg0: string) => string
  changeLanguage: (lng: ECountry) => void
  language: string
  selectedLanguages: string[]
}

const Settings: FC<ISettings> = ({
  token,
  rest,
  t,
  changeLanguage,
  language,
  selectedLanguages
}) => {
  const { openNotification } = useContext(NotificationContext)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [form] = Form.useForm()
  const [isLoading, setIsLoading] = React.useState(false)
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unused-vars
  const [restData, setRestData] = React.useState<TRest>({} as TRest)
  const [settings, setSettings] = React.useState<any>()
  const [checkedEnableSms, setCheckedEnableSms] = React.useState(false)
  const [checkedEnableDateDelivery, setCheckedEnableDateDelivery] =
    React.useState(false)
  const [checkedEnableIsAdult, setCheckedEnableIsAdult] = React.useState(false)
  const [openTime, setOpenTime] = React.useState('')
  const [closeTime, setCloseTime] = React.useState('')
  const [countTable, setCountTable] = React.useState<String | Number>('')
  const [countries, setCountries] = React.useState([])
  const [showAlert, setShowAlert] = React.useState(false)
  const location = useLocation()

  const languageSettings: Record<string, string> = {}

  for (const lang of rest ? rest.languages : []) {
    languageSettings[lang] = settings ? settings.titleRest[lang] || '' : ''
  }

  React.useEffect(() => {
    restApi
      .getRest(rest._id)
      .then((res: TRest) => {
        setRestData(res)
        setSettings(res)
        setOpenTime(res.openTime)
        setCloseTime(res.closeTime)
        setCheckedEnableSms(res.enableSms)
        setCheckedEnableIsAdult(res.isAdult)
        setCheckedEnableDateDelivery(res.enableDateDelivery)
        form.setFieldsValue({ titleRest: res.titleRest })
        form.setFieldsValue({ currentCurrency: res.currentCurrency })
        form.setFieldsValue({ workPhone: res.workPhone })
        form.setFieldsValue({ workAddress: res.workAddress })
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (res.countTable) {
          setCountTable(res.countTable)
          form.setFieldsValue({ countTable: res.countTable })
        }
        countryApi
          .getListCountries(rest._id)
          .then((arraysCountries) => {
            setCountries(arraysCountries)
            form.setFieldsValue({ country: res.country })
            setIsLoading(true)
          })
          .catch((e) => openNotification(e, 'topRight'))
      })
      .catch((e) => openNotification(e, 'topRight'))
    const currentPath = location.pathname
    window.localStorage.setItem('initialRoute', currentPath)
  }, [])

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 }
  }

  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: '${label} ' + `${t('it-is-necessary-to-fill-in')}!`
  }

  const format = 'HH-mm'

  /* const finish = (values: any): void => {
    const newLanguageCategory: any = { ...values }
    newLanguageCategory.titleRest = {}
    newLanguageCategory.workAddress = {}
    newLanguageCategory.active = true
    for (let i = 0; i < selectedLanguages.length; i++) {
      const key = selectedLanguages[i]
      newLanguageCategory.titleRest[key] = ''
      newLanguageCategory.workAddress[key] = ''
    }
    newLanguageCategory.titleRest[language] = values.titleRest
    newLanguageCategory.workAddress[language] = values.workAddress
    newLanguageCategory.openTime = openTime
    newLanguageCategory.closeTime = closeTime
    newLanguageCategory.enableSms = checkedEnableSms
    newLanguageCategory.enableDateDelivery = checkedEnableDateDelivery
  } */

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onFinish = (values: any) => {
    values._id = rest._id
    values.openTime = openTime
    values.closeTime = closeTime
    values.enableSms = checkedEnableSms
    values.enableDateDelivery = checkedEnableDateDelivery
    values.isAdult = checkedEnableIsAdult

    restApi
      .updateRest(values, token)
      .then((res: TRest) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (res._id) {
          if (restData.country !== values.country) {
            changeLanguage(values.country)
          }
          setShowAlert(true)
          setTimeout(() => setShowAlert(false), 5000)
        } else {
          openNotification(t('something-went-wrong'), 'topRight')
        }
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onChangeCheckedEnableSms = (e: CheckboxChangeEvent) => {
    setCheckedEnableSms(!checkedEnableSms)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onChangeCheckedEnableDateDelivery = (e: CheckboxChangeEvent) => {
    setCheckedEnableDateDelivery(!checkedEnableDateDelivery)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onChangeCheckedEnableIsAdult = (e: CheckboxChangeEvent) => {
    setCheckedEnableIsAdult(!checkedEnableIsAdult)
  }

  const onChangeOpenTime: DatePickerProps['onChange'] = (date, dateString) => {
    setOpenTime(dateString)
  }

  const onChangeCloseTime: DatePickerProps['onChange'] = (date, dateString) => {
    setCloseTime(dateString)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const sort = e.target.value
    if (sort === '' || sort.match(/^\d{1,}$/) != null) {
      form.setFieldsValue({ sort })
      setCountTable(sort)
    } else {
      form.setFieldsValue({ countTable })
    }
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
        {t('settings')}
      </h4>
      {isLoading ? (
        <Form
          {...layout}
          onFinish={onFinish}
          validateMessages={validateMessages}
          name='payment'
          form={form}
          style={{ paddingTop: '1.5rem' }}
        >
          <Form.Item
            label={t('name-of-the-place')}
            rules={[{ required: true }]}
            name='titleRest'
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t('currency-icon')}
            rules={[{ required: true }]}
            name='currentCurrency'
          >
            <Input />
          </Form.Item>
          <Form.Item label={t('mumber-of-tables-rooms')} name='countTable'>
            <Input onChange={handleChange} />
          </Form.Item>
          <Form.Item label={t('opening-time')} name='openTime'>
            <TimePicker
              defaultValue={dayjs(openTime, format)}
              format={format}
              onChange={onChangeOpenTime}
            />
          </Form.Item>
          <Form.Item label={t('closing-time')} name='closeTime'>
            <TimePicker
              defaultValue={dayjs(closeTime, format)}
              format={format}
              onChange={onChangeCloseTime}
            />
          </Form.Item>
          <Form.Item
            label={t('phone-number-of-the-institution')}
            name='workPhone'
          >
            <Input />
          </Form.Item>
          <Form.Item label={t('address-of-the-institution')} name='workAddress'>
            <Input />
          </Form.Item>
          <Form.Item
            label={t('sms-confirmation-of-the-order')}
            name='enableSms'
          >
            <Checkbox
              onChange={onChangeCheckedEnableSms}
              checked={checkedEnableSms}
            ></Checkbox>
          </Form.Item>
          <Form.Item
            label={t('choose-possible-date-when-ordering')}
            name='enableDateDelivery'
          >
            <Checkbox
              onChange={onChangeCheckedEnableDateDelivery}
              checked={checkedEnableDateDelivery}
            ></Checkbox>
          </Form.Item>
          <Form.Item label={t('verify-client-old-18')} name='isAdult'>
            <Checkbox
              onChange={onChangeCheckedEnableIsAdult}
              checked={checkedEnableIsAdult}
            ></Checkbox>
          </Form.Item>
          <Form.Item label={t('country')} name='country'>
            <Select>
              {countries.map((country) => (
                <Select.Option value={country} key={country}>
                  {country}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type='primary' htmlType='submit'>
              {t('save')}
            </Button>
          </Form.Item>
        </Form>
      ) : (
        ''
      )}
      {showAlert ? (
        <Alert type='success' message='Изменения успешно применены!' />
      ) : (
        ''
      )}
    </>
  )
}
export default Settings
