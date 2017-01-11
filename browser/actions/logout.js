import request from '../request'
import state from '../state'

export default function logout() {
  return request('post', '/api/logout')
    .catch(logoutError => {
      state.set({logoutError})
      throw logoutError
    })
    .then(_ => window.location.href = window.location.origin )
}
