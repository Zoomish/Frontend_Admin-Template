/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL } from '../const'
import { handleResponse } from '../helpers'

export const autorization = async (button: any, isLocal?: boolean) => {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (isLocal) {
    return await fetch(`${BASE_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://u-mikhalycha.easyqr.ru/admin'
      },
      body: JSON.stringify({
        ...button
      })
    }).then(async (res) => await handleResponse(res))
  } else {
    return await fetch(`${BASE_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...button
      })
    }).then(async (res) => await handleResponse(res))
  }
}
