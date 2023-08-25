import axios from 'axios'

export function getOne(userId) {
  return axios.get(`https://api.flippycoin.io/api/user/${userId}`)
}

export function getCurrent(wallet) {
  return axios.get(`https://api.flippycoin.io/api/user/me?wallet=${wallet}`)
}

export function login(wallet) {
  return axios.post('https://api.flippycoin.io/api/user/login', { wallet })
}

export function transaction(transaction) {
  return axios.post('https://api.flippycoin.io/api/transaction', transaction)
}
