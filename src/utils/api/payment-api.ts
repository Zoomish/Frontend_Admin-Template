/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL } from '../const'
import { handleResponse } from '../helpers'

export const getPayment = async (payment_id: string) => {
  return await fetch(`${BASE_URL}/payment/${payment_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async (res) => await handleResponse(res))
}

export const updatePayment = async (payment: any, token: string) => {
  return await fetch(`${BASE_URL}/payment/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ...payment
    })
  }).then(async (res) => await handleResponse(res))
}

export const deletePayment = async (payment_id: string, token: string) => {
  return await fetch(`${BASE_URL}/payment/${payment_id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(async (res) => await handleResponse(res))
}

export const createPayment = async (payment: any, token: string) => {
  return await fetch(`${BASE_URL}/payment/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ...payment
    })
  }).then(async (res) => await handleResponse(res))
}
