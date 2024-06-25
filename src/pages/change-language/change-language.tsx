import { Checkbox, Button, Form, Alert } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import React, { FC, useContext } from 'react'
import { useLocation } from 'react-router'
import { TRest } from '../../utils/typesFromBackend'
import * as countryApi from '../../utils/api/country-api'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import * as restApi from '../../utils/api/rest-api'
import i18n from '../../components/i18n/i18n'

interface IChangeLanguage {
  rest: TRest
  language: string
  token: string
  selectedLanguages: string[]
  setSelectedLanguages: (value: React.SetStateAction<string[]>) => void
  restData: TRest
  setRestData: (arg0: any) => void
  t: (arg0: string) => string
}

const ChangeLanguage: FC<IChangeLanguage> = ({
  rest,
  language,
  token,
  selectedLanguages,
  setSelectedLanguages,
  restData,
  setRestData,
  t
}) => {
  const { openNotification } = useContext(NotificationContext)
  const [showAlert, setShowAlert] = React.useState<boolean>(false)
  const [successAlert, setSuccessAlert] = React.useState<boolean>(false)
  const [form] = Form.useForm()
  const location = useLocation()

  React.useEffect(() => {
    restApi
      .getRest(rest._id)
      .then((res: TRest) => {
        setRestData(res)
      })
      .catch((e) => openNotification(e, 'topRight'))
    const currentPath = location.pathname
    window.localStorage.setItem('initialRoute', currentPath)
  }, [])

  React.useEffect(() => {
    countryApi
      .getListCountries(rest._id)
      .then((arraysCountries) => {
        form.setFieldsValue({ country: language })
      })
      .catch((e) => openNotification(e, 'topRight'))
  }, [])

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  /* const onFinish = (values: any) => {
    changeLanguage(values.country)
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 5000)
  }

  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: '${label} ' + `${t('it-is-necessary-to-fill-in')}!`
  } */

  /* const updateLanguages: TRest = {
    ...rest,
    languages: selectedLanguages
  } */

  const handleCheckboxChange = (checkedValue: CheckboxChangeEvent): void => {
    const { value, checked } = checkedValue.target

    if (checked) {
      setSelectedLanguages((prevSelectedLanguages) => [
        ...prevSelectedLanguages,
        value
      ])
    } else {
      setSelectedLanguages((prevSelectedLanguages) =>
        prevSelectedLanguages.filter((language) => language !== value)
      )
    }
  }

  const handleSave = (): void => {
    if (selectedLanguages.length === 0) {
      setShowAlert(true)
      setSuccessAlert(false)
    } else {
      restApi
        .updateRest({ ...restData, languages: selectedLanguages }, token)
        .then(() => {
          restApi
            .getRest(rest._id)
            .then(async (updatedRestData) => {
              setRestData(updatedRestData)

              setShowAlert(false)
              setSuccessAlert(true)

              if (
                !updatedRestData.languages ||
                updatedRestData.languages.length <= 1
              ) {
                if (updatedRestData.languages.length === 1) {
                  await i18n.changeLanguage(updatedRestData.languages[0])
                }
              }
            })
            .catch((e) => {
              console.error(e)
            })
        })
        .catch((e) => openNotification(e, 'topRight'))
    }
  }

  return (
    <>
      <div style={{ padding: '20px' }}>
        <h4
          style={{
            marginBottom: '15px',
            marginTop: '0',
            fontSize: '1.75rem',
            fontWeight: '600'
          }}
        >
          {t('choise-language')}
        </h4>
        <div>
          <Checkbox
            value='RU'
            checked={
              selectedLanguages ? selectedLanguages.includes('RU') : false
            }
            onChange={handleCheckboxChange}
          >
            RU
          </Checkbox>
          <Checkbox
            value='EN'
            checked={
              selectedLanguages ? selectedLanguages.includes('EN') : false
            }
            onChange={handleCheckboxChange}
          >
            EN
          </Checkbox>
          <Checkbox
            value='KZ'
            checked={
              selectedLanguages ? selectedLanguages.includes('KZ') : false
            }
            onChange={handleCheckboxChange}
          >
            KZ
          </Checkbox>
          <Button
            type='primary'
            onClick={handleSave}
            style={{ marginTop: '10px' }}
          >
            {t('save')}
          </Button>
        </div>
      </div>
      {successAlert && (
        <Alert
          message={t('message-success')}
          type='success'
          showIcon
          closable
          onClose={() => setSuccessAlert(false)}
          style={{ marginTop: '10px' }}
        />
      )}
      {showAlert && (
        <Alert
          message={t('message-warning')}
          type='warning'
          showIcon
          closable
          onClose={() => setShowAlert(false)}
          style={{ marginTop: '10px' }}
        />
      )}
    </>
  )
}
export default ChangeLanguage
