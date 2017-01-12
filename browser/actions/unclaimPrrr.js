import socket from '../socket'

export default function unclaimPrrr(prrrId) {
  console.log('WS SND: unclaimPrrr', prrrId)
  socket.emit('unclaimPrrr', {prrrId})
}
