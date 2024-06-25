/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL } from '../const'
import { handleResponse } from '../helpers'

export const getListOrders = async (rest_id: string, token: string) => {
  return await fetch(`${BASE_URL}/order/list?rest_id=${rest_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(async (res) => await handleResponse(res))
}

export const getOrder = async (orderId: string, token: string) => {
  return await fetch(`${BASE_URL}/order/${orderId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(async (res) => await handleResponse(res))
}

export const updateOrder = async (order: any, token: string) => {
  return await fetch(`${BASE_URL}/order/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ...order
    })
  }).then(async (res) => await handleResponse(res))
}
