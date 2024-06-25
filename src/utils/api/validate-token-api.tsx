/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL } from '../const'
import { handleResponse } from '../helpers'

export const validateToken = async (pathRest: string, token: string) => {
  return await fetch(`${BASE_URL}/validate/token`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Referer: `${pathRest}`,
      Authorization: `Bearer ${token}`
    }
  }).then(async (res) => await handleResponse(res))
}
