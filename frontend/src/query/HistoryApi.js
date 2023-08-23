import axios from 'axios'

export function insertIntoHistory(payload) {
  return axios.post('https://168.100.9.7/api/history', payload)
}

export function getTailsHistory() {
  return axios.get('https://168.100.9.7/api/history/tails')
}

export function getHeadsHistory() {
  return axios.get('https://168.100.9.7/api/history/heads')
}

export function getRemainingTimer() {
  return axios.get('https://168.100.9.7/timer')
}

export function resetTimer() {
  return axios.get('https://168.100.9.7/reset-timer')
}

export function getResult() {
  return axios.get('https://168.100.9.7/result')
}

export function getTotalBetAmount() {
  return axios.get('https://168.100.9.7/api/history/total-bet-amount')
}

export function getLastGames() {
  return axios.get('https://168.100.9.7/last-games')
}
