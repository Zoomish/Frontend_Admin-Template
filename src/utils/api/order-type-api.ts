/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL } from '../const'
import { handleResponse } from '../helpers'

export const getOrderType = async (orderType_id: string) => {
  return await fetch(`${BASE_URL}/order-type/${orderType_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async (res) => await handleResponse(res))
}

export const updateOrderType = async (orderType: any, token: string) => {
  return await fetch(`${BASE_URL}/order-type/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ...orderType
    })
  }).then(async (res) => await handleResponse(res))
}

export const deleteOrderType = async (orderType_id: string, token: string) => {
  return await fetch(`${BASE_URL}/order-type/${orderType_id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(async (res) => await handleResponse(res))
}

export const createOrderType = async (orderType: any, token: string) => {
  return await fetch(`${BASE_URL}/order-type/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ...orderType
    })
  }).then(async (res) => await handleResponse(res))
}
