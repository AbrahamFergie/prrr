import state from './state'
const io = require('socket.io-client')
const socket = io.connect(location.origin)

const getPrrrIndex = (prrr) => {
  const prrrs = state.get().prrrs
  const prrrToUpdate = prrrs.find(oldPrrr => {
    return prrr.id === oldPrrr.id
  })
  const prrrIndex = prrrs.indexOf(prrrToUpdate)

  return prrrIndex
}

socket.on('errorReport', function(payload){
  console.log('WS RCV: errorReport', payload)
  console.log('SOCKET ERROR REPORT', payload)
  // state.set({session})
})

socket.on('updateSession', function(session){
  console.log('WS RCV: updateSession', session)
  state.set({session})
})

socket.on('initialPrrrs', function(prrrs){
  console.log('WS RCV: initialPrrrs', prrrs)
  state.set({prrrs})
})

socket.on('updatePrrr', function(prrr){
  console.log('WS RCV: updatePrrr', prrr)
  const prrrs = state.get().prrrs
  const index = getPrrrIndex(prrr)
  prrrs.splice(index, 1, prrr)
  state.set({prrrs})
})

socket.on('newPrrr', function(payload){
  console.log('WS RCV: newPrrr', payload)
  const prrrs = state.get().prrrs
  prrrs.push(payload.prrr)
  state.set({prrrs})
})

socket.on('removePrrr', function(prrr){
  console.log('WS RCV: removePrrr', prrr)
  const prrrs = state.get().prrrs
  const index = getPrrrIndex(prrr)
  prrrs.splice(index, 1)
  state.set({prrrs})
})


module.exports = socket
