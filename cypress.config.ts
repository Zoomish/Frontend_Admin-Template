import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000'
  },
  env: {
    password: '0926',
    login: 'admin'
  },
  defaultCommandTimeout: 10000
})
