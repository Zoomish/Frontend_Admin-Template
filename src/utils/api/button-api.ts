/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL } from '../const'
import { handleResponse } from '../helpers'

export const getButton = async (button_id: string) => {
  return await fetch(`${BASE_URL}/button/${button_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async (res) => await handleResponse(res))
}

export const updateButton = async (button: any, token: string) => {
  return await fetch(`${BASE_URL}/button/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ...button
    })
  }).then(async (res) => await handleResponse(res))
}

export const deleteButton = async (button_id: string, token: string) => {
  return await fetch(`${BASE_URL}/button/${button_id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(async (res) => await handleResponse(res))
}

export const createButton = async (button: any, token: string) => {
  return await fetch(`${BASE_URL}/button/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ...button
    })
  }).then(async (res) => await handleResponse(res))
}
