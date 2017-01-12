import socket from '../socket'

export default function completePrrr(prrrId) {
  console.log('WS SND: completePrrr', prrrId)
  socket.emit('completePrrr', {prrrId})
}
