import { FC } from 'react'
import { TRest } from '../../utils/typesFromBackend'

interface IIikoTerminal {
    token: string
    t: (arg0: string) => string
    language: string
    rest: TRest
  }

const IikoTerminal: FC<IIikoTerminal> = () => {
  return <></>
}
export default IikoTerminal
