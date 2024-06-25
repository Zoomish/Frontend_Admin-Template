import React, { FC, useContext } from 'react'
import { ECountry, TRest } from '../../utils/typesFromBackend'
import * as countryApi from '../../utils/api/country-api'
import { NotificationContext } from '../../components/notification-provider/notification-provider'

interface IChangeLanguage {
  rest: TRest
  t: (arg0: string) => string
  changeLanguage: (lng: ECountry) => void
  restData: TRest
}
const ChoiseLanguage: FC<IChangeLanguage> = ({
  rest,
  t,
  changeLanguage,
  restData
}) => {
  const { openNotification } = useContext(NotificationContext)
  const [selectedOption, setSelectedOption] = React.useState('')

  React.useEffect(() => {
    countryApi
      .getListCountries(rest._id)
      .catch((e) => openNotification(e, 'topRight'))
  }, [])

  React.useEffect(() => {
    const storedLanguage = localStorage.getItem('language')
    if (
      storedLanguage &&
      Object.values(ECountry).includes(storedLanguage as ECountry)
    ) {
      setSelectedOption(storedLanguage)
      changeLanguage(storedLanguage as ECountry)
    }
  }, [])

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onFinish = (values: any) => {
    setSelectedOption(values)
    changeLanguage(values)
    localStorage.setItem('language', values)
    localStorage.removeItem('formDataDish')
  }

  return (
    <>
      {restData?.languages && Array.isArray(restData.languages)
        ? (
        <>
          <select
            id='my-select'
            value={selectedOption}
            onChange={(e) => onFinish(e.target.value)}
          >
            {restData.languages.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </>
          )
        : (
            ''
          )}
    </>
  )
}
export default ChoiseLanguage
