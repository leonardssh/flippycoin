import { useMutation, useQuery } from '@tanstack/react-query'
import * as api from './HistoryApi.js'
import { getData } from './QueryUtils.js'

export const useInsertIntoHistory = () => {
  return useMutation(payload => api.insertIntoHistory(payload).then(getData))
}

export const useGetTailsHistory = () => {
  return useQuery(['history', 'tails'], () => api.getTailsHistory().then(getData))
}

export const useGetHeadsHistory = () => {
  return useQuery(['history', 'heads'], () => api.getHeadsHistory().then(getData))
}

export const useGetRemainingTimer = () => {
  return useQuery(['timer', 'remaining'], () => api.getRemainingTimer().then(getData))
}

export const useResetTimer = () => {
  return useQuery(['timer', 'reset'], () => api.resetTimer().then(getData))
}

export const useResult = () => {
  return useQuery(['result'], () => api.getResult().then(getData))
}

export const useTotalBetAmount = () => {
  return useQuery(['total', 'bet', 'amount'], () => api.getTotalBetAmount().then(getData))
}

export const useLastGames = () => {
  return useQuery(['last', 'games'], () => api.getLastGames().then(getData))
}
