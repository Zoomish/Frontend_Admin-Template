/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL } from '../const'
import { handleResponse } from '../helpers'

export const getListModifiers = async (rest_id: string) => {
  return await fetch(`${BASE_URL}/modifier/rest?rest_id=${rest_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async (res) => await handleResponse(res))
}

export const updateModifier = async (modifier: any, token: string) => {
  return await fetch(`${BASE_URL}/modifier/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ...modifier
    })
  }).then(async (res) => await handleResponse(res))
}

export const getModifier = async (modifier_id: string) => {
  return await fetch(`${BASE_URL}/modifier/${modifier_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async (res) => await handleResponse(res))
}

export const deleteModifier = async (modifier_id: string, token: string) => {
  return await fetch(`${BASE_URL}/modifier/${modifier_id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(async (res) => await handleResponse(res))
}

export const createModifier = async (category: any, token: string) => {
  return await fetch(`${BASE_URL}/modifier/create`, {
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
