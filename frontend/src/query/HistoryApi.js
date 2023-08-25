import axios from 'axios'

export function insertIntoHistory(payload) {
  return axios.post('https://api.flippycoin.io/api/history', payload)
}

export function getTailsHistory() {
  return axios.get('https://api.flippycoin.io/api/history/tails')
}

export function getHeadsHistory() {
  return axios.get('https://api.flippycoin.io/api/history/heads')
}

export function getRemainingTimer() {
  return axios.get('https://api.flippycoin.io/timer')
}

export function resetTimer() {
  return axios.get('https://api.flippycoin.io/reset-timer')
}

export function getResult() {
  return axios.get('https://api.flippycoin.io/result')
}

export function getTotalBetAmount() {
  return axios.get('https://api.flippycoin.io/api/history/total-bet-amount')
}

export function getLastGames() {
  return axios.get('https://api.flippycoin.io/last-games')
}
