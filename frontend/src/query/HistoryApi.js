import axios from 'axios'

export function insertIntoHistory(payload) {
  return axios.post('http://localhost:1234/api/history', payload)
}

export function getTailsHistory() {
  return axios.get('http://localhost:1234/api/history/tails')
}

export function getHeadsHistory() {
  return axios.get('http://localhost:1234/api/history/heads')
}

export function getRemainingTimer() {
  return axios.get('http://localhost:1234/timer')
}

export function resetTimer() {
  return axios.get('http://localhost:1234/reset-timer')
}

export function getResult() {
  return axios.get('http://localhost:1234/result')
}

export function getTotalBetAmount() {
  return axios.get('http://localhost:1234/api/history/total-bet-amount')
}

export function getLastGames() {
  return axios.get('http://localhost:1234/last-games')
}
