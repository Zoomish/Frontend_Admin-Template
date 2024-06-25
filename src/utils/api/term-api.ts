/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL } from '../const'
import { handleResponse } from '../helpers'

export const getTerm = async (termId: string) => {
  return await fetch(`${BASE_URL}/term/${termId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async (res) => await handleResponse(res))
}

export const createTerm = async (term: any, token: string) => {
  return await fetch(`${BASE_URL}/term/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ...term
    })
  }).then(async (res) => await handleResponse(res))
}

export const updateTerm = async (term: any, token: string) => {
  return await fetch(`${BASE_URL}/term/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ...term
    })
  }).then(async (res) => await handleResponse(res))
}

export const deleteTerm = async (term_id: string, token: string) => {
  return await fetch(`${BASE_URL}/term/${term_id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(async (res) => await handleResponse(res))
}
