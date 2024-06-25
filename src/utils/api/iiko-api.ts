/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL } from '../const'
import { handleResponse } from '../helpers'

export const updateIikoDetails = async (NameIiko: string, isIntegrationWithIiko: boolean, token: string) => {
  return await fetch(`${BASE_URL}/iiko/update-rest-details`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      NameIiko,
      isIntegrationWithIiko
    })
  }).then(async (res) => await handleResponse(res))
}

export const integrationStepTwo = async (OrganizationName: string, IsCourier: boolean, IsTableSchema: boolean, token: string) => {
  return await fetch(`${BASE_URL}/iiko/integration-step-two`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      OrganizationName,
      IsCourier,
      IsTableSchema
    })
  }).then(async (res) => await handleResponse(res))
}
