/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL } from '../const'
import { handleResponse } from '../helpers'

export const getListDish = async (rest_id: string) => {
  return await fetch(`${BASE_URL}/dish/list?rest_id=${rest_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async (res) => await handleResponse(res))
}

export const updateDish = async (dish: any, token: string) => {
  return await fetch(`${BASE_URL}/dish/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ...dish
    })
  }).then(async (res) => await handleResponse(res))
}

export const updateDishWithFormData = async (dish: any) => {
  return await fetch(`${BASE_URL}/dish/update`, {
    method: 'PUT',
    body: dish
  }).then(async (res) => await handleResponse(res))
}

export const getDish = async (dish_id: string) => {
  return await fetch(`${BASE_URL}/dish/${dish_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async (res) => await handleResponse(res))
}

export const deleteDish = async (dish_id: string, token: string) => {
  return await fetch(`${BASE_URL}/dish/${dish_id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(async (res) => await handleResponse(res))
}

export const createDish = async (dish: any, token: string) => {
  return await fetch(`${BASE_URL}/dish/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ...dish
    })
  }).then(async (res) => await handleResponse(res))
}

export const createDishWithFormData = async (dish: any, token: string) => {
  return await fetch(`${BASE_URL}/dish/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ...dish
    })
  }).then(async (res) => await handleResponse(res))
}
