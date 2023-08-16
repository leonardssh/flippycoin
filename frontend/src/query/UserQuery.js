import { useMutation, useQuery } from '@tanstack/react-query'
import * as api from './UserApi.js'
import { getData } from './QueryUtils.js'

export const useCurrentUser = wallet => {
  return useQuery(['user', 'me', wallet], () => {
    return api.getCurrent(wallet).then(getData)
  })
}

export const useLogin = () => {
  return useMutation(wallet => api.login(wallet).then(getData))
}

export const useTransaction = () => {
  return useMutation(transaction => api.transaction(transaction).then(getData))
}
