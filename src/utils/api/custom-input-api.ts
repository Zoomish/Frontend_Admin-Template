/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL } from '../const'
import { handleResponse } from '../helpers'

export const getCustomInput = async (customInput_id: string) => {
  return await fetch(`${BASE_URL}/custom-input/${customInput_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async (res) => await handleResponse(res))
}

export const updateCustomInput = async (customInput: any, token: string) => {
  return await fetch(`${BASE_URL}/custom-input/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ...customInput
    })
  }).then(async (res) => await handleResponse(res))
}

export const deleteCustomInput = async (customInput_id: string, token: string) => {
  return await fetch(`${BASE_URL}/custom-input/${customInput_id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(async (res) => await handleResponse(res))
}

export const createCustomInput = async (customInput: any, token: string) => {
  return await fetch(`${BASE_URL}/custom-input/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ...customInput
    })
  }).then(async (res) => await handleResponse(res))
}
