/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL } from '../const'
import { handleResponse } from '../helpers'

export const getListSales = async (rest_id: string) => {
  return await fetch(`${BASE_URL}/sale/list?rest_id=${rest_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async (res) => await handleResponse(res))
}

export const getSale = async (saleId: string) => {
  return await fetch(`${BASE_URL}/sale/${saleId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async (res) => await handleResponse(res))
}

export const createSale = async (sale: any, token: string) => {
  return await fetch(`${BASE_URL}/sale/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ...sale
    })
  }).then(async (res) => await handleResponse(res))
}

export const updateSale = async (sale: any, token: string) => {
  return await fetch(`${BASE_URL}/sale/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ...sale
    })
  }).then(async (res) => await handleResponse(res))
}

export const deleteSale = async (sale_id: string, token: string) => {
  return await fetch(`${BASE_URL}/sale/${sale_id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(async (res) => await handleResponse(res))
}
