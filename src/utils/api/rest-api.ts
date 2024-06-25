/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL } from '../const'
import { handleResponse } from '../helpers'
import { TRest } from '../typesFromBackend'

export const getRest = async (rest_id: string): Promise<TRest> => {
  return await fetch(`${BASE_URL}/rest/${rest_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async (res) => await handleResponse(res))
}

export const updateRest = async (rest: any, token: string) => {
  return await fetch(`${BASE_URL}/rest/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ...rest
    })
  }).then(async (res) => await handleResponse(res))
}
