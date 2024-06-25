/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL_CDN } from '../const'
import { handleResponse } from '../helpers'

export const createImage = async (image: any, token: string) => {
  return await fetch(`${BASE_URL_CDN}/write`, {
    method: 'POST',
    body: image,
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(async (res) => await handleResponse(res))
}
