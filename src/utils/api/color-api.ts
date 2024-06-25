/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL } from '../const'
import { handleResponse } from '../helpers'

export const getColor = async (color_id: string) => {
  return await fetch(`${BASE_URL}/color/${color_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async (res) => await handleResponse(res))
}

export const updateColor = async (color: any, token: string) => {
  return await fetch(`${BASE_URL}/color/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ...color
    })
  }).then(async (res) => await handleResponse(res))
}

export const deleteColor = async (color_id: string, token: string) => {
  return await fetch(`${BASE_URL}/color/${color_id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(async (res) => await handleResponse(res))
}

export const createColor = async (color: any, token: string) => {
  return await fetch(`${BASE_URL}/color/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ...color
    })
  }).then(async (res) => await handleResponse(res))
}
