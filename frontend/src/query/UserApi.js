import axios from 'axios'

export function getOne(userId) {
  return axios.get(`http://localhost:1234/api/user/${userId}`)
}

export function getCurrent(wallet) {
  return axios.get(`http://localhost:1234/api/user/me?wallet=${wallet}`)
}

export function login(wallet) {
  return axios.post('http://localhost:1234/api/user/login', { wallet })
}

export function transaction(transaction) {
  return axios.post('http://localhost:1234/transaction', transaction)
}
