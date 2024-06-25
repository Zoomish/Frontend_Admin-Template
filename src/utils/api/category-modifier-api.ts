/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL } from '../const'
import { handleResponse } from '../helpers'

export const getListCategoriesModifiers = async (rest_id: string) => {
  return await fetch(`${BASE_URL}/category-modifier/rest?rest_id=${rest_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async (res) => await handleResponse(res))
}

export const updateCategoryModifier = async (category: any, token: string) => {
  return await fetch(`${BASE_URL}/category-modifier/update`, {
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

export const getCategoryModifier = async (category_id: string) => {
  return await fetch(`${BASE_URL}/category-modifier/${category_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async (res) => await handleResponse(res))
}

export const deleteCategoryModifier = async (category_id: string, token: string) => {
  return await fetch(`${BASE_URL}/category-modifier/${category_id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(async (res) => await handleResponse(res))
}

export const createCategoryModifier = async (category: any, token: string) => {
  return await fetch(`${BASE_URL}/category-modifier/create`, {
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
