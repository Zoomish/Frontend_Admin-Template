/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL } from '../const'
import { handleResponse } from '../helpers'

export const getListCategories = async (rest_id: string) => {
  return await fetch(`${BASE_URL}/category/rest?rest_id=${rest_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async (res) => await handleResponse(res))
}

export const updateCategory = async (category: any, token: string) => {
  return await fetch(`${BASE_URL}/category/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ...category
    })
  }).then(async (res) => await handleResponse(res))
}

export const getCategory = async (category_id: string) => {
  return await fetch(`${BASE_URL}/category/${category_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async (res) => await handleResponse(res))
}

export const deleteCategory = async (category_id: string, token: string) => {
  return await fetch(`${BASE_URL}/category/${category_id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(async (res) => await handleResponse(res))
}

export const createCategory = async (category: any, token: string) => {
  return await fetch(`${BASE_URL}/category/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ...category
    })
  }).then(async (res) => await handleResponse(res))
}
