import axios from 'axios'

export function getOne(userId) {
  return axios.get(`https://168.100.9.7/api/user/${userId}`)
}

export function getCurrent(wallet) {
  return axios.get(`https://168.100.9.7/api/user/me?wallet=${wallet}`)
}

export function login(wallet) {
  return axios.post('https://168.100.9.7/api/user/login', { wallet })
}

export function transaction(transaction) {
  return axios.post('https://168.100.9.7/transaction', transaction)
}
