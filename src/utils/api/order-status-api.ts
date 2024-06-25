/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL } from '../const'
import { handleResponse } from '../helpers'

export const getOrderStatus = async (orderType_id: string) => {
  return await fetch(`${BASE_URL}/order-status/${orderType_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async (res) => await handleResponse(res))
}

export const updateOrderStatus = async (orderType: any, token: string) => {
  return await fetch(`${BASE_URL}/order-status/update`, {
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

export const deleteOrderStatus = async (orderType_id: string, token: string) => {
  return await fetch(`${BASE_URL}/order-status/${orderType_id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(async (res) => await handleResponse(res))
}

export const createOrderStatus = async (orderType: any, token: string) => {
  return await fetch(`${BASE_URL}/order-status/create`, {
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
