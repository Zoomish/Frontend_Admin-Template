import React, { FC, useContext, ChangeEvent } from 'react'
import { TRest } from '../../utils/typesFromBackend'
import * as countryApi from '../../utils/api/country-api'
import { NotificationContext } from '../../components/notification-provider/notification-provider'

interface IChangeLanguage {
  rest: TRest
  t: (arg0: string) => string
  changeLanguage: (arg0: string) => void
}
const ChangeLanguage: FC<IChangeLanguage> = ({ rest, t, changeLanguage }) => {
  const { openNotification } = useContext(NotificationContext)
  const [selectedOption, setSelectedOption] = React.useState('')
  const arrayLanguage = ['RU', 'EN', 'KZ']

  React.useEffect(() => {
    countryApi
      .getListCountries(rest._id)
      .catch((e) => openNotification(e, 'topRight'))
  }, [])

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onFinish = (values: any) => {
    setSelectedOption(values)
    changeLanguage(values)
  }

  return (
    <>
      <select
        id='my-select'
        value={selectedOption}
        onChange={(e) => onFinish(e.target.value)}
      >
        {arrayLanguage.map((country) => {
          return (
            <option key={country} value={country}>
              {country}
            </option>
          )
        })}
      </select>
    </>
  )
}
export default ChangeLanguage
